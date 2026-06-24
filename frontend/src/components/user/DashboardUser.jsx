import React from 'react';
import './DashboardUser.css';

const DashboardUser = () => {
  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="logo-wrapper">
          <img src="/user/logo.png" alt="SICAP" className="logo-img" />
        </div>
        <div className="status-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lightning-icon">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          active
        </div>
      </header>

      {/* HERO SECTION (PORTÓN) */}
      <section className="dash-hero">
        <div className="gate-display">
          <img src="/user/port.png" alt="Portón" className="gate-img" />
          <div className="gate-base"></div>
          
          <div className="location-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="pin-icon">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Narayola II
          </div>
        </div>
        
        <div className="pagination-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
        </div>
      </section>

      {/* PANEL DE CONTROL */}
      <section className="dash-control-panel">
        <div className="panel-header">
          <h2>Panel de control</h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dots-icon">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </div>

        <div className="cards-grid">
          {/* Tarjeta 1: Cuentas Pendientes */}
          <div className="card pending-card">
            <p className="subtitle">Proximo corte<br/>en 30 dias</p>
            <div className="pending-content">
              <span className="highlight-number">2</span>
              <h3>Cuentas<br/>Pendientes</h3>
            </div>
          </div>

          {/* Tarjeta 2: Mensaje */}
          <div className="card message-card">
            <div className="icon-wrapper">
              <img src="/user/msj.png" alt="Mensaje" className="msj-icon" />
            </div>
            <h3>Se verifico<br/>su pago<br/>de enero</h3>
          </div>
        </div>

        <div className="actions-row">
          {/* Botón Ver Pagos */}
          <button className="action-btn payments-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fire-icon">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M9 3v.01M12 21a9 9 0 0 0 8.94-8.06A4.5 4.5 0 0 0 16 8.5c-.32 0-.64.06-.94.17A6.47 6.47 0 0 0 10.5 4a6.5 6.5 0 0 0-4.47 11.23A4.5 4.5 0 0 0 12 21Z"></path>
            </svg>
            Ver mis Pagos
          </button>

          {/* Botón SOS */}
          <div className="action-btn sos-btn">
            <span className="sos-text">SOS</span>
            <div className="toggle-switch"></div>
          </div>
        </div>

        {/* NOTIFICACIONES TIPO IPHONE SEPARADAS */}
        <div className="notifications-container">
          <div className="notif-item">
            <div className="notif-icon-col">
              <div className="notif-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="small-icon">
                  <circle cx="12" cy="12" r="3"></circle>
                  <circle cx="12" cy="12" r="8"></circle>
                </svg>
              </div>
            </div>
            <div className="notif-content">
              <div className="notif-header">
                <span className="notif-title">Admin</span>
                <span className="notif-time">6:07 pm</span>
              </div>
              <p className="notif-desc">Pago #4515 Acreditado</p>
            </div>
          </div>

          <div className="notif-item">
            <div className="notif-icon-col">
              <div className="notif-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="small-icon">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
            </div>
            <div className="notif-content">
              <div className="notif-header">
                <span className="notif-title">Sicap</span>
                <div className="notif-time-col">
                  <span className="notif-time">6:12 pm</span>

                </div>
              </div>
              <p className="notif-desc">Agregado exitosamente</p>
            </div>
          </div>

          <div className="notif-item">
            <div className="notif-icon-col">
              <div className="notif-icon-wrapper">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="small-icon">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            <div className="notif-content">
              <div className="notif-header">
                <span className="notif-title">Sistema</span>
                <span className="notif-time">6:15 pm</span>
              </div>
              <p className="notif-desc">Mantenimiento programado</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM NAVIGATION */}
      <nav className="dash-bottom-nav">
        <div className="nav-container">
          <div className="nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
            </svg>
            <span>Feed</span>
            <div className="active-indicator"></div>
          </div>
          <div className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </div>
          <div className="nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardUser;