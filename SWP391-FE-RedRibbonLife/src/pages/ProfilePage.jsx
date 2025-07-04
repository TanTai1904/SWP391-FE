import React from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth.jsx';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useAuth();

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa cập nhật';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // Helper function to get gender display
  const getGenderDisplay = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
      case 'nam':
        return { text: 'Nam', icon: '♂', class: 'gender-male' };
      case 'female':
      case 'nữ':
        return { text: 'Nữ', icon: '♀', class: 'gender-female' };
      default:
        return { text: gender || 'Chưa cập nhật', icon: '⚧', class: 'gender-other' };
    }
  };

  // Helper function to get role badge class
  const getRoleClass = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'doctor':
        return 'role-doctor';
      case 'patient':
        return 'role-patient';
      default:
        return 'role-user';
    }
  };

  // Helper function to get user initials
  const getUserInitials = (fullName, username) => {
    if (fullName) {
      const names = fullName.split(' ');
      return names.length > 1 
        ? names[0][0] + names[names.length - 1][0] 
        : names[0][0];
    }
    return username ? username[0].toUpperCase() : 'U';
  };

  if (!user) {
    return (
      <div>
        <Header />        <div className="login-prompt-container">
          <div className="login-prompt">
            <h2>🩸 Yêu cầu đăng nhập</h2>
            <p>Vui lòng đăng nhập để xem thông tin hồ sơ cá nhân trong hệ thống Red Ribbon Life.</p>
          </div>
        </div>
      </div>
    );
  }

  const genderInfo = getGenderDisplay(user.gender);

  return (
    <div>
      <Header />      <div className="profile-container">
        <div className="profile-content">
          {/* Main Profile Section */}
          <div className="profile-main">
            <div className="profile-header">
              <h1 className="profile-title">Hồ sơ Cá nhân</h1>
              <p className="profile-subtitle">Thông tin chi tiết tài khoản Red Ribbon Life</p>
            </div>
            
            <div className="profile-card">
              <div className="profile-avatar">
                <div className="avatar-circle">
                  {getUserInitials(user.full_name, user.username)}
                </div>
                <h3>{user.full_name || user.username || 'Người dùng'}</h3>
              </div>

              <div className="profile-info">
                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">👤</span>
                    Tên đăng nhập
                  </div>
                  <div className="info-value">
                    {user.username || <span className="empty-value">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">✉️</span>
                    Email
                  </div>
                  <div className="info-value email-value">
                    {user.email || <span className="empty-value">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">📱</span>
                    Số điện thoại
                  </div>
                  <div className="info-value phone-value">
                    {user.phone_number || <span className="empty-value">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">👨‍👩‍👧‍👦</span>
                    Họ và tên
                  </div>
                  <div className="info-value full-name-value">
                    {user.full_name || <span className="empty-value">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">🎂</span>
                    Ngày sinh
                  </div>
                  <div className="info-value date-value">
                    {formatDate(user.date_of_birth)}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className={`icon ${genderInfo.class}`}>{genderInfo.icon}</span>
                    Giới tính
                  </div>
                  <div className="info-value">
                    {genderInfo.text}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">🏠</span>
                    Địa chỉ
                  </div>
                  <div className="info-value address-value">
                    {user.address || <span className="empty-value">Chưa cập nhật</span>}
                  </div>
                </div>

                <div className="info-group">
                  <div className="info-label">
                    <span className="icon">🎭</span>
                    Vai trò
                  </div>
                  <div className="info-value">
                    <span className={`role-badge ${getRoleClass(user.user_role)}`}>
                      {user.user_role || 'User'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Website Info Sidebar */}
          <div className="profile-sidebar">
            <div className="website-info-card">
              <div className="website-header">
                <div className="website-logo">
                  🩸
                </div>
                <h3 className="website-name">Red Ribbon Life</h3>
                <p className="website-tagline">Hệ thống hỗ trợ HIV/AIDS toàn diện</p>
              </div>

              <div className="website-stats">
                <div className="stat-item">
                  <div className="stat-header">
                    <span className="stat-icon">👥</span>
                    <span className="stat-label">Bệnh nhân</span>
                  </div>
                  <p className="stat-value">2,450+ người</p>
                </div>

                <div className="stat-item">
                  <div className="stat-header">
                    <span className="stat-icon">👨‍⚕️</span>
                    <span className="stat-label">Bác sĩ</span>
                  </div>
                  <p className="stat-value">85+ chuyên gia</p>
                </div>

                <div className="stat-item">
                  <div className="stat-header">
                    <span className="stat-icon">📅</span>
                    <span className="stat-label">Cuộc hẹn</span>
                  </div>
                  <p className="stat-value">5,200+ lịch khám</p>
                </div>

                <div className="stat-item">
                  <div className="stat-header">
                    <span className="stat-icon">🏥</span>
                    <span className="stat-label">Điều trị</span>
                  </div>
                  <p className="stat-value">98% hiệu quả</p>
                </div>
              </div>

              <div className="website-links">
                <a href="/" className="website-link">
                  <span className="link-icon">🏠</span>
                  Trang chủ
                </a>
                <a href="/about" className="website-link">
                  <span className="link-icon">ℹ️</span>
                  Về dự án
                </a>
                <a href="/doctors" className="website-link">
                  <span className="link-icon">👨‍⚕️</span>
                  Đội ngũ y tế
                </a>
                <a href="/services" className="website-link">
                  <span className="link-icon">🏥</span>
                  Dịch vụ hỗ trợ
                </a>
              </div>

              <div className="contact-info">
                <h4 className="contact-title">Liên hệ hỗ trợ</h4>
                <div className="contact-item">
                  <span className="contact-icon">📞</span>
                  Hotline: 1900-1234
                </div>
                <div className="contact-item">
                  <span className="contact-icon">✉️</span>
                  support@redribbonlife.vn
                </div>
                <div className="contact-item">
                  <span className="contact-icon">⏰</span>
                  24/7 tư vấn khẩn cấp
                </div>
                <div className="contact-item">
                  <span className="contact-icon">🏢</span>
                  FPT University, TP.HCM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
