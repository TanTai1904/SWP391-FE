import React from "react";
import { Link } from "react-router-dom";
import "../styles/app.scss";

const Header = () => {
  return (
    <header className="app-header">
      <div className="flex items-center space-x-2">
        <Link to="/" className="app-logo">
          <span className="app-logo-rrl-text">RRL</span>
          <span className="app-logo-name">Logo RRL</span>
        </Link>
      </div>
      <nav className="app-nav">
        <Link to="/" className="app-nav-link">
          Trang chủ
        </Link>
        <Link to="/services" className="app-nav-link">
          Dịch vụ
        </Link>
        <Link to="/doctors" className="app-nav-link">
          Bác sĩ
        </Link>
        <Link to="/appointment" className="app-nav-link">
          Đặt lịch
        </Link>
        <Link to="/blog" className="app-nav-link">
          Blog
        </Link>
        <Link to="/contact" className="app-nav-link">
          Liên hệ
        </Link>
      </nav>
      <div className="app-auth-buttons">
        <Link to="/login" className="app-button-secondary">
          Đăng nhập
        </Link>
        <Link to="/register" className="app-button-primary">
          Đăng ký
        </Link>
      </div>
    </header>
  );
};

export default Header;
