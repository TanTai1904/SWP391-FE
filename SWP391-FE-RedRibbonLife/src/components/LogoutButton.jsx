import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';

const LogoutButton = ({ className = '' }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, redirect to login
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={loading}
      className={`logout-button ${className}`}
    >
      {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
    </button>
  );
};

export default LogoutButton;
