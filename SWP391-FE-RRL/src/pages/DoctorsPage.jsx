import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const specialties = [
  "Tất cả",
  "HIV/AIDS",
  "Nội - HIV",
  "Truyền nhiễm",
  "Tâm lý",
  "Nhi - HIV",
  "Da liễu - HIV"
];

const doctors = [
  {
    id: 1,
    name: "PGS.TS Nguyễn Văn A",
    specialty: "HIV/AIDS",
    education: "Tiến sĩ Y khoa - ĐH Y Hà Nội",
    experience: "20 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    schedule: "Thứ 2, Thứ 3, Thứ 4",
    expertise: [
      "Điều trị HIV/AIDS",
      "Nghiên cứu lâm sàng",
      "Phác đồ ARV",
      "Kháng thuốc HIV"
    ],
    certifications: [
      "Chứng chỉ Điều trị HIV/AIDS - WHO",
      "Thành viên Hội đồng chuyên môn HIV/AIDS"
    ],
    image: "/images/doctor1.jpg"
  },
  {
    id: 2,
    name: "TS.BS Trần Thị B",
    specialty: "Nội - HIV",
    education: "Tiến sĩ Y khoa - ĐH Y Dược TP.HCM",
    experience: "15 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    schedule: "Thứ 3, Thứ 5, Thứ 6",
    expertise: [
      "Điều trị nội khoa HIV",
      "Quản lý bệnh đồng nhiễm",
      "Điều trị ARV",
      "Theo dõi tác dụng phụ"
    ],
    certifications: [
      "Chuyên khoa II Nội - HIV",
      "Chứng chỉ Điều trị HIV/AIDS - CDC"
    ],
    image: "/images/doctor2.jpg"
  },
  {
    id: 3,
    name: "PGS.TS Lê Văn C",
    specialty: "HIV/AIDS",
    education: "Tiến sĩ Y khoa - ĐH Y Dược Huế",
    experience: "18 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"],
    schedule: "Thứ 4, Thứ 6, Thứ 7",
    expertise: [
      "Điều trị HIV/AIDS",
      "Nghiên cứu kháng thuốc",
      "Phác đồ điều trị",
      "Tư vấn dự phòng"
    ],
    certifications: [
      "Chứng chỉ Điều trị HIV/AIDS - WHO",
      "Giảng viên Đào tạo HIV/AIDS"
    ],
    image: "/images/doctor3.jpg"
  },
  {
    id: 4,
    name: "TS.BS Phạm Thị D",
    specialty: "Truyền nhiễm",
    education: "Tiến sĩ Y khoa - ĐH Y Dược TP.HCM",
    experience: "16 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    schedule: "Thứ 2, Thứ 4, Thứ 6",
    expertise: [
      "Bệnh truyền nhiễm - HIV",
      "Viêm gan B, C đồng nhiễm",
      "Nhiễm trùng cơ hội",
      "Điều trị ARV"
    ],
    certifications: [
      "Chuyên khoa II Truyền nhiễm",
      "Chứng chỉ Điều trị Đồng nhiễm"
    ],
    image: "/images/doctor4.jpg"
  },
  {
    id: 5,
    name: "ThS.BS Hoàng Văn E",
    specialty: "Tâm lý",
    education: "Thạc sĩ Tâm lý học Lâm sàng - ĐH KHXH&NV",
    experience: "12 năm kinh nghiệm",
    languages: ["Tiếng Việt"],
    schedule: "Thứ 3, Thứ 5, Thứ 7",
    expertise: [
      "Tư vấn tâm lý HIV/AIDS",
      "Hỗ trợ tuân thủ điều trị",
      "Can thiệp khủng hoảng",
      "Tư vấn gia đình"
    ],
    certifications: [
      "Chứng chỉ Tư vấn HIV/AIDS",
      "Chứng nhận Tham vấn Tâm lý"
    ],
    image: "/images/doctor5.jpg"
  },
  {
    id: 6,
    name: "TS.BS Nguyễn Thị F",
    specialty: "Da liễu - HIV",
    education: "Tiến sĩ Y khoa - ĐH Y Hà Nội",
    experience: "14 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    schedule: "Thứ 2, Thứ 5, Thứ 7",
    expertise: [
      "Điều trị da liễu HIV/AIDS",
      "Nhiễm trùng cơ hội",
      "Phản ứng thuốc trên da",
      "Điều trị tổn thương da"
    ],
    certifications: [
      "Chuyên khoa II Da liễu",
      "Chứng chỉ Điều trị HIV/AIDS"
    ],
    image: "/images/doctor6.jpg"
  },
  {
    id: 7,
    name: "TS.BS Trần Văn G",
    specialty: "Nhi - HIV",
    education: "Tiến sĩ Y khoa - ĐH Y Dược Huế",
    experience: "13 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    schedule: "Thứ 3, Thứ 4, Thứ 6",
    expertise: [
      "Điều trị HIV trẻ em",
      "Dự phòng lây truyền mẹ con",
      "Tiêm chủng cho trẻ HIV",
      "Theo dõi phát triển"
    ],
    certifications: [
      "Chuyên khoa II Nhi",
      "Chứng chỉ Điều trị HIV Nhi khoa"
    ],
    image: "/images/doctor7.jpg"
  },
  {
    id: 8,
    name: "PGS.TS Lê Thị H",
    specialty: "HIV/AIDS",
    education: "Tiến sĩ Y khoa - ĐH Y Dược TP.HCM",
    experience: "17 năm kinh nghiệm",
    languages: ["Tiếng Việt", "Tiếng Anh"],
    schedule: "Thứ 2, Thứ 4, Thứ 6",
    expertise: [
      "Điều trị HIV/AIDS",
      "Nghiên cứu lâm sàng",
      "Điều trị dự phòng",
      "Quản lý kháng thuốc"
    ],
    certifications: [
      "Chứng chỉ Điều trị HIV/AIDS - WHO",
      "Thành viên Ban Điều trị HIV/AIDS"
    ],
    image: "/images/doctor8.jpg"
  }
];

