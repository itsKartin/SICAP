import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- 1. Importamos la herramienta de navegación
import './Login.css';

function Login() {
  const navigate = useNavigate(); // <-- 2. La inicializamos

  // 3. Creamos una función para manejar el clic del botón
  const handleLogin = (e) => {
    e.preventDefault(); // Evita que la página se recargue
    // Aquí luego conectaremos con el backend de Carlos, por ahora simulamos el ingreso:
    navigate('/dashboard'); 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Iniciar Sesión en SICAP</h2>
        
        {/* 4. Le decimos al formulario que use nuestra función al enviarse */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Cédula o Correo:</label>
            <input type="text" placeholder="Ingrese su usuario" />
          </div>
          
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" placeholder="Ingrese su contraseña" />
          </div>
          
          <button type="submit" className="btn-submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;