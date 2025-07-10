import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "../styles/styles.css";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Xóa sạch localStorage trước khi login để tránh lẫn user cũ
  const clearAdminStorage = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    clearAdminStorage(); // Xóa sạch trước khi login mới
    
    try {
      // Sử dụng endpoint đăng nhập dành riêng cho admin
      // Sửa dụng endpoint Auth/login chung cho tất cả user (phân biệt admin bằng role)
      const response = await authService.adminLogin({ username, password });
      console.log('Admin login response:', response);
      
      // Extract token from various possible response formats
      const token = response.data?.token || response.data?.accessToken || response.data?.data?.token;
      
      if (token) {
        // Lưu token và kiểm tra vai trò
        localStorage.setItem('adminToken', token);
        
        // Log token để debug
        console.log('Admin token received:', token.substring(0, 20) + '...');
        
        try {
          // Hàm giải mã JWT đơn giản (chỉ kiểm tra payload, không verify signature)
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
          console.log('Decoded token payload:', decoded);
          
          // Kiểm tra role từ nhiều nguồn có thể (role hoặc role[] hoặc http://schemas.microsoft.com/ws/2008/06/identity/claims/role)
          const role = decoded?.role || 
                       (decoded?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) || 
                       (Array.isArray(decoded?.role) ? decoded.role[0] : null);
          
          // Kiểm tra ID từ nhiều nguồn có thể
          const userId = decoded?.nameid || 
                         decoded?.sub || 
                         decoded?.id || 
                         decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
          
          // Kiểm tra username từ nhiều nguồn có thể  
          const username = decoded?.unique_name || 
                           decoded?.name || 
                           decoded?.username ||
                           decoded?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];
          
          console.log('Extracted from token - Role:', role, 'UserId:', userId, 'Username:', username);
          
          if (role === 'Admin' || role === 'admin' || (Array.isArray(role) && role.includes('Admin'))) {
            // Lưu thông tin admin
            const adminUser = {
              id: userId,
              username: username,
              role: role,
              accessToken: token
            };
            
            console.log('Saving admin user data:', adminUser);
            localStorage.setItem('adminUser', JSON.stringify(adminUser));
            
            navigate("/admin/dashboard");
          } else {
            console.error('Invalid role for admin:', role);
            setError("Tài khoản không có quyền truy cập. Vui lòng đăng nhập bằng tài khoản Admin.");
            clearAdminStorage();
          }
        } catch (e) {
          console.error('Error parsing token:', e);
          setError("Đăng nhập thất bại. Token không hợp lệ.");
          clearAdminStorage();
        }
      } else {
        setError("Đăng nhập thất bại. Không nhận được token từ server.");
      }
    } catch (err) {
      console.error('Admin login error:', err);
      
      // Extract error message from response if possible
      let errorMessage = "Tên đăng nhập hoặc mật khẩu không chính xác. Vui lòng thử lại.";
      
      if (err.response) {
        // Error from server with response
        if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        } else if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 400) {
          errorMessage = "Thông tin đăng nhập không hợp lệ. Kiểm tra lại tên đăng nhập và mật khẩu.";
        } else if (err.response.status === 401) {
          errorMessage = "Không có quyền truy cập. Vui lòng kiểm tra lại tài khoản.";
        } else if (err.response.status === 403) {
          errorMessage = "Tài khoản không có quyền Admin. Vui lòng sử dụng tài khoản Admin.";
        }
      } else if (err.message) {
        // Network or other errors
        if (err.message.includes('Network Error')) {
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <div className="admin-login-header">
          <h2>Đăng nhập Quản trị viên</h2>
          <p>Nhập thông tin tài khoản để đăng nhập vào hệ thống quản trị</p>
        </div>
        
        {error && (
          <div className="admin-login-error">
            <p>{error}</p>
          </div>
        )}
        
        <form className="admin-login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              required
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
          
          <button 
            className="admin-login-button" 
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <p>© 2023 Hệ thống quản lý y tế. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
