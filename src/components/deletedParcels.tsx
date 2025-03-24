import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './header';
import Footer from './footer';

interface DeletedParcela {
  id: number;
  nombre: string;
  ubicacion: string;
  tipo_cultivo: string;
  responsable: string;
}

const DeletedParcels: React.FC = () => {
  const [deletedParcels, setDeletedParcels] = useState<DeletedParcela[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeletedParcels = async () => {
      try {
        const response = await axios.get<DeletedParcela[]>('http://localhost:5000/deleted_parcels');
        setDeletedParcels(response.data);
      } catch (err) {
        console.error("Error al obtener las parcelas eliminadas", err);
        setError("Error al obtener las parcelas eliminadas");
      } finally {
        setLoading(false);
      }
    };

    fetchDeletedParcels();
  }, []);

  if (loading) return <p>Cargando parcelas eliminadas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="deleted-parcels-page">
      <Header title="Parcelas Eliminadas" />

      <div className="content">
        <h2>Parcelas Eliminadas</h2>
        {deletedParcels.length === 0 ? (
          <p>No se encontraron parcelas eliminadas.</p>
        ) : (
          <table className="deleted-parcels-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Ubicación</th>
                <th>Tipo de Cultivo</th>
                <th>Responsable</th>
              </tr>
            </thead>
            <tbody>
              {deletedParcels.map((parcela) => (
                <tr key={parcela.id}>
                  <td>{parcela.id}</td>
                  <td>{parcela.nombre}</td>
                  <td>{parcela.ubicacion}</td>
                  <td>{parcela.tipo_cultivo}</td>
                  <td>{parcela.responsable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DeletedParcels;
