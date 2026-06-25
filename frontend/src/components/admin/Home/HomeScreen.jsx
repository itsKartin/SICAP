import React, { useState } from 'react';
import { Users, Coins, Lock, History, X, Plus, ChevronRight, FileText } from 'lucide-react';
import './HomeScreen.css';

const HomeScreen = () => {
  // Arreglo temporal para renderizar los 4 items de accesos manuales
  const manualAccesses = [1, 2, 3, 4];
  
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-container">
      
      {/* Cabecera: Hora y Fecha */}
      <div className="home-header">
        <h1 className="home-time">11:21 PM</h1>
        <span className="home-date">Friday, 06 Jan 2023</span>
      </div>

      {/* Panel Derecho: Accesos manuales */}
      <div className="manual-access-panel">
        <div className="panel-header">
          <h3 className="panel-title">Accesos manuales</h3>
          {/* Al hacer click, abrimos el modal */}
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Agregar
          </button>
        </div>
        <div className="access-list">
          {manualAccesses.map((item) => (
            <div key={item} className="access-card">
              <div className="car-image-wrapper">
                <img src="/admin/car-2.png" alt="Auto" />
              </div>
              <div className="access-info">
                <h4>Giuseppe Papa</h4>
                <p>Acceso manual 6:10 pm</p>
              </div>
              <ChevronRight size={18} color="#555555" className="access-chevron" />
            </div>
          ))}
        </div>
      </div>

      {/* Fila de Estadísticas Superiores */}
      <div className="stats-row">
        {/* ... (Tu código de estadísticas se mantiene igual) ... */}
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
      
      {/* =========================================
          NUEVO CÓDIGO: Modal de Registro Manual
      ========================================= */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Botón de cerrar superior derecho */}
            <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            
            {/* Ícono central superior */}
            <div className="modal-icon-wrapper">
              <FileText size={28} color="#3b82f6" />
            </div>
            
            <h2 className="modal-title">Registrar Acceso</h2>
            <p className="modal-subtitle">Ingresa los datos del acceso manual</p>
            
            {/* Formulario */}
            <div className="modal-form">
              <div className="form-group">
                <label>Fecha y Hora</label>
                <input type="datetime-local" className="form-input" />
              </div>
              <div className="form-group">
                <label>Usuario</label>
                <input type="text" placeholder="Ej. Carlos Lugo - Apto 511" className="form-input" />
              </div>
              <div className="form-group">
                <label>Descripción</label>
                <input type="text" placeholder="Ej. Visita técnica" className="form-input" />
              </div>
            </div>
            
            {/* Botones de acción replicando el formato */}
            <button className="btn-modal-primary" onClick={() => setIsModalOpen(false)}>
              Registrar Acceso
            </button>
            <button className="btn-modal-secondary" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;