import React, { useState } from 'react';
import { Zap, MapPin, MoreHorizontal, Wallet, CircleCheck } from 'lucide-react';
import './DashboardUser.css';

const DashboardUser = () => {
  // Estado para controlar si el usuario está activo o inactivo
  const [isActive, setIsActive] = useState(false); // Cambia a true para ver el color verde

  // Estados para controlar los modales
  const [showPendingMenu, setShowPendingMenu] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentsHistory, setShowPaymentsHistory] = useState(false);
  const [reference, setReference] = useState('');

  // Estado con la lista de deudas pendientes
  const [pendingDebts] = useState([
    { id: 1, month: 'Febrero 2026', amount: 15.00 },
    { id: 2, month: 'Marzo 2026', amount: 15.00 }
  ]);

  // Estado con el historial de pagos del usuario
  const [paymentHistory] = useState([
    { id: 101, date: '15 Ene 2026', ref: '45158932', status: 'Aprobado', amount: 15.00 },
    { id: 102, date: '18 Dic 2025', ref: '98765432', status: 'Aprobado', amount: 15.00 },
    { id: 103, date: '20 Nov 2025', ref: '12349876', status: 'Rechazado', amount: 15.00 },
    { id: 104, date: '15 Oct 2025', ref: '56781234', status: 'Aprobado', amount: 15.00 }
  ]);

  const [selectedDebts, setSelectedDebts] = useState([1, 2]);

  // Manejadores de eventos
  const handleOpenPending = () => setShowPendingMenu(true);
  
  const handleOpenPaymentForm = () => {
    if (selectedDebts.length > 0) {
      setShowPendingMenu(false);
      setShowPaymentForm(true);
    }
  };

  const handleOpenPaymentsHistory = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(false);
    setShowPaymentsHistory(true);
  };

  const handleCloseModals = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(false);
    setShowPaymentsHistory(false);
    setReference('');
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    console.log("Pago reportado con referencia:", reference);
    console.log("Deudas pagadas (IDs):", selectedDebts);
    alert("¡Pago reportado exitosamente!");
    handleCloseModals();
  };

  const toggleDebtSelection = (id) => {
    setSelectedDebts(prev => 
      prev.includes(id) 
        ? prev.filter(debtId => debtId !== id)
        : [...prev, id]
    );
  };

  const totalToPay = pendingDebts
    .filter(debt => selectedDebts.includes(debt.id))
    .reduce((sum, debt) => sum + debt.amount, 0);

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="SICAP" className="logo-img" />
        </div>
        {/* Lógica dinámica para el estado del usuario */}
        <div className={`user-status-badge ${!isActive ? 'inactive' : ''}`}>
       
          {isActive ? 'active' : 'inactivo'}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="dash-hero">
        <div className="gate-display">
          <img src="/user/port.png" alt="Portón" className="gate-img" />
          {/* Lógica dinámica para la base del portón */}
          <div className={`gate-base ${!isActive ? 'inactive' : ''}`}></div>
          
          <div className="location-badge">
            <MapPin className="pin-icon" />
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
          <MoreHorizontal className="dots-icon" />
        </div>

        <div className="cards-grid">
          <div className="card pending-card clickable" onClick={handleOpenPending}>
            <p className="subtitle">Proximo corte<br/>en 30 dias</p>
            <div className="pending-content">
              <span className="highlight-number">{pendingDebts.length}</span>
              <h3>Cuentas<br/>Pendientes</h3>
            </div>
          </div>

          <div className="card message-card">
            <div className="icon-wrapper">
              <img src="/user/msj.png" alt="Mensaje" className="msj-icon" />
            </div>
            <h3>Se verifico<br/>su pago<br/>de enero</h3>
          </div>
        </div>

        <div className="actions-row">
          <button className="action-btn payments-btn" onClick={handleOpenPaymentsHistory}>
            <Wallet className="payment-icon" />
            Ver mis Pagos
          </button>

          <div className="action-btn sos-btn">
            <span className="sos-text">SOS</span>
            <div className="toggle-switch"></div>
          </div>
        </div>

        {/* NOTIFICACIONES */}
        <div className="notifications-container">
          <div className="notif-item">
            <div className="notif-icon-col">
              <div className="notif-icon-wrapper">
                <CircleCheck className="small-icon check-icon" />
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
              {pendingDebts.map(debt => {
                const isSelected = selectedDebts.includes(debt.id);
                return (
                  <div 
                    key={debt.id} 
                    className={`pending-list-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleDebtSelection(debt.id)}
                  >
                    <div className="pending-info">
                      <span className="pending-month">{debt.month}</span>
                      <span className="pending-amount">${debt.amount.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              className="modal-primary-btn" 
              onClick={handleOpenPaymentForm}
              disabled={selectedDebts.length === 0}
              style={{ 
                opacity: selectedDebts.length === 0 ? 0.5 : 1, 
                cursor: selectedDebts.length === 0 ? 'not-allowed' : 'pointer' 
              }}
            >
              Pagar Deuda (${totalToPay.toFixed(2)})
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
              <p><strong>Monto total:</strong> ${totalToPay.toFixed(2)} (Cambio BCV)</p>
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

      {/* Modal 3: Historial de Pagos */}
      {showPaymentsHistory && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Historial de Pagos</h3>
              <button className="close-btn" onClick={handleCloseModals}>✕</button>
            </div>

            <div className="history-list">
              {paymentHistory.map(payment => (
                <div key={payment.id} className="history-item">
                  <div className="history-row">
                    <span className="history-date">{payment.date}</span>
                    <span className="history-amount">${payment.amount.toFixed(2)}</span>
                  </div>
                  <div className="history-row">
                    <span className="history-ref">Ref: {payment.ref}</span>
                    <span className={`history-status status-${payment.status.toLowerCase()}`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardUser;