import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    const user = { email, password, remember };
    localStorage.setItem('user', JSON.stringify(user));
    alert('Đăng nhập thành công!');
    navigate('/');
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-container">
          <h2>Đăng nhập</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="checkmark"></span>
                Ghi nhớ đăng nhập
              </label>
            </div>
            <button className="submit-btn" type="submit">Đăng nhập</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default LoginPage; 