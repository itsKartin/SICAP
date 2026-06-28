import React, { useState, useEffect, useRef } from 'react';
import { LayoutGrid, Users, CreditCard, Ban, ArrowUpRight, CarFront } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom'; 
import './css/AdminNav.css';

const AdminNav = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);
  const exportRef = useRef(null);

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

const handleDownloadUsersPDF = async () => {
    try {

      //obtener token
      const token = localStorage.getItem('access_token');

      
      const response = await fetch('http://192.168.1.109:8000/admin/owners-report/pdf', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      // convertir a archivo binario
      const blob = await response.blob();
      
      //url temporal 
      const url = window.URL.createObjectURL(blob);
      
      // new element <a> para descargar el archivo

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_propietarios.pdf');
      
      // Agregamos el link al DOM, hacemos clic y limpiamos
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Cerramos el menú de exportación
      setIsExportOpen(false); 
      
    } catch (error) {
      console.error('Hubo un problema descargando el PDF:', error);
    }
  };

  return (
    <div className="admin-layout">
      <div className="admin-content">
        
        <nav className="admin-sidebar">
          <ul className="nav-list">
            <li>
              <NavLink to="/admin/home" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <LayoutGrid size={18} />
                <span>Home Screen</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/owners" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Users size={18} />
                <span>Propietarios</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/pagos" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <CreditCard size={18} />
                <span>Pagos</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/bloqueados" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <Ban size={18} />
                <span>Bloqueados</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/manual-access" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
                <CarFront size={18} />
                <span>Accesos manuales</span>
              </NavLink>
            </li>
          </ul>

          <div className="export-container" ref={exportRef}>
            {isExportOpen && (
              <div className="export-dropdown">
                <button className="export-option" onClick={handleDownloadUsersPDF}>Todos los usuarios</button>
                <button className="export-option">Todos los pagos</button>
                <button className="export-option">Accesos manuales</button>
              </div>
            )}

            <button className="export-btn" onClick={() => setIsExportOpen(!isExportOpen)}>
              <span className="export-text">Exportar</span>
              <div className={`export-icon-wrapper ${isExportOpen ? 'open' : ''}`}>
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </div>
            </button>
          </div>
        </nav>

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