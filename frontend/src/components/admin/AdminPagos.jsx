import React, { useState, useEffect } from 'react';
import { ArrowUpDown, MoreVertical, X, DollarSign, Calendar, Receipt, Activity, User } from 'lucide-react';
import './css/AdminPagos.css';

const PaymentDetailsModal = ({ payment, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !payment) return null;


  const nombre = payment.owner_name || payment.usuario || payment.nombre;
  const monto = payment.amount_bs ? `${payment.amount_bs} bs` : payment.monto;
  const fecha = payment.payment_date || payment.fecha;
  const recibo = payment.receipt || payment.recibo || payment.ref;

  return (
    <div className="modal-overlay">
      <div className="modal-content ref-format">
        <button className="close-btn-absolute" onClick={onClose}>
          <X size={20} />
        </button>
        

        <div className="modal-icon-wrapper">
          <Receipt size={32} />
        </div>
        
        <h2 className="modal-title-centered">Detalles del Pago</h2>
        <p className="modal-subtitle-centered">Pago de {nombre}</p>

        <div className="payment-details-grid">
          <div className="detail-item">
            <span className="detail-label">Monto:</span>
            <span className="detail-value-highlight">{monto}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">{fecha}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Referencia:</span>
            <span className="detail-value">{recibo}</span>
          </div>
        </div>

        <div className="modal-actions">
          <button className="approve-btn" onClick={() => onApprove(payment.id)}>
            Comprobar Pago
          </button>
          <button className="reject-btn" onClick={() => onReject(payment.id)}>
            Rechazar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminPagos = () => {
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendientes, setPendientes] = useState([]); 


  const pagos = [
    { id: 1, monto: '17.1515 bs', fecha: '4 Abr 2026', recibo: 'Ref#1551', estado: 'Completado', usuario: 'Carlos Lugo' },
    { id: 2, monto: '17.1515 bs', fecha: '4 Abr 2026', recibo: 'Ref#1551', estado: 'Completado', usuario: 'Giuseppe Papa' },
    { id: 3, monto: '25.0000 bs', fecha: '5 Abr 2026', recibo: 'Ref#1552', estado: 'Pendiente', usuario: 'Ana Martínez' },
  ];

  useEffect(() => {
    const fetchPendientes = async () => {
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch('http://192.168.1.109:8000/admin/pending-payments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setPendientes(data); 
        } else {
          console.error("Error al obtener los pagos pendientes:", response.statusText);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    };

    fetchPendientes();
  }, []);

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

const approvePayment = async (paymentId) => {

    const token = localStorage.getItem('access_token');
    
    try {
  
      const response = await fetch(`http://192.168.1.109:8000/admin/payment-verification/${paymentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Pago verificado exitosamente:", data);
        

        setPendientes((prevPendientes) => 
          prevPendientes.filter((pago) => pago.id !== paymentId)
        );
        
        alert("Pago verificado correctamente.");
      } else {
 
        const errorData = await response.json();
        console.error("Error al verificar el pago:", errorData.detail);
        alert(`Error: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Hubo un error de conexión al intentar verificar el pago.");
    } finally {
  
      closePaymentModal();
    }
  };

  const rejectPayment = (paymentId) => {
    console.log(`Pago ${paymentId} rechazado`);
    closePaymentModal();
  };

  return (
    <div className="admin-pagos-container">

      <div className="pagos-main-content">
        
        <div className="pagos-cards-row">
  
          <div className="pagos-card card-recaudado">
            <p className="card-subtitle">Pagos recibidos</p>
            <p className="card-sub-date">2025-2026</p>
            <div className="price-container">
              <h2 className="card-price">$1,550.00</h2>
              <button className="icon-btn-sort">
                <ArrowUpDown size={14} />
              </button>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar-segment segment-1"></div>
              <div className="progress-bar-segment segment-2"></div>
              <div className="progress-bar-segment segment-3"></div>
              <div className="progress-circle">
                <span>75%</span>
              </div>
            </div>
          </div>


          <div className="pagos-card balance-chart-card">
            <div className="balance-header">
              <h3 className="balance-title">Pagos por verificar</h3>
              <MoreVertical size={16} color="#888" style={{ cursor: 'pointer' }} />
            </div>
            <div className="balance-info">

              <h2 className="balance-total">{pendientes.length}</h2>
              <span className="balance-badge">+5 Hoy</span>
            </div>
            <div className="balance-chart-container">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="balance-svg">
                <defs>
                  <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4ade80" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#4ade80" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M0,100 C50,90 80,110 130,70 C180,30 220,80 280,60 C340,40 380,20 400,10 L400,120 L0,120 Z" 
                  fill="url(#gradient-green)" 
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="modern-table-container">
          <div className="modern-table-header">
            <div className="modern-header-cell">
              <DollarSign size={16} /> Monto bs
            </div>
            <div className="modern-header-cell">
              <Calendar size={16} /> Fecha
            </div>
            <div className="modern-header-cell">
              <Receipt size={16} /> Recibo
            </div>
        
            <div className="modern-header-cell">
              <User size={16} /> Usuario
            </div>

            <div className="modern-header-cell">
              <Activity size={16} /> Estado
            </div>
          </div>

          <div className="modern-table-body">
            {pagos.map((pago) => (
              <div className="modern-table-row" key={pago.id}>
                <div className="modern-cell font-semibold">{pago.monto}</div>
                <div className="modern-cell">{pago.fecha}</div>
                <div className="modern-cell text-muted">{pago.recibo}</div>
               
                <div className="modern-cell font-medium">{pago.usuario}</div>

                 <div className="modern-cell">
                  <span className={`status-badge ${pago.estado === 'Completado' ? 'status-completed' : 'status-pending'}`}>
                    {pago.estado}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="pagos-sidebar-right">
        <h3 className="pendientes-title">Pendientes por verificar</h3>
        
        <div className="pendientes-list-wrapper">
          <div className="pendientes-list">
            {pendientes.length > 0 ? (
              pendientes.map((pago) => (
                <div className="pendiente-card" key={pago.id} onClick={() => openPaymentModal(pago)}>
                  <div className="pendiente-info">
                    <img src="/admin/User.png" alt="Perfil" className="pendiente-avatar" />
                    <div className="pendiente-text">
    
                      <p className="pendiente-name">{pago.owner_name}</p>
                      <p className="pendiente-role">Apto: {pago.owner_tower}{pago.owner_floor}{pago.owner_apartment}</p>
                    </div>
                  </div>
                  <button className="btn-more" onClick={(e) => { e.stopPropagation(); openPaymentModal(pago); }}>
                    <MoreVertical size={16} color="#888" />
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>
                No hay pagos pendientes.
              </p>
            )}
          </div>
        </div>
      </div>

    
      <PaymentDetailsModal 
        payment={selectedPayment} 
        isOpen={isModalOpen} 
        onClose={closePaymentModal} 
        onApprove={approvePayment} 
        onReject={rejectPayment} 
      />

    </div>
  );
};

export default AdminPagos;