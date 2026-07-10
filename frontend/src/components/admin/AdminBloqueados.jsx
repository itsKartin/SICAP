import React, { useState, useEffect } from 'react';
import './css/AdminBloqueados.css'; 

const AdminBloqueados = () => {
  const [bloqueados, setBloqueados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBloqueados = async () => {
      try {
        // Buscamos el token bajo 'access_token' y si no está, probamos con 'token'
        const token = localStorage.getItem('access_token') || localStorage.getItem('token'); 
        
        if (!token) {
          throw new Error('No estás autenticado. Por favor, inicia sesión de nuevo.');
        }

        const response = await fetch('http://localhost:8000/admin/blocked-owners', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error('Tu sesión ha expirado o no tienes permisos. Inicia sesión nuevamente.');
          }
          throw new Error('Error al obtener la lista de usuarios bloqueados.');
        }

        const data = await response.json();
        
        // Verificamos si el backend devolvió un array antes de mapear
        if (!Array.isArray(data)) {
            setBloqueados([]);
            return;
        }

        const usuariosMapeados = data.map(usuario => ({
          id: usuario.id,
          nombre: `${usuario.first_name} ${usuario.last_name}`,
          telefono: usuario.phone || 'Sin número'
        }));

        setBloqueados(usuariosMapeados);
      } catch (err) {
        console.error("Error en fetchBloqueados:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBloqueados();
  }, []); 

  if (loading) {
    return (
      <div className="admin-bloqueados-container">
        <h1 className="admin-titulo">Usuarios bloqueados</h1>
        <p style={{ color: 'white', textAlign: 'center' }}>Cargando lista...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-bloqueados-container">
        <h1 className="admin-titulo">Usuarios bloqueados</h1>
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <p style={{ color: '#ff4444', fontSize: '1.2rem', marginBottom: '10px' }}>{error}</p>
          {/* Opcional: Puedes agregar un botón aquí que redirija al login */}
          <button onClick={() => window.location.href = '/login'} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-bloqueados-container">
      <h1 className="admin-titulo">Usuarios bloqueados</h1>
      
      {bloqueados.length === 0 ? (
        <p style={{ color: 'white', textAlign: 'center' }}>No hay usuarios bloqueados actualmente.</p>
      ) : (
        <div className="admin-grid">
          {bloqueados.map((usuario) => (
            <div key={usuario.id} className="admin-card">
              <img 
                src="/admin/car-2.png" 
                alt="Vehículo bloqueado" 
                className="admin-card-img" 
              />
              <h2 className="admin-card-nombre">{usuario.nombre}</h2>
              <p className="admin-card-telefono">{usuario.telefono}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBloqueados;