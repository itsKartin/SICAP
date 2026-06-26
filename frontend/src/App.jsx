import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importamos los componentes del Administrador
import AdminNav from './components/admin/AdminNav';
import HomeScreen from './components/admin/HomeScreen';
import AdminPropietarios from './components/admin/AdminPropietarios';
import AdminPagos from './components/admin/AdminPagos';
import AdminBloqueados from './components/admin/AdminBloqueados'; 

// Importamos el componente de Usuario
import DashboardUser from './components/user/DashboardUser';

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
        
        {/* SECCIÓN DE ADMINISTRADOR (ARRIBA) - CON RUTAS ACTIVAS */}
        <div className="admin-workspace-section" style={{ borderBottom: '3px dashed #222', paddingBottom: '40px' }}>
          <div style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', padding: '10px 40px', fontWeight: 'bold' }}>
            ENTORNO DE DESARROLLO: MÓDULO ADMINISTRATIVO (NAVEGACIÓN ACTIVA)
          </div>
          
          <Routes>
            {/* Si entras a la raíz "/" te redirige automáticamente a las torres o al home del admin */}
            <Route path="/" element={<Navigate to="/admin/home" replace />} />

            {/* Configuración de rutas anidadas para el Administrador */}
            <Route path="/admin" element={<AdminNav />}>
              <Route index element={<Navigate to="home" replace />} />
              <Route path="home" element={<HomeScreen />} />
              <Route path="owners" element={<AdminPropietarios />} />
              <Route path="pagos" element={<AdminPagos />} />
              <Route path="bloqueados" element={<AdminBloqueados />} />
            </Route>
          </Routes>
        </div>

        {/* SECCIÓN DE USUARIO (ABAJO) - ESTÁTICA PARA MONITOREO */}
        <div className="user-workspace-section" style={{ paddingTop: '20px' }}>
          <div style={{ color: '#666', fontSize: '12px', letterSpacing: '2px', padding: '10px 40px', fontWeight: 'bold' }}>
            ENTORNO DE DESARROLLO: MÓDULO DE USUARIO (FIJO)
          </div>
          <DashboardUser />
        </div>

      </div>
    </Router>
  );
}

export default App;