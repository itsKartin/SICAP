import React, { useState } from 'react';
import './DashboardUser.css';

const DashboardUser = () => {
  // Estados para controlar los modales y el formulario
  const [showPendingMenu, setShowPendingMenu] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [reference, setReference] = useState('');

  // Manejadores de eventos
  const handleOpenPending = () => setShowPendingMenu(true);
  
  const handleOpenPaymentForm = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(true);
  };

  const handleCloseModals = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(false);
    setReference('');
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    console.log("Pago reportado con referencia:", reference);
    alert("¡Pago reportado exitosamente!"); // Aquí iría tu lógica de backend
    handleCloseModals();
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="SICAP" className="logo-img" />
        </div>
        <div className="user-status-badge">
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
          <h2>Bienvenido, Giuseppe</h2>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dots-icon">
            <circle cx="12" cy="12" r="1"></circle>
            <circle cx="19" cy="12" r="1"></circle>
            <circle cx="5" cy="12" r="1"></circle>
          </svg>
        </div>

        <div className="cards-grid">
          {/* Tarjeta 1: Cuentas Pendientes (AHORA CON ONCLICK) */}
          <div className="card pending-card clickable" onClick={handleOpenPending}>
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
          <button className="action-btn payments-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fire-icon">
              <path d="M15.05 5A5 5 0 0 1 19 8.95M9 3v.01M12 21a9 9 0 0 0 8.94-8.06A4.5 4.5 0 0 0 16 8.5c-.32 0-.64.06-.94.17A6.47 6.47 0 0 0 10.5 4a6.5 6.5 0 0 0-4.47 11.23A4.5 4.5 0 0 0 12 21Z"></path>
            </svg>
            Ver mis Pagos
          </button>

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
          {/* ... resto de las notificaciones ... */}
        </div>
      </section>

     

      {/* --- MODALES --- */}

      {/* Modal 1: Lista de Cuentas Pendientes */}
      {showPendingMenu && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Cuentas Pendientes</h3>
              <button className="close-btn" onClick={handleCloseModals}>✕</button>
            </div>
            
            <div className="pending-list">
              <div className="pending-list-item">
                <div className="pending-info">
                  <span className="pending-month">Febrero 2026</span>
                  <span className="pending-amount">$15.00</span>
                </div>
              </div>
              <div className="pending-list-item">
                <div className="pending-info">
                  <span className="pending-month">Marzo 2026</span>
                  <span className="pending-amount">$15.00</span>
                </div>
              </div>
            </div>

            <button className="modal-primary-btn" onClick={handleOpenPaymentForm}>
              Pagar Deuda ($30.00)
            </button>
          </div>
        </div>
      )}

      {/* Modal 2: Formulario de Pago */}
      {showPaymentForm && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reportar Pago</h3>
              <button className="close-btn" onClick={handleCloseModals}>✕</button>
            </div>

            <div className="bank-details">
              <p><strong>Banco:</strong> Banesco</p>
              <p><strong>Cta:</strong> 0134-XXXX-XXXX-XXXX-XXXX</p>
              <p><strong>RIF:</strong> J-12345678-9</p>
              <p><strong>Monto total:</strong> $30.00 (Cambio BCV)</p>
            </div>

            <form onSubmit={handleSubmitPayment} className="payment-form">
              <label htmlFor="refInput">Número de Referencia:</label>
              <input 
                type="text" 
                id="refInput"
                className="form-input" 
                placeholder="Ej. 12345678" 
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required
              />
              <div className="form-actions">
                <button type="button" className="modal-secondary-btn" onClick={handleCloseModals}>Cancelar</button>
                <button type="submit" className="modal-primary-btn">Enviar Pago</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardUser;