import React, { useState, useEffect } from 'react';
import './css/ManualAccess.css';
import { 
  FiPlus, FiSearch, FiUser, FiCalendar, FiFileText, FiHash, FiClock, FiX
} from 'react-icons/fi';

const ManualAccess = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accessLogs, setAccessLogs] = useState([]);
  

  const [formData, setFormData] = useState({
    descripcion: ''
  });


  const fetchIncidents = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      const response = await fetch('http://localhost:8000/admin/incidents/list', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAccessLogs(data);
      } else {
        console.error("Error al obtener los registros");
      }
    } catch (error) {
      console.error("Error de red al obtener la lista de incidentes:", error);
    }
  };


  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); 
    
    const payload = {
      description: formData.descripcion,
      opened_at: new Date().toISOString()
    };

    try {
      const response = await fetch('http://localhost:8000/admin/incidents/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Acceso manual registrado con éxito");
        setIsModalOpen(false); 
        setFormData({ descripcion: '' });
        

        fetchIncidents(); 
      } else {
        const errorData = await response.json();
        alert(`Error al registrar: ${errorData.detail || 'Revisa los datos enviados'}`);
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("Error de red: No se pudo conectar con el servidor.");
    }
  };


  const filteredLogs = accessLogs.filter(log => 
    (log.description && log.description.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (log.registered_by && log.registered_by.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const formatOnlyDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatOnlyTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString(); 
  };

  return (
    <div className="admin-container">
 
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

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th><div className="th-content"><FiHash /> ID</div></th>
              <th><div className="th-content"><FiUser /> Registrado Por</div></th>
              <th><div className="th-content"><FiCalendar /> Fecha</div></th>
              <th><div className="th-content"><FiFileText /> Descripción</div></th>
              <th><div className="th-content"><FiClock /> Hora</div></th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td className="col-name">{log.registered_by}</td>
                  <td>{formatOnlyDate(log.created_at)}</td>
                  <td>{log.description}</td>
                  <td>{formatOnlyTime(log.created_at)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Registrar Acceso Manual</h2>
              <FiX className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-single-col">
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