import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const CreateCategory = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    categoryName: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        navigate('/login');
        return;
      }

      const response = await axios.post(`${API_URL}/api/Category/Create`, 
        {
          categoryName: formData.categoryName,
          isActive: true
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        navigate('/categories');
        toast.success('Tạo danh mục thành công');
      } else {
        setError('Có lỗi xảy ra khi tạo danh mục. Vui lòng thử lại.');
        toast.error('Có lỗi xảy ra khi tạo danh mục. Vui lòng thử lại.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
        } else {
          setError('Có lỗi xảy ra khi tạo danh mục. Vui lòng thử lại.');
        }
      } else {
        setError('Có lỗi xảy ra khi tạo danh mục. Vui lòng thử lại.');
      }
      console.error('Error creating category:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Tạo danh mục mới</h1>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Tên danh mục
                </label>
                <input
                  type="text"
                  value={formData.categoryName}
                  onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nhập tên danh mục..."
                  required
                />
                <p className="mt-2 text-sm text-gray-500">
                  Tên danh mục nên ngắn gọn và dễ hiểu
                </p>
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/category-manager')}
                  className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  <FiX className="mr-2" />
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Lưu danh mục
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              Hướng dẫn tạo danh mục
            </h2>
            <ul className="space-y-2 text-blue-700">
              <li>• Đặt tên danh mục ngắn gọn, súc tích</li>
              <li>• Tránh sử dụng các ký tự đặc biệt</li>
              <li>• Đảm bảo tên danh mục dễ hiểu với người dùng</li>
              <li>• Kiểm tra không trùng với các danh mục đã có</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
