import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar-container">
      <div className="logo">MarketinIA</div>
      <nav className="nav-menu">
        <Link to="/">Dashboard</Link>
        <Link to="/parcelasEliminadas">PArcelas Eliminadas</Link>
        <div className="navigation-section">
        <Link to="/charts">
          Ver Gráficas Históricas
        </Link>
      </div>
      </nav>
    </div>
  );
};

export default Sidebar;
