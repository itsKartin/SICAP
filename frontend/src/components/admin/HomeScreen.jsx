import React, { useState } from 'react';
import { Users, Coins, Lock, History, X, Plus, ChevronRight, FileText } from 'lucide-react';
import './css/HomeScreen.css';

const HomeScreen = () => {
  // Arreglo temporal para renderizar los 4 items de accesos manuales
  const manualAccesses = [1, 2, 3, 4];
  
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-container">
      
      {/* Contenedor Principal (Lado Izquierdo) */}
      <div className="main-content">
        
        {/* Cabecera: Hora y Fecha */}
        <div className="home-header">
          <h1 className="home-time">11:21 PM</h1>
          <span className="home-date">Friday, 06 Jan 2023</span>
        </div>

        {/* Fila de Estadísticas Superiores */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
            <p className="stat-value">75</p><p className="stat-label">Usuarios</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Coins size={24} /></div>
            <p className="stat-value">67%</p><p className="stat-label">Solventes</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Lock size={24} color="#ff3b30" /></div>
            <p className="stat-value">24</p><p className="stat-label">Bloqueados</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><History size={24} /></div>
            <p className="stat-value">30%</p><p className="stat-label">Pendientes</p>
          </div>
        </div>

        {/* Contenedor Central: Imagen del Portón */}
        <div className="gate-container">
          <img src="/admin/porton.png" alt="Render de Portón" className="gate-image" />
        </div>

        {/* Sección Inferior: Textos y Notificación */}
        <div className="home-footer">
          <div className="footer-info">
            <h2>Narayola II</h2>
            <p>GMS 4G Activo</p>
          </div>
        </div>

      </div>


      
    </div>
  );
};

export default HomeScreen;