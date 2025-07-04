import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();  const [formData, setFormData] = useState({
    fullname: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirmPassword: '', 
    terms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp!');
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự!');
      setLoading(false);
      return;
    }
    if (!formData.terms) {
      setError('Bạn phải đồng ý với điều khoản sử dụng!');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 2000);
  };

  // Toggle password visibility functions
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Icons
  const BackArrowIcon = () => (
    <svg className="back-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
    </svg>
  );

  const RegisterIcon = () => (
    <svg className="register-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.78,4.39C19.36,5.96 20.17,7.96 20.17,10.17C20.17,12.38 19.36,14.38 17.78,15.95C16.21,17.53 14.21,18.34 12,18.34C9.79,18.34 7.79,17.53 6.22,15.95C4.64,14.38 3.83,12.38 3.83,10.17C3.83,7.96 4.64,5.96 6.22,4.39C7.79,2.81 9.79,2 12,2M12,20.34C14.67,20.34 17.04,19.3 18.72,17.63C20.39,15.96 21.43,13.59 21.43,10.92C21.43,8.25 20.39,5.88 18.72,4.21C17.04,2.54 14.67,1.5 12,1.5C9.33,1.5 6.96,2.54 5.28,4.21C3.61,5.88 2.57,8.25 2.57,10.92C2.57,13.59 3.61,15.96 5.28,17.63C6.96,19.3 9.33,20.34 12,20.34Z"/>
    </svg>
  );

  const MainRegisterIcon = () => (
    <svg className="main-register-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15,14C12.33,14 7,15.33 7,18V20H23V18C23,15.33 17.67,14 15,14M6,10V7H4V10H1V12H4V15H6V12H9V10M15,12A4,4 0 0,0 19,8A4,4 0 0,0 15,4A4,4 0 0,0 11,8A4,4 0 0,0 15,12Z"/>
    </svg>
  );

  const EyeIcon = () => (
    <svg className="password-toggle-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="password-toggle-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
    </svg>
  );

  // Benefit Icons
  const ShieldIcon = () => (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.8C8,12.2 8.6,11.7 9.2,11.7V10.2C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
    </svg>
  );

  const HeartIcon = () => (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
    </svg>
  );

  const DocumentIcon = () => (
    <svg className="benefit-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );
  return (
    <div className="register-page">
      {/* Back to Homepage Button */}
      <Link to="/" className="back-to-home">
        <BackArrowIcon />
        Quay về trang chủ
      </Link>
      
      <div className="register-container">
        {/* Left Panel - Registration Information */}
        <div className="register-info-panel">
          <div className="register-info-content">
            <div className="register-main-logo">
              <MainRegisterIcon />
            </div>
            <h1 className="register-title">Tham gia hệ thống</h1>
            <p className="register-subtitle">
              Đăng ký tài khoản để truy cập đầy đủ các dịch vụ chăm sóc và điều trị HIV chuyên nghiệp
            </p>
            
            <div className="register-benefits">
              <div className="benefit-item">
                <ShieldIcon />
                <span className="benefit-text">Thông tin cá nhân được bảo mật tuyệt đối</span>
              </div>
              <div className="benefit-item">
                <HeartIcon />
                <span className="benefit-text">Chăm sóc y tế chuyên nghiệp 24/7</span>
              </div>
              <div className="benefit-item">
                <ClockIcon />
                <span className="benefit-text">Theo dõi sức khỏe liên tục</span>
              </div>
              <div className="benefit-item">
                <DocumentIcon />
                <span className="benefit-text">Quản lý hồ sơ y tế điện tử</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Registration Form */}
        <div className="register-form-panel">
          <div className="register-header">
            <div className="register-logo">
              <RegisterIcon />
            </div>
            <h2 className="register-form-title">Đăng ký tài khoản</h2>
            <p className="register-form-subtitle">Vui lòng điền đầy đủ thông tin bên dưới</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullname">Họ và tên *</label>
                <input
                  id="fullname"
                  type="text"
                  name="fullname"
                  className="form-input"
                  placeholder="Nhập họ và tên đầy đủ"
                  value={formData.fullname}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Số điện thoại *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="Nhập địa chỉ email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password">Mật khẩu *</label>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-input"
                    placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={loading}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-input"
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  name="terms"
                  checked={formData.terms}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="custom-checkbox"></span>
                Tôi đồng ý với <Link to="/terms" className="link-item">điều khoản sử dụng</Link> và <Link to="/privacy" className="link-item">chính sách bảo mật</Link>
              </label>
            </div>

            <button 
              className="register-button" 
              type="submit" 
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Đang xử lý..." : "Đăng ký tài khoản"}
            </button>
          </form>

          <div className="additional-links">
            <span>Đã có tài khoản? </span>
            <Link to="/login" className="link-item">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 