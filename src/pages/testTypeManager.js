import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TestTypeManager = () => {
  const [testTypes, setTestTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestTypes();
  }, []);

  const fetchTestTypes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/TestType/GetAll', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        // Chỉ lấy các test type có isActive = true
        const activeTestTypes = response.data.data.filter(type => type.isActive);
        setTestTypes(activeTestTypes);
      } else {
        toast.error('Không thể tải danh sách loại xét nghiệm');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        // Redirect to login page or handle token expiration
      } else {
        toast.error('Đã xảy ra lỗi khi tải danh sách loại xét nghiệm');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (testType) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại xét nghiệm này?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.put(
          'http://localhost:8080/api/TestType/Update',
          {
            ...testType,
            isActive: false
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status) {
          toast.success('Xóa loại xét nghiệm thành công');
          fetchTestTypes(); // Refresh danh sách
        } else {
          toast.error('Không thể xóa loại xét nghiệm');
        }
      } catch (error) {
        console.error('Error deactivating test type:', error);
        if (error.response?.status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        } else {
          toast.error('Đã xảy ra lỗi khi vô hiệu hóa loại xét nghiệm');
        }
      }
    }
  };

  const filteredTestTypes = testTypes.filter(testType =>
    testType.testTypeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testType.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    testType.normalRange.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800" style={{ marginLeft: '70px' }}>Quản lý Loại Xét nghiệm</h1>
        <button
          onClick={() => navigate('/test-types/create')}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          style={{ marginRight: '70px' }}
        >
          <FiPlus className="mr-2" />
          Thêm loại xét nghiệm
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-6" style={{ width: '90%', margin: '0 auto' }}>
        <input
          type="text"
          placeholder="Tìm kiếm loại xét nghiệm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Xét nghiệm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá trị Bình thường</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTestTypes.map((testType) => (
                <tr key={testType.testTypeId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testType.testTypeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testType.testTypeName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testType.unit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testType.normalRange}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => navigate(`/test-types/update/${testType.testTypeId}`)}
                        className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeactivate(testType)}
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

export default TestTypeManager;
