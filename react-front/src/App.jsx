import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          {/* Al entrar a la raíz, redirige automáticamente a /login */}
          <Route path="/" element={<Navigate to="/login" replace/>} />

          {/* Ruta del login */}
          <Route path="/login" element={<Login />} />

          {/* Temporalmente colocamos un placeholder para /users para que no dé error al redirigir*/}
          <Route path="/users" element={<div className="p-8 text-center text-xl font-bold">¡Login Exitoso! (Aquí irá la tabla)</div>} />
          
        </Routes>
      </div>
    </BrowserRouter>
  )
}