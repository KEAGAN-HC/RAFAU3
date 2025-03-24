// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Dashboard from './components/dashboard';
import ChartsView from './components/grafGlobales'; 
import DeletedParcels from './components/deletedParcels';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/charts" element={<ChartsView />} />
            <Route path="/parcelasEliminadas" element={<DeletedParcels />} />
          </Routes>
          
        </div>
      </div>
    </Router>
  );
}

export default App;
