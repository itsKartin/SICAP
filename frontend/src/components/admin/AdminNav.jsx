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
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:8000/admin/owners-report/pdf', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/pdf'
        }
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reporte_propietarios.pdf');
      
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      setIsExportOpen(false); 
      
    } catch (error) {
      console.error('Hubo un problema descargando el PDF:', error);
    }
  };

  const handleGenerateDues = async () => {
    const amountInput = window.prompt("Ingrese el monto de la mensualidad (USD):", "5");
    if (amountInput === null) return; 
    
    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      alert("Por favor, ingrese un monto válido.");
      return;
    }

    const defaultDate = new Date().toISOString().split('T')[0];
    const dueDate = window.prompt("Ingrese la fecha de vencimiento (YYYY-MM-DD):", defaultDate);
    if (!dueDate) return; 

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/admin/generate-dues', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount_usd: amount,
          due_date: dueDate
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      alert(`${data.message}\nDeudas creadas: ${data.dues_created}\nPropietarios bloqueados: ${data.owners_blocked.length}`);
      setIsExportOpen(false); 

    } catch (error) {
      console.error('Hubo un problema generando la deuda:', error);
      alert(`Error al generar la deuda: ${error.message}`);
    }
  };


  const handleCreateAdmin = async () => {

    const fullName = window.prompt("Ingrese el nombre completo del administrador:");
    if (fullName === null) return; 

    const username = window.prompt("Ingrese el nombre de usuario:");
    if (username === null) return;

    const email = window.prompt("Ingrese el correo electrónico:");
    if (email === null) return;


    const password = window.prompt("Ingrese la contraseña:");
    if (password === null) return;


    if (!fullName || !username || !email || !password) {
      alert("Todos los campos son obligatorios para crear un administrador.");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:8000/admin/new-admin', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          full_name: fullName,
          email: email,
          password: password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      alert(`${data.message} (ID: ${data.id})`);
      
      setIsExportOpen(false); 

    } catch (error) {
      console.error('Hubo un problema creando el administrador:', error);
      alert(`Error: ${error.message}`);
    }
  };


  const handleManualBlock = async () => {
    const ownerIdInput = window.prompt("Ingrese el ID del propietario a bloquear:");
    if (ownerIdInput === null || ownerIdInput.trim() === "") return;

    const ownerId = parseInt(ownerIdInput, 10);
    if (isNaN(ownerId) || ownerId <= 0) {
      alert("Por favor, ingrese un ID de propietario válido.");
      return;
    }

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch(`http://localhost:8000/admin/block-owner/${ownerId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      
      alert(data.message);
      
      setIsExportOpen(false); 

    } catch (error) {
      console.error('Hubo un problema bloqueando al propietario:', error);
      alert(`Error al bloquear: ${error.message}`);
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
                <button className="export-option" onClick={handleGenerateDues}>Generar deuda</button>
                <button className="export-option" onClick={handleCreateAdmin}>Nuevo Administrador</button>
         
                <button className="export-option" onClick={handleManualBlock}>Bloquear manualmente</button>
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