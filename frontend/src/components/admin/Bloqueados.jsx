import React from 'react';
import { Lock, Info, CarFront, ArrowRight } from 'lucide-react';
import './Bloqueados.css';

const Bloqueados = () => {
  // Datos simulados para mantener el JSX limpio
  const bloqueadosList = [
    { id: 1, phone: '+58 412 217 2502' },
    { id: 2, phone: '+58 424 355 6555' },
    { id: 3, phone: '+58 412 217 2502' },
    { id: 4, phone: '+58 424 355 6555' }
  ];

  const notificacionesList = [
    { id: 1, action: 'Acceso manual Solicitado por', person: 'Giuseppe Papa', time: '2:34', showInfo: true },
    { id: 2, action: 'Acceso manual Solicitado por', person: 'Giuseppe Papa', time: '2:34', showInfo: false },
    { id: 3, action: 'Acceso manual Solicitado por', person: 'Giuseppe Papa', time: '2:34', showInfo: false }
  ];

  return (
    <div className="bloqueados-container">
      {/* Barra de Búsqueda Superior */}
      <div className="bloqueados-header">
        <div className="search-bar">
          <input type="text" placeholder="Buscar" />
        </div>
      </div>

      {/* Título de la Sección */}
      <div className="bloqueados-title">
        <div className="lock-icon-wrapper">
          <Lock size={24} className="lock-icon" />
        </div>
        <h1>Usuarios Bloqueados</h1>
      </div>

      {/* Grid de Vehículos */}
      <div className="cars-grid">
        {bloqueadosList.map((user) => (
          <div key={user.id} className="car-card">
            <img src="/admin/tesla.png" alt="Tesla Bloqueado" className="car-image" />
            <p className="car-phone">{user.phone}</p>
            <button className="cancel-ride-btn">Cancel Ride</button>
          </div>
        ))}
      </div>

      {/* Sección Inferior: Resumen y Notificaciones */}
      <div className="bottom-dashboard">
        
        {/* Columna Izquierda: Resumen */}
        <div className="resumen-section">
          <h3 className="section-subtitle">Resumen</h3>
          
          <div className="resumen-cards">
            {/* Tarjeta Pagos */}
            <div className="resumen-card dark-glass">
              <div className="resumen-header">
                <h2>68</h2>
                <span>Pagos Procesados</span>
              </div>
              <div className="progress-line solid-progress"></div>
              <a href="#pagos" className="resumen-link">
                ver pagos <ArrowRight size={14} />
              </a>
            </div>

            {/* Tarjeta Bloqueos */}
            <div className="resumen-card dark-glass">
              <div className="resumen-header">
                <h2>4</h2>
                <span>Usuarios por bloquear</span>
              </div>
              <div className="progress-line dashed-progress"></div>
              <a href="#bloquear" className="resumen-link">
                Bloquear <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Notificaciones */}
        <div className="notificaciones-section">
          <h3 className="section-subtitle">Notificaciones</h3>
          
          <div className="notifications-list">
            {notificacionesList.map((notif) => (
              <div key={notif.id} className="notif-card">
                {/* Simulador del ícono de la luz trasera del vehículo */}
                <div className="notif-car-icon">
                  <div className="taillight-glow"></div>
                  <CarFront size={24} color="#333" strokeWidth={1.5} />
                </div>
                
                <div className="notif-details">
                  <p className="notif-action">{notif.action}</p>
                  <p className="notif-person">{notif.person}</p>
                </div>
                
                <div className="notif-meta">
                  {notif.showInfo && <Info size={16} className="info-icon" />}
                  <span className="notif-time">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Bloqueados;