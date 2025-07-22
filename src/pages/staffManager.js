import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const StaffManager = () => {
  const [staffs, setStaffs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchStaffs();
  }, []);

  const fetchStaffs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/Staff/GetAll`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        setStaffs(response.data.data);
      } else {
        toast.error('Không thể tải danh sách nhân viên');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Đã xảy ra lỗi khi tải danh sách nhân viên');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (staff) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa nhân viên ${staff.fullName}?`)) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem('token');
        const updateData = {
          userId: staff.userId,
          isActive: false
        };

        const response = await axios.put(
          `${API_URL}/api/Staff/Update`,
          updateData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status) {
          toast.success(`Đã xóa thành công nhân viên ${staff.fullName}`);
          // Cập nhật state để không cần gọi API lại
          setStaffs(prevStaffs => 
            prevStaffs.map(s => 
              s.userId === staff.userId ? { ...s, isActive: false } : s
            )
          );
        } else {
          const errorMessage = response.data.errors?.[0] || response.data.message;
          toast.error(errorMessage || `Không xóa được nhân viên ${staff.fullName}`);
        }
      } catch (error) {
        console.error('Error deactivating staff:', error);
        if (error.response?.status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
          navigate('/login');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error(`Đã xảy ra lỗi khi xóa nhân viên ${staff.fullName}`);
        }
      } finally {
        setIsDeleting(false);
      }
    }
  };

  // Lọc staffs chỉ hiển thị active và theo tìm kiếm
  const filteredStaffs = staffs.filter(staff => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      staff.fullName?.toLowerCase().includes(searchString) ||
      staff.username?.toLowerCase().includes(searchString) ||
      staff.email?.toLowerCase().includes(searchString) ||
      staff.phoneNumber?.includes(searchString);

    return matchesSearch && staff.isActive;
  });

  return (
    <div className="container mx-auto px-4 py-8" style={{ width: '86%', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800" style={{ marginLeft: '70px' }}>Quản lý Nhân viên</h1>
        <div className="flex items-center space-x-4" style={{ marginRight: '70px' }}>
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          
          <button
            onClick={() => navigate('/staffs/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Thêm nhân viên
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto" style={{ width: '90%', margin: '0 auto' }}>
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và Tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Địa chỉ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaffs.map((staff) => (
                <tr key={staff.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staff.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/staffs/update/${staff.userId}`)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(staff)}
                        disabled={isDeleting}
                        className={`flex items-center text-red-600 hover:text-red-900 transition-colors duration-200 ${
                          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Vô hiệu hóa"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStaffs.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy nhân viên nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffManager;
