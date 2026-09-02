import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export function Login() {
    const [cedula, setCedula] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:3000/auth/login', {
                cedula,
                contrasena
            });

            localStorage.setItem('user', JSON.stringify(response.data.user));
            navigate('/users');

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message || 'Error al iniciar sesión');
            } else {
                setError('No se pudo iniciar sesión');
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Iniciar Sesión
                </h2>

                { error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className= "block text-sm font-medium text-gray-700 mb-1">
                            Cédula
                        </label>
                        <input

                            type="text"
                            required
                            placeholder="Cédula (Ejm. 12345678)"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"

                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            required
                            placeholder="Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                    </button>
                </form>
                
                <div className="mt-6 border-t border-gray-200 pt-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">¿No tienes un usuario registrado?</p>
                    <Link
                        to="/users/new"
                        className="inline-block w-full text-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 text-sm"
                    >
                        Registrar nuevo usuario
                    </Link>
                </div>

            </div>

        </div>
    )
}