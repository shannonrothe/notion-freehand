import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/protected_route';
import { Draw } from './pages/draw';
import { Login } from './pages/login';
import { Register } from './pages/register';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Draw />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
