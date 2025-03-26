import React, { useEffect, useState } from "react";
import "../App.css";
import { Map, Marker, NavigationControl, Popup } from "react-map-gl/mapbox";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxToken =
  "pk.eyJ1Ijoicm9kcmlnb2hjIiwiYSI6ImNtODdjdXMwMjA2cDkycm9iczR5cjUzNzkifQ._QNEyoiwDYMgGed_PcltCg";

interface SensorData {
  temperatura: number;
  humedad: number;
  lluvia: number;
  sol: number;
}

interface Parcela {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
  sensor?: SensorData; // <-- Datos del sensor
}

const MapView: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  // Almacena la parcela que está siendo "hovereada"
  const [hoveredParcela, setHoveredParcela] = useState<Parcela | null>(null);

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const response = await axios.get("https://moriahmkt.com/iotapp/test/");
        const { parcelas } = response.data;
        setParcelas(parcelas);
      } catch (error) {
        console.error("Error al obtener las parcelas:", error);
      }
    };

    fetchParcelas();
  }, []);

  return (
    <div className="map-view-container">
      <Map
        mapboxAccessToken={MapboxToken}
        initialViewState={{
          longitude: -86.87,
          latitude: 21.06,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      >
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <NavigationControl />
        </div>

        {parcelas.map((parcela) => (
          <Marker
            key={parcela.id}
            longitude={parcela.longitud}
            latitude={parcela.latitud}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredParcela(parcela)}
              onMouseLeave={() => setHoveredParcela(null)}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#ad3044",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  boxShadow: "0 0 2px rgb(255, 255, 255)",
                }}
              />
              <span style={{ fontSize: "12px", color: "#ffffff" }}>
                {parcela.nombre}
              </span>
            </div>
          </Marker>
        ))}

        {hoveredParcela && hoveredParcela.sensor && (
          <Popup
            longitude={hoveredParcela.longitud}
            latitude={hoveredParcela.latitud}
            closeButton={false}
            closeOnClick={false}
            anchor="bottom"
            offset={[0, -10]}
          >
          
            <div
              style={{
                color: "#000",
                fontSize: "14px",
                minWidth: "120px",
              }}
              onMouseLeave={() => setHoveredParcela(null)}
            >
              <strong>{hoveredParcela.nombre}</strong>
              <br />
              <span>Temp: {hoveredParcela.sensor.temperatura} °C</span>
              <br />
              <span>Humedad: {hoveredParcela.sensor.humedad} %</span>
              <br />
              <span>Lluvia: {hoveredParcela.sensor.lluvia} mm</span>
              <br />
              <span>Sol: {hoveredParcela.sensor.sol} %</span>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
};

export default MapView;

