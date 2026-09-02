import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewDeleted, setViewDeleted] = useState(false); // Estado para alternar vistas
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Consume GET /users o GET /users/deleted según el toggle
      const endpoint = viewDeleted
        ? 'http://localhost:3000/users/deleted'
        : 'http://localhost:3000/users';
      
      const response = await axios.get(endpoint);
      setUsers(response.data);
    } catch (err) {
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [viewDeleted]);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas desactivar este usuario?')) {
      try {
        await axios.delete(`http://localhost:3000/users/${id}`);
        fetchUsers();
      } catch (err) {
        alert('No se pudo eliminar el usuario');
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/users/${id}/restore`);
      fetchUsers(); // Refresca la lista tras restaurar
    } catch (err) {
      alert('No se pudo restaurar el usuario');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header con título y acciones globales */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <div className="space-x-3">
          <Link
            to="/users/new"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
          >
            + Crear Usuario
          </Link>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Controles para alternar entre Activos y Eliminados */}
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setViewDeleted(false)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            !viewDeleted
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border hover:bg-gray-50'
          }`}
        >
          Activos
        </button>
        <button
          onClick={() => setViewDeleted(true)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition ${
            viewDeleted
              ? 'bg-red-600 text-white'
              : 'bg-white text-gray-700 border hover:bg-gray-50'
          }`}
        >
          Papelera / Eliminados
        </button>
      </div>

      {/* Alerta de error */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {/* Contenido de la Tabla */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {viewDeleted
              ? 'No hay usuarios en la papelera.'
              : 'No hay usuarios activos registrados.'}
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200 text-gray-700 text-sm font-semibold uppercase">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Apellido</th>
                <th className="py-3 px-4">Cédula</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                  <td className="py-3 px-4 text-gray-800 font-medium">{user.nombre}</td>
                  <td className="py-3 px-4 text-gray-800">{user.apellido}</td>
                  <td className="py-3 px-4 text-gray-600">{user.cedula}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    {viewDeleted ? (
                      <button
                        onClick={() => handleRestore(user.id)}
                        className="text-green-600 hover:text-green-800 font-semibold text-sm"
                      >
                        Restaurar
                      </button>
                    ) : (
                      <>
                        <Link
                          to={`/users/${user.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                          Ver Detalle
                        </Link>
                        <span className="text-gray-300">|</span>
                        <Link
                          to={`/users/${user.id}/edit`}
                          className="text-amber-600 hover:text-amber-800 font-medium text-sm"
                        >
                          Editar
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}