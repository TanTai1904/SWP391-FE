import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const serviceCategories = [
  "Tất cả",
  "Điều trị ARV",
  "Xét nghiệm",
  "Tư vấn & Hỗ trợ",
  "Dự phòng",
  "Theo dõi",
  "Chăm sóc"
];

const services = [
  {
    id: 1,
    title: "Điều trị ARV Người lớn",
    category: "Điều trị ARV",
    description: "Điều trị ARV cho người lớn theo phác đồ chuẩn của Bộ Y tế và WHO",
    features: [
      "Phác đồ bậc 1: TDF + 3TC + DTG",
      "Phác đồ bậc 2: AZT + 3TC + LPV/r",
      "Đánh giá và điều chỉnh phác đồ",
      "Theo dõi tác dụng phụ"
    ],
    icon: "pills"
  },
  {
    id: 2,
    title: "Điều trị ARV Trẻ em",
    category: "Điều trị ARV",
    description: "Phác đồ điều trị ARV đặc biệt cho trẻ em nhiễm HIV",
    features: [
      "Phác đồ theo cân nặng",
      "Dạng siro cho trẻ nhỏ",
      "Theo dõi tăng trưởng",
      "Tư vấn cho gia đình"
    ],
    icon: "baby"
  },
  {
    id: 3,
    title: "Điều trị ARV Thai phụ",
    category: "Điều trị ARV",
    description: "Phác đồ ARV đặc biệt cho phụ nữ mang thai nhiễm HIV",
    features: [
      "Phác đồ an toàn cho thai nhi",
      "Dự phòng lây truyền mẹ con",
      "Theo dõi thai kỳ",
      "Tư vấn sau sinh"
    ],
    icon: "female"
  },
  {
    id: 4,
    title: "Xét nghiệm CD4",
    category: "Xét nghiệm",
    description: "Theo dõi số lượng tế bào CD4 để đánh giá hiệu quả điều trị",
    features: [
      "Xét nghiệm định kỳ 6 tháng",
      "Đánh giá miễn dịch",
      "Điều chỉnh phác đồ",
      "Tư vấn kết quả"
    ],
    icon: "vial"
  },
  {
    id: 5,
    title: "Đo Tải lượng HIV",
    category: "Xét nghiệm",
    description: "Xét nghiệm định lượng virus HIV trong máu",
    features: [
      "Theo dõi 6-12 tháng/lần",
      "Đánh giá đáp ứng điều trị",
      "Phát hiện kháng thuốc",
      "Điều chỉnh phác đồ kịp thời"
    ],
    icon: "chart-line"
  },
  {
    id: 6,
    title: "Xét nghiệm Kháng thuốc",
    category: "Xét nghiệm",
    description: "Phát hiện tình trạng kháng thuốc ARV",
    features: [
      "Xét nghiệm gen HIV",
      "Phát hiện đột biến",
      "Lựa chọn thuốc thay thế",
      "Tư vấn điều trị"
    ],
    icon: "microscope"
  },
  {
    id: 7,
    title: "Tư vấn Trước-Sau XN",
    category: "Tư vấn & Hỗ trợ",
    description: "Tư vấn chuyên sâu trước và sau xét nghiệm HIV",
    features: [
      "Tư vấn về xét nghiệm",
      "Hỗ trợ tâm lý",
      "Giới thiệu dịch vụ",
      "Bảo mật thông tin"
    ],
    icon: "comments"
  },
  {
    id: 8,
    title: "Tư vấn Tuân thủ",
    category: "Tư vấn & Hỗ trợ",
    description: "Hỗ trợ người bệnh tuân thủ điều trị ARV",
    features: [
      "Tư vấn uống thuốc đều",
      "Nhắc nhở qua ứng dụng",
      "Theo dõi tác dụng phụ",
      "Hỗ trợ vượt khó khăn"
    ],
    icon: "check-circle"
  },
  {
    id: 9,
    title: "PrEP - Dự phòng trước",
    category: "Dự phòng",
    description: "Điều trị dự phòng trước phơi nhiễm HIV",
    features: [
      "Đánh giá nguy cơ",
      "Kê đơn PrEP",
      "Theo dõi định kỳ",
      "Tư vấn giảm nguy cơ"
    ],
    icon: "shield-alt"
  },
  {
    id: 10,
    title: "PEP - Dự phòng sau",
    category: "Dự phòng",
    description: "Điều trị dự phòng sau phơi nhiễm HIV",
    features: [
      "Đánh giá phơi nhiễm",
      "Điều trị trong 72h",
      "Theo dõi 4 tuần",
      "Xét nghiệm định kỳ"
    ],
    icon: "first-aid"
  },
  {
    id: 11,
    title: "Theo dõi Điều trị",
    category: "Theo dõi",
    description: "Hệ thống theo dõi điều trị toàn diện",
    features: [
      "Hồ sơ điện tử",
      "Lịch tái khám",
      "Nhắc uống thuốc",
      "Theo dõi tiến triển"
    ],
    icon: "laptop-medical"
  },
  {
    id: 12,
    title: "Chăm sóc Hỗ trợ",
    category: "Chăm sóc",
    description: "Dịch vụ chăm sóc và hỗ trợ toàn diện",
    features: [
      "Hỗ trợ dinh dưỡng",
      "Tư vấn tâm lý",
      "Giảm kỳ thị",
      "Kết nối cộng đồng"
    ],
    icon: "hand-holding-heart"
  }
];

const ServicesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const filteredServices = selectedCategory === "Tất cả"
    ? services
    : services.filter(service => service.category === selectedCategory);

  return (
    <>
      <Header />
      <main className="services-page">
        <div className="container">
          <section className="services-header">
            <h1>Dịch vụ Điều trị HIV</h1>
            <p>Cung cấp dịch vụ điều trị HIV toàn diện, chuyên nghiệp và bảo mật</p>
          </section>

          <section className="services-categories">
            <div className="category-tags">
              {serviceCategories.map(category => (
                <button
                  key={category}
                  className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </section>

          <section className="services-grid">
            {filteredServices.map(service => (
              <div key={service.id} className="service-detail-card">
                <div className="service-icon">
                  <i className={`fas fa-${service.icon}`}></i>
                </div>
                <div className="service-category-tag">{service.category}</div>
                <h2>{service.title}</h2>
                <p>{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <Link to="/appointment" className="service-cta">
                  Đặt lịch ngay
                </Link>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ServicesPage; 