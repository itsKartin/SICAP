import React, { useState } from 'react';
import './AdminPropietarios.css';

const AdminPropietarios = () => {
  // Datos simulados de los residentes de la torre
  const residentsData = [
    { id: 1, apto: '3-1', name: 'GIUSEPPE PAPA', cedula: 'V-31358151', email: 'papa57886@gmail.com', phone: '0424-3556555' },
    { id: 2, apto: '2-1', name: 'CARLOS LUGO', cedula: 'V-28123456', email: 'carlos.lugo@gmail.com', phone: '0414-1234567' },
    { id: 3, apto: '3-1', name: 'GIUSEPPE PAPA', cedula: 'V-31358151', email: 'papa57886@gmail.com', phone: '0424-3556555' },
    { id: 4, apto: '2-1', name: 'CARLOS LUGO', cedula: 'V-28123456', email: 'carlos.lugo@gmail.com', phone: '0414-1234567' },
    { id: 5, apto: '3-1', name: 'GIUSEPPE PAPA', cedula: 'V-31358151', email: 'papa57886@gmail.com', phone: '0424-3556555' },
    { id: 6, apto: '2-1', name: 'CARLOS LUGO', cedula: 'V-28123456', email: 'carlos.lugo@gmail.com', phone: '0414-1234567' },
    { id: 7, apto: '3-1', name: 'GIUSEPPE PAPA', cedula: 'V-31358151', email: 'papa57886@gmail.com', phone: '0424-3556555' },
    { id: 8, apto: '2-1', name: 'CARLOS LUGO', cedula: 'V-28123456', email: 'carlos.lugo@gmail.com', phone: '0414-1234567' },
    { id: 9, apto: '3-1', name: 'GIUSEPPE PAPA', cedula: 'V-31358151', email: 'papa57886@gmail.com', phone: '0424-3556555' },
    { id: 10, apto: '2-1', name: 'CARLOS LUGO', cedula: 'V-28123456', email: 'carlos.lugo@gmail.com', phone: '0414-1234567' },
  ];

  // Estado para manejar el residente seleccionado (inicializado con el primero)
  const [selectedResident, setSelectedResident] = useState(residentsData[0]);

  return (
    <div className="ap-container">
      {/* Cabecera de navegación */}
      <div className="ap-header">
        <button className="ap-back-btn">&lt; TORRE 2</button>
        <div className="ap-header-placeholder"></div>
      </div>

      <div className="ap-main-content">
        {/* Cuadrícula izquierda (Casas) */}
        <div className="ap-grid">
          {residentsData.map((resident) => (
            <div 
              key={resident.id} 
              className={`ap-house-card ${selectedResident.id === resident.id ? 'active' : ''}`}
              onClick={() => setSelectedResident(resident)}
            >
              <img 
                src="/admin/house.png" 
                alt="Casa" 
                className="ap-house-img" 
              />
              <div className="ap-house-info">
                <span className="ap-house-apto">{resident.apto}</span>
                <span className="ap-house-name">{resident.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Panel lateral derecho (Información del residente) */}
        <div className="ap-sidebar">
          <div className="ap-sidebar-avatar-container">
            <img 
              src="/admin/perfil.png" 
              alt="Perfil" 
              className="ap-sidebar-avatar" 
            />
          </div>
          
          <h2 className="ap-sidebar-title">Informacion residente</h2>
          
          <div className="ap-sidebar-details">
            <div className="ap-detail-row">
              <span className="ap-detail-text">{selectedResident.cedula}</span>
            </div>
            <div className="ap-detail-row">
              <span className="ap-detail-text">Apto {selectedResident.apto}</span>
            </div>
            <div className="ap-detail-row">
              <span className="ap-detail-text">Nombre: {selectedResident.name}</span>
            </div>
            <div className="ap-detail-row">
              <span className="ap-detail-text">Correo: {selectedResident.email}</span>
            </div>
            <div className="ap-detail-row">
              {/* Corregido el pequeño error tipográfico de la imagen de "Teleono" a "Teléfono" */}
              <span className="ap-detail-text">Teléfono: {selectedResident.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPropietarios;