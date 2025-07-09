import React, { useState } from "react";
import { login } from "@/api/authService";

const LoginAdmin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await login(username, password);
      localStorage.setItem("token", res.token);
      if (onLogin) onLogin();
    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu!");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "80px auto", background: "#fff", padding: 32, borderRadius: 12, boxShadow: "0 2px 16px #0001" }}>
      <h2>Đăng nhập Admin</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tài khoản:</label>
          <input value={username} onChange={e => setUsername(e.target.value)} required style={{ width: "100%", marginBottom: 12 }} />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: "100%", marginBottom: 12 }} />
        </div>
        {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#2563eb", color: "#fff", border: "none", borderRadius: 6 }}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </div>
  );
};

export default LoginAdmin;
