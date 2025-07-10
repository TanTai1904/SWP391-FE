import React, { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPatient, setCurrentPatient] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Male",
    address: "",
    bloodType: "",
    arvRegimen: "",
    allergies: ""
  });

  // Fetch all patients
  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllPatients();
      if (response.data && response.data.data) {
        setPatients(response.data.data);
      } else {
        setPatients([]);
      }
      setError("");
    } catch (err) {
      console.error("Error fetching patients:", err);
      setError("Không thể tải danh sách bệnh nhân. Vui lòng thử lại sau.");
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit && currentPatient) {
        // Update existing patient
        const updateData = {
          ...formData,
          patientId: currentPatient.patientId
        };
        await adminService.updatePatient(updateData);
      } else {
        // Create new patient
        await adminService.createPatient(formData);
      }
      
      // Reset form and fetch updated data
      resetForm();
      fetchPatients();
      setError("");
    } catch (err) {
      console.error("Error saving patient:", err);
      setError("Lỗi khi lưu thông tin bệnh nhân. Vui lòng kiểm tra lại các trường dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      email: "",
      phoneNumber: "",
      fullName: "",
      dateOfBirth: "",
      gender: "Male",
      address: "",
      bloodType: "",
      arvRegimen: "",
      allergies: ""
    });
    setShowForm(false);
    setIsEdit(false);
    setCurrentPatient(null);
  };

  // Edit patient
  const handleEdit = (patient) => {
    setCurrentPatient(patient);
    setFormData({
      username: patient.username || "",
      // Don't set password for edit
      password: "",
      email: patient.email || "",
      phoneNumber: patient.phoneNumber || "",
      fullName: patient.fullName || "",
      dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : "",
      gender: patient.gender || "Male",
      address: patient.address || "",
      bloodType: patient.bloodType || "",
      arvRegimen: patient.arvRegimen || "",
      allergies: patient.allergies || ""
    });
    setShowForm(true);
    setIsEdit(true);
  };

  // Delete patient
  const handleDelete = async (patientId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bệnh nhân này?")) return;
    
    setLoading(true);
    try {
      await adminService.deletePatient(patientId);
      fetchPatients();
      setError("");
    } catch (err) {
      console.error("Error deleting patient:", err);
      setError("Không thể xóa bệnh nhân. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <h2>Quản lý Bệnh nhân</h2>
        {!showForm && (
          <button
            className="admin-button-primary"
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setCurrentPatient(null);
              resetForm();
            }}
          >
            Thêm Bệnh nhân mới
          </button>
        )}
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      {showForm ? (
        <div className="admin-form-container">
          <h3>{isEdit ? "Cập nhật Bệnh nhân" : "Thêm Bệnh nhân mới"}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="username">Tên đăng nhập *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  disabled={isEdit} // Không cho phép sửa username
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="password">
                  {isEdit ? "Mật khẩu (để trống nếu không thay đổi)" : "Mật khẩu *"}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!isEdit}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="fullName">Họ tên *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="phoneNumber">Số điện thoại</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="dateOfBirth">Ngày sinh</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="gender">Giới tính</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="Male">Nam</option>
                  <option value="Female">Nữ</option>
                  <option value="Other">Khác</option>
                </select>
              </div>

              <div className="admin-form-group">
                <label htmlFor="bloodType">Nhóm máu</label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                >
                  <option value="">Không biết</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="address">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="arvRegimen">Phác đồ ARV</label>
                <input
                  type="text"
                  id="arvRegimen"
                  name="arvRegimen"
                  value={formData.arvRegimen}
                  onChange={handleChange}
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="allergies">Dị ứng</label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleChange}
                />
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
          ) : patients.length === 0 ? (
            <div className="admin-no-data">Không có dữ liệu bệnh nhân</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Ngày sinh</th>
                  <th>Giới tính</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Nhóm máu</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.patientId}>
                    <td>{patient.patientId}</td>
                    <td>{patient.fullName}</td>
                    <td>{formatDate(patient.dateOfBirth)}</td>
                    <td>{patient.gender === "Male" ? "Nam" : patient.gender === "Female" ? "Nữ" : "Khác"}</td>
                    <td>{patient.phoneNumber}</td>
                    <td>{patient.email}</td>
                    <td>{patient.bloodType || "N/A"}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-button-secondary admin-button-small"
                          onClick={() => handleEdit(patient)}
                        >
                          Sửa
                        </button>
                        <button
                          className="admin-button-danger admin-button-small"
                          onClick={() => handleDelete(patient.patientId)}
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

export default PatientManagement;
