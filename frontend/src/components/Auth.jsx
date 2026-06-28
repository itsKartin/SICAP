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
      // 1. Cambiamos la URL al puerto de tu backend FastAPI (usualmente 8000)
      // Nota: Si tu router tiene un prefijo en main.py (ej. /auth o /api), añádelo a la URL.

      const response = await fetch('http://192.168.1.109:8000/auth/token', {
        method: 'POST', // 2. El backend espera un POST
        headers: {
          'Content-Type': 'application/json', // 3. Indicamos que enviamos JSON
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }) // 4. Enviamos el email y password en el cuerpo de la petición
      });

      if (response.ok) {
        // Si el status es 200 (OK)
        const data = await response.json();
        
        // Opcional: Puedes guardar el token en localStorage para mantener la sesión
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('role', data.role);

        // Pasamos los datos del usuario/token a la función padre
        onLoginSuccess(data);
      } else {
        // Si hay un error (ej. 401 Invalid credentials), FastAPI devuelve un 'detail'
        const errorData = await response.json();
        setError(errorData.detail || 'Correo o contraseña incorrectos');
      }
    } catch (err) {
      console.error(err);
      setError('No se pudo conectar con el servidor.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-overlay"></div> 

      <div className="auth-card">
        <header className="auth-header">
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