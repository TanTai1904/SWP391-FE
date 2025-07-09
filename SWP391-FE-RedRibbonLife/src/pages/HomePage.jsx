import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

// Data for different sections
const services = [
  {
    icon: "stethoscope",
    title: "Khám & Điều trị",
    description: "Khám sàng lọc, điều trị HIV với đội ngũ bác sĩ chuyên môn cao",
    link: "/services"
  },
  {
    icon: "calendar-check",
    title: "Đặt lịch hẹn",
    description: "Đặt lịch khám, tái khám và theo dõi điều trị một cách dễ dàng",
    link: "/appointment"
  },
  {
    icon: "user-md",
    title: "Tư vấn chuyên môn",
    description: "Tư vấn trực tuyến với bác sĩ về điều trị và chăm sóc sức khỏe",
    link: "/doctors"
  },
  {
    icon: "pills",
    title: "Quản lý thuốc",
    description: "Theo dõi lịch uống thuốc và nhắc nhở thông minh",
    link: "/services"
  }
];

const statistics = [
  { number: "5000+", label: "Bệnh nhân đã điều trị", icon: "users" },
  { number: "50+", label: "Bác sĩ chuyên môn", icon: "user-md" },
  { number: "15+", label: "Năm kinh nghiệm", icon: "award" },
  { number: "98%", label: "Tỷ lệ hài lòng", icon: "heart" }
];



const blogPosts = [
  {
    id: 1,
    title: "Những tiến bộ mới trong điều trị HIV năm 2024",
    excerpt: "Khám phá những phương pháp điều trị tiên tiến và thuốc mới giúp nâng cao chất lượng cuộc sống...",
    author: "TS. Nguyễn Văn Minh",
    date: "15/03/2024",
    readTime: "5 phút đọc",
    category: "Nghiên cứu"
  },
  {
    id: 2,
    title: "Chia sẻ hành trình 10 năm sống với HIV",
    excerpt: "Câu chuyện truyền cảm hứng về việc vượt qua khó khăn và xây dựng cuộc sống tích cực...",
    author: "Anh Hoàng (Bệnh nhân)",
    date: "12/03/2024",
    readTime: "7 phút đọc",
    category: "Chia sẻ"
  },
  {
    id: 3,
    title: "Tầm quan trọng của việc tuân thủ điều trị",
    excerpt: "Tại sao việc uống thuốc đều đặn lại quan trọng và cách duy trì thói quen này...",
    author: "ThS. Trần Thị Lan",
    date: "08/03/2024",
    readTime: "4 phút đọc",
    category: "Giáo dục"
  }
];



const HomePage = () => {
  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <div className="homepage">
      <Header />
      
      <main className="homepage-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-container">
            <div className="hero-content">
              <h1 className="hero-title">
                Chăm sóc sức khỏe
                <span className="highlight"> toàn diện</span>
              </h1>
              <p className="hero-subtitle">
                Hệ thống điều trị HIV hiện đại với đội ngũ bác sĩ chuyên môn cao, 
                cam kết mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho bạn.
              </p>
              <div className="hero-actions">
                <Link to="/appointment" className="btn-primary">
                  <i className="fas fa-calendar-plus"></i>
                  Đặt lịch ngay
                </Link>
                <button 
                  onClick={() => scrollToSection('services')}
                  className="btn-secondary"
                >
                  <i className="fas fa-info-circle"></i>
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
            
            <div className="hero-visual">
              <div className="hero-card">
                <div className="card-icon">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <h3>Điều trị hiệu quả</h3>
                <p>Phác đồ điều trị hiện đại, an toàn</p>
              </div>
              <div className="hero-card">
                <div className="card-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Bảo mật tuyệt đối</h3>
                <p>Thông tin bệnh nhân được bảo vệ</p>
              </div>
              <div className="hero-card">
                <div className="card-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Hỗ trợ 24/7</h3>
                <p>Luôn sẵn sàng hỗ trợ bạn</p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {statistics.map((stat, index) => (
                <div key={index} className="stat-card">
                  <div className="stat-icon">
                    <i className={`fas fa-${stat.icon}`}></i>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-number">{stat.number}</h3>
                    <p className="stat-label">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="services-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Dịch vụ chuyên nghiệp</h2>
              <p className="section-subtitle">
                Chúng tôi cung cấp đầy đủ các dịch vụ chăm sóc sức khỏe 
                từ khám sàng lọc đến điều trị và theo dõi lâu dài
              </p>
            </div>
            
            <div className="services-grid">
              {services.map((service, index) => (
                <div key={index} className="service-card">
                  <div className="service-icon">
                    <i className={`fas fa-${service.icon}`}></i>
                  </div>
                  <h3 className="service-title">{service.title}</h3>
                  <p className="service-description">{service.description}</p>
                  <Link to={service.link} className="service-link">
                    Tìm hiểu thêm <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>        {/* Blog Section */}
        <section className="blog-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Blog & Chia sẻ kinh nghiệm</h2>
              <p className="section-subtitle">
                Những câu chuyện truyền cảm hứng và kiến thức hữu ích 
                từ cộng đồng và các chuyên gia y tế
              </p>
            </div>
            
            <div className="blog-grid">
              {blogPosts.map((post) => (
                <article key={post.id} className="blog-card">
                  <div className="blog-category">{post.category}</div>
                  <h3 className="blog-title">{post.title}</h3>
                  <p className="blog-excerpt">{post.excerpt}</p>
                  <div className="blog-meta">
                    <div className="blog-author">
                      <i className="fas fa-user-circle"></i>
                      <span>{post.author}</span>
                    </div>
                    <div className="blog-date">
                      <i className="fas fa-calendar"></i>
                      <span>{post.date}</span>
                    </div>
                    <div className="blog-read-time">
                      <i className="fas fa-clock"></i>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Link to={`/blog/${post.id}`} className="blog-link">
                    Đọc tiếp <i className="fas fa-arrow-right"></i>
                  </Link>
                </article>
              ))}
            </div>
            
            <div className="blog-cta">
              <Link to="/blog" className="btn-outline">
                Xem tất cả bài viết <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>        {/* Call to Action Section */}
        <section className="cta-section">
          <div className="container">
            <div className="cta-content">
              <h2 className="cta-title">Sẵn sàng bắt đầu hành trình chăm sóc sức khỏe?</h2>
              <p className="cta-subtitle">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng hỗ trợ bạn 
                với dịch vụ chăm sóc sức khỏe tốt nhất.
              </p>
              <div className="cta-actions">
                <Link to="/appointment" className="btn-primary">
                  <i className="fas fa-calendar-plus"></i>
                  Đặt lịch khám
                </Link>
                <Link to="/contact" className="btn-secondary">
                  <i className="fas fa-phone"></i>
                  Liên hệ tư vấn
                </Link>
              </div>
            </div>
            
            <div className="cta-features">
              <div className="feature-item">
                <i className="fas fa-shield-check"></i>
                <span>Bảo mật thông tin</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-user-md"></i>
                <span>Bác sĩ chuyên môn</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-clock"></i>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage; 