import React from 'react';
import './Dashboard.css'; // Conectamos el CSS

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>SICAP - Panel de Control</h1>
      </div>
      
      <div className="status-card">
        <p className="status-label">Estatus del Residente</p>
        {/* Si cambias la clase a "status-value deudor", se pondrá rojo */}
        <h2 className="status-value solvente">Solvente</h2>
      </div>
    </div>
  );
}

export default Dashboard;