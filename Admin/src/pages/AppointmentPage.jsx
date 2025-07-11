import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AppointmentForm from '../components/AppointmentForm';

const AppointmentPage = () => {
  return (
    <>
      <Header />
      <main className="appointment-page">
        <div className="container">
          <div className="appointment-info">
            <h1>Đặt Lịch Khám & Điều Trị HIV</h1>
            <div className="info-box">
              <h3>Thông tin quan trọng</h3>
              <ul>
                <li>Bảo mật thông tin cá nhân tuyệt đối</li>
                <li>Tư vấn miễn phí 24/7</li>
                <li>Đội ngũ bác sĩ chuyên môn cao</li>
                <li>Hỗ trợ đặt lịch ẩn danh</li>
                <li>Theo dõi điều trị liên tục</li>
              </ul>
            </div>
          </div>
          <AppointmentForm />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default AppointmentPage; 