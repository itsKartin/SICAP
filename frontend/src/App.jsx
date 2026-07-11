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

  const [user, setUser] = useState(null);


  const handleLoginSuccess = (userData) => {
   
    setUser(userData);
  };

  return (
    <Router>
      <div>
        <Routes>
          {!user ? (
            <Route 
              path="*" 
              element={<Auth onLoginSuccess={handleLoginSuccess} />} 
            />
          ) : (
            <>
              {user.role === 'admin' ? (        
                <>
                  <Route path="/admin" element={<AdminNav />}>
                    <Route index element={<Navigate to="home" replace />} />
                    <Route path="home" element={<HomeScreen />} />
                    <Route path="owners" element={<AdminPropietarios />} />
                    <Route path="pagos" element={<AdminPagos />} />
                    <Route path="bloqueados" element={<AdminBloqueados />} />
                    <Route path="manual-access" element={<ManualAccess/>} />
                  </Route>
  
                  <Route path="*" element={<Navigate to="/admin/home" replace />} />
                </>
              ) : (
                <>
                  <Route path="/dashboard" element={<DashboardUser />} />

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