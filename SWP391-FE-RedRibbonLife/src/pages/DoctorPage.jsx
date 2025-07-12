import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import doctorService from '../services/doctorService';
import '../styles/DoctorsPage.css';

const DoctorCard = ({ doctor }) => (
  <div className="doctor-card">
    <div className="doctor-card-header">
      <div className="doctor-avatar">
        {doctor.avatar || doctor.image ? (
          <img
            src={doctor.avatar || doctor.image}
            alt={doctor.fullName || doctor.name || 'Bác sĩ'}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="avatar-placeholder"
          style={{ display: doctor.avatar || doctor.image ? 'none' : 'flex' }}
        >
          <i className="fas fa-user-md"></i>
        </div>
      </div>
      <div className="doctor-status">
        <span className="status-badge available">Có thể khám</span>
      </div>
    </div>
    <div className="doctor-card-body">
      <h3 className="doctor-name">
        BS. {doctor.fullName || doctor.name || 'Chưa cập nhật'}
      </h3>
      <div className="doctor-specialty">
        <i className="fas fa-stethoscope"></i>
        <span>{doctor.specialty || doctor.specialization || 'Chuyên khoa chung'}</span>
      </div>
      <div className="doctor-details">
        {doctor.experience && (
          <div className="detail-item">
            <i className="fas fa-award"></i>
            <span>{doctor.experience} năm kinh nghiệm</span>
          </div>
        )}
        {doctor.education && (
          <div className="detail-item">
            <i className="fas fa-graduation-cap"></i>
            <span>{doctor.education}</span>
          </div>
        )}
        {doctor.hospital && (
          <div className="detail-item">
            <i className="fas fa-hospital"></i>
            <span>{doctor.hospital}</span>
          </div>
        )}
        {doctor.phone && (
          <div className="detail-item">
            <i className="fas fa-phone"></i>
            <span>{doctor.phone}</span>
          </div>
        )}
      </div>
      {doctor.bio && (
        <div className="doctor-bio">
          <p>{doctor.bio.length > 100 ? `${doctor.bio.substring(0, 100)}...` : doctor.bio}</p>
        </div>
      )}
      {doctor.rating && (
        <div className="doctor-rating">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star ${i < Math.floor(doctor.rating) ? 'filled' : ''}`}
              ></i>
            ))}
          </div>
          <span className="rating-text">{doctor.rating}/5</span>
        </div>
      )}
    </div>
    <div className="doctor-card-footer">
      <Link
        to={`/appointment?doctorId=${doctor.doctorID || doctor.id}`}
        className="btn btn-primary"
      >
        <i className="fas fa-calendar-plus"></i>
        Đặt lịch hẹn
      </Link>
      <Link
        to={`/doctor/${doctor.doctorID || doctor.id}`}
        className="btn btn-outline"
      >
        <i className="fas fa-info-circle"></i>
        Chi tiết
      </Link>
    </div>
  </div>
);

const DoctorsGrid = ({ doctors, onRetry }) => (
  <div className="doctors-content">
    {doctors.length === 0 ? (
      <div className="empty-state">
        <div className="empty-icon">👨‍⚕️</div>
        <h3>Chưa có thông tin bác sĩ</h3>
        <p>
          Danh sách bác sĩ đang được cập nhật.
          <br />Vui lòng quay lại sau hoặc liên hệ với chúng tôi để biết thêm thông tin.
        </p>
        <button className="retry-btn" onClick={onRetry}>
          <i className="fas fa-refresh"></i>
          Tải lại
        </button>
      </div>
    ) : (
      <div className="doctors-grid">
        {doctors.map((doctor, index) => (
          <DoctorCard key={doctor.doctorID || doctor.id || index} doctor={doctor} />
        ))}
      </div>
    )}
  </div>
);

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await doctorService.getAllDoctors();
      if (response && response.status && response.data) {
        setDoctors(response.data);
      } else if (Array.isArray(response)) {
        setDoctors(response);
      } else {
        setError('Dữ liệu không hợp lệ từ server');
      }
    } catch (err) {
      setError('Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <div className="doctors-page">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3>Đang tải danh sách bác sĩ...</h3>
            <p>Vui lòng chờ trong giây lát</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="doctors-page">
          <div className="error-state">
            <div className="error-icon">⚠️</div>
            <h3>Có lỗi xảy ra</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={fetchDoctors}>
              <i className="fas fa-redo"></i>
              Thử lại
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="doctors-page">
        {/* Hero Section */}
        <section className="doctors-hero">
          <div className="hero-background">
            <div className="hero-overlay"></div>
          </div>
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Đội Ngũ Bác Sĩ <span className="highlight">Chuyên Nghiệp</span>
              </h1>
              <p className="hero-subtitle">
                Kết nối với hơn <strong>50+ bác sĩ chuyên gia</strong> hàng đầu trong lĩnh vực HIV/AIDS, 
                truyền nhiễm và các chuyên khoa đa dạng. Chúng tôi cam kết mang đến dịch vụ 
                <span className="highlight-text"> chăm sóc sức khỏe toàn diện</span> và 
                <span className="highlight-text"> tư vấn chuyên sâu</span> với phương pháp điều trị hiện đại nhất.
              </p>
              <div className="hero-features">
                <div className="feature-item">
                  <i className="fas fa-shield-alt"></i>
                  <span>Bảo mật tuyệt đối</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-clock"></i>
                  <span>Tư vấn 24/7</span>
                </div>
                <div className="feature-item">
                  <i className="fas fa-heart"></i>
                  <span>Chăm sóc tận tâm</span>
                </div>
              </div>
              <div className="hero-stats">
                <div className="stat-card">
                  <div className="stat-number">{doctors.length}+</div>
                  <div className="stat-label">Bác sĩ chuyên nghiệp</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">6</div>
                  <div className="stat-label">Chuyên khoa đa dạng</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Hỗ trợ tư vấn</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Doctors Grid */}
        <section className="doctors-grid-section">
          <div className="container">
            {/* Section Header */}
            <div className="section-header">
              <h2 className="section-title">Đội ngũ bác sĩ chuyên nghiệp</h2>
              <p className="section-description">
                Gặp gỡ các chuyên gia y tế hàng đầu, luôn sẵn sàng chăm sóc sức khỏe của bạn
              </p>
              <div className="doctors-count">
                <span className="count-badge">
                  <i className="fas fa-user-md"></i>
                  {doctors.length} bác sĩ
                </span>
              </div>
            </div>
            <DoctorsGrid doctors={doctors} onRetry={fetchDoctors} />
          </div>
        </section>

        {/* CTA Section */}
        <section className="doctors-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Cần hỗ trợ tư vấn?</h2>
              <p>Liên hệ với chúng tôi để được tư vấn miễn phí về các dịch vụ chăm sóc sức khỏe</p>
              <div className="cta-buttons">
                <Link to="/contact" className="btn btn-primary">
                  <i className="fas fa-phone"></i>
                  Liên hệ ngay
                </Link>
                <Link to="/about" className="btn btn-outline">
                  <i className="fas fa-info"></i>
                  Tìm hiểu thêm
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default DoctorsPage;
