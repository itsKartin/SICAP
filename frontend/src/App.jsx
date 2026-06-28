import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminNav from './components/admin/AdminNav';
import HomeScreen from './components/admin/HomeScreen';
import AdminPropietarios from './components/admin/AdminPropietarios';
import AdminPagos from './components/admin/AdminPagos';
import AdminBloqueados from './components/admin/AdminBloqueados'; 
import ManualAccess from './components/admin/ManualAccess';
import Auth from './components/Auth';
import DashboardUser from './components/user/DashboardUser';

function App() {
  // Estado para saber quién está logueado. Inicia en 'null' (nadie logueado).
  const [user, setUser] = useState(null);

  // Esta función se pasa al Auth.jsx y se ejecuta cuando el login responde 200 OK
  const handleLoginSuccess = (userData) => {
    // userData trae la respuesta de FastAPI: { access_token: "...", role: "admin" o "owner" }
    setUser(userData);
  };

  return (
    <Router>
      <div>
        <Routes>
          
          {/* 1. SI NO HAY USUARIO LOGUEADO */}
          {!user ? (
            // Atrapamos cualquier ruta y forzamos a mostrar el Login
            <Route 
              path="*" 
              element={<Auth onLoginSuccess={handleLoginSuccess} />} 
            />
          ) : (
            
          /* 2. SI HAY UN USUARIO LOGUEADO, VERIFICAMOS SU ROL */
            <>
              {user.role === 'admin' ? (
                /* --- INTERFAZ DE ADMINISTRADOR --- */
                <>
                  <Route path="/admin" element={<AdminNav />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomeScreen />} />
                    <Route path="owners" element={<AdminPropietarios />} />
                    <Route path="pagos" element={<AdminPagos />} />
                    <Route path="bloqueados" element={<AdminBloqueados />} />
                    <Route path="manual-access" element={<ManualAccess/>} />
                  </Route>
                  {/* Si un admin intenta ir a otra URL, lo regresamos a su home */}
                  <Route path="*" element={<Navigate to="/admin/home" replace />} />
                </>
              ) : (
                /* --- INTERFAZ DE USUARIO / PROPIETARIO --- */
                <>
                  <Route path="/dashboard" element={<DashboardUser />} />
                  {/* Si un usuario intenta ir a otra URL (como /admin), lo regresamos a su dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </>
              )}
            </>
          )}

        </Routes>
      </div>
    </Router>
  );
}

export default App;