import React from 'react';
import './DashboardUser.css'; // Importa tus estilos corregidos

const DashboardUser = () => {
  return (
    <div className="dashboard-container">
      {/* Sección Superior con el degradado limpio */}
      <div className="dashboard-top-section">
        <header className="dashboard-header">
          <div className="header-info">
            <h1 className="header-title">RESIDENCIAS NARAYOLA II</h1>
            <span className="header-status">Solvente</span>
          </div>
          <div className="header-actions">
            <button className="icon-button" aria-label="Información">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </button>
            <button className="icon-button" aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </header>

        <div className="gate-container">
          {/* Esta imagen del portón sigue aquí y está en public/ */}
          <img src="/porton.png" alt="Portón Residencias" className="gate-image" />
        </div>
      </div>

      {/* Sección Inferior del Menú */}
      <main className="dashboard-menu">
        {/* Item 1 */}
        <div className="menu-item">
          <div className="menu-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div className="menu-content">
            <h2 className="menu-title">Saldo Pendiente: 20$</h2>
            <p className="menu-subtitle">Fecha de corte 24-02</p>
          </div>
          <div className="menu-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6f76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        </div>

        {/* Item 2 */}
        <div className="menu-item">
          <div className="menu-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </div>
          <div className="menu-content">
            <h2 className="menu-title">Realizar Pago</h2>
            <p className="menu-subtitle">Nominas pendientes: 2</p>
          </div>
          <div className="menu-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6f76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>

        {/* Item 3 */}
        <div className="menu-item">
          <div className="menu-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
              <line x1="2" y1="22" x2="11" y2="13"></line>
            </svg>
          </div>
          <div className="menu-content">
            <h2 className="menu-title">Ver mis Pagos</h2>
            <p className="menu-subtitle">Pago 42545 En revision.</p>
          </div>
          <div className="menu-action">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6b6f76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <button className="settings-button">
          Ajustes de cuenta
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </footer>
    </div>
  );
};

export default DashboardUser;