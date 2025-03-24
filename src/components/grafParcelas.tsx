import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ParcelaSensor {
  id: number;
  id_parcela: number;
  temperatura: number;
  humedad: number;
  lluvia: number;
  sol: number;
  fecha_hora: string;
  parcelas: {
    nombre: string;
  };
}

const ParcelBarCharts: React.FC = () => {
  const [groupedData, setGroupedData] = useState<Record<number, ParcelaSensor>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchParcelHistoricalData = async () => {
      try {
        const response = await axios.get<ParcelaSensor[]>('http://localhost:5000/historical_parcelas');
        const data = response.data;

        const groups: Record<number, ParcelaSensor> = {};
        data.forEach((record) => {
          groups[record.id_parcela] = record;
        });
        setGroupedData(groups);
      } catch (err) {
        console.error("❌ Error fetching parcel historical data", err);
        setError("Error al obtener datos históricos de parcelas");
      } finally {
        setLoading(false);
      }
    };

    fetchParcelHistoricalData();
  }, []);

  if (loading) return <p>Cargando datos históricos de parcelas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="parcel-bar-charts">
      <h2>Datos Históricos por Parcela</h2>
      {Object.values(groupedData).map((record) => {
        const chartData = {
          labels: ['Temperatura (°C)', 'Humedad (%)', 'Lluvia (mm)', 'Intensidad del Sol (%)'],
          datasets: [
            {
              label: record.parcelas.nombre,
              data: [record.temperatura, record.humedad, record.lluvia, record.sol],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
            },
          ],
        };

        return (
          <div key={record.id_parcela} className="chart-container">
            <h3>{record.parcelas.nombre}</h3>
            <Bar data={chartData} />
          </div>
        );
      })}
    </div>
  );
};

export default ParcelBarCharts;
