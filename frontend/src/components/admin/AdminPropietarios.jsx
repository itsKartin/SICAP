import React, { useState } from 'react';
import './css/AdminPropietarios.css';
import { 
  FiPlus, FiSearch, FiUser, FiAtSign, FiPhone, FiHash, FiHome, FiFileText, FiActivity, FiX
} from 'react-icons/fi';

const AdminPropietarios = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado para el formulario (sin status ni cuotas, incluyendo piso y torre)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    telefono: '',
    ci: '',
    apartament: '',
    piso: '',
    torre: ''
  });

  const [propietarios, setPropietarios] = useState([
    { id: 1, firstName: 'Milos', lastName: 'Stojanovic', email: 'stojanovic.loshmi@gmail.com', telefono: '0414-1234567', ci: '12345678', apartament: '1A', status: 'Active', cuotasAcumuladas: 0 },
    // ... tus otros datos simulados
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Recuperamos el token almacenado al hacer login
    const token = localStorage.getItem('access_token');
    
    const payload = {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      phone: formData.telefono,
      ci: formData.ci,
      apartment: formData.apartament,
      floor: formData.piso,
      tower: formData.torre,
      passw: formData.ci
    };

    try {
      const response = await fetch('http://192.168.1.109:8000/admin/newowner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 2. AÑADIMOS EL TOKEN AQUÍ
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        const newUser = {
          ...formData,
          id: data.id, 
          status: 'Active', 
          cuotasAcumuladas: 0 
        };
        
        setPropietarios([...propietarios, newUser]);
        setIsModalOpen(false);
        
        setFormData({ 
          firstName: '', lastName: '', email: '', telefono: '', 
          ci: '', apartament: '', piso: '', torre: '' 
        });
        
        alert("Propietario creado con éxito");
      } else {
        const errorData = await response.json();
        alert(`Error al crear propietario: ${errorData.detail || 'Revisa los datos enviados'}`);
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      alert("Error de red: No se pudo conectar con el servidor.");
    }
  };

  return (
    <div className="admin-container">
      {/* Barra de Herramientas */}
      <div className="admin-toolbar">
        <div className="search-wrapper">
          <FiSearch className="search-icon" />
          <input 
            type="text" 
            placeholder="Search for users..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        

        <div className="toolbar-right">
          <select className="filter-select">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {/* Botón que abre el modal */}
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Agregar
          </button>
        </div>
      </div>

      {/* Tabla (sin cambios) */}
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th><div className="th-content"><FiUser /> Name</div></th>
              <th><div className="th-content"><FiAtSign /> Email</div></th>
              <th><div className="th-content"><FiPhone /> Teléfono</div></th>
              <th><div className="th-content"><FiHash /> C.I.</div></th>
              <th><div className="th-content"><FiHome /> Apartament</div></th>
              <th><div className="th-content"><FiFileText /> Cuotas</div></th>
              <th><div className="th-content"><FiActivity /> Status</div></th>
            </tr>
          </thead>
          <tbody>
            {propietarios.map((user) => (
              <tr key={user.id}>
                <td className="col-name">{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.ci}</td>
                <td>{user.torre}{user.piso}{user.apartament}</td>
                <td>{user.cuotasAcumuladas === 0 ? 'No debts' : user.cuotasAcumuladas}</td>
                <td>{user.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Agregar Propietario */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Agregar Nuevo Propietario</h2>
              <FiX className="close-icon" onClick={() => setIsModalOpen(false)} />
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Nombre</label>
                  <input type="text" name="firstName" className="form-input" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Apellido</label>
                  <input type="text" name="lastName" className="form-input" value={formData.lastName} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input type="email" name="email" className="form-input" value={formData.email} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Teléfono</label>
                  <input type="text" name="telefono" className="form-input" value={formData.telefono} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Cédula (C.I.)</label>
                  <input type="text" name="ci" className="form-input" value={formData.ci} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Torre</label>
                  <input type="text" name="torre" className="form-input" value={formData.torre} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Piso</label>
                  <input type="text" name="piso" className="form-input" value={formData.piso} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Apartamento</label>
                  <input type="text" name="apartament" className="form-input" value={formData.apartament} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="btn-submit">Guardar Propietario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropietarios;   