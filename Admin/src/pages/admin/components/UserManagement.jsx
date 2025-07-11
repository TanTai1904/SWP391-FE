import React, { useState, useEffect } from "react";
import adminService from "../../../services/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

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
    userRole: "Patient"
  });

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      if (response.data && response.data.data) {
        setUsers(response.data.data);
        setFilteredUsers(response.data.data);
      } else {
        setUsers([]);
        setFilteredUsers([]);
      }
      setError("");
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.");
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users when search term or role filter changes
  useEffect(() => {
    if (!users) return;
    
    let filtered = [...users];
    
    // Filter by role if not set to 'all'
    if (filterRole !== 'all') {
      filtered = filtered.filter(user => 
        user.userRole.toLowerCase() === filterRole.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.username?.toLowerCase().includes(term) ||
        user.fullName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phoneNumber?.toLowerCase().includes(term)
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, filterRole]);

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
      if (isEdit && currentUser) {
        // Update existing user
        const updateData = {
          ...formData,
          userId: currentUser.userId
        };
        await adminService.updateUser(updateData);
      } else {
        // Create new user
        await adminService.createUser(formData);
      }
      
      // Reset form and fetch updated data
      resetForm();
      fetchUsers();
      setError("");
    } catch (err) {
      console.error("Error saving user:", err);
      let errorMessage = "Lỗi khi lưu thông tin người dùng. Vui lòng kiểm tra lại các trường dữ liệu.";
      
      // Check for specific validation errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        if (errors.PhoneNumber && errors.PhoneNumber.length > 0) {
          errorMessage = `Lỗi: ${errors.PhoneNumber[0]}`;
        } else {
          // Get first error message
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
      address: "",
      userRole: "Patient"
    });
    setShowForm(false);
    setIsEdit(false);
    setCurrentUser(null);
  };

  // Edit user
  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      username: user.username || "",
      // Don't set password for edit
      password: "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      fullName: user.fullName || "",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : "",
      gender: user.gender || "Male",
      address: user.address || "",
      userRole: user.userRole || "Patient",
      isActive: user.isActive
    });
    setShowForm(true);
    setIsEdit(true);
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    
    setLoading(true);
    try {
      await adminService.deleteUser(userId);
      fetchUsers();
      setError("");
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("Không thể xóa người dùng. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };
  
  // Get Vietnamese role name
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'Patient':
        return 'Bệnh nhân';
      case 'Doctor':
        return 'Bác sĩ';
      case 'Admin':
        return 'Quản trị viên';
      default:
        return role;
    }
  };

  return (
    <div className="admin-module">
      <div className="admin-module-header">
        <h2>Quản lý Người dùng</h2>
        {!showForm && (
          <button
            className="admin-button-primary"
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setCurrentUser(null);
              setFormData({
                username: "",
                password: "",
                email: "",
                phoneNumber: "",
                fullName: "",
                dateOfBirth: "",
                gender: "Male",
                address: "",
                userRole: "Patient"
              });
            }}
          >
            Thêm Người dùng mới
          </button>
        )}
      </div>

      {error && <div className="admin-error-message">{error}</div>}

      {showForm ? (
        <div className="admin-form-container">
          <h3>{isEdit ? "Cập nhật Người dùng" : "Thêm Người dùng mới"}</h3>
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
                  placeholder="Định dạng: 0123456789"
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
                <label htmlFor="userRole">Vai trò *</label>
                <select
                  id="userRole"
                  name="userRole"
                  value={formData.userRole}
                  onChange={handleChange}
                  required
                >
                  <option value="Patient">Bệnh nhân</option>
                  <option value="Doctor">Bác sĩ</option>
                  <option value="Admin">Quản trị viên</option>
                </select>
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
              
              {isEdit && (
                <div className="admin-form-group">
                  <label htmlFor="isActive">Trạng thái</label>
                  <select
                    id="isActive"
                    name="isActive"
                    value={formData.isActive ? "true" : "false"}
                    onChange={(e) => setFormData({
                      ...formData, 
                      isActive: e.target.value === "true"
                    })}
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Không hoạt động</option>
                  </select>
                </div>
              )}
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
        <>
          <div className="admin-filters">
            <div className="admin-search">
              <input 
                type="text" 
                placeholder="Tìm kiếm người dùng..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filter">
              <select 
                value={filterRole} 
                onChange={(e) => setFilterRole(e.target.value)}
              >
                <option value="all">Tất cả vai trò</option>
                <option value="patient">Bệnh nhân</option>
                <option value="doctor">Bác sĩ</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
          </div>
          
          <div className="admin-table-container">
            {loading ? (
              <div className="admin-loading">Đang tải dữ liệu...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="admin-no-data">Không có dữ liệu người dùng</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên đăng nhập</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Số điện thoại</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.userId}>
                      <td>{user.userId}</td>
                      <td>{user.username}</td>
                      <td>{user.fullName}</td>
                      <td>{user.email}</td>
                      <td>{user.phoneNumber}</td>
                      <td>{getRoleDisplayName(user.userRole)}</td>
                      <td>
                        <span className={`admin-status ${user.isActive ? "active" : "inactive"}`}>
                          {user.isActive ? "Hoạt động" : "Không hoạt động"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-button-secondary admin-button-small"
                            onClick={() => handleEdit(user)}
                          >
                            Sửa
                          </button>
                          <button
                            className="admin-button-danger admin-button-small"
                            onClick={() => handleDelete(user.userId)}
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
        </>
      )}
    </div>
  );
};

export default UserManagement;
