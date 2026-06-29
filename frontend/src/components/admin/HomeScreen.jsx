import React, { useState, useEffect } from 'react';
import { Users, Coins, Lock, History, X, Plus, ChevronRight, FileText } from 'lucide-react';
import './css/HomeScreen.css';

const HomeScreen = () => {
  // Estado para mantener la fecha y hora actuales actualizadas
  const [currentDate, setCurrentDate] = useState(new Date());

  // --- Estado actualizado para incluir "active" (Solventes) ---
  const [stats, setStats] = useState({
    total: "...",
    active: "...",
    blocked: "..."
  });

  // Efecto para actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    // Limpieza del intervalo al desmontar el componente
    return () => clearInterval(timer);
  }, []);

  // Efecto para hacer el "fetch" a tu API en Python
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/owners/stats'); 
        const data = await response.json();
        
        // Guardamos total, active (solventes) y blocked (bloqueados)
        setStats({
          total: data.total,
          active: data.active,
          blocked: data.blocked
        }); 
      } catch (error) {
        console.error("Error conectando con la base de datos:", error);
        setStats({ total: "-", active: "-", blocked: "-" });
      }
    };

    fetchStats();
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
          {/* 1. Total de Usuarios */}
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
            <p className="stat-value">{stats.total}</p><p className="stat-label">Usuarios</p>
          </div>
          
          {/* 2. Solventes (Muestra los usuarios activos reales de la Base de Datos) */}
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Coins size={24} /></div>
            <p className="stat-value">{stats.active}</p><p className="stat-label">Solventes</p>
          </div>
          
          {/* 3. Bloqueados */}
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Lock size={24} color="#ff3b30" /></div>
            <p className="stat-value">{stats.blocked}</p><p className="stat-label">Bloqueados</p>
          </div>
          
          {/* 4. Pendientes (Se mantiene estático temporalmente) */}
          <div className="stat-item">
            <div className="stat-icon-wrapper"><History size={24} /></div>
            <p className="stat-value">30%</p><p className="stat-label">Pendientes</p>
          </div>
        </div>

        {/* Contenedor Central: Imagen del Portón */}
        <div className="gate-container">
          <img src="/user/port.png" alt="Render de Portón" className="gate-image" />
        </div>

      </div>

    </div>
  );
};

export default HomeScreen;