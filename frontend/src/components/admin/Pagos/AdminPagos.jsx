import React, { useState } from 'react';
import { ArrowUpDown, MoreVertical, X, DollarSign, Calendar, Receipt, Activity, User } from 'lucide-react';
import './AdminPagos.css';

// Modal component rediseñado basado en la referencia
const PaymentDetailsModal = ({ payment, isOpen, onClose, onApprove, onReject }) => {
  if (!isOpen || !payment) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content ref-format">
        <button className="close-btn-absolute" onClick={onClose}>
          <X size={20} />
        </button>
        
        {/* Ícono superior centrado simulando el estilo de la referencia */}
        <div className="modal-icon-wrapper">
          <Receipt size={32} />
        </div>
        
        <h2 className="modal-title-centered">Detalles del Pago</h2>
        <p className="modal-subtitle-centered">Pago de {payment.nombre}</p>

        <div className="payment-details-grid">
          <div className="detail-item">
            <span className="detail-label">Monto:</span>
            <span className="detail-value-highlight">{payment.monto}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Fecha:</span>
            <span className="detail-value">{payment.fecha}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Referencia:</span>
            <span className="detail-value">{payment.ref || payment.recibo}</span>
          </div>
          {/* Campo de Método de Pago eliminado */}
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

  const pagos = [
    { id: 1, monto: '17.1515 bs', fecha: '4 Abr 2026', recibo: 'Ref#1551', estado: 'Completado', usuario: 'Carlos Lugo' },
    { id: 2, monto: '17.1515 bs', fecha: '4 Abr 2026', recibo: 'Ref#1551', estado: 'Completado', usuario: 'Giuseppe Papa' },
    { id: 3, monto: '25.0000 bs', fecha: '5 Abr 2026', recibo: 'Ref#1552', estado: 'Pendiente', usuario: 'Ana Martínez' },
  ];

  const pendientes = [
    { id: 1, nombre: 'Robert Fox', rol: 'Team Leader', ref: 'Ref#1001', monto: '10.50 bs', fecha: '12 Abr 2026', metodo: 'Pago Móvil Banesco' },
    { id: 2, nombre: 'Theresa Webb', rol: 'Team Leader', ref: 'Ref#1002', monto: '15.00 bs', fecha: '13 Abr 2026', metodo: 'Transferencia Mercantil' },
    { id: 3, nombre: 'Jerome Bell', rol: 'Ethical Hacker', ref: 'Ref#1003', monto: '22.30 bs', fecha: '13 Abr 2026', metodo: 'Pago Móvil Provincial' },
    { id: 4, nombre: 'Dianne Russell', rol: 'Scrum Master', ref: 'Ref#1004', monto: '18.75 bs', fecha: '14 Abr 2026', metodo: 'Transferencia BNC' },
    { id: 5, nombre: 'Cody Fisher', rol: 'UI/UX Designer', ref: 'Ref#1005', monto: '20.00 bs', fecha: '14 Abr 2026', metodo: 'Pago Móvil Banesco' },
    { id: 6, nombre: 'Esther Howard', rol: 'Project Manager', ref: 'Ref#1006', monto: '25.50 bs', fecha: '15 Abr 2026', metodo: 'Transferencia Mercantil' },
    { id: 7, nombre: 'Brooklyn Simmons', rol: 'Software Engineer', ref: 'Ref#1007', monto: '19.20 bs', fecha: '15 Abr 2026', metodo: 'Pago Móvil Provincial' },
    { id: 8, nombre: 'Leslie Alexander', rol: 'Data Analyst', ref: 'Ref#1008', monto: '21.00 bs', fecha: '16 Abr 2026', metodo: 'Transferencia BNC' },
  ];

  const openPaymentModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const approvePayment = (paymentId) => {
    console.log(`Pago ${paymentId} verificado`);
    closePaymentModal();
  };

  const rejectPayment = (paymentId) => {
    console.log(`Pago ${paymentId} rechazado`);
    closePaymentModal();
  };

  return (
    <div className="admin-pagos-container">
      
      {/* --- COLUMNA PRINCIPAL IZQUIERDA --- */}
      <div className="pagos-main-content">
        
        <div className="pagos-cards-row">
          {/* Tarjeta 1: Recaudado */}
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

          {/* Tarjeta 2: Gráfico de Crecimiento del Balance */}
          <div className="pagos-card balance-chart-card">
            <div className="balance-header">
              <h3 className="balance-title">Pagos por verificar</h3>
              <MoreVertical size={16} color="#888" style={{ cursor: 'pointer' }} />
            </div>
            <div className="balance-info">
              <h2 className="balance-total">12</h2>
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

        {/* --- NUEVA TABLA DE PAGOS --- */}
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

      {/* --- COLUMNA DERECHA (PENDIENTES - EFECTO CARRUSEL) --- */}
      <div className="pagos-sidebar-right">
        <h3 className="pendientes-title">Pendientes por verificar</h3>
        
        <div className="pendientes-list-wrapper">
          <div className="pendientes-list">
            {pendientes.map((persona) => (
              <div className="pendiente-card" key={persona.id} onClick={() => openPaymentModal(persona)}>
                <div className="pendiente-info">
                  <img src="/admin/User.png" alt="Perfil" className="pendiente-avatar" />
                  <div className="pendiente-text">
                    <p className="pendiente-name">{persona.nombre}</p>
                    <p className="pendiente-role">{persona.rol}</p>
                  </div>
                </div>
                <button className="btn-more" onClick={(e) => { e.stopPropagation(); openPaymentModal(persona); }}>
                  <MoreVertical size={16} color="#888" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal for payment details and actions */}
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