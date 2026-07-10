import React, { useState, useEffect } from 'react';
import { Users, Coins, Lock, History, X, Plus, ChevronRight, FileText } from 'lucide-react';
import './css/HomeScreen.css';

const HomeScreen = () => {

  const [currentDate, setCurrentDate] = useState(new Date());


  const [stats, setStats] = useState({
    total: "...",
    active: "...",
    blocked: "..."
  });


  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    

    return () => clearInterval(timer);
  }, []);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/owners/stats'); 
        const data = await response.json();
        
     
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


  const formattedTime = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const dayName = days[currentDate.getDay()];
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  
  const formattedDate = `${dayName}, ${day} ${month} ${year}`;

  return (
    <div className="home-container">
      
   
      <div className="main-content">
        
       
        <div className="home-header">
          <h1 className="home-time">{formattedTime}</h1>
          <span className="home-date">{formattedDate}</span>
        </div>

        {/* estadísticas */}
        <div className="stats-row">
     

          <div className="stat-item">
            <div className="stat-icon-wrapper"><Users size={24} /></div>
            <p className="stat-value">{stats.total}</p><p className="stat-label">Usuarios</p>
          </div>
          
        
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Coins size={24} /></div>
            <p className="stat-value">{stats.active}</p><p className="stat-label">Solventes</p>
          </div>
          
     
          <div className="stat-item">
            <div className="stat-icon-wrapper"><Lock size={24} color="#ff3b30" /></div>
            <p className="stat-value">{stats.blocked}</p><p className="stat-label">Bloqueados</p>
          </div>

        </div>


        <div className="gate-container">
          <img src="/user/port.png" alt="Render de Portón" className="gate-image" />
        </div>

      </div>

    </div>
  );
};

export default HomeScreen;