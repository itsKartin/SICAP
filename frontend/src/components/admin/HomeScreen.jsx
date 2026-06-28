import React, { useState, useEffect } from 'react';
import { Users, Coins, Lock, History, X, Plus, ChevronRight, FileText } from 'lucide-react';
import './css/HomeScreen.css';

const HomeScreen = () => {
  // Estado para mantener la fecha y hora actuales actualizadas
  const [currentDate, setCurrentDate] = useState(new Date());

  // Efecto para actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(timer);
  }, []);

  // Formateo de la hora (ej. 11:21 PM)
  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Formateo de la fecha exacto al diseño (ej. Friday, 06 Jan 2023)
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[currentDate.getDay()];
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  const formattedDate = `${dayName}, ${day} ${month} ${year}`;

  // Arreglo temporal para renderizar los 4 items de accesos manuales
  const manualAccesses = [1, 2, 3, 4];
  
  // Estado para controlar la visibilidad del modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="home-container">
      
      {/* Contenedor Principal (Lado Izquierdo) */}
      <div className="main-content">
        
        {/* Cabecera: Hora y Fecha dinámicas */}
        <div className="home-header">
          <h1 className="home-time">{formattedTime}</h1>
          <span className="home-date">{formattedDate}</span>
        </div>

        {/* Fila de Estadísticas Superiores */}
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
            <p className="stat-value">75</p><p className="stat-label">Usuarios</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Coins size={24} /></div>
            <p className="stat-value">67%</p><p className="stat-label">Solventes</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Lock size={24} color="#ff3b30" /></div>
            <p className="stat-value">24</p><p className="stat-label">Bloqueados</p>
          </div>
          <div className="stat-item">
            <div className="stat-icon-wrapper"><History size={24} /></div>
            <p className="stat-value">30%</p><p className="stat-label">Pendientes</p>
          </div>
        </div>

        {/* Contenedor Central: Imagen del Portón */}
        <div className="gate-container">
          <img src="/user/port.png" alt="Render de Portón" className="gate-image" />
        </div>

        {/* Sección Inferior: Textos y Notificación */}
        <div className="home-footer">
          <div className="footer-info">
            <h2>Narayola II</h2>
            <p>GMS 4G Activo</p>
          </div>
        </div>

      </div>

    </div>
  );
};

export default HomeScreen;