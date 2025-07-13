import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentForm from '../components/AppointmentForm';
import '../styles/AppointmentPage.css';

const highlights = [
  {
    icon: 'fas fa-user-shield',
    title: 'Bảo mật tuyệt đối',
    desc: 'Thông tin cá nhân được bảo vệ 100%',
  },
  {
    icon: 'fas fa-user-md',
    title: 'Bác sĩ chuyên môn',
    desc: 'Đội ngũ y bác sĩ giàu kinh nghiệm',
  },
  {
    icon: 'fas fa-clock',
    title: 'Hỗ trợ 24/7',
    desc: 'Tư vấn miễn phí mọi lúc',
  },
  {
    icon: 'fas fa-eye-slash',
    title: 'Đặt lịch ẩn danh',
    desc: 'Hỗ trợ đặt lịch không cần tên',
  },
  {
    icon: 'fas fa-heartbeat',
    title: 'Theo dõi liên tục',
    desc: 'Chăm sóc và hỗ trợ dài hạn',
  },
];

const contacts = [
  {
    icon: 'fas fa-phone-alt',
    label: 'Hotline: 1900-1234',
  },
  {
    icon: 'fas fa-envelope',
    label: 'Email: contact@hivcare.vn',
  },
  {
    icon: 'fas fa-map-marker-alt',
    label: 'Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM',
  },
];

const AppointmentPage = () => (
  <div className="appointment-page">
    <Header />
    <main className="appointment-main">
      {/* Hero Section */}
      <section className="appointment-hero">
        <div className="appointment-container">
          <div className="appointment-hero-content">
            <h1>Đặt Lịch Khám & Điều Trị HIV</h1>
            <p>
              Hệ thống đặt lịch trực tuyến an toàn, bảo mật và tiện lợi với đội ngũ bác sĩ chuyên môn cao
            </p>
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
              {highlights.map((item, idx) => (
                <div className="highlight-item" key={idx}>
                  <div className="highlight-icon">
                    <i className={item.icon}></i>
                  </div>
                  <div className="highlight-text">
                    <div className="highlight-title">{item.title}</div>
                    <div className="highlight-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="contact-info">
              <h3>
                <i className="fas fa-phone"></i>
                Liên hệ nhanh
              </h3>
              {contacts.map((c, idx) => (
                <div className="contact-item" key={idx}>
                  <i className={c.icon}></i>
                  <span>{c.label}</span>
                </div>
              ))}
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

export default AppointmentPage;