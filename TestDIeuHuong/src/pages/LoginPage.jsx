import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import authService from "../services/authService";
import { toast } from "react-toastify";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(username, password);
      console.log("Login response:", response);

      // Lấy thông tin user từ response
      const userData = response.user || response;
      console.log("User data:", userData);

      // Kiểm tra role và chuyển hướng
      const userRole = userData.role || userData.userType;
      console.log("User role:", userRole);

      if (userRole === "doctor" || userRole === "Doctor") {
        console.log("Redirecting to doctor dashboard...");
        navigate("/doctor");
      } else if (userRole === "manager" || userRole === "Manager") {
        console.log("Redirecting to manager dashboard...");
        navigate("/manager");
      } else {
        console.log("Redirecting to home...");
        navigate("/");
      }

      toast.success("Đăng nhập thành công!");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-container">
          <h2>Đăng nhập</h2>
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
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage;
