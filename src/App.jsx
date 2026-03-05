import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Statistics from './pages/Statistics';
import Labs from './pages/Labs';
import Settings from './pages/Settings';
import { GlobalProvider } from "./context/GlobalContext";
import UsersPage from "./pages/UsersPage";
import './App.css';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ClientDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </GlobalProvider>
  );
}

export default App;