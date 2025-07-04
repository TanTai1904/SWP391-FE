import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth.jsx';

const MedicalRecordsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <Header />
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <h2>Vui lòng đăng nhập để xem hồ sơ y tế</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '100px', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>Hồ sơ y tế</h1>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2>Thông tin y tế cá nhân</h2>
            <p>Tính năng này đang được phát triển.</p>
            <p>Hồ sơ y tế sẽ hiển thị:</p>
            <ul style={{ marginLeft: '2rem', marginTop: '1rem' }}>
              <li>Lịch sử khám bệnh</li>
              <li>Kết quả xét nghiệm</li>
              <li>Đơn thuốc</li>
              <li>Lịch trình điều trị</li>
              <li>Ghi chú từ bác sĩ</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
