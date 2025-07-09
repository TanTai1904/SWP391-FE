import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';

const Header = () => {
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isDoctor = !!user.doctorId;
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
    window.location.reload(); // Đảm bảo UI đồng bộ, không cache tên cũ
  };

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="/images/logo.png" alt="RRL Logo" />
            <span>RRL</span>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/services">Dịch vụ</Link>
          <Link to="/doctors">Bác sĩ</Link>
          <Link to="/appointment">Đặt lịch</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/contact">Liên hệ</Link>
          {isDoctor && (
            <div className="arv-dropdown" style={{display:'inline-block',marginLeft:16}}>
              <span style={{cursor:'pointer'}}>ARV ▼</span>
              <div className="arv-dropdown-content" style={{position:'absolute',background:'#fff',boxShadow:'0 2px 8px #ccc',padding:8,display:'none'}}>
                <Link to="/arv/components">Thành phần ARV</Link><br/>
                <Link to="/arv/regimens">Phác đồ ARV</Link>
              </div>
            </div>
          )}
        </div>
        <div className="auth-buttons">
          {isDoctor ? (
            <>
              <span className="doctor-name">👨‍⚕️ {user.fullName || user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/login" className="login-btn">Đăng nhập</Link>
              <Link to="/register" className="register-btn">Đăng ký</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;