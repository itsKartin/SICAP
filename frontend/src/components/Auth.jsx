import React, { useState } from 'react';
import './Auth.css';

const Auth = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    torre: '',
    piso: '',
    apartamento: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      if (isLogin) {
        const response = await fetch(`http://192.168.1.109:3000/users?email=${formData.email}&password=${formData.password}`);
        const users = await response.json();

        if (users.length > 0) {
          onLoginSuccess(users[0]);
        } else {
          setError('Correo o contraseña incorrectos');
        }
      } else {
        const checkRes = await fetch(`http://192.168.1.109:3000/users?email=${formData.email}`);
        const existingUsers = await checkRes.json();

        if (existingUsers.length > 0) {
          setError('El correo electrónico ya está registrado');
          return;
        }

        const newUser = {
          nombres: formData.nombres,
          apellidos: formData.apellidos,
          cedula: formData.cedula,
          telefono: formData.telefono,
          torre: formData.torre,
          piso: formData.piso,
          apartamento: formData.apartamento,
          email: formData.email,
          password: formData.password,
          status: "Solvente"
        };

        const response = await fetch('http://192.168.1.109:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser)
        });

        if (response.ok) {
          setMessage('¡Registro exitoso! Ya puedes iniciar sesión.');
          setIsLogin(true);
          setFormData({
            nombres: '', apellidos: '', cedula: '', telefono: '',
            torre: '', piso: '', apartamento: '', email: '', password: '', confirmPassword: ''
          });
        } else {
          setError('Hubo un error al registrar el usuario');
        }
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
          <h1 className="auth-title">SICAP</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Ingresa tus datos para acceder al portón.' : 'Ingresa tus datos personales para crear tu cuenta.'}
          </p>
        </header>

        {/* Botones Sociales (Visuales) */}
        <div className="social-login">
          <button type="button" className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button type="button" className="social-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
            Github
          </button>
        </div>

        <div className="divider">
          <span>O</span>
        </div>

        {error && <div className="auth-alert error">{error}</div>}
        {message && <div className="auth-alert success">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* CAMPOS EXCLUSIVOS DE REGISTRO */}
          {!isLogin && (
            <>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="nombres">Nombres</label>
                  <input type="text" id="nombres" name="nombres" value={formData.nombres} onChange={handleChange} required placeholder="Ej. Juan" />
                </div>
                <div className="form-group half">
                  <label htmlFor="apellidos">Apellidos</label>
                  <input type="text" id="apellidos" name="apellidos" value={formData.apellidos} onChange={handleChange} required placeholder="Ej. Pérez" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="cedula">Cédula</label>
                  <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleChange} required placeholder="V-12345678" />
                </div>
                <div className="form-group half">
                  <label htmlFor="telefono">Teléfono</label>
                  <input type="text" id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required placeholder="0414-0000000" />
                </div>
              </div>

              <div className="form-row three-cols">
                <div className="form-group third">
                  <label htmlFor="torre">Torre</label>
                  <input type="text" id="torre" name="torre" value={formData.torre} onChange={handleChange} required placeholder="Ej. A" />
                </div>
                <div className="form-group third">
                  <label htmlFor="piso">Piso</label>
                  <input type="text" id="piso" name="piso" value={formData.piso} onChange={handleChange} required placeholder="Ej. 4" />
                </div>
                <div className="form-group third">
                  <label htmlFor="apartamento">Apto</label>
                  <input type="text" id="apartamento" name="apartamento" value={formData.apartamento} onChange={handleChange} required placeholder="42" />
                </div>
              </div>
            </>
          )}

          {/* CAMPOS COMUNES (LOGIN Y REGISTRO) */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="ej. usuario@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password" id="password" name="password" value={formData.password} onChange={handleChange} required placeholder="Ingresa tu contraseña"
            />
            {/* Opcional: subtítulo de contraseña como en la imagen */}
            {!isLogin && <span className="input-hint">Debe tener al menos 8 caracteres.</span>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Confirma tu contraseña"
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn">
            {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
          </button>
        </form>

        <footer className="auth-footer">
          <p className="auth-switch-text">
            {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            <button 
              type="button" 
              className="auth-switch-btn" 
              onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}
            >
              {isLogin ? ' Regístrate' : ' Inicia Sesión'}
            </button>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Auth;