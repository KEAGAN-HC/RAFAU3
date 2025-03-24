// server.js
import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const app = express();
app.use(cors());

const supabase = createClient(
  'https://ihzcoshiesmktesysyyo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloemNvc2hpZXNta3Rlc3lzeXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2OTU1MDcsImV4cCI6MjA1ODI3MTUwN30.b0HBtRP72tehIjWYXJnEsNYFggVmKF1HNZUQdgpeyAc'
);

app.get('/sync', async (req, res) => {
  try {
    const { data } = await axios.get('http://moriahmkt.com/iotapp/');

    const sensoresGlobales = data.sensores;
    const parcelas = data.parcelas;

    // 1. Insertar sensores globales si han cambiado
    const { data: lastGlobal } = await supabase
      .from('historial_global')
      .select('*')
      .order('fecha_hora', { ascending: false })
      .limit(1)
      .single();

    if (
      !lastGlobal ||
      lastGlobal.temperatura !== sensoresGlobales.temperatura ||
      lastGlobal.humedad !== sensoresGlobales.humedad ||
      lastGlobal.lluvia !== sensoresGlobales.lluvia ||
      lastGlobal.sol !== sensoresGlobales.sol
    ) {
      await supabase.from('historial_global').insert([sensoresGlobales]);
      console.log("✅ Nuevo registro en historial_global");
    } else {
      console.log("🔁 Sensores globales sin cambios");
    }

    // Lista de nombres de parcelas activas desde la API
    const activeParcelNames = parcelas.map(p => p.nombre);

    // 2. Procesar parcelas y guardar sus sensores si cambian
    for (const parcela of parcelas) {
      try {
        const { data: existingParcela } = await supabase
          .from('parcelas')
          .select('id')
          .eq('nombre', parcela.nombre)
          .single();

        let parcelaId = existingParcela?.id;

        if (!parcelaId) {
          const { data: insert, error: insertError } = await supabase
            .from('parcelas')
            .insert([{
              nombre: parcela.nombre,
              ubicacion: parcela.ubicacion,
              tipo_cultivo: parcela.tipo_cultivo,
              responsable: parcela.responsable,
              status: true
            }])
            .select()
            .single();

          if (insertError || !insert) {
            console.error(`❌ Error al insertar parcela ${parcela.nombre}:`, insertError);
            continue;
          }

          parcelaId = insert.id;
          console.log(`✅ Parcela '${parcela.nombre}' insertada`);
        } else {
          // Actualiza la información de la parcela en caso de cambios
          await supabase
            .from('parcelas')
            .update({
              ubicacion: parcela.ubicacion,
              tipo_cultivo: parcela.tipo_cultivo,
              responsable: parcela.responsable,
              status: true // Si se recibe, se reactivan
            })
            .eq('id', parcelaId);
        }

        const { data: lastHist } = await supabase
          .from('historial_sensores')
          .select('*')
          .eq('id_parcela', parcelaId)
          .order('fecha_hora', { ascending: false })
          .limit(1)
          .single();

        const sensor = parcela.sensor;

        if (
          !lastHist ||
          lastHist.temperatura !== sensor.temperatura ||
          lastHist.humedad !== sensor.humedad ||
          lastHist.lluvia !== sensor.lluvia ||
          lastHist.sol !== sensor.sol
        ) {
          await supabase.from('historial_sensores').insert([{
            id_parcela: parcelaId,
            ...sensor
          }]);
          console.log(`📍 Sensor actualizado para '${parcela.nombre}'`);
        } else {
          console.log(`🟡 Sin cambios en '${parcela.nombre}'`);
        }
      } catch (parcelError) {
        console.error(`❌ Error procesando parcela '${parcela.nombre}':`, parcelError);
      }
    }

    // 3. Identificar y actualizar parcelas eliminadas
    const { data: allParcelas, error: allParcelasError } = await supabase
      .from('parcelas')
      .select('id, nombre, status');
    if (allParcelasError) {
      console.error("❌ Error al obtener todas las parcelas:", allParcelasError);
    } else {
      for (const dbParcela of allParcelas) {
        // Si la parcela no está en la lista de activas y aún está activa, marcarla como eliminada.
        if (!activeParcelNames.includes(dbParcela.nombre) && dbParcela.status === true) {
          await supabase.from('parcelas')
            .update({ status: false })
            .eq('id', dbParcela.id);
          console.log(`🗑️ Parcela '${dbParcela.nombre}' marcada como eliminada`);
        }
      }
    }

    res.send('✅ Sincronización completa');
  } catch (error) {
    console.error('❌ Error en la sincronización general:', error);
    res.status(500).send('Error al sincronizar');
  }
});

// Endpoint para datos históricos globales
app.get('/historical', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('historial_global')
      .select('*')
      .order('fecha_hora', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener datos históricos:', err);
    res.status(500).send('Error al obtener datos históricos');
  }
});

// Endpoint para datos históricos de parcelas, incluyendo el nombre de la parcela (join)
app.get('/historical_parcelas', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('historial_sensores')
      .select('*, parcelas(nombre)')
      .order('fecha_hora', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener datos históricos de parcelas:', err);
    res.status(500).send('Error al obtener datos históricos de parcelas');
  }
});

// Nuevo endpoint para obtener parcelas eliminadas (status: false)
app.get('/deleted_parcels', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parcelas')
      .select('*')
      .eq('status', false);

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error('❌ Error al obtener parcelas eliminadas:', err);
    res.status(500).send('Error al obtener parcelas eliminadas');
  }
});

app.listen(5000, () => {
  console.log('🚀 Servidor corriendo en http://localhost:5000');
});
