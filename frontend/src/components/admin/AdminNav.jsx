import React, { useState, useEffect, useRef } from 'react';
// Importamos los nuevos íconos más acordes al contexto
import { LayoutGrid, Users, CreditCard, Ban, ArrowUpRight, CarFront } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom'; 
import './css/AdminNav.css';

const AdminNav = () => {
  // Estado para controlar el menú de exportación
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef(null);

  // Cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setIsExportOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-layout">
      <div className="admin-content">
        
        {/* Barra de Navegación Lateral */}
        <nav className="admin-sidebar">
          <ul className="nav-list">
            <li>
              <NavLink 
                to="/admin/home" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <LayoutGrid size={18} />
                <span>Home Screen</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/owners" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <Users size={18} />
                <span>Propietarios</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/pagos" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <CreditCard size={18} />
                <span>Pagos</span>
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/bloqueados" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <Ban size={18} />
                <span>Bloqueados</span>
              </NavLink>
            </li>


               <li>
              <NavLink 
                to="/admin/manual-access" 
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
              >
                <CarFront size={18} />
                <span>Accesos manuales</span>
              </NavLink>
            </li>

          </ul>

          {/* Botón de Exportar inferior con Menú Desplegable */}
          <div className="export-container" ref={exportRef}>
            
            {/* Menú que se muestra condicionalmente */}
            {isExportOpen && (
              <div className="export-dropdown">
                <button className="export-option">Todos los usuarios</button>
                <button className="export-option">Usuarios bloqueados</button>
                <button className="export-option">Todos los pagos</button>
                <button className="export-option">Accesos manuales</button>
              </div>
            )}

            <button 
              className="export-btn"
              onClick={() => setIsExportOpen(!isExportOpen)}
            >
              <span className="export-text">Exportar</span>
              <div className={`export-icon-wrapper ${isExportOpen ? 'open' : ''}`}>
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </nav>

        {/* Área Principal Dinámica */}
        <main className="admin-main">
          <Outlet />
        </main>

      </div>

      <footer className="admin-footer">
        <img src="/logo.png" alt="SICAP Logo" className="admin-logo" />
      </footer>
    </div>
  );
};

export default AdminNav;