const DoctorsPage = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả");

  const filteredDoctors = selectedSpecialty === "Tất cả"
    ? doctors
    : doctors.filter(doctor => doctor.specialty === selectedSpecialty);

  return (
    <>
      <Header />
      <main className="doctors-page">
        <div className="container">
          <section className="doctors-header">
            <h1>Đội ngũ Bác sĩ Chuyên khoa</h1>
            <p>Đội ngũ bác sĩ giàu kinh nghiệm trong điều trị HIV/AIDS và các bệnh liên quan</p>
          </section>

          <section className="doctors-specialties">
            <div className="specialty-tags">
              {specialties.map(specialty => (
                <button
                  key={specialty}
                  className={`specialty-tag ${selectedSpecialty === specialty ? 'active' : ''}`}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </section>

          <section className="doctors-grid">
            {filteredDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-detail-card">
                <div className="doctor-image">
                  <img src={doctor.image} alt={doctor.name} />
                </div>
                <div className="doctor-info">
                  <h2>{doctor.name}</h2>
                  <p className="specialty">{doctor.specialty}</p>
                  <p className="education">{doctor.education}</p>
                  <p className="experience">{doctor.experience}</p>
                  <p className="languages">
                    <i className="fas fa-language"></i>
                    {doctor.languages.join(", ")}
                  </p>
                  <div className="certifications">
                    <h3>Chứng chỉ chuyên môn</h3>
                    <ul>
                      {doctor.certifications.map((cert, index) => (
                        <li key={index}>{cert}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="expertise">
                    <h3>Chuyên môn</h3>
                    <ul>
                      {doctor.expertise.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="schedule">
                    <i className="fas fa-calendar-alt"></i>
                    Lịch khám: {doctor.schedule}
                  </p>
                  <Link to="/appointment" className="appointment-btn">
                    Đặt lịch với bác sĩ
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DoctorsPage; 