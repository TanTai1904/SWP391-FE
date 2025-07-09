import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import "../styles/LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      await login(username, password);
      if (remember) {
        localStorage.setItem("remember", "true");
      }
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };
  // Medical Cross Icon SVG
  const MedicalIcon = () => (
    <svg className="medical-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 8h-2v3h-3v2h3v3h2v-3h3v-2h-3V8zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
    </svg>
  );

  // Main Medical Icon for System Panel
  const MainMedicalIcon = () => (
    <svg className="main-medical-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
      <path d="M12 6v6h6v2h-6v6h-2v-6H4v-2h6V6h2z"/>
    </svg>
  );

  // Feature Icons
  const ShieldIcon = () => (
    <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.1 16,12.7V16.2C16,16.8 15.4,17.3 14.8,17.3H9.2C8.6,17.3 8,16.8 8,16.2V12.8C8,12.2 8.6,11.7 9.2,11.7V10.2C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,9.5V11.5H13.5V9.5C13.5,8.7 12.8,8.2 12,8.2Z"/>
    </svg>
  );

  const HeartIcon = () => (
    <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
    </svg>
  );

  const ClockIcon = () => (
    <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z"/>
    </svg>
  );
  const DocumentIcon = () => (
    <svg className="feature-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
    </svg>
  );

  // Password Toggle Icons
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
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Back Arrow Icon
  const BackArrowIcon = () => (
    <svg className="back-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"/>
    </svg>
  );
  return (
    <div className="login-page">
      {/* Back to Homepage Button */}
      <Link to="/" className="back-to-home">
        <BackArrowIcon />
        Quay về trang chủ
      </Link>
      
      <div className="login-container">
        {/* Left Panel - System Information */}
        <div className="system-info-panel">
          <div className="system-info-content">
            <div className="system-main-logo">
              <MainMedicalIcon />
            </div>
            <h1 className="system-title">HIV Treatment System</h1>
            <p className="system-subtitle">
              Hệ thống quản lý và điều trị HIV toàn diện, bảo mật cao và hiệu quả
            </p>
            
            <div className="system-features">
              <div className="feature-item">
                <ShieldIcon />
                <span className="feature-text">Bảo mật thông tin y tế tuyệt đối</span>
              </div>
              <div className="feature-item">
                <HeartIcon />
                <span className="feature-text">Chăm sóc bệnh nhân tận tình</span>
              </div>
              <div className="feature-item">
                <ClockIcon />
                <span className="feature-text">Hỗ trợ 24/7 không gián đoạn</span>
              </div>
              <div className="feature-item">
                <DocumentIcon />
                <span className="feature-text">Quản lý hồ sơ điện tử thông minh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="login-form-panel">
          <div className="login-header">
            <div className="login-logo">
              <MedicalIcon />
            </div>
            <h2 className="login-title">Đăng nhập hệ thống</h2>
            <p className="login-subtitle">Vui lòng nhập thông tin đăng nhập</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập hoặc Email</label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="Nhập tên đăng nhập hoặc email"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="Nhập mật khẩu"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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

            <div className="checkbox-group">
              <label className="checkbox-wrapper">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <span className="custom-checkbox"></span>
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button 
              className="login-button" 
              type="submit" 
              disabled={loading}
            >
              {loading && <span className="loading-spinner"></span>}
              {loading ? "Đang đăng nhập..." : "Đăng nhập hệ thống"}
            </button>
          </form>

          <div className="additional-links">
            <Link to="/forgot-password" className="link-item">
              Quên mật khẩu?
            </Link>
            <Link to="/register" className="link-item">
              Đăng ký tài khoản
            </Link>
          </div>

          <div className="security-notice">
            <span>🔒 Hệ thống bảo mật cao - Thông tin y tế được mã hóa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
