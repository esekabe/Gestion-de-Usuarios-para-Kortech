import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:3000/users');
            setUsers(response.data);
        } catch (err) {
            setError('Error al cargar la lista de Usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if(window.confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
            try{
                await axios.delete(`http://localhost:3000/users/${id}`);
                // Volvemos a pedir la lista para refrescar la vista tras el soft-delete
                fetchUsers();
            } catch (err) {
                alert('Error al desactivar el usuario');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="max-w-6xl mx-auto p-6">

            {/* Header con título y acciones globales */}

            <div>
                <h1 className="text-3xl font-bold text-gray-800"> Gestión de Usuarios </h1>
                <div className="py-3 space-x-3">
                    <Link
                    to="/users/new"
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                    >
                        + Crear Usuario
                    </Link>

                    <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 inline-block"
                    >
                        Cerrar Sesión
                    </button>
                </div>

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
                        No hay usuarios registrados o activos.
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
                                        <Link 
                                        to={`/users/${user.id}`}
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