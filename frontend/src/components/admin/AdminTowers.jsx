import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos el hook
import './AdminTowers.css';

const AdminTowers = () => {
  const navigate = useNavigate(); // Inicializamos el hook

  const towersData = [
    { id: 1, name: 'Torre 1', residents: 24 },
    { id: 2, name: 'Torre 2', residents: 24 },
    // ...
  ];

  return (
    <div className="admin-towers-container">
      <div className="admin-towers-header">
        <button className="add-owner-btn">Agregar propietario</button>
      </div>
      
      <div className="towers-grid">
        {towersData.map((tower) => (
          <div key={tower.id} className="tower-item">
            <span className="tower-name">{tower.name}</span>
            <div 
              className="tower-card" 
              // Al hacer clic, navegamos a la ruta de la torre específica
              onClick={() => navigate(`/admin/torres/${tower.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src="/admin/tower.png" alt={`Imagen de ${tower.name}`} className="tower-image" />
              <p className="tower-residents">{tower.residents} RESIDENTES</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminTowers;