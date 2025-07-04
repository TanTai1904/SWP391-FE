import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentForm from '../components/AppointmentForm';
import '../styles/AppointmentPage.css';

const AppointmentPage = () => {
  return (
    <div className="appointment-page">
      <Header />
      <main className="appointment-main">
        {/* Hero Section */}
        <section className="appointment-hero">
          <div className="appointment-container">
            <div className="appointment-hero-content">
              <h1>Đặt Lịch Khám & Điều Trị HIV</h1>
              <p>Hệ thống đặt lịch trực tuyến an toàn, bảo mật và tiện lợi với đội ngũ bác sĩ chuyên môn cao</p>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="appointment-container">
          <div className="appointment-content">
            {/* Info Section */}
            <div className="appointment-info">
              <h2>
                <i className="fas fa-shield-alt"></i>
                Thông tin quan trọng
              </h2>
              
              <div className="info-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div className="highlight-text">
                    <div className="highlight-title">Bảo mật tuyệt đối</div>
                    <div className="highlight-desc">Thông tin cá nhân được bảo vệ 100%</div>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-user-md"></i>
                  </div>
                  <div className="highlight-text">
                    <div className="highlight-title">Bác sĩ chuyên môn</div>
                    <div className="highlight-desc">Đội ngũ y bác sĩ giàu kinh nghiệm</div>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="highlight-text">
                    <div className="highlight-title">Hỗ trợ 24/7</div>
                    <div className="highlight-desc">Tư vấn miễn phí mọi lúc</div>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-eye-slash"></i>
                  </div>
                  <div className="highlight-text">
                    <div className="highlight-title">Đặt lịch ẩn danh</div>
                    <div className="highlight-desc">Hỗ trợ đặt lịch không cần tên</div>
                  </div>
                </div>
                
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div className="highlight-text">
                    <div className="highlight-title">Theo dõi liên tục</div>
                    <div className="highlight-desc">Chăm sóc và hỗ trợ dài hạn</div>
                  </div>
                </div>
              </div>

              <div className="contact-info">
                <h3>
                  <i className="fas fa-phone"></i>
                  Liên hệ nhanh
                </h3>
                <div className="contact-item">
                  <i className="fas fa-phone-alt"></i>
                  <span>Hotline: 1900-1234</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>Email: contact@hivcare.vn</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM</span>
                </div>
              </div>

              <div className="emergency-contact">
                <h3>
                  <i className="fas fa-exclamation-triangle"></i>
                  Cấp cứu
                </h3>
                <p>Trường hợp khẩn cấp, vui lòng gọi ngay:</p>
                <div className="emergency-phone">115 - 113</div>
              </div>
            </div>

            {/* Appointment Form */}
            <AppointmentForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentPage; 