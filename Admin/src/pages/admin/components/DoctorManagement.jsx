import React, { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);

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
    specialization: "",
    bio: "",
    doctorImage: ""
  });

  // Fetch all doctors
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllDoctors();
      if (response.data && response.data.data) {
        setDoctors(response.data.data);
      } else {
        setDoctors([]);
      }
      setError("");
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Không thể tải danh sách bác sĩ. Vui lòng thử lại sau.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
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
      if (isEdit && currentDoctor) {
        // Update existing doctor
        const updateData = {
          ...formData,
          doctorId: currentDoctor.doctorId
        };
        await adminService.updateDoctor(updateData);
      } else {
        // Create new doctor
        await adminService.createDoctor(formData);
      }
      
      // Reset form and fetch updated data
      resetForm();
      fetchDoctors();
      setError("");
    } catch (err) {
      console.error("Error saving doctor:", err);
      setError("Lỗi khi lưu thông tin bác sĩ. Vui lòng kiểm tra lại các trường dữ liệu.");
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
      specialization: "",
      bio: "",
      doctorImage: ""
    });
    setShowForm(false);
    setIsEdit(false);
    setCurrentDoctor(null);
  };

  // Edit doctor
  const handleEdit = (doctor) => {
    setCurrentDoctor(doctor);
    setFormData({
      username: doctor.username || "",
      // Don't set password for edit
      password: "",
      email: doctor.email || "",
      phoneNumber: doctor.phoneNumber || "",
      fullName: doctor.fullName || "",
      dateOfBirth: doctor.dateOfBirth ? doctor.dateOfBirth.split('T')[0] : "",
      gender: doctor.gender || "Male",
      address: doctor.address || "",
      specialization: doctor.specialization || "",
      bio: doctor.bio || "",
      doctorImage: doctor.doctorImage || ""
    });
    setShowForm(true);
    setIsEdit(true);
  };

  // Delete doctor
  const handleDelete = async (doctorId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này?")) return;
    
    setLoading(true);
    try {
      await adminService.deleteDoctor(doctorId);
      fetchDoctors();
      setError("");
    } catch (err) {
      console.error("Error deleting doctor:", err);
      setError("Không thể xóa bác sĩ. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <h2>Quản lý Bác sĩ</h2>
        {!showForm && (
          <button
            className="admin-button-primary"
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setCurrentDoctor(null);
              resetForm();
            }}
          >
            Thêm Bác sĩ mới
          </button>
        )}
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      {showForm ? (
        <div className="admin-form-container">
          <h3>{isEdit ? "Cập nhật Bác sĩ" : "Thêm Bác sĩ mới"}</h3>
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
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="phoneNumber">Số điện thoại *</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
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
                <label htmlFor="specialization">Chuyên khoa</label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-row">
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

              <div className="admin-form-group">
                <label htmlFor="doctorImage">URL Hình ảnh</label>
                <input
                  type="text"
                  id="doctorImage"
                  name="doctorImage"
                  value={formData.doctorImage}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label htmlFor="bio">Tiểu sử</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              ></textarea>
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
          ) : doctors.length === 0 ? (
            <div className="admin-no-data">Không có dữ liệu bác sĩ</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Họ tên</th>
                  <th>Chuyên khoa</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.doctorId}>
                    <td>{doctor.doctorId}</td>
                    <td>{doctor.fullName}</td>
                    <td>{doctor.specialization}</td>
                    <td>{doctor.email}</td>
                    <td>{doctor.phoneNumber}</td>
                    <td>{doctor.gender === "Male" ? "Nam" : doctor.gender === "Female" ? "Nữ" : "Khác"}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-button-secondary admin-button-small"
                          onClick={() => handleEdit(doctor)}
                        >
                          Sửa
                        </button>
                        <button
                          className="admin-button-danger admin-button-small"
                          onClick={() => handleDelete(doctor.doctorId)}
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

export default DoctorManagement;
