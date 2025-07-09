import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth.jsx';

const SettingsPage = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div>
        <Header />
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <h2>Vui lòng đăng nhập để truy cập cài đặt</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '100px', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>Cài đặt tài khoản</h1>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Thông tin cá nhân</h2>
            <p>Cập nhật thông tin cá nhân của bạn</p>
            <button style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Chỉnh sửa thông tin
            </button>
          </div>
          
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Đổi mật khẩu</h2>
            <p>Cập nhật mật khẩu để bảo mật tài khoản</p>
            <button style={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer',
              marginTop: '1rem'
            }}>
              Đổi mật khẩu
            </button>
          </div>
          
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
            <h2>Thông báo</h2>
            <p>Quản lý cài đặt thông báo</p>
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="checkbox" defaultChecked />
                <span>Nhận thông báo email về lịch hẹn</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <input type="checkbox" defaultChecked />
                <span>Nhận thông báo về kết quả xét nghiệm</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" />
                <span>Nhận newsletter về sức khỏe</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
