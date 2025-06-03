import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ManagerPage = () => {
  const [managers, setManagers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/Manager/GetAll`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        // Lưu tất cả managers
        setManagers(response.data.data);
      } else {
        toast.error('Không thể tải danh sách quản lý');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else {
        toast.error('Đã xảy ra lỗi khi tải danh sách quản lý');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (manager) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa tài khoản quản lý này?')) {
      try {
        const token = localStorage.getItem('token');
        // Chỉ gửi 2 trường cần thiết theo API
        const updateData = {
          isActive: false,
          userId: manager.userId
        };

        console.log('Sending update data:', updateData); // Log để debug

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
          toast.success('Xóa tài khoản thành công');
          fetchManagers(); // Tải lại danh sách sau khi vô hiệu hóa
        } else {
          toast.error(response.data.message || 'Không thể vô hiệu hóa tài khoản');
        }
      } catch (error) {
        console.error('Error deactivating manager:', error);
        if (error.response?.status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
          navigate('/login');
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error('Đã xảy ra lỗi khi vô hiệu hóa tài khoản');
        }
      }
    }
  };

  // Lọc managers chỉ hiển thị active và theo tìm kiếm
  const filteredManagers = managers.filter(manager => {
    const matchesSearch = 
      manager.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch && manager.isActive;
  });

  return (
    <div className="container mx-auto px-4 py-8" style={{ width: '86%', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800" style={{ marginLeft: '70px' }}>Quản lý Tài khoản</h1>
        <button
          onClick={() => navigate('/managers/create')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          style={{ marginRight: '70px' }}
        >
          <FiPlus className="mr-2" />
          Thêm tài khoản quản lý
        </button>
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
              {filteredManagers.map((manager) => (
                <tr key={manager.userId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.userId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{manager.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/managers/update/${manager.userId}`)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(manager)}
                        className="flex items-center text-red-600 hover:text-red-900 transition-colors duration-200"
                        title="Vô hiệu hóa"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManagerPage;
