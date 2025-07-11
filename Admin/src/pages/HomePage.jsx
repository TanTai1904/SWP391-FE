import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const services = [
  {
    icon: "calendar-check",
    title: "Đặt lịch khám",
    description: "Đặt lịch khám và điều trị HIV với bác sĩ chuyên môn"
  },
  {
    icon: "user-doctor",
    title: "Theo dõi điều trị",
    description: "Tra cứu thông tin xét nghiệm và lịch sử điều trị"
  },
  {
    icon: "bell",
    title: "Nhắc nhở",
    description: "Hệ thống nhắc nhở lịch tái khám và uống thuốc"
  },
  {
    icon: "comments",
    title: "Tư vấn trực tuyến",
    description: "Đặt lịch tư vấn trực tuyến với bác sĩ"
  }
];

const doctors = [];

const HomePage = () => {
  return (
    <>
      <Header />
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Chăm sóc sức khỏe toàn diện</h1>
            <p>Hệ thống chăm sóc và điều trị HIV chuyên nghiệp</p>
            <Link to="/appointment" className="cta-button">Đặt lịch ngay</Link>
          </div>
        </section>

        <section className="services-section">
          <div className="container">
            <h2>Dịch vụ của chúng tôi</h2>
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    <i className={`fas fa-${service.icon}`}></i>
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="doctors-section">
          <div className="container">
            <h2>Đội ngũ bác sĩ</h2>
            <div className="doctors-grid">
              {doctors.length > 0 ? (
                doctors.map((doctor, index) => (
                  <div key={index} className="doctor-card">
                    <img src={doctor.image} alt={doctor.name} />
                    <h3>{doctor.name}</h3>
                    <p className="specialty">{doctor.specialty}</p>
                    <p className="schedule">{doctor.schedule}</p>
                  </div>
                ))
              ) : (
                <p>Chưa có thông tin bác sĩ.</p>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;