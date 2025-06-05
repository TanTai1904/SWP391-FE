import React, { useEffect, useState } from "react";
import doctorService from "../services/doctorService";
import Header from "../components/Header";
import Footer from "../components/Footer";

const specialties = [
  "Tất cả",
  "HIV/AIDS",
  "Nội - HIV",
  "Truyền nhiễm",
  "Tâm lý",
  "Nhi - HIV",
  "Da liễu - HIV",
];

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("Tất cả");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await doctorService.getAllDoctors();
        setDoctors(data);
      } catch (err) {
        setError("Không thể tải danh sách bác sĩ.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const filteredDoctors =
    selectedSpecialty === "Tất cả"
      ? doctors
      : doctors.filter((doctor) => doctor.specialty === selectedSpecialty);

  return (
    <>
      <Header />
      <main className="doctors-page">
        <div className="container">
          <section className="doctors-header">
            <h1>Đội ngũ Bác sĩ Chuyên khoa</h1>
            <p>
              Đội ngũ bác sĩ giàu kinh nghiệm trong điều trị HIV/AIDS và các
              bệnh liên quan
            </p>
          </section>

          <section className="doctors-specialties">
            <div className="specialty-tags">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  className={`specialty-tag ${
                    selectedSpecialty === specialty ? "active" : ""
                  }`}
                  onClick={() => setSelectedSpecialty(specialty)}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </section>

          <section className="doctors-grid">
            {loading && <p>Đang tải...</p>}
            {error && <p className="error-message">{error}</p>}
            {filteredDoctors.map((doctor) => (
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
