import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import authService from "../services/authService";
import doctorService from "../services/doctorService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  // Xóa sạch localStorage trước khi login để tránh lẫn user cũ
  const clearUserStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    clearUserStorage(); // Xóa sạch trước khi login mới
    try {
      const data = await authService.login({ username, password });
      if (data.data && data.data.token) {
        localStorage.setItem('token', data.data.token);
      } else {
        setError("Đăng nhập thất bại. Không nhận được token từ server.");
        return;
      }

      // Lấy username từ response (so sánh không phân biệt hoa thường)
      const loginUsername = (data.data.username || username).toLowerCase();
      let doctorInfo = null;
      try {
        const res = await doctorService.getAll();
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          // So sánh username và lấy đúng doctorId (ưu tiên doctorId, không lấy nhầm id)
          doctorInfo = res.data.data.find(d => (d.username || '').toLowerCase() === loginUsername);
          // Nếu không tìm thấy theo username, thử tìm theo email (phòng trường hợp dữ liệu backend lỗi)
          if (!doctorInfo && data.data.email) {
            doctorInfo = res.data.data.find(d => (d.email || '').toLowerCase() === (data.data.email || '').toLowerCase());
          }
        }
      } catch (err) {
        console.error("Không lấy được danh sách bác sĩ:", err);
      }
      // Debug: log ra doctorInfo để kiểm tra mapping
      console.log('Doctor info found:', doctorInfo);
      // Kiểm tra doctorId mapping đúng với username
      if (
        doctorInfo &&
        doctorInfo.doctorId &&
        doctorInfo.fullName &&
        doctorInfo.username &&
        doctorInfo.username.toLowerCase() === loginUsername
      ) {
        localStorage.setItem('role', 'doctor');
        localStorage.setItem('user', JSON.stringify({
          doctorId: doctorInfo.doctorId,
          fullName: doctorInfo.fullName,
          username: doctorInfo.username,
          email: doctorInfo.email,
          phoneNumber: doctorInfo.phoneNumber,
          dateOfBirth: doctorInfo.dateOfBirth,
          gender: doctorInfo.gender,
          address: doctorInfo.address,
          doctorImage: doctorInfo.doctorImage,
          bio: doctorInfo.bio,
          role: 'doctor',
          accessToken: data.data.token // Ensure token is included in user object
        }));
        navigate("/doctor");
      } else {
        setError("Không tìm thấy thông tin bác sĩ! Vui lòng kiểm tra lại username hoặc liên hệ quản trị viên.");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-container">
          <h2>Đăng nhập</h2>
          {error && <div className="error-message">{error}</div>}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Tên đăng nhập</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span className="checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
            </div>
            <button className="submit-btn" type="submit">
              Đăng nhập
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage;
