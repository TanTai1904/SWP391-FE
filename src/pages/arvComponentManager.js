import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ARVComponentManager = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/ARVComponents/GetAll', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        // Lọc chỉ lấy các component có isActive = true
        const activeComponents = response.data.data.filter(comp => comp.isActive);
        setComponents(activeComponents);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ARV components:', error);
      toast.error('Không thể tải danh sách thuốc ARV');
      setLoading(false);
    }
  };

  const handleDelete = async (component) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thành phần này?')) {
      try {
        const token = localStorage.getItem('token');
        const updateData = {
          ...component,
          isActive: false
        };

        const response = await axios.put(
          `http://localhost:8080/api/ARVComponents/Update`,
          updateData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status) {
          toast.success('Xóa thành phần thành công');
          fetchComponents(); // Tải lại danh sách sau khi vô hiệu hóa
        } else {
          toast.error('Không thể vô hiệu hóa thành phần');
        }
      } catch (error) {
        console.error('Error deactivating ARV component:', error);
        toast.error('Không thể vô hiệu hóa thành phần');
      }
    }
  };

  const filteredComponents = components.filter(component =>
    component.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Quản Lý Thành phần</h1>
            <p className="mt-2 text-gray-600">Danh sách các thành phần thuốc ARV đang hoạt động trong hệ thống</p>
          </div>

          {/* Search and Add Button */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Tìm kiếm theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => navigate(`/ARVcomponents/create`)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaPlus className="mr-2" />
              Thêm Thành phần
            </button>
          </div>

          {/* Components Table */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Thuốc</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center">
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      </td>
                    </tr>
                  ) : filteredComponents.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                        Không tìm thấy dữ liệu
                      </td>
                    </tr>
                  ) : (
                    filteredComponents.map((component) => (
                      <tr key={component.componentId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {component.componentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {component.componentName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {component.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => navigate(`/ARVcomponents/update/${component.componentId}`)}
                              className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                              title="Chỉnh sửa"
                            >
                              <FiEdit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(component)}
                              className="flex items-center text-red-600 hover:text-red-900 transition-colors duration-200"
                              title="Vô hiệu hóa"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ARVComponentManager;
