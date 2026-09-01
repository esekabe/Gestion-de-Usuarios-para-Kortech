import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export function UserDetail() {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() =>{
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${id}`);
                setUser(response.data);
            } catch (err) {
                setError('No se pudo cargar la información del usuario');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();

    }, [id]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Cargando detalles...</div>;
    }

    if (error || !user) {
        return (
            <div className="max-w-md mx-auto mt-10 p-4 bg-red-100 border border-red-400 text-red-700 rounded text-center">
                {error || 'Usuario no encontrado'}
                <div className="mt-4">
                    <Link to="/users" className="text-blue-600 hover:underline">Volver a la lista</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 bg-white rounded rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-3">
                Detalles del Usuario
            </h2>

            <div className="space-y-4">
                <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">ID (UUID)</span>
                    <span className="text-sm font-mono text-gray-800 block">{user.id}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Nombre</span>
                        <span className="text-base text-gray-800 font-medium">{user.nombre}</span>
                    </div>

                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Apellido</span>
                        <span className="text-base text-gray-800 font-medium">{user.apellido}</span>
                    </div>
                </div>

                <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Cédula</span>
                    <span className="text-base text-gray-800">{user.cedula}</span>
                </div>

                {user.createdAt && (
                    <div>
                        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Fecha de Registro</span>
                        <span className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()} - {new Date (user.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                )}

            </div>

            <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-100">
                <Link
                    to="/users"
                    className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                >
                    ← Volver a la lista
                </Link>

                <Link
                    to={`/users/${user.id}/edit`}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md text-sm transition duration-200"
                >
                    Editar Usuario
                </Link>
            </div>
        </div>
    );
}