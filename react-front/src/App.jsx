import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { UserList } from './pages/UserList';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<UserList />} />

          {/* Placeholders temporales para los pasos 10 y 11 */}
          <Route path="users/new" element={<div className="p-8">Vista Formulario Crear</div>}/>
          <Route path="/users/:id" element={<div className="p-8">Vista Detalle</div>}/>
          <Route path="/users/:id/edit" element={<div className="p-8">Vista Formulario Editar</div>}/>

        </Routes>
      </div>
    </BrowserRouter>
  )
}