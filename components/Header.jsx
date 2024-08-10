import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Header = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (userId > 0) {
      setIsAuthenticated(true);
      setUserData(localStorage.getItem('userName'));
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUserData(null);
    window.location.reload(); // Reload the page to reflect the logout state
  };

  const handleLogoClick = () => {
    navigate('/');
    window.scrollTo(0, 0);
  };

  return (
    <header className="header">
      <button className="header-logo" onClick={handleLogoClick}>
        <FontAwesomeIcon icon={faGraduationCap} className="icon-graduate" />
        Quant Guru
        <div className="header-logo-underline"></div>
      </button>
      <div className="header-controls">
        <div className="user-menu-container">
          {isAuthenticated && userData && (
            <div className="menu-item">Welcome, {userData}</div>
          )}
          <button
            className="user-icon"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          >
            <User />
          </button>
          {isUserMenuOpen && (
            <div className="user-menu">
              {!isAuthenticated ? (
                <button className="menu-item" onClick={() => navigate('/login')}>Login</button>
              ) : (
                <button className="menu-item" onClick={handleLogout}>Logout</button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
