import React from 'react';
import { LayoutGrid, Compass, RefreshCw, CarFront, ArrowUpRight } from 'lucide-react';
// Importamos NavLink y Outlet de react-router-dom
import { NavLink, Outlet } from 'react-router-dom'; 
import './AdminNav.css';

const AdminNav = () => {
  return (
    <div className="admin-layout">
      <div className="admin-content">
        
        {/* Barra de Navegación Lateral */}
        <nav className="admin-sidebar">
          <ul className="nav-list">
            <li>
              {/* NavLink agrega automáticamente la clase 'active' si la URL coincide */}
              <NavLink 
                to="/admin/home" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <LayoutGrid size={20} />
                <span>Home Screen</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/torres" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <Compass size={20} />
                <span>Propietarios</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/pagos" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <RefreshCw size={20} />
                <span>Pagos</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/bloqueados" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <CarFront size={20} />
                <span>Bloqueados</span>
              </NavLink>
            </li>
          </ul>

          {/* Botón de Exportar inferior */}
          <div>
            <button className="export-btn">
              <span className="export-text">Exportar</span>
              <div className="export-icon-wrapper">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </nav>

        {/* Área Principal Dinámica */}
        <main className="admin-main">
          {/* Magia de React Router: 
            Aquí se renderizará automáticamente el componente que corresponda 
            a la URL (Ej: si estás en /admin/torres, aquí se verá <AdminTowers />) 
          */}
          <Outlet />
        </main>

      </div>

      <footer className="admin-footer">
        <img src="/admin/logo.png" alt="SICAP Logo" className="admin-logo" />
      </footer>
    </div>
  );
};

export default AdminNav;