import React from "react";
import "../App.css";

const WeatherInfo: React.FC = () => {
  return (
    <div className="weather-info-container">
      <div className="weather-card">
        <h3>Temperatura</h3>
        <p>0°C</p>
      </div>
      <div className="weather-card">
        <h3>Humedad</h3>
        <p>53%</p>
      </div>
      <div className="weather-card">
        <h3>Lluvia</h3>
        <p>Ligera</p>
      </div>
      <div className="weather-card">
        <h3>Intensidad del Sol</h3>
        <p>Alta</p>
      </div>
    </div>
  );
};

export default WeatherInfo;
