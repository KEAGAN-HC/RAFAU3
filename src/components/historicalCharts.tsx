import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalData {
  fecha_hora: string;
  temperatura: number;
  humedad: number;
  lluvia: number;
  sol: number;
}

const HistoricalCharts: React.FC = () => {
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get<HistoricalData[]>('http://localhost:5000/historical');
        setHistoricalData(response.data);
      } catch (err) {
        console.error("❌ Error fetching historical data", err);
        setError("Error al obtener datos históricos");
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  if (loading) return <p>Cargando datos históricos...</p>;
  if (error) return <p>{error}</p>;

  // Limitar a los últimos 15 registros
  const last15Data = historicalData.slice(-15);

  const labels = last15Data.map(record =>
    new Date(record.fecha_hora).toLocaleTimeString()
  );
  const tempData = last15Data.map(record => record.temperatura);
  const humidityData = last15Data.map(record => record.humedad);

  const lineChartData = {
    labels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: tempData,
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const barChartData = {
    labels,
    datasets: [
      {
        label: 'Humedad (%)',
        data: humidityData,
        backgroundColor: '#41ab5d',
      }
    ]
  };

 
  const lastRecord = last15Data[last15Data.length - 1];
  const stackedBarData = {
    labels: ['Último Registro'],
    datasets: [
      {
        label: 'Lluvia (mm)',
        data: [lastRecord.lluvia],
        backgroundColor: 'rgba(180, 255, 119, 0.7)',
        stack: 'clima',
      },
      {
        label: 'Intensidad del Sol (%)',
        data: [lastRecord.sol],
        backgroundColor: 'rgba(255, 205, 86, 0.7)',
        stack: 'clima',
      }
    ]
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: false,
        text: 'Lluvia y Sol',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="historical-charts">
      <h2>Datos Históricos Globales</h2>
      <div className="charts-container">
        <div className="chart-card">
          <h3>Temperatura a lo largo del tiempo</h3>
          <Line data={lineChartData} options={{ maintainAspectRatio: false }} />
        </div>

        <div className="chart-card">
          <h3>Humedad a lo largo del tiempo</h3>
          <Bar data={barChartData} options={{ maintainAspectRatio: false }} />
        </div>

        <div className="chart-card">
          <h3>Lluvia y Sol (último registro)</h3>
          <Bar data={stackedBarData} options={stackedBarOptions} />
        </div>
      </div>
    </div>
  );
};

export default HistoricalCharts;
