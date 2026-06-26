import React, { useState } from 'react';
import { 
  X, 
  Home, 
  Phone, 
  FileText, 
  Activity,
  CarFront,
  LockKeyhole,
  MoreVertical,
  ShieldAlert
} from 'lucide-react';
import './css/AdminBloqueados.css';

// Modal original para detalles de bloqueo
const BlockDetailsModal = ({ user, isOpen, onClose, onUnblock, onKeepBlocked }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content ref-format">
        <button className="close-btn-absolute" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-icon-wrapper-red">
          <LockKeyhole size={32} />
        </div>
        
        <h2 className="modal-title-centered">Detalles de Bloqueo</h2>
        <p className="modal-subtitle-centered">{user.nombre} - {user.apto}</p>

        <div className="block-details-grid ref-grid">
          <div className="detail-item">
            <span className="detail-label">Estado actual:</span>
            <span className="detail-value highlight-red">{user.estado}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Deudas (Meses):</span>
            <span className="detail-value">{user.deudas}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Teléfono:</span>
            <span className="detail-value">{user.telefono}</span>
          </div>
        </div>

        <div className="modal-actions-stacked">
          <button className="unblock-btn-ref" onClick={() => onUnblock(user.id)}>
            Desbloquear Usuario
          </button>
          <button className="keep-blocked-btn-ref" onClick={() => onKeepBlocked(user.id)}>
            Mantener Bloqueo
          </button>
        </div>
      </div>
    </div>
  );
};

// MODAL ACTUALIZADO: Usuarios pendientes de bloqueo con carritos y botón único
const PendingBlockModal = ({ isOpen, onClose, pendingUsers, onBlockAll }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content pending-format">
        <button className="close-btn-absolute" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header-inline">
          <ShieldAlert size={24} color="#ef4444" />
          <h2 className="modal-title-left">Usuarios por Bloquear</h2>
        </div>
        <p className="modal-subtitle-left">Usuarios que han excedido el límite de deudas.</p>

        <div className="pending-users-list">
          {pendingUsers.map((user) => (
            <div className="pending-user-item" key={user.id}>
              {/* Contenedor del carrito */}
              <div className="pending-avatar-wrapper">
                <img src="/admin/car.png" alt="Car" className="pending-avatar" />
              </div>
              
              <div className="pending-user-info">
                <span className="pending-name">{user.nombre}</span>
                <span className="pending-details">{user.apto} • {user.deudas} meses de deuda</span>
              </div>
            </div>
          ))}
        </div>

        {/* Botón único para bloquear a todos */}
        <div className="pending-action-footer">
          <button className="btn-bloquear-todos" onClick={onBlockAll}>
            Bloquear a todos
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminBloqueados = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPendingPanelOpen, setIsPendingPanelOpen] = useState(false);

  const bloqueados = [
    { id: 1, nombre: 'Carlos Lugo', apto: 'Apto 511', telefono: '0412-1234567', deudas: 0, estado: 'Apelacion' },
    { id: 2, nombre: 'Giuseppe Papa', apto: 'Apto 511', telefono: '0414-7654321', deudas: 3, estado: 'Bloqueado' },
    { id: 3, nombre: 'Ana Martínez', apto: 'Apto 511', telefono: '0424-9876543', deudas: 3, estado: 'Bloqueado' },
  ];

  const apelaciones = [
    { id: 1, nombre: 'Carlos Lugo', apto: 'Apto 511', telefono: '0412-1234567', deudas: 0, estado: 'Apelacion' },
    { id: 2, nombre: 'Giuseppe Papa', apto: 'Apto 511', telefono: '0414-7654321', deudas: 3, estado: 'Bloqueado' },
    { id: 3, nombre: 'Ana Martínez', apto: 'Apto 511', telefono: '0424-9876543', deudas: 3, estado: 'Bloqueado' },
  ];

  const usuariosPendientesPorBloquear = [
    { id: 101, nombre: 'Luis Silva', apto: 'Apto 204', deudas: 4 },
    { id: 102, nombre: 'María Gómez', apto: 'Apto 301', deudas: 3 },
    { id: 103, nombre: 'Pedro Pérez', apto: 'Apto 105', deudas: 5 },
  ];

  const openBlockModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeBlockModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const unblockUser = (userId) => {
    console.log(`Usuario ${userId} desbloqueado exitosamente.`);
    closeBlockModal();
  };

  const keepBlockedUser = (userId) => {
    console.log(`El bloqueo se mantiene para el usuario ${userId}.`);
    closeBlockModal();
  };

  // Función para manejar el bloqueo de todos a la vez
  const handleBlockAll = () => {
    console.log('Bloqueando a todos los usuarios pendientes...');
    // Lógica para actualizar la BD
    setIsPendingPanelOpen(false);
  };

  return (
    <div className="admin-bloqueados-container">
      
      {/* --- COLUMNA PRINCIPAL IZQUIERDA --- */}
      <div className="bloqueados-main-content">
        
        <div className="bloqueados-cards-row">
          <div className="bloqueados-card card-totales">
            <p className="card-subtitle">Usuarios por Bloquear</p>
            <p className="card-sub-date">Ultimo corte: 30-6-26</p>
            <div className="price-container">
              <h2 className="card-price">{usuariosPendientesPorBloquear.length}</h2>
              <button className="icon-btn-sort" onClick={() => setIsPendingPanelOpen(true)}>
                <LockKeyhole size={14} />
              </button>
            </div>
            
            <div className="progress-container">
              <div className="progress-bar-segment segment-1"></div>
              <div className="progress-bar-segment segment-2"></div>
              <div className="progress-bar-segment segment-3" style={{backgroundColor: '#333'}}></div>
              <div className="progress-circle">
                <span>+12%</span>
              </div>
            </div>
          </div>

          <div className="bloqueados-card trend-chart-card">
            <div className="trend-header">
              <h3 className="trend-title">Apelaciones por verificar</h3>
              <MoreVertical size={16} color="#888" style={{ cursor: 'pointer' }} />
            </div>
            <div className="trend-info">
              <h2 className="trend-total">4</h2>
              <span className="trend-badge alert-badge">+2 esta semana</span>
            </div>
            <div className="trend-chart-container">
              <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="trend-svg">
                <defs>
                  <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M0,100 C50,90 80,110 130,70 C180,30 220,80 280,60 C340,40 380,20 400,10 L400,120 L0,120 Z" 
                  fill="url(#gradient-red)" 
                />
              </svg>
            </div>
          </div>
        </div>

        {/* --- TABLA DE BLOQUEOS --- */}
        <div className="bloqueados-table-section">
          
          <div className="table-header-titles table-grid">
            <div className="col-header"><CarFront size={16} /> Usuario</div>
            <div className="col-header"><Home size={16} /> Apto</div>
            <div className="col-header"><Phone size={16} /> Teléfono</div>
            <div className="col-header"><FileText size={16} /> Deudas</div>
            <div className="col-header"><Activity size={16} /> Estado</div>
          </div>

          <div className="table-body">
            {bloqueados.map((user) => (
              
              <div className="table-row table-grid" key={user.id}>
                
                <div className="row-user">
                  <img src="/admin/car.png" alt="Car" className="row-avatar" />
                  <span className="row-name">{user.nombre}</span>
                </div>
                
                <div className="row-text">{user.apto}</div>
                
                <div className="row-text">{user.telefono}</div>
                
                <div className="row-text">{user.deudas}</div>
                
                <div className="row-status">
                  <span className={`status-badge ${user.estado === 'Bloqueado' ? 'status-bloqueado' : 'status-apelacion'}`}>
                    {user.estado}
                  </span>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* --- COLUMNA DERECHA (APELACIONES PENDIENTES) --- */}
      <div className="bloqueados-sidebar-right">
        <h3 className="apelaciones-title">Apelaciones Pendientes</h3>
        
        <div className="apelaciones-list-wrapper">
          <div className="apelaciones-list">
            {apelaciones.map((persona) => (
              <div className="apelacion-card" key={persona.id} onClick={() => openBlockModal(persona)}>
                <div className="apelacion-info">
                  <img src="/admin/car.png" alt="Perfil" className="apelacion-avatar" />
                  <div className="apelacion-text">
                    <p className="apelacion-name">{persona.nombre}</p>
                    <p className="apelacion-role">{persona.rol}</p>
                  </div>
                </div>
                <button className="btn-more" onClick={(e) => { e.stopPropagation(); openBlockModal(persona); }}>
                  <MoreVertical size={16} color="#888" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal original de detalles */}
      <BlockDetailsModal 
        user={selectedUser} 
        isOpen={isModalOpen} 
        onClose={closeBlockModal} 
        onUnblock={unblockUser} 
        onKeepBlocked={keepBlockedUser} 
      />

      {/* Nuevo modal de usuarios pendientes de bloqueo */}
      <PendingBlockModal 
        isOpen={isPendingPanelOpen} 
        onClose={() => setIsPendingPanelOpen(false)} 
        pendingUsers={usuariosPendientesPorBloquear}
        onBlockAll={handleBlockAll}
      />

    </div>
  );
};

export default AdminBloqueados;