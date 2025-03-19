import React from 'react';
import logo from './logo.svg';
import './App.css';
import Mensajeria from './components/Mensajeria';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./components/dashboard";


function App() {
  return (
    <>

      <Router>
      <div className="app-container">
        <Sidebar />

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
      
    </>
  );
}

export default App;


