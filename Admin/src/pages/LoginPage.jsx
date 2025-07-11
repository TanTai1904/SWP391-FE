import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  const [loading, setLoading] = useState(false);

  // Xóa sạch localStorage trước khi login để tránh lẫn user cũ
  const clearUserStorage = () => {
    // Xóa tất cả dữ liệu đăng nhập
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    clearUserStorage(); // Xóa sạch trước khi login mới
    try {
      // Sử dụng login API thống nhất, không phân biệt trước
      const response = await authService.login({ username, password });
      console.log('Login response:', response);
      
      // Try to extract token from different possible response formats
      const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;
      
      if (token) {
        localStorage.setItem('token', token);
        console.log('Token saved to localStorage');
      } else {
        console.error('Token not found in response:', response.data);
        setError("Đăng nhập thất bại. Không nhận được token từ server.");
        setLoading(false);
        return;
      }

      // Giải mã JWT token để xác định role
      const parseJwt = (token) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          return JSON.parse(jsonPayload);
        } catch (e) {
          return null;
        }
      };
      
      const decoded = parseJwt(token);
      console.log('Decoded token:', decoded);
      
      // Kiểm tra role từ nhiều nguồn có thể
      const role = decoded?.role || 
                  (decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) || 
                  (Array.isArray(decoded?.role) ? decoded.role[0] : null);
      
      // Nếu là admin, xử lý đăng nhập admin
      if (role === 'Admin' || role === 'admin' || (Array.isArray(role) && role.includes('Admin'))) {
        // Lưu thông tin admin
        localStorage.setItem('adminToken', token);
        localStorage.setItem('adminUser', JSON.stringify({
          id: decoded.nameid || decoded.sub || decoded.id,
          username: decoded.unique_name || decoded.name || username,
          role: role,
          accessToken: token
        }));
        
        console.log('Admin login successful, redirecting to dashboard');
        navigate("/admin/dashboard");
        return;
      }
      
      // Nếu không phải admin, kiểm tra xem có phải là bác sĩ không
      const loginUsername = username.toLowerCase();
      const userData = response.data || {};
      
      let doctorInfo = null;
      try {
        const res = await doctorService.getAll();
        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          // So sánh username và lấy đúng doctorId
          doctorInfo = res.data.data.find(d => (d.username || '').toLowerCase() === loginUsername);
          // Nếu không tìm thấy theo username, thử tìm theo email
          if (!doctorInfo && userData.email) {
            doctorInfo = res.data.data.find(d => (d.email || '').toLowerCase() === (userData.email || '').toLowerCase());
          }
        }
      } catch (err) {
        console.error("Không lấy được danh sách bác sĩ:", err);
      }
      
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
          accessToken: token // Ensure token is included in user object
        }));
        console.log('Doctor login successful, redirecting to doctor page');
        navigate("/doctor");
      } else {
        setError("Không tìm thấy thông tin bác sĩ! Vui lòng kiểm tra lại username hoặc liên hệ quản trị viên.");
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      setLoading(false);
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
                placeholder="Nhập tên đăng nhập"
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
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
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
            <div className="login-note">
              <p>Hệ thống sẽ tự động xác định vai trò của bạn (Bác sĩ hoặc Quản trị viên) sau khi đăng nhập.</p>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage;
