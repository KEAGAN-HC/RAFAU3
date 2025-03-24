// dashboard.tsx
import Header from "./header";
import MapView from "./MapView";
import WeatherInfo from "./weatherInfo";
import Footer from "./footer";
import React, { useEffect } from "react";
import "../App.css";

const Dashboard: React.FC = () => {
  useEffect(() => {
    fetch("http://localhost:5000/sync")
      .then((res) => res.text())
      .then((msg) => console.log("🟢 Sincronización automática:", msg))
      .catch((err) => console.error("❌ Error al sincronizar:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <Header title="Cultivos del Sur / Mapa de Ubicaciones" />
      <div className="content-section">
        <MapView />
        <WeatherInfo />
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
