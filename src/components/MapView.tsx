import React, { useEffect, useState } from "react";
import "../App.css";
import { Map, Marker, NavigationControl } from "react-map-gl/mapbox";
import axios from "axios";
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxToken = "pk.eyJ1Ijoicm9kcmlnb2hjIiwiYSI6ImNtODdjdXMwMjA2cDkycm9iczR5cjUzNzkifQ._QNEyoiwDYMgGed_PcltCg";

interface Parcela {
  id: number;
  nombre: string;
  latitud: number;
  longitud: number;
}

const MapView: React.FC = () => {
  const [parcelas, setParcelas] = useState<Parcela[]>([]);

  useEffect(() => {
    const fetchParcelas = async () => {
      try {
        const response = await axios.get("http://moriahmkt.com/iotapp/");
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
        mapStyle="mapbox://styles/mapbox/streets-v11"
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
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  backgroundColor: "#41ab5d",
                  borderRadius: "50%",
                  border: "2px solid #fff",
                  boxShadow: "0 0 2px rgba(0,0,0,0.5)",
                }}
              />
              <span style={{ fontSize: "12px", color: "#000" }}>{parcela.nombre}</span>
            </div>
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default MapView;
