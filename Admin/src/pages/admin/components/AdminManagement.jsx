import React, { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    fullName: "",
    dateOfBirth: "",
    gender: "Male",
    address: ""
  });

  // Fetch all admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllAdmins();
      if (response.data && response.data.data) {
        setAdmins(response.data.data);
      } else {
        setAdmins([]);
      }
      setError("");
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Không thể tải danh sách admin. Vui lòng thử lại sau.");
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validate phone number format (Vietnam)
  const validatePhoneNumber = (phone) => {
    // Vietnamese phone number pattern: starts with 0, followed by 9 digits
    const phonePattern = /^0\d{9}$/;
    return phonePattern.test(phone);
  };

  // Validate form before submission
  const validateForm = () => {
    // Validate phone number
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError("Số điện thoại không hợp lệ. Số điện thoại phải có 10 chữ số và bắt đầu bằng số 0.");
      return false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError("Địa chỉ email không hợp lệ.");
      return false;
    }

    // Validate password for new admin
    if (!isEdit && formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return false;
    }
    
    // All validations passed
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form first
    if (!validateForm()) {
      return;
    }
    
    setError("");
    setLoading(true);
    try {
      if (isEdit && currentAdmin) {
        // Update existing admin
        const updateData = {
          ...formData,
          userId: currentAdmin.userId
        };
        await adminService.updateAdmin(updateData);
      } else {
        // Create new admin
        await adminService.createAdmin(formData);
      }
      
      // Reset form and fetch updated data
      resetForm();
      fetchAdmins();
      setError("");
      setSuccess(isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("Error saving admin:", err);
      
      let errorMessage = "Lỗi khi lưu thông tin admin. Vui lòng kiểm tra lại các trường dữ liệu.";
      
      // Check for specific validation errors from API
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.PhoneNumber && errors.PhoneNumber.length > 0) {
          errorMessage = `Lỗi: ${errors.PhoneNumber[0]}`;
        } else {
          // Get first error message from any field
          const firstErrorKey = Object.keys(errors)[0];
          if (firstErrorKey && errors[firstErrorKey].length > 0) {
            errorMessage = `Lỗi: ${errors[firstErrorKey][0]}`;
          }
        }
      }
      
      setError(errorMessage);
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
      address: ""
    });
    setShowForm(false);
    setIsEdit(false);
    setCurrentAdmin(null);
    setSuccess("");
  };

  // Edit admin
  const handleEdit = (admin) => {
    setCurrentAdmin(admin);
    setFormData({
      username: admin.username || "",
      // Don't set password for edit
      password: "",
      email: admin.email || "",
      phoneNumber: admin.phoneNumber || "",
      fullName: admin.fullName || "",
      dateOfBirth: admin.dateOfBirth || "",
      gender: admin.gender || "Male",
      address: admin.address || ""
    });
    setShowForm(true);
    setIsEdit(true);
  };

  // Delete admin
  const handleDelete = async (adminId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa admin này?")) return;
    
    setLoading(true);
    try {
      await adminService.deleteAdmin(adminId);
      fetchAdmins();
      setError("");
    } catch (err) {
      console.error("Error deleting admin:", err);
      setError("Không thể xóa admin. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <h2>Quản lý Admin</h2>
        <div className="admin-header-actions">
          <button
            className="admin-button-secondary"
            onClick={() => fetchAdmins()}
            disabled={loading}
            title="Làm mới dữ liệu"
          >
            {loading ? "Đang tải..." : "Làm mới"}
          </button>
          {!showForm && (
            <button
              className="admin-button-primary"
              onClick={() => {
                setShowForm(true);
                setIsEdit(false);
                setCurrentAdmin(null);
                setFormData({
                  username: "",
                  password: "",
                  email: "",
                  phoneNumber: "",
                  fullName: "",
                  dateOfBirth: "",
                  gender: "Male",
                  address: ""
                });
              }}
            >
              Thêm Admin mới
            </button>
          )}
        </div>
      </div>

      {error && <div className="admin-error-message">{error}</div>}
      {success && <div className="admin-success-message">{success}</div>}

      {showForm ? (
        <div className="admin-form-container">
          <h3>{isEdit ? "Cập nhật Admin" : "Thêm Admin mới"}</h3>
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
                  className={!formData.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? "" : "admin-input-error"}
                  placeholder="example@domain.com"
                  required
                />
                {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                  <div className="admin-form-error">
                    Email không hợp lệ
                  </div>
                )}
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
                  className={!formData.phoneNumber || validatePhoneNumber(formData.phoneNumber) ? "" : "admin-input-error"}
                  placeholder="VD: 0987654321"
                  required
                />
                {formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber) && (
                  <div className="admin-form-error">
                    Số điện thoại không hợp lệ. Phải có 10 chữ số và bắt đầu bằng số 0.
                  </div>
                )}
                <div className="admin-form-hint">
                  Định dạng: 10 chữ số, bắt đầu bằng số 0
                </div>
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
                <label htmlFor="address">Địa chỉ</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
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
          ) : admins.length === 0 ? (
            <div className="admin-no-data">Không có dữ liệu admin</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tên đăng nhập</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Giới tính</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.userId}>
                    <td>{admin.userId}</td>
                    <td>{admin.username}</td>
                    <td>{admin.fullName}</td>
                    <td>{admin.email}</td>
                    <td>{admin.phoneNumber}</td>
                    <td>{admin.gender === "Male" ? "Nam" : admin.gender === "Female" ? "Nữ" : "Khác"}</td>
                    <td>
                      <span className={`admin-status ${admin.isActive ? "active" : "inactive"}`}>
                        {admin.isActive ? "Hoạt động" : "Không hoạt động"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-button-secondary admin-button-small"
                          onClick={() => handleEdit(admin)}
                        >
                          Sửa
                        </button>
                        <button
                          className="admin-button-danger admin-button-small"
                          onClick={() => handleDelete(admin.userId)}
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

export default AdminManagement;
