import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '', email: '', phone: '', password: '', confirmPassword: '', userType: '', terms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    if (formData.password.length < 8) {
      alert('Mật khẩu phải có ít nhất 8 ký tự!');
      return;
    }
    if (!formData.terms) {
      alert('Bạn phải đồng ý với điều khoản!');
      return;
    }
    alert('Đăng ký thành công! Hãy đăng nhập.');
    navigate('/login');
  };

  return (
    <>
      <Header />
      <section className="auth-section">
        <div className="auth-container">
          <h2>Đăng ký</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input name="fullname" value={formData.fullname} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Điện thoại</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Mật khẩu</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Loại tài khoản</label>
              <select name="userType" value={formData.userType} onChange={handleChange} required>
                <option value="">Chọn loại tài khoản</option>
                <option value="patient">Bệnh nhân</option>
                <option value="doctor">Bác sĩ</option>
                <option value="staff">Nhân viên y tế</option>
              </select>
            </div>
            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
                <span className="checkmark"></span>
                Tôi đồng ý với điều khoản
              </label>
            </div>
            <button className="submit-btn" type="submit">Đăng ký</button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default RegisterPage; 