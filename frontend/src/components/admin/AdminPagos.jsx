import React from 'react';
import { ArrowUpDown, ChevronDown, MoreVertical } from 'lucide-react';
import './AdminPagos.css';

const AdminPagos = () => {
  // Datos simulados para la tabla de pagos
  const pagos = [
    { id: 1, nombre: 'Carlos Lugo', monto: '17.1515 bs', ref: 'Ref#1551', fecha: '4-4-26' },
    { id: 2, nombre: 'Giuseppe Papa', monto: '17.1515 bs', ref: 'Ref#1551', fecha: '4-4-26' },
  ];

  // Datos simulados para la lista de pendientes
  const pendientes = [
    { id: 1, nombre: 'Robert Fox', rol: 'Team Leader', activa: true },
    { id: 2, nombre: 'Theresa Webb', rol: 'Team Leader', activa: true },
    { id: 3, nombre: 'Jerome Bell', rol: 'Ethical Hacker', activa: true },
    { id: 4, nombre: 'Dianne Russell', rol: 'Scrum Master', activa: true },
    // Elementos atenuados para simular el scroll de la imagen
    { id: 5, nombre: 'Theresa Webb', rol: 'Team Leader', activa: false },
    { id: 6, nombre: 'Jerome Bell', rol: 'Ethical Hacker', activa: false },
    { id: 7, nombre: 'Dianne Russell', rol: 'Scrum Master', activa: false },
  ];

  return (
    <div className="admin-pagos-container">
      
      {/* Columna Principal Izquierda */}
      <div className="pagos-main-content">
        
        {/* Tarjetas Superiores */}
        <div className="pagos-cards-row">
          
          {/* Tarjeta 1: Recaudado */}
          <div className="pagos-card card-recaudado">
            <p className="card-subtitle">Historial de Pagos</p>
            <p className="card-sub-date">2025-2026</p>
            <div className="price-container">
              <h2 className="card-price">$1,550.00</h2>
              <button className="icon-btn-sort">
                <ArrowUpDown size={14} />
              </button>
            </div>
            
            {/* Barra de progreso personalizada */}
            <div className="progress-container">
              <div className="progress-bar-segment segment-1"></div>
              <div className="progress-bar-segment segment-2"></div>
              <div className="progress-bar-segment segment-3"></div>
              <div className="progress-circle">
                <span>75%</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Usuarios */}
          <div className="pagos-card card-usuarios">
            <div className="usuarios-text">
              <h3 className="card-title">Mas usuarios han pagado</h3>
              <p className="card-subtitle-gray">comparado al mes anterior</p>
              <h2 className="card-percentage">+24%</h2>
              <p className="card-growth-text">Grow since last month ↗</p>
            </div>
            {/* Gráfico SVG simulado para que se vea idéntico */}
            <div className="usuarios-chart">
              <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="chart-svg">
                <path 
                  d="M0,30 L10,35 L20,20 L30,25 L40,15 L50,5 L60,25 L70,10 L80,30 L90,15 L100,20" 
                  fill="none" 
                  stroke="#4ade80" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {/* Línea punteada vertical */}
                <line x1="50" y1="5" x2="50" y2="40" stroke="#4ade80" strokeWidth="0.5" strokeDasharray="2 2" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tabla de Pagos */}
        <div className="pagos-table-section">
          <div className="table-header">
            <h3>todos los pagos</h3>
            <div className="table-filters">
              <div className="filter-dropdown">
                <span>All Categories</span>
                <ChevronDown size={14} />
              </div>
              <div className="filter-dropdown">
                <span>All Status</span>
                <ChevronDown size={14} />
              </div>
            </div>
          </div>

          <div className="table-body">
            {pagos.map((pago) => (
              <div className="table-row" key={pago.id}>
                <div className="row-user">
                  {/* Usando la imagen de perfil que mostraste en tu estructura */}
                  <img src="/admin/perfil.png" alt="Perfil" className="row-avatar" />
                  <span className="row-name">{pago.nombre}</span>
                </div>
                <span className="row-cell">{pago.monto}</span>
                <span className="row-cell">{pago.ref}</span>
                <span className="row-cell">{pago.fecha}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Columna Derecha: Pendientes por verificar */}
      <div className="pagos-sidebar-right">
        <h3 className="pendientes-title">Pendientes por verificar</h3>
        <div className="pendientes-list">
          {pendientes.map((persona) => (
            <div 
              className={`pendiente-card ${persona.activa ? 'active-card' : 'faded-card'}`} 
              key={persona.id}
            >
              <div className="pendiente-info">
                <img src="/admin/perfil.png" alt="Perfil" className="pendiente-avatar" />
                <div className="pendiente-text">
                  <p className="pendiente-name">{persona.nombre}</p>
                  <p className="pendiente-role">{persona.rol}</p>
                </div>
              </div>
              <button className="btn-more">
                <MoreVertical size={16} color="#888" />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminPagos;