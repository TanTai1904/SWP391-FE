import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
        </div>
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Đăng nhập</Link>
          <Link to="/register" className="register-btn">Đăng ký</Link>
        </div>
      </nav>
    </header>
  );
};

export default Header; 