import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

interface Sensores {
  temperatura: number;
  humedad: number;
  lluvia: number;
  sol: number;
}

interface ApiResponse {
  sensores: Sensores;
}

const WeatherInfo: React.FC = () => {
  const [weather, setWeather] = useState<Sensores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get<ApiResponse>("http://moriahmkt.com/iotapp/");
        
        console.log("✅ Respuesta completa de la API:", response.data);
        console.log("🌤️ Sensores globales usados:", response.data.sensores);

        setWeather(response.data.sensores);
      } catch (err) {
        setError("Error al obtener datos");
        console.error("❌ Error al hacer la petición:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <p>Cargando datos meteorológicos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="weather-info-container">
      <div className="weather-card">
        <h3>Temperatura</h3>
        <p>{weather?.temperatura}°C</p>
      </div>
      <div className="weather-card">
        <h3>Humedad</h3>
        <p>{weather?.humedad}%</p>
      </div>
      <div className="weather-card">
        <h3>Lluvia</h3>
        <p>{weather?.lluvia} mm</p>
      </div>
      <div className="weather-card">
        <h3>Intensidad del Sol</h3>
        <p>{weather?.sol}%</p>
      </div>
    </div>
  );
};

export default WeatherInfo;
