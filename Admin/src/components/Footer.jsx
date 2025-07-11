import React from 'react';

const Footer = () => (
  <footer>
    <div className="footer-content">
      <div className="footer-section">
        <h3>Về chúng tôi</h3>
        <p>Hệ thống chăm sóc và điều trị HIV chuyên nghiệp, tận tâm</p>
      </div>
      <div className="footer-section">
        <h3>Liên hệ</h3>
        <p>Email: contact@hivcare.com</p>
        <p>Điện thoại: (84) 123-456-789</p>
      </div>
      <div className="footer-section">
        <h3>Theo dõi</h3>
        <div className="social-links">
          <a href="#"><i className="fab fa-facebook"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <p>&copy; 2024 HIV Care Center. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer; 