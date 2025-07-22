import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSave, FiX } from 'react-icons/fi';

const UpdateManager = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    username: '',
    email: '',
    phoneNumber: '',
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    address: '',
    isActive: true
  });
  const API_URL = process.env.REACT_APP_API_URL;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchManagerData();
  }, [id]);

  const fetchManagerData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/Manager/GetByID/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        const managerData = response.data.data;
        // Format date to YYYY-MM-DD for input type="date"
        const formattedDate = managerData.dateOfBirth.split('T')[0];
        const formattedData = {
          ...managerData,
          dateOfBirth: formattedDate
        };
        setOriginalData(formattedData);
        setFormData(formattedData);
      } else {
        toast.error('Không thể tải thông tin quản lý');
        navigate('/manager-management');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        toast.error('Đã xảy ra lỗi khi tải thông tin quản lý');
      }
      navigate('/manager-management');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Tên đăng nhập không được để trống';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    } else if (formData.email.trim() === originalData?.email && Object.keys(formData).every(key => 
      key === 'email' || formData[key] === originalData[key]
    )) {
      newErrors.email = 'Vui lòng thay đổi ít nhất một thông tin để cập nhật';
    }

    // Validate phone number
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 10 chữ số';
    }

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống';
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Ngày sinh không được để trống';
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Địa chỉ không được để trống';
    }

    // Kiểm tra xem có sự thay đổi nào không
    const hasChanges = Object.keys(formData).some(key => 
      originalData && formData[key] !== originalData[key]
    );

    if (!hasChanges) {
      toast.info('Vui lòng thay đổi ít nhất một thông tin để cập nhật');
      return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      
      // Format date properly
      const formattedDate = formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : null;

      // Create update data object with all required fields
      const updateData = {
        userId: parseInt(formData.userId),
        username: formData.username.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        fullName: formData.fullName.trim(),
        dateOfBirth: formattedDate,
        gender: formData.gender,
        address: formData.address.trim(),
        isActive: formData.isActive
      };

      console.log('Sending update data:', updateData); // For debugging

      const response = await axios.put(
        `${API_URL}/api/Manager/Update`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật thông tin thành công');
        navigate('/manager-management');
      } else {
        // Xử lý thông báo lỗi từ backend
        const errorMessage = response.data.errors?.[0] || response.data.message;
        let vietnameseError = errorMessage;
        
        // Chuyển đổi các thông báo lỗi từ tiếng Anh sang tiếng Việt
        if (errorMessage.includes('You are entering the exact email in your account')) {
          vietnameseError = 'Email mới không được trùng với email hiện tại';
        } else if (errorMessage.includes('Email already exists')) {
          vietnameseError = 'Email này đã được sử dụng bởi tài khoản khác';
        } else if (errorMessage.includes('Invalid email format')) {
          vietnameseError = 'Định dạng email không hợp lệ';
        }
        // Thêm các trường hợp lỗi khác nếu cần

        toast.error(vietnameseError || 'Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Error updating manager:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else if (error.response?.data?.errors) {
        // Xử lý thông báo lỗi từ backend
        const errorMessage = error.response.data.errors[0];
        let vietnameseError = errorMessage;
        
        // Chuyển đổi các thông báo lỗi từ tiếng Anh sang tiếng Việt
        if (errorMessage.includes('You are entering the exact email in your account')) {
          vietnameseError = 'Email mới không được trùng với email hiện tại';
        } else if (errorMessage.includes('Email already exists')) {
          vietnameseError = 'Email này đã được sử dụng bởi tài khoản khác';
        } else if (errorMessage.includes('Invalid email format')) {
          vietnameseError = 'Định dạng email không hợp lệ';
        }
        // Thêm các trường hợp lỗi khác nếu cần

        toast.error(vietnameseError);
      } else {
        toast.error('Đã xảy ra lỗi khi cập nhật thông tin');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Cập nhật Thông tin Quản lý</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username field removed from form but kept in formData */}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày sinh
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Giới tính
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
              </select>
            </div>
          </div>

          {/* Address - Full width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/manager-management')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FiX className="mr-2" />
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <FiSave className="mr-2" />
              {isSubmitting ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateManager;
