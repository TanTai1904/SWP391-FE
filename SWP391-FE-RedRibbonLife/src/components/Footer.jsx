import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  // Icons
  const MedicalFooterIcon = () => (
    <svg className="footer-medical-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,6H13V11H18V13H13V18H11V13H6V11H11V6Z"/>
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
    </svg>
  );

  const EmailIcon = () => (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z"/>
    </svg>
  );

  const LocationIcon = () => (
    <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
    </svg>
  );

  const InstagramIcon = () => (
    <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  const ShieldIcon = () => (
    <svg className="security-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.8C8,12.2 8.6,11.7 9.2,11.7V10.2C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
    </svg>
  );

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main Info Section */}
        <div className="footer-main">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <MedicalFooterIcon />
            </div>
            <div className="footer-logo-text">
              <h2 className="footer-logo-title">HIV Treatment</h2>
              <span className="footer-logo-subtitle">Medical System</span>
            </div>
          </div>
          
          <p className="footer-description">
            Hệ thống chăm sóc và điều trị HIV toàn diện, cung cấp dịch vụ y tế chuyên nghiệp 
            với công nghệ hiện đại và đội ngũ bác sĩ giàu kinh nghiệm.
          </p>

          <div className="footer-stats">
            <div className="stat-item">
              <span className="stat-number">15+</span>
              <span className="stat-label">Năm kinh nghiệm</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">5000+</span>
              <span className="stat-label">Bệnh nhân</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Bác sĩ</span>
            </div>
          </div>

          <div className="security-badge">
            <ShieldIcon />
            <span className="security-text">Chứng nhận bảo mật y tế</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Liên kết nhanh</h3>
          <Link to="/services" className="footer-link">
            Dịch vụ y tế
          </Link>
          <Link to="/doctors" className="footer-link">
            Đội ngũ bác sĩ
          </Link>
          <Link to="/appointment" className="footer-link">
            Đặt lịch khám
          </Link>
          <Link to="/blog" className="footer-link">
            Tin tức sức khỏe
          </Link>
          <Link to="/emergency" className="footer-link">
            Cấp cứu 24/7
          </Link>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Thông tin liên hệ</h3>
          <div className="contact-item">
            <PhoneIcon />
            <div className="contact-text">
              <strong>Hotline:</strong><br />
              1900 123 456
            </div>
          </div>
          <div className="contact-item">
            <EmailIcon />
            <div className="contact-text">
              <strong>Email:</strong><br />
              info@hivtreatment.vn
            </div>
          </div>
          <div className="contact-item">
            <LocationIcon />
            <div className="contact-text">
              <strong>Địa chỉ:</strong><br />
              123 Nguyễn Văn Cừ, Q.5, TP.HCM
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="footer-section">
          <h3>Đăng ký nhận tin</h3>
          <p className="footer-description" style={{fontSize: '0.85rem', marginBottom: '1rem'}}>
            Nhận thông tin mới nhất về điều trị và chăm sóc sức khỏe
          </p>
          <form className="newsletter-form">
            <input 
              type="email" 
              className="newsletter-input" 
              placeholder="Nhập email của bạn"
              required
            />
            <button type="submit" className="newsletter-button">
              Đăng ký
            </button>
          </form>
          
          <div className="social-links">
            <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>
            <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
              <TwitterIcon />
            </a>
            <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-copyright">
          © 2025 HIV Treatment Medical System. Tất cả quyền được bảo lưu.
        </div>
        <div className="footer-legal">
          <Link to="/privacy" className="footer-legal-link">Chính sách bảo mật</Link>
          <Link to="/terms" className="footer-legal-link">Điều khoản sử dụng</Link>
          <Link to="/sitemap" className="footer-legal-link">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 