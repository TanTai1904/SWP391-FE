import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth.jsx';

const PrescriptionsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <Header />
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <h2>Vui lòng đăng nhập để xem đơn thuốc</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '100px', padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1>💊 Đơn thuốc của tôi</h1>
          
          <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
            {/* Current Prescriptions */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>🔄 Đơn thuốc hiện tại</h2>
              <div style={{ background: '#f8f9ff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #667eea30' }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>ARV Combination Therapy</h3>
                <p style={{ color: '#666', margin: '0 0 1rem 0' }}>Kê đơn bởi: BS. Nguyễn Văn A</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Efavirenz 600mg</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>1 viên/ngày, tối trước khi ngủ</p>
                    <span style={{ color: '#27ae60', fontSize: '0.8rem' }}>✓ Còn 25 ngày</span>
                  </div>
                  <div style={{ background: 'white', padding: '1rem', borderRadius: '8px' }}>
                    <strong>Tenofovir/Emtricitabine</strong>
                    <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>1 viên/ngày, sáng sau ăn</p>
                    <span style={{ color: '#f39c12', fontSize: '0.8rem' }}>⚠ Còn 5 ngày</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medication Schedule */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>📅 Lịch uống thuốc hôm nay</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#e8f5e8', borderRadius: '12px' }}>
                  <div style={{ width: '50px', height: '50px', background: '#27ae60', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    ✓
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>Tenofovir/Emtricitabine</strong>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>8:00 AM - Đã uống</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#fff5e6', borderRadius: '12px', border: '2px solid #f39c12' }}>
                  <div style={{ width: '50px', height: '50px', background: '#f39c12', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    🔔
                  </div>
                  <div style={{ flex: 1 }}>
                    <strong>Efavirenz 600mg</strong>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>10:00 PM - Sắp đến giờ</p>
                  </div>
                  <button style={{ 
                    background: '#f39c12', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '8px', 
                    cursor: 'pointer' 
                  }}>
                    Đánh dấu đã uống
                  </button>
                </div>
              </div>
            </div>

            {/* Prescription History */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <h2 style={{ color: '#667eea', marginBottom: '1rem' }}>📋 Lịch sử đơn thuốc</h2>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ padding: '1rem', border: '1px solid #e0e6ed', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>ARV Initial Treatment</strong>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>15/03/2024</span>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>BS. Trần Thị B</p>
                  <span style={{ color: '#27ae60', fontSize: '0.9rem' }}>✓ Hoàn thành</span>
                </div>
                
                <div style={{ padding: '1rem', border: '1px solid #e0e6ed', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong>Vitamin D3 Supplement</strong>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>01/02/2024</span>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>BS. Nguyễn Văn A</p>
                  <span style={{ color: '#27ae60', fontSize: '0.9rem' }}>✓ Hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsPage;
