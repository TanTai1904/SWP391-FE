import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';

const UpdateCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL
  const [formData, setFormData] = useState({
    categoryId: '',
    categoryName: '',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategoryDetails();
  }, [id]);

  const fetchCategoryDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/Category/GetById/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        setFormData({
          categoryId: response.data.data.categoryId,
          categoryName: response.data.data.categoryName,
          isActive: response.data.data.isActive
        });
      } else {
        toast.error('Không tìm thấy thông tin danh mục');
        navigate('/categories');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        toast.error('Có lỗi khi tải thông tin danh mục');
      }
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Bạn cần đăng nhập để thực hiện thao tác này');
        navigate('/login');
        return;
      }

      const response = await axios.put('http://localhost:8080/api/Category/Update', 
        {
          categoryId: formData.categoryId,
          categoryName: formData.categoryName,
          isActive: formData.isActive
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật danh mục thành công');
        navigate('/categories');
      } else {
        setError('Có lỗi xảy ra khi cập nhật danh mục');
        toast.error('Có lỗi xảy ra khi cập nhật danh mục');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          navigate('/login');
        } else {
          setError('Có lỗi xảy ra khi cập nhật danh mục');
        }
      } else {
        setError('Có lỗi xảy ra khi cập nhật danh mục');
      }
      console.error('Error updating category:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Cập nhật danh mục</h1>
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
                  onClick={() => navigate('/categories')}
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
                      Lưu thay đổi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-4">
              Lưu ý khi cập nhật danh mục
            </h2>
            <ul className="space-y-2 text-blue-700">
              <li>• Kiểm tra kỹ thông tin trước khi lưu thay đổi</li>
              <li>• Đảm bảo tên mới không trùng với danh mục khác</li>
              <li>• Thay đổi sẽ ảnh hưởng đến tất cả bài viết trong danh mục này</li>
              <li>• Không sử dụng các ký tự đặc biệt trong tên danh mục</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;
