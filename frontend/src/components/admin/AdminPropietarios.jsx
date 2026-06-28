import React, { useState, useEffect } from 'react';
import './css/AdminPropietarios.css';
import { 
  FiPlus, FiSearch, FiUser, FiAtSign, FiPhone, FiHash, FiHome, FiFileText, FiActivity, FiX
} from 'react-icons/fi';

const AdminPropietarios = () => {
  // Estados para los filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // Nuevo estado para el select
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
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

  const [propietarios, setPropietarios] = useState([]);

  useEffect(() => {
    const fetchPropietarios = async () => {
      const token = localStorage.getItem('access_token');
      
      try {
        const response = await fetch('http://192.168.1.109:8000/admin/ownerlist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          const formattedData = data.map(owner => ({
            id: owner.id,
            firstName: owner.first_name,
            lastName: owner.last_name,
            email: owner.email,
            telefono: owner.phone,
            ci: owner.ci,
            apartament: owner.apartment,
            piso: owner.floor,
            torre: owner.tower,
            status: owner.status || 'active', // Aseguramos un valor por defecto
            cuotasAcumuladas: 0 
          }));
          
          setPropietarios(formattedData);
        } else {
          console.error("Error al obtener la lista de propietarios:", response.statusText);
        }
      } catch (error) {
        console.error("Error de red al conectar con el backend:", error);
      }
    };

    fetchPropietarios();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
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
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        
        const newUser = {
          ...formData,
          id: data.id, 
          status: 'active', 
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

  // Lógica combinada de filtrado (Búsqueda + Estatus)
  const filteredPropietarios = propietarios.filter(user => {
    // 1. Verificamos si coincide con el texto de búsqueda
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.ci.includes(searchTerm);

    // 2. Verificamos si coincide con el estatus seleccionado
    const matchesStatus = 
      filterStatus === 'all' || 
      (user.status && user.status.toLowerCase() === filterStatus.toLowerCase());

    // El usuario debe cumplir ambas condiciones para mostrarse en la tabla
    return matchesSearch && matchesStatus;
  });

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
          {/* Select de filtro ahora controlado por React */}
          <select 
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <button className="btn-add" onClick={() => setIsModalOpen(true)}>
            <FiPlus /> Agregar
          </button>
        </div>
      </div>

      {/* Tabla */}
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
            {filteredPropietarios.map((user) => (
              <tr key={user.id}>
                <td className="col-name">{user.firstName} {user.lastName}</td>
                <td>{user.email}</td>
                <td>{user.telefono}</td>
                <td>{user.ci}</td>
                <td>{user.torre}{user.piso}{user.apartament}</td>
                <td>{user.cuotasAcumuladas === 0 ? 'No debts' : user.cuotasAcumuladas}</td>
                {/* Capitalizamos la primera letra del status para que se vea mejor */}
                <td>{user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1).toLowerCase() : 'Desconocido'}</td>
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