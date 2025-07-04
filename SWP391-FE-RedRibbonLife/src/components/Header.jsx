import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import '../styles/Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  // Debug user state
  useEffect(() => {
    console.log('Header - User state:', user);
    console.log('Header - Loading state:', loading);
  }, [user, loading]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown-container')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };
  const closeDropdown = () => {
    setIsUserDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      closeDropdown();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  // Medical Cross Icon for Logo
  const MedicalLogoIcon = () => (
    <svg className="medical-logo-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6H13V11H18V13H13V18H11V13H6V11H11V6Z"/>
    </svg>
  );

  // User Avatar Icon
  const UserIcon = () => (
    <svg className="user-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
    </svg>
  );

  // Dropdown Arrow Icon
  const ChevronDownIcon = () => (
    <svg className="chevron-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7,10L12,15L17,10H7Z"/>
    </svg>
  );

  // Profile Icon
  const ProfileIcon = () => (
    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,8.39C10.72,8.39 9.68,9.43 9.68,10.71C9.68,11.99 10.72,13.03 12,13.03C13.28,13.03 14.32,11.99 14.32,10.71C14.32,9.43 13.28,8.39 12,8.39M12,15.29C10.45,15.29 8.24,16.08 8.24,17.65V18.81H15.76V17.65C15.76,16.08 13.55,15.29 12,15.29Z"/>
    </svg>
  );

  // Settings Icon
  const SettingsIcon = () => (
    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
    </svg>
  );

  // Logout Icon
  const LogoutIcon = () => (
    <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16,17V14H9V10H16V7L21,12L16,17M14,2A2,2 0 0,1 16,4V6H14V4H5V20H14V18H16V20A2,2 0 0,1 14,22H5A2,2 0 0,1 3,20V4A2,2 0 0,1 5,2H14Z"/>
    </svg>
  );
  return (
    <header className={`modern-header ${isScrolled ? 'scrolled' : ''}`}>
      <nav className="modern-navbar">
        <Link to="/" className="modern-logo">
          <div className="modern-logo-container">
            <div className="modern-logo-icon">
              <MedicalLogoIcon />
            </div>
            <div className="modern-logo-text">
              <h1 className="modern-logo-title">HIV Treatment</h1>
              <span className="modern-logo-subtitle">Medical System</span>
            </div>
          </div>
        </Link>

        <div className="modern-nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Trang chủ
          </Link>
          <Link 
            to="/services" 
            className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`}
          >
            Dịch vụ
          </Link>
          <Link 
            to="/doctors" 
            className={`nav-link ${location.pathname === '/doctors' ? 'active' : ''}`}
          >
            Bác sĩ
          </Link>
          <Link 
            to="/appointment" 
            className={`nav-link ${location.pathname === '/appointment' ? 'active' : ''}`}
          >
            Đặt lịch
          </Link>          <Link 
            to="/blog" 
            className={`nav-link ${location.pathname === '/blog' ? 'active' : ''}`}
          >
            Blog
          </Link>        </div>        <div>
          {loading ? (
            <div className="auth-loading">Loading...</div>
          ) : user ? (            <div className={`user-dropdown-container ${isUserDropdownOpen ? 'open' : ''}`}>
              <button 
                className="user-button"
                onClick={toggleUserDropdown}
              >
                <div className="user-avatar">
                  <span>{user.username?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="username">{user.username}</span>
                <svg className="dropdown-arrow" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 10l5 5 5-5z"/>
                </svg>
              </button>

              {isUserDropdownOpen && (
                <div className="user-dropdown-menu">
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-role">{user.userRole || 'Patient'}</div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to="/profile" className="dropdown-item" onClick={closeDropdown}>
                    Hồ sơ cá nhân
                  </Link>
                  
                  <Link to="/my-appointments" className="dropdown-item" onClick={closeDropdown}>
                    Lịch hẹn của tôi
                  </Link>
                  
                  <Link to="/settings" className="dropdown-item" onClick={closeDropdown}>
                    Cài đặt
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button 
                    className="dropdown-item logout-btn"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="login-btn">Đăng nhập</Link>
              <Link to="/register" className="register-btn">Đăng ký</Link>
            </div>
          )}
        </div>

        <div 
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </nav>      {isMobileMenuOpen && (
        <div className="mobile-menu active">
          <div className="mobile-nav-links">
            <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Trang chủ
            </Link>
            <Link to="/services" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Dịch vụ
            </Link>
            <Link to="/doctors" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Bác sĩ
            </Link>
            <Link to="/appointment" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Đặt lịch
            </Link>
            <Link to="/blog" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              Blog
            </Link>
          </div>
          
          {user ? (
            <div className="mobile-user-section">
              <div className="mobile-user-info">
                <UserIcon />
                <div className="mobile-user-details">
                  <span className="mobile-username">{user.username}</span>
                  <span className="mobile-user-role">{user.userRole || 'User'}</span>
                </div>
              </div>
              
              <div className="mobile-user-links">
                <Link to="/profile" className="mobile-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <ProfileIcon />
                  <span>Hồ sơ cá nhân</span>
                </Link>
                <Link to="/my-appointments" className="mobile-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <svg className="dropdown-icon" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z"/>
                  </svg>
                  <span>Lịch hẹn của tôi</span>
                </Link>
                <Link to="/settings" className="mobile-user-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <SettingsIcon />
                  <span>Cài đặt</span>
                </Link>
                <button className="mobile-logout-btn" onClick={handleLogout}>
                  <LogoutIcon />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link to="/login" className="login-btn" onClick={() => setIsMobileMenuOpen(false)}>
                Đăng nhập
              </Link>
              <Link to="/register" className="register-btn" onClick={() => setIsMobileMenuOpen(false)}>
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;