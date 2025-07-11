import React, { useState, useEffect } from "react";
import adminService from "../../../services/adminService";
import appointmentService from "../../../services/appointmentService";

const AppointmentManagement = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "Tư vấn trực tiếp",
    reason: "",
    note: "",
    status: "Pending",
    isAnonymous: false
  });

  // Fetch all appointments
  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAllScheduled();
      if (response.data && response.data.data) {
        setAppointments(response.data.data);
      } else {
        setAppointments([]);
      }
      setError("");
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors and patients for dropdown
  const fetchDoctorsAndPatients = async () => {
    try {
      // Fetch doctors
      const doctorsResponse = await adminService.getAllDoctors();
      if (doctorsResponse.data && doctorsResponse.data.data) {
        setDoctors(doctorsResponse.data.data);
      }

      // Fetch patients
      const patientsResponse = await adminService.getAllPatients();
      if (patientsResponse.data && patientsResponse.data.data) {
        setPatients(patientsResponse.data.data);
      }
    } catch (err) {
      console.error("Error fetching doctors and patients:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchDoctorsAndPatients();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && currentAppointment) {
        // Update existing appointment
        const updateData = {
          ...formData,
          appointmentId: currentAppointment.appointmentId || currentAppointment.id
        };
        await appointmentService.update(updateData);
      } else {
        // Create new appointment
        await appointmentService.create(formData);
      }
      
      // Reset form and fetch updated data
      resetForm();
      fetchAppointments();
      setError("");
    } catch (err) {
      console.error("Error saving appointment:", err);
      setError("Lỗi khi lưu lịch hẹn. Vui lòng kiểm tra lại các trường dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      appointmentDate: "",
      appointmentTime: "",
      appointmentType: "Tư vấn trực tiếp",
      reason: "",
      note: "",
      status: "Pending",
      isAnonymous: false
    });
    setShowForm(false);
    setIsEdit(false);
    setCurrentAppointment(null);
  };

  // Edit appointment
  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    
    // Format date and time properly
    let appointmentDate = appointment.appointmentDate;
    if (appointmentDate && appointmentDate.includes('T')) {
      appointmentDate = appointmentDate.split('T')[0];
    }
    
    let appointmentTime = appointment.appointmentTime;
    if (appointmentTime && appointmentTime.includes(':')) {
      // Ensure it's in HH:mm format
      appointmentTime = appointmentTime.substring(0, 5);
    }
    
    setFormData({
      patientId: appointment.patientId || "",
      doctorId: appointment.doctorId || "",
      appointmentDate: appointmentDate || "",
      appointmentTime: appointmentTime || "",
      appointmentType: appointment.appointmentType || "Tư vấn trực tiếp",
      reason: appointment.reason || "",
      note: appointment.note || "",
      status: appointment.status || "Pending",
      isAnonymous: appointment.isAnonymous || false
    });
    setShowForm(true);
    setIsEdit(true);
  };

  // Delete appointment
  const handleDelete = async (appointmentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa lịch hẹn này?")) return;
    
    setLoading(true);
    try {
      await appointmentService.deleteAppointment(appointmentId);
      fetchAppointments();
      setError("");
    } catch (err) {
      console.error("Error deleting appointment:", err);
      setError("Không thể xóa lịch hẹn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Pending": return "admin-badge admin-badge-pending";
      case "Scheduled": return "admin-badge admin-badge-scheduled";
      case "Confirmed": return "admin-badge admin-badge-confirmed";
      case "Completed": return "admin-badge admin-badge-completed";
      case "Cancelled": return "admin-badge admin-badge-cancelled";
      case "Rejected": return "admin-badge admin-badge-rejected";
      default: return "admin-badge";
    }
  };

  // Get doctor name by ID
  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(doc => doc.doctorId === doctorId);
    return doctor ? doctor.fullName : "N/A";
  };

  // Get patient name by ID
  const getPatientName = (patientId, isAnonymous, patientName) => {
    if (isAnonymous) return patientName || "Bệnh nhân ẩn danh";
    const patient = patients.find(pat => pat.patientId === patientId);
    return patient ? patient.fullName : "N/A";
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <h2>Quản lý Lịch hẹn</h2>
        {!showForm && (
          <button
            className="admin-button-primary"
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setCurrentAppointment(null);
              resetForm();
            }}
          >
            Thêm Lịch hẹn mới
          </button>
        )}
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      {showForm ? (
        <div className="admin-form-container">
          <h3>{isEdit ? "Cập nhật Lịch hẹn" : "Thêm Lịch hẹn mới"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="doctorId">Bác sĩ *</label>
                <select
                  id="doctorId"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Chọn bác sĩ --</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doctorId} value={doctor.doctorId}>
                      {doctor.fullName} ({doctor.specialization || "Bác sĩ"})
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label>Bệnh nhân</label>
                <div className="admin-form-checkbox">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                  />
                  <label htmlFor="isAnonymous">Bệnh nhân ẩn danh</label>
                </div>

                {formData.isAnonymous ? (
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    placeholder="Tên bệnh nhân (không bắt buộc)"
                    value={formData.patientName || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <select
                    id="patientId"
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required={!formData.isAnonymous}
                  >
                    <option value="">-- Chọn bệnh nhân --</option>
                    {patients.map(patient => (
                      <option key={patient.patientId} value={patient.patientId}>
                        {patient.fullName}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="appointmentDate">Ngày hẹn *</label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="appointmentTime">Giờ hẹn *</label>
                <input
                  type="time"
                  id="appointmentTime"
                  name="appointmentTime"
                  value={formData.appointmentTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="appointmentType">Loại lịch hẹn</label>
                <select
                  id="appointmentType"
                  name="appointmentType"
                  value={formData.appointmentType}
                  onChange={handleChange}
                >
                  <option value="Tư vấn trực tiếp">Tư vấn trực tiếp</option>
                  <option value="Tư vấn trực tuyến">Tư vấn trực tuyến</option>
                  <option value="Xét nghiệm">Xét nghiệm</option>
                  <option value="Tái khám">Tái khám</option>
                  <option value="Khám tổng quát">Khám tổng quát</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="status">Trạng thái</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Pending">Chờ xử lý</option>
                  <option value="Confirmed">Đã xác nhận</option>
                  <option value="Scheduled">Đã lên lịch</option>
                  <option value="Completed">Đã hoàn thành</option>
                  <option value="Cancelled">Đã hủy</option>
                  <option value="Rejected">Từ chối</option>
                </select>
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="reason">Lý do khám</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="admin-form-group">
                <label htmlFor="note">Ghi chú</label>
                <textarea
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <div className="admin-form-buttons">
              <button
                type="button"
                className="admin-button-secondary"
                onClick={resetForm}
              >
                Hủy
              </button>
              <button
                type="submit"
                className="admin-button-primary"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : (isEdit ? "Cập nhật" : "Thêm mới")}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="admin-table-container">
          {loading ? (
            <div className="admin-loading">Đang tải dữ liệu...</div>
          ) : appointments.length === 0 ? (
            <div className="admin-no-data">Không có dữ liệu lịch hẹn</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Bác sĩ</th>
                  <th>Bệnh nhân</th>
                  <th>Ngày hẹn</th>
                  <th>Giờ hẹn</th>
                  <th>Loại lịch hẹn</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.appointmentId || appointment.id}>
                    <td>{appointment.appointmentId || appointment.id}</td>
                    <td>{getDoctorName(appointment.doctorId)}</td>
                    <td>{getPatientName(appointment.patientId, appointment.isAnonymous, appointment.patientName)}</td>
                    <td>{formatDate(appointment.appointmentDate)}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>{appointment.appointmentType}</td>
                    <td>
                      <span className={getStatusBadgeClass(appointment.status)}>
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-button-secondary admin-button-small"
                          onClick={() => handleEdit(appointment)}
                        >
                          Sửa
                        </button>
                        <button
                          className="admin-button-danger admin-button-small"
                          onClick={() => handleDelete(appointment.appointmentId || appointment.id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentManagement;
