import React, { useState } from 'react';
import Auth from './components/Auth';
import DashboardUser from './components/user/DashboardUser';


function App() {
  // Guardamos los datos del usuario logueado. Si es null, mostramos el Login.
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <div className="app-container">
      {user ? (
        // Si hay usuario, renderiza el Dashboard (puedes pasarle los datos del usuario si quieres)
        <DashboardUser user={user} />
      ) : (
        // Si no hay usuario, muestra la pantalla de Login/Registro
        <Auth onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;