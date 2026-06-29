import React, { useState, useEffect } from 'react';
import { Zap, MapPin, MoreHorizontal, Wallet, CircleCheck } from 'lucide-react';
import './DashboardUser.css';

const DashboardUser = () => {
  // Estado para controlar si el usuario está activo o inactivo
  const [isActive, setIsActive] = useState(false);

  // Estados para controlar los modales
  const [showPendingMenu, setShowPendingMenu] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPaymentsHistory, setShowPaymentsHistory] = useState(false);
  
  // --- NUEVOS ESTADOS PARA EL PROTOCOLO SOS ---
  const [isSosActive, setIsSosActive] = useState(false);
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  
  // Estados para el formulario de pago
  const [reference, setReference] = useState('');
  const [amountBsInput, setAmountBsInput] = useState(''); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Tasa BCV (Se inicializa por defecto pero se actualizará con el backend)
  const [bcvRate, setBcvRate] = useState(36.5); 

  // --- ESTADOS PARA LAS DEUDAS PENDIENTES ---
  const [pendingDebts, setPendingDebts] = useState([]);
  const [isLoadingDebt, setIsLoadingDebt] = useState(false);

  // --- ESTADOS PARA EL HISTORIAL DE PAGOS ---
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Efecto para cargar las deudas automáticamente al entrar al Dashboard
  useEffect(() => {
    fetchDebtSummary();
  }, []);

  // Función para llamar a la API y traer las deudas pendientes
  const fetchDebtSummary = async () => {
    setIsLoadingDebt(true);
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://192.168.1.109:8000/owners/my-debt', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener las deudas pendientes');
      }

      const data = await response.json();
      setPendingDebts(data.pending_dues || []);
      
      if (data.exchange_rate) {
        setBcvRate(data.exchange_rate);
      }
    } catch (error) {
      console.error("Error al cargar deudas pendientes:", error);
    } finally {
      setIsLoadingDebt(false);
    }
  };

  // Función para llamar a tu API y traer los pagos
  const fetchPaymentHistory = async () => {
    setIsLoadingHistory(true);
    const token = localStorage.getItem('access_token'); 

    try {
      const response = await fetch('http://192.168.1.109:8000/owners/my-payments', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener el historial de pagos');
      }

      const data = await response.json();
      setPaymentHistory(data); 
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // --- FUNCIONES DEL PROTOCOLO SOS ---
  const handleSosToggleClick = () => {
    // Solo abre el modal si el SOS no está activo aún
    if (!isSosActive) {
      setShowSosConfirm(true);
    }
  };

  const confirmSosProtocol = async () => {
    setIsBlocking(true);
    const token = localStorage.getItem('access_token'); 
    
    try {
      const response = await fetch('http://192.168.1.109:8000/owners/block-number', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      const data = await response.json();

      if (response.ok) {
        setIsSosActive(true);
        setShowSosConfirm(false);
        // Opcional: Desactivar al usuario localmente en la UI
        setIsActive(false); 
        alert(data.message || "Protocolo SOS activado con éxito."); 
      } else {
        alert(data.detail || "Error al activar el protocolo SOS.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error de conexión al activar el protocolo SOS.");
    } finally {
      setIsBlocking(false);
    }
  };

  // Manejadores de eventos de Modales
  const handleOpenPending = () => setShowPendingMenu(true);
  
  const handleOpenPaymentForm = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(true);
  };

  const handleOpenPaymentsHistory = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(false);
    setShowPaymentsHistory(true);
    fetchPaymentHistory(); 
  };

  const handleCloseModals = () => {
    setShowPendingMenu(false);
    setShowPaymentForm(false);
    setShowPaymentsHistory(false);
    setShowSosConfirm(false); // Cierra también el de SOS si se hace clic fuera
    setReference('');
    setAmountBsInput(''); 
  };

  const totalToPay = pendingDebts.reduce((sum, debt) => sum + debt.amount_usd, 0);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const parsedAmountBs = parseFloat(amountBsInput);

    if (isNaN(parsedAmountBs) || parsedAmountBs <= 0) {
      alert("Por favor, ingresa un monto válido mayor a cero.");
      setIsSubmitting(false);
      return;
    }
    
    const token = localStorage.getItem('access_token');

    try {
      const response = await fetch('http://192.168.1.109:8000/owners/upload-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          receipt: reference,
          amount_bs: parsedAmountBs 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Hubo un error al procesar el pago.');
      }

      const data = await response.json();
      
      alert(data.message || "¡Pago reportado exitosamente!");
      handleCloseModals();
      fetchDebtSummary();
      
    } catch (error) {
      console.error("Error al reportar pago:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusText = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'PENDIENTE';
      case 'approved': return 'APROBADO';
      case 'rejected': return 'RECHAZADO';
      default: return status?.toUpperCase();
    }
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dash-header">
        <div className="logo-wrapper">
          <img src="/logo.png" alt="SICAP" className="logo-img" />
        </div>
        <div className={`user-status-badge ${!isActive ? 'inactive' : ''}`}>
          {isActive ? 'active' : 'inactivo'}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="dash-hero">
        <div className="gate-display">
          <img src="/user/port.png" alt="Portón" className="gate-img" />
          <div className={`gate-base ${!isActive ? 'inactive' : ''}`}></div>
          <div className="location-badge">
            <MapPin className="pin-icon" />
            Narayola II
          </div>
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
              <span className="highlight-number">
                {isLoadingDebt ? '...' : pendingDebts.length}
              </span>
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

          {/* NUEVO BOTÓN SOS CON SLIDER */}
          <div className="action-btn sos-btn" onClick={handleSosToggleClick}>
            <div className="sos-label-col">
              <span className="sos-text">SOS</span>
            </div>
            <div className={`sos-toggle ${isSosActive ? 'active' : ''}`}>
              <div className="sos-toggle-thumb"></div>
            </div>
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
              {isLoadingDebt ? (
                <p style={{textAlign: 'center', padding: '20px', color: '#999'}}>Cargando cuentas...</p>
              ) : pendingDebts.length === 0 ? (
                <p style={{textAlign: 'center', padding: '20px', color: '#999'}}>No tienes cuentas pendientes.</p>
              ) : (
                pendingDebts.map(debt => (
                  <div 
                    key={debt.id} 
                    className="pending-list-item selected" 
                  >
                    <div className="pending-info">
                      <span className="pending-month">{debt.month}</span>
                      <span className="pending-amount">${debt.amount_usd.toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button 
              className="modal-primary-btn" 
              onClick={handleOpenPaymentForm}
              disabled={pendingDebts.length === 0}
            >
             Realizar Pago
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
              <p><strong>Deuda total:</strong> ${totalToPay.toFixed(2)}</p>
              <p style={{ fontSize: '0.85em', color: '#888' }}><strong>Tasa de cambio (BCV):</strong> {bcvRate} Bs/$</p>
              <p style={{ color: '#2ecc71' }}><strong>Total estimado en Bs:</strong> {(totalToPay * bcvRate).toFixed(2)} Bs</p>
            </div>

            <form onSubmit={handleSubmitPayment} className="payment-form">
              <label htmlFor="amountBsInput">Monto depositado (Bs):</label>
              <input 
                type="number" 
                id="amountBsInput"
                className="form-input" 
                placeholder="Ej. 1095.50" 
                value={amountBsInput}
                onChange={(e) => setAmountBsInput(e.target.value)}
                step="0.01"
                min="0"
                required
                disabled={isSubmitting} 
                style={{ marginBottom: '15px' }} 
              />

              <label htmlFor="refInput">Número de Referencia:</label>
              <input 
                type="text" 
                id="refInput"
                className="form-input" 
                placeholder="Ej. 12345678" 
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                required
                disabled={isSubmitting} 
              />

              <div className="form-actions">
                <button 
                  type="button" 
                  className="modal-secondary-btn" 
                  onClick={handleCloseModals}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="modal-primary-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Pago'}
                </button>
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
              {isLoadingHistory ? (
                <p style={{textAlign: 'center', padding: '20px', color: '#999'}}>Cargando historial...</p>
              ) : paymentHistory.length === 0 ? (
                <p style={{textAlign: 'center', padding: '20px', color: '#999'}}>No hay pagos registrados.</p>
              ) : (
                paymentHistory.map(payment => (
                  <div key={payment.id} className="history-item">
                    <div className="history-row">
                      <span className="history-date">{payment.payment_date}</span>
                      <span className="history-amount">${payment.amount_usd.toFixed(2)}</span>
                    </div>
                    <div className="history-row">
                      <span className="history-ref">Ref: {payment.receipt}</span>
                      <span className={`history-status status-${payment.status.toLowerCase()}`}>
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal 4: CONFIRMACIÓN SOS */}
      {showSosConfirm && (
        <div className="modal-overlay" onClick={handleCloseModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ color: '#ff4d4d' }}>⚠️ Protocolo de Seguridad</h3>
              <button className="close-btn" onClick={() => setShowSosConfirm(false)}>✕</button>
            </div>
            
            <div style={{ padding: '20px 0', textAlign: 'center', lineHeight: '1.5' }}>
              <p>¿Está seguro que desea activar el <strong>protocolo SOS</strong> para desactivar su número de inmediato?</p>
              <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '10px' }}>
                Esta acción bloqueará su acceso temporalmente por seguridad.
              </p>
            </div>

            <div className="confirm-actions">
              <button 
                className="btn-cancel" 
                onClick={() => setShowSosConfirm(false)}
                disabled={isBlocking}
              >
                Cancelar
              </button>
              <button 
                className="btn-danger" 
                onClick={confirmSosProtocol}
                disabled={isBlocking}
              >
                {isBlocking ? 'Activando...' : 'Sí, Activar SOS'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardUser;