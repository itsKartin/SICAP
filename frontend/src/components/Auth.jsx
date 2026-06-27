import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://192.168.1.109:3000/users?email=${formData.email}&password=${formData.password}`);
      const users = await response.json();

      if (users.length > 0) {
        onLoginSuccess(users[0]);
      } else {
        setError('Correo o contraseña incorrectos');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="auth-container">
      {/* Capa oscura sobre la imagen de fondo */}
      <div className="auth-overlay"></div> 

      <div className="auth-card">
        <header className="auth-header">
          {/* Aquí se reemplazó el texto SICAP por tu logo */}
          <img src="/logo.png" alt="Logo de la aplicación" className="auth-logo" />
          <p className="auth-subtitle">
            Ingrese sus datos para acceder
          </p>
        </header>

        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              placeholder="ej. usuario@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
              placeholder="Ingresa tu contraseña"
            />
          </div>

          <button type="submit" className="auth-submit-btn">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;