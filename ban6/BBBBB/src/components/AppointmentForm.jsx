import React, { useState } from 'react';

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
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
    alert('Đặt lịch thành công! Chúng tôi sẽ liên hệ với bạn sớm.');
  };

  return (
    <div className="appointment-form-container">
      <h2>Đặt Lịch Khám</h2>
      <form onSubmit={handleSubmit} className="appointment-form">
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="isAnonymous"
              checked={formData.isAnonymous}
              onChange={handleChange}
            />
            Đặt lịch ẩn danh
          </label>
        </div>

        {!formData.isAnonymous && (
          <>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!formData.isAnonymous}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required={!formData.isAnonymous}
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Chọn bác sĩ</label>
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

        <div className="form-group">
          <label>Ngày khám</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Giờ khám</label>
          <input
            type="time"
            name="appointmentTime"
            value={formData.appointmentTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Triệu chứng/Lý do khám</label>
          <textarea
            name="symptoms"
            value={formData.symptoms}
            onChange={handleChange}
            rows="3"
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Tiền sử điều trị (nếu có)</label>
          <textarea
            name="treatmentHistory"
            value={formData.treatmentHistory}
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="submit-btn">Đặt lịch</button>
      </form>
    </div>
  );
};

export default AppointmentForm; 