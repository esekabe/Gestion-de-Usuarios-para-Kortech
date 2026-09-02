import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { UserList } from './pages/UserList';
import { UserDetail } from './pages/UserDetail';
import { UserForm } from './pages/UserForm';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 text-gray-800">
        <Routes>
          
          <Route path="/" element={<Navigate to="/login" replace/>} />
          <Route path="/login" element={ <Login /> } />
          <Route path="/users" element={ <UserList /> } />
          <Route path="/users/new" element={ <UserForm /> } />
          <Route path="/users/:id" element={ <UserDetail/> } />
          <Route path="/users/:id/edit" element={ <UserForm />} />

        </Routes>
      </div>
    </BrowserRouter>
  )
}