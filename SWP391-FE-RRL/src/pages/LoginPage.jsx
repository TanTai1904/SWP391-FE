import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import authService from "../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await authService.login(username, password);
      if (remember) {
        localStorage.setItem("remember", "true");
      }
      alert("Đăng nhập thành công!");
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message || "Đăng nhập thất bại. Vui lòng thử lại."
      );
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
