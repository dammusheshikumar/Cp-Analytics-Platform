// src/components/layout/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="navbar">
      {/* 3-Bar Hamburger Menu Button - Shows when user is authenticated */}
      {isAuthenticated && (
        <button 
          className={`hamburger ${menuOpen ? 'active' : ''}`} 
          onClick={toggleMenu} 
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      )}

      <div className="navbar-brand">
        <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
          📊 CP Analytics Platform
        </Link>
      </div>

      {isAuthenticated && (
        /* The links panel slides out from the left when open */
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/leetcode" onClick={() => setMenuOpen(false)}>LeetCode</Link>
          <Link to="/codeforces" onClick={() => setMenuOpen(false)}>Codeforces</Link>
          <Link to="/MyProfile" onClick={() => setMenuOpen(false)}>My Profile</Link>
          
          {/* Mobile/Drawer Logout visible inside the menu stream */}
          <div className="drawer-only-user">
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      )}

      <div className="navbar-user">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">Welcome {user?.name}</span>
            <button onClick={handleLogout} className="logout-button header-logout">
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