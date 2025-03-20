import React from "react";
import "../App.css";
import { Map, Marker, NavigationControl } from 'react-map-gl/mapbox';
import "mapbox-gl/dist/mapbox-gl.css";

const MapboxToken = "pk.eyJ1Ijoicm9kcmlnb2hjIiwiYSI6ImNtODdjdXMwMjA2cDkycm9iczR5cjUzNzkifQ._QNEyoiwDYMgGed_PcltCg";

const MapView: React.FC = () => {
  return (
    <div className="map-view-container">
      <Map
        mapboxAccessToken={MapboxToken}
        initialViewState={{
          longitude: -99.1332,
          latitude: 19.4326,
          zoom: 12,
        }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
      >
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <NavigationControl />
        </div>
        <Marker longitude={-99.1332} latitude={19.4326} />
      </Map>
    </div>
  );
};

export default MapView;
