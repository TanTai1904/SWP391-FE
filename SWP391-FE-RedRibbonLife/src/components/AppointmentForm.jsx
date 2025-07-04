import React, { useState } from 'react';

const AppointmentForm = () => {  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    appointmentDate: '',
    appointmentTime: '',
    doctor: '',
    isAnonymous: false,
    symptoms: '',
    treatmentHistory: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const doctors = [
    { id: 1, name: "Dr. Nguyễn Văn A", specialty: "HIV/AIDS" },
    { id: 2, name: "Dr. Trần Thị B", specialty: "Nội" },
    { id: 3, name: "Dr. Lê Văn C", specialty: "HIV/AIDS" }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement appointment submission
    console.log('Appointment Data:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };
  return (
    <div className="appointment-form-container">
      <h2>
        <i className="fas fa-calendar-plus"></i>
        Đặt Lịch Khám
      </h2>
      
      {isSubmitted && (
        <div className="success-message">
          <i className="fas fa-check-circle"></i>
          <span>Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="checkbox-group">
          <input
            type="checkbox"
            name="isAnonymous"
            checked={formData.isAnonymous}
            onChange={handleChange}
            id="isAnonymous"
          />
          <label htmlFor="isAnonymous">
            <i className="fas fa-user-secret"></i>
            Đặt lịch ẩn danh
          </label>
        </div>
        
        {formData.isAnonymous && (
          <div className="anonymous-info">
            <i className="fas fa-info-circle"></i>
            <p>Chế độ ẩn danh: Chúng tôi sẽ chỉ cần số điện thoại để liên hệ và xác nhận lịch hẹn.</p>
          </div>
        )}

        {!formData.isAnonymous && (
          <div className="form-row">
            <div className="form-group">
              <label>
                <i className="fas fa-user"></i>
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!formData.isAnonymous}
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            <div className="form-group">
              <label>
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!formData.isAnonymous}
                placeholder="example@email.com"
              />
            </div>
          </div>
        )}

        <div className="form-group">
          <label>
            <i className="fas fa-phone"></i>
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="0xxx xxx xxx"
          />
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-user-md"></i>
            Chọn bác sĩ
          </label>
          <select
            name="doctor"
            value={formData.doctor}
            onChange={handleChange}
            required
          >
            <option value="">-- Chọn bác sĩ --</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} - {doctor.specialty}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>
              <i className="fas fa-calendar-alt"></i>
              Ngày khám
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-clock"></i>
              Giờ khám
            </label>
            <input
              type="time"
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-stethoscope"></i>
            Triệu chứng/Lý do khám
          </label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows="4"
            required
            placeholder="Mô tả triệu chứng hoặc lý do bạn muốn khám..."
          ></textarea>
        </div>

        <div className="form-group">
          <label>
            <i className="fas fa-history"></i>
            Tiền sử điều trị (nếu có)
          </label>
          <textarea
            name="treatmentHistory"
            value={formData.treatmentHistory}
            onChange={handleChange}
            rows="3"
            placeholder="Ví dụ: Đã từng điều trị ARV, có bệnh lý kèm theo..."
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">
          <i className="fas fa-paper-plane"></i>
          Đặt lịch ngay
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm; 