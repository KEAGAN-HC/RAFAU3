import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar-container">
      <div className="logo">MarketinIA</div>
      <nav className="nav-menu">
        <Link to="/">Dashboard</Link>
        <Link to="/mapa">Cultivos del Sur</Link>
        <Link to="/salir">Salir</Link>
      </nav>
      <div className="user-icon">RV</div>
    </div>
  );
};

export default Sidebar;
