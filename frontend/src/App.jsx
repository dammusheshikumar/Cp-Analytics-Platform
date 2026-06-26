import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Footer from './components/layout/Footer';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeetCodeProfile from './pages/LeetCodeProfile';
import CodeforcesProfile from './pages/CodeforcesProfile';
import MyProfile from './pages/MyProfile';
import NotFound from './pages/NotFound';

import './styles/App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/leetcode"
            element={
              <ProtectedRoute>
                <LeetCodeProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/codeforces"
            element={
              <ProtectedRoute>
                <CodeforcesProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/MyProfile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>

        <Footer />

      </BrowserRouter>
    </AuthProvider>
  );
}