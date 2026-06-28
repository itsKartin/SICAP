import React, { useState } from 'react';
import './css/ManualAccess.css';
import { 
  FiPlus, FiSearch, FiUser, FiCalendar, FiFileText, FiHash, FiShield, FiX
} from 'react-icons/fi';

const ManualAccess = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para el formulario (Solo Descripción según tus requerimientos)
  const [formData, setFormData] = useState({
    descripcion: '',
    usuario: ''  // <-- Nuevo campo agregado
  });

  // Datos simulados con los campos requeridos
  const [accessLogs, setAccessLogs] = useState([
    { id: 1, usuario: 'Milos Stojanovic', fecha: '2026-06-27 07:30', descripcion: 'Apertura manual de portón principal', id_admin: 101 },
    { id: 2, usuario: 'Visita (Reparación)', fecha: '2026-06-26 14:15', descripcion: 'Acceso peatonal autorizado por apto 1A', id_admin: 102 }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      description: formData.descripcion,
      // Nota: 'usuario' e 'id_admin' probablemente se tomen del contexto 
      // del usuario autenticado en tu backend o aplicación.
    };

    try {
      // Reemplaza esta URL con el endpoint correcto de tu API FastAPI
      const response = await fetch('http://localhost:8000/admin/manual-access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Actualizamos la tabla con los datos que retorne la BD. 
        // Para el ejemplo, simulamos la respuesta rellenando los campos faltantes.
        const newLog = {
          id: data.id || accessLogs.length + 1,
          usuario: data.usuario || 'Admin Actual', // Simulado
          fecha: data.fecha || new Date().toISOString().slice(0, 16).replace('T', ' '), // Simulado
          descripcion: formData.descripcion,
          id_admin: data.id_admin || 999 // Simulado
        };
        
        setAccessLogs([...accessLogs, newLog]);
        setIsModalOpen(false); 
        
        setFormData({ descripcion: '' });
        alert("Acceso manual registrado con éxito");
      } else {
        const errorData = await response.json();
        alert(`Error al registrar: ${errorData.detail || 'Revisa los datos enviados'}`);
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("Error de red: No se pudo conectar con el servidor.");
    }
  };

  // Filtrado simple de búsqueda
  const filteredLogs = accessLogs.filter(log => 
    log.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) || 
    log.usuario.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container">
      {/* Barra de Herramientas */}
      <div className="admin-toolbar">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Buscar registros..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="toolbar-right">
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Registrar Acceso
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th><div className="th-content"><FiHash /> ID</div></th>
              <th><div className="th-content"><FiUser /> Usuario</div></th>
              <th><div className="th-content"><FiCalendar /> Fecha</div></th>
              <th><div className="th-content"><FiFileText /> Descripción</div></th>
              <th><div className="th-content"><FiShield /> ID Admin</div></th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td className="col-name">{log.usuario}</td>
                <td>{log.fecha}</td>
                <td>{log.descripcion}</td>
                <td>{log.id_admin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Acceso Manual */}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Acceso Manual</h2>
              <FiX className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleSubmit}>

              {/* Se eliminó el form-grid para usar un diseño de 1 sola columna apropiado para 1 campo */}

              <div className="form-single-col">

                <div className="input-group">
      <label>Usuario</label>
      <select 
        name="usuario" 
        className="form-input" 
        value={formData.usuario} 
        onChange={handleInputChange} 
        required
      >
        <option value="" disabled>Seleccione un usuario...</option>
        {/* Aquí idealmente mapearías tu lista de usuarios. Ejemplo estático: */}
        <option value="Milos Stojanovic">Milos Stojanovic</option>
        <option value="Visita">Visita (Reparación / Delivery)</option>
        <option value="Personal Mantenimiento">Personal de Mantenimiento</option>
      </select>
    </div>
                <div className="input-group">
                  <label>Descripción del Acceso</label>
                  <textarea 
                    name="descripcion" 
                    className="form-input form-textarea" 
                    value={formData.descripcion} 
                    onChange={handleInputChange} 
                    placeholder="Detalle el motivo del acceso manual..."
                    required 
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar Registro</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManualAccess;