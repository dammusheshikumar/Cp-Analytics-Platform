// src/components/layout/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">📊 Competitive Programming Analytics Platform</Link>
      </div>

      {isAuthenticated && (
        <div className="navbar-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/leetcode">LeetCode</Link>
          <Link to="/codeforces">Codeforces</Link>
          <Link to="/MyProfile">My Profile</Link>
        </div>
      )}

      <div className="navbar-user">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">Welcome {user?.name}</span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}


