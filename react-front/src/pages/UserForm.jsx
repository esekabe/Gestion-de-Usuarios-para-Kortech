import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

export function UserForm() {
  const { id } = useParams(); // Si existe ID, estamos editando
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    contrasena: '',
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  const [error, setError] = useState('');

  const isEditing = Boolean(id);

  // Si estamos en modo Editar, cargamos los datos del usuario existente
  useEffect(() => {
    if (isEditing) {
      axios.get(`http://localhost:3000/users/${id}`)
        .then((response) => {
          const { nombre, apellido, cedula } = response.data;
          setFormData({ nombre, apellido, cedula, contrasena: '' });
        })
        .catch(() => setError('No se pudieron obtener los datos del usuario'))
        .finally(() => setFetching(false));
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isEditing) {
        // En edición, si la contraseña viene vacía, no la enviamos para no sobrescribirla
        const payload = { ...formData };
        if (!payload.contrasena) delete payload.contrasena;

        await axios.patch(`http://localhost:3000/users/${id}`, payload);
      } else {
        // En creación, enviamos todo el formulario
        await axios.post('http://localhost:3000/users', formData);
      }

      navigate('/users'); // Volvemos a la tabla tras guardar
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Ocurrió un error al guardar');
      } else {
        setError('Error al conectar con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 text-center text-gray-500">Cargando formulario...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            required
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Apellido
          </label>
          <input
            type="text"
            name="apellido"
            required
            value={formData.apellido}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cédula
          </label>
          <input
            type="text"
            name="cedula"
            required
            value={formData.cedula}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contraseña {isEditing && <span className="text-xs text-gray-500 font-normal">(Opcional si no deseas cambiarla)</span>}
          </label>
          <input
            type="password"
            name="contrasena"
            required={!isEditing} // Obligatoria solo al crear
            minLength={6}
            placeholder={isEditing ? '••••••••' : 'Mínimo 6 caracteres'}
            value={formData.contrasena}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <Link
            to="/users"
            className="text-gray-600 hover:text-gray-800 font-medium text-sm"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar Usuario' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
}