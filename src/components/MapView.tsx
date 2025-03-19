import React from "react";
import "../App.css";

const MapView: React.FC = () => {
  return (
    <div className="map-view-container">
      <div className="map-placeholder">
        <p>Aquí iría un mapa (o imagen) estático de Mapbox</p>
      </div>
    </div>
  );
};

export default MapView;
