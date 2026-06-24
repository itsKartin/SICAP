import React from 'react';
// Importamos los nuevos íconos desde lucide-react
import { Users, Coins, Lock, History, X } from 'lucide-react';
import './HomeScreen.css';

const HomeScreen = () => {
  return (
    <div className="home-container">
      
      {/* Cabecera: Hora y Fecha */}
      <div className="home-header">
        <h1 className="home-time">11:21 PM</h1>
        <span className="home-date">Friday, 06 Jan 2023</span>
      </div>

      {/* Fila de Estadísticas Superiores */}
      <div className="stats-row">
        
        {/* Usuarios */}
        <div className="stat-item">
          <div className="stat-icon-wrapper">
            <Users size={24} />
          </div>
          <p className="stat-value">75</p>
          <p className="stat-label">Usuarios</p>
        </div>
        
        {/* Solventes */}
        <div className="stat-item">
          <div className="stat-icon-wrapper">
            <Coins size={24} />
          </div>
          <p className="stat-value">67%</p>
          <p className="stat-label">Solventes</p>
        </div>
        
        {/* Bloqueados */}
        <div className="stat-item">
          <div className="stat-icon-wrapper">
            {/* Aplicamos color rojo directamente al ícono para igualar el diseño */}
            <Lock size={24} color="#ff3b30" />
          </div>
          <p className="stat-value">24</p>
          <p className="stat-label">Bloqueados</p>
        </div>
        
        {/* Pendientes */}
        <div className="stat-item">
          <div className="stat-icon-wrapper">
            <History size={24} />
          </div>
          <p className="stat-value">30%</p>
          <p className="stat-label">Pendientes</p>
        </div>
      </div>

      {/* Contenedor Central: Imagen del Portón */}
      <div className="gate-container">
        {/* Aquí llamamos la imagen referenciada desde la carpeta public */}
        <img 
          src="/admin/porton.png" 
          alt="Render de Portón" 
          className="gate-image" 
        />
      </div>

      {/* Sección Inferior: Textos y Notificación */}
      <div className="home-footer">
        {/* Lado izquierdo */}
        <div className="footer-info">
          <h2>Narayola II</h2>
          <p>GMS 4G Activo</p>
        </div>

        {/* Lado derecho: Tarjeta de Notificación */}
        <div className="notification-card">
          <img 
            src="/admin/banesco.jpg" 
            alt="Logo Banesco" 
            className="notification-img" 
          />
          <div className="notification-text">
            <p className="notif-title">Pago por verificar</p>
            <p className="notif-desc">12562 Bs APTO 311</p>
          </div>
          <button className="notif-close" aria-label="Cerrar notificación">
            <X size={20} />
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default HomeScreen;