import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_AVATAR = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg';

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Utility function to parse JWT token
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

  // Hàm chuyển đổi giới tính sang tiếng Việt
  const getGenderInVietnamese = (gender) => {
    const genderMap = {
      'Male': 'Nam',
      'Female': 'Nữ'
    };
    return genderMap[gender] || gender;
  };

  useEffect(() => {
    if (profileData && !editedData) {
      // Initialize editedData with all fields from profileData
      const baseData = {
        phoneNumber: profileData.phoneNumber || '',
        fullName: profileData.fullName || '',
        dateOfBirth: profileData.dateOfBirth?.split('T')[0] || '',
        gender: profileData.gender || '',
        address: profileData.address || '',
        email: profileData.email || ''
      };

      // Add role-specific fields
      const token = localStorage.getItem('token');
      const userRole = parseJwt(token)?.role?.toLowerCase();
      
      switch (userRole) {
        case 'doctor':
          baseData.doctorId = profileData.doctorId;
          baseData.doctorImage = profileData.doctorImage || '';
          baseData.bio = profileData.bio || '';
          break;
        case 'patient':
          baseData.patientId = profileData.patientId;
          baseData.bloodType = profileData.bloodType || '';
          baseData.isPregnant = profileData.isPregnant || false;
          baseData.specialNotes = profileData.specialNotes || '';
          break;
      }

      setEditedData(baseData);
    }
  }, [profileData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const getRoleName = () => {
    const token = localStorage.getItem('token');
    if (!token) return 'Không xác định';

    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      const role = tokenData?.role?.toLowerCase();
      
      const names = {
        'admin': 'Quản trị viên',
        'doctor': 'Bác sĩ',
        'patient': 'Bệnh nhân',
        'staff': 'Nhân viên',
        'manager': 'Quản lý'
      };

      return names[role] || 'Không xác định';
    } catch (e) {
      return 'Không xác định';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpdateSuccess(false);

    try {
      const token = localStorage.getItem('token');
      const tokenData = parseJwt(token);
      const userRole = tokenData?.role?.toLowerCase();

      if (!userRole) {
        throw new Error('Không xác định được vai trò người dùng');
      }
      
      let endpoint = `/api/${userRole}/Update`;
      
      // Format date properly
      const formattedDate = editedData.dateOfBirth ? new Date(editedData.dateOfBirth).toISOString().split('T')[0] : null;
      
      // Base update data
      let updateData = {
        userId: parseInt(user.userId),
        username: profileData.username,
        phoneNumber: editedData.phoneNumber,
        fullName: editedData.fullName,
        dateOfBirth: formattedDate,
        gender: editedData.gender,
        address: editedData.address,
        isActive: true
      };

      // Chỉ thêm email vào request nếu nó khác với email hiện tại
      if (editedData.email !== profileData.email) {
        updateData.email = editedData.email;
      }

      // Add role-specific IDs
      switch (userRole) {
        case 'doctor':
          updateData.doctorId = user.doctorId;
          updateData.doctorImage = profileData.doctorImage || '';
          updateData.bio = profileData.bio || '';
          break;
        case 'patient':
          updateData.patientId = user.patientId;
          updateData.bloodType = profileData.bloodType || '';
          updateData.isPregnant = profileData.isPregnant || false;
          updateData.specialNotes = profileData.specialNotes || '';
          break;
      }

      console.log('Update Data to be sent:', updateData);

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      const responseData = await response.json();
      console.log('API Response:', responseData);

      if (!response.ok) {
        throw new Error(responseData.message || responseData.errors?.[0] || 'Cập nhật thông tin thất bại');
      }

      if (responseData.data) {
        // Cập nhật state với dữ liệu từ server
        setProfileData(responseData.data);
        setEditedData(responseData.data);
        
        // Cập nhật thông tin user trong AuthContext
        updateUserInfo({
          ...user,
          fullName: responseData.data.fullName,
          phoneNumber: responseData.data.phoneNumber,
          email: responseData.data.email,
          gender: responseData.data.gender,
          address: responseData.data.address,
          dateOfBirth: responseData.data.dateOfBirth
        });
        
        setUpdateSuccess(true);
        setIsEditing(false);
      } else {
        throw new Error('Không có dữ liệu trả về từ server');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) {
        setError('Không tìm thấy thông tin người dùng');
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Phiên đăng nhập đã hết hạn');
          setLoading(false);
          return;
        }

        // Parse JWT token để lấy thông tin role
        const tokenData = parseJwt(token);
        const userRole = tokenData?.role?.toLowerCase();

        if (!userRole) {
          setError('Không xác định được vai trò người dùng');
          setLoading(false);
          return;
        }

        const roleEndpoints = {
          'admin': 'Admin',
          'doctor': 'Doctor',
          'patient': 'Patient',
          'staff': 'Staff',
          'manager': 'Manager'
        };

        // Xác định ID phù hợp cho từng role
        let endpointId;
        switch (userRole) {
          case 'doctor':
            endpointId = user.doctorId;
            break;
          case 'patient':
            endpointId = user.patientId;
            break;
          default:
            // Với admin, staff, manager sử dụng userId
            endpointId = user.userId;
        }

        const endpoint = `/api/${roleEndpoints[userRole]}/GetByID/${endpointId}`;

        const response = await fetch(`http://localhost:8080${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          setError('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error(`Lỗi khi tải dữ liệu: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data || !data.data) {
          throw new Error('Không có dữ liệu trả về từ server');
        }
        
        setProfileData(data.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải thông tin');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-lg max-w-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-lg">Không có dữ liệu</div>
      </div>
    );
  }

  const renderUpdateForm = () => {
    const userRole = parseJwt(localStorage.getItem('token'))?.role?.toLowerCase();

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              name="fullName"
              value={editedData?.fullName || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={editedData?.email || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={editedData?.phoneNumber || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ngày sinh</label>
            <input
              type="date"
              name="dateOfBirth"
              value={editedData?.dateOfBirth || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Giới tính</label>
            <select
              name="gender"
              value={editedData?.gender || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            >
              <option value="">Chọn giới tính</option>
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={editedData?.address || ''}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-8 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-white">
                  <img
                    src={profileData.avatar || DEFAULT_AVATAR}
                    alt={profileData.fullName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_AVATAR;
                    }}
                  />
                </div>
                <div className="ml-6">
                  <h1 className="text-3xl font-bold text-white">{profileData.username}</h1>
                  <div className="flex items-center mt-2">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-white bg-opacity-20 text-white">
                      {getRoleName()}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-8 py-6">
            {updateSuccess && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">
                      Cập nhật thông tin thành công!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {isEditing ? renderUpdateForm() : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Existing profile display code */}
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Thông tin cơ bản</h2>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                      <p className="text-base text-gray-900">{profileData.fullName}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                      <p className="text-base text-gray-900">{profileData.phoneNumber}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                      <p className="text-base text-gray-900">{new Date(profileData.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Giới tính</p>
                      <p className="text-base text-gray-900">{getGenderInVietnamese(profileData.gender)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Thông tin liên hệ</h2>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-base text-gray-900">{profileData.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                      <p className="text-base text-gray-900">{profileData.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;