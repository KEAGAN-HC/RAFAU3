import React from "react";
import Header from "./header";
import MapView from "./MapView";
import WeatherInfo from "./weatherInfo";
import Footer from "./footer";
import "../App.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      {/* Encabezado con título */}
      <Header title="Cultivos del Sur / Mapa de Ubicaciones" />

      <div className="content-section">
        {/* Sección del mapa */}
        <MapView />

        <WeatherInfo />
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
