import React from 'react';
import { Link } from 'react-router-dom';
import HistoricalCharts from './historicalCharts';
import ParcelBarCharts from './grafParcelas';
import Header from './header';
import Footer from './footer';
import '../App.css';

const ChartsView: React.FC = () => {
  return (
    <div className="charts-view-container">
      <Header title="Gráficas Históricas" />
      <div className="charts-content">
        <HistoricalCharts />
        <ParcelBarCharts />
      </div>
      <div className="navigation-section">
        <Link to="/">
          <button>Volver al Dashboard</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default ChartsView;
