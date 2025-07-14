import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateArticle = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get article ID from URL
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    articleId: 0,
    title: '',
    content: '',
    categoryId: '',
    isActive: true,
    userId: 0
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      
      if (!token || !userDetails) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Fetch article details
        const articleResponse = await axios.get(`http://localhost:8080/api/Article/GetByID/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (articleResponse.data.status && articleResponse.data.data) {
          const articleData = articleResponse.data.data;
          setFormData({
            articleId: articleData.articleId,
            title: articleData.title,
            content: articleData.content,
            categoryId: articleData.categoryId,
            isActive: articleData.isActive,
            userId: articleData.userId
          });
        } else {
          toast.error('Không tìm thấy bài viết');
          navigate('/articles-management', { replace: true });
        }

        // Fetch categories
        const categoryResponse = await axios.get('http://localhost:8080/api/Category/GetAll', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (categoryResponse.data.status) {
          setCategories(categoryResponse.data.data);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userDetails');
          navigate('/login', { replace: true });
        } else {
          toast.error('Đã xảy ra lỗi khi tải dữ liệu');
        }
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      
      if (!token || !userDetails) {
        navigate('/login', { replace: true });
        return;
      }

      const response = await axios.put('http://localhost:8080/api/Article/Update',
        {
          ...formData,
          categoryId: parseInt(formData.categoryId),
          userId: parseInt(formData.userId),
          articleId: parseInt(id)
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật bài viết thành công');
        navigate('/articles-management', { replace: true });
      } else {
        setError(response.data.message || 'Không thể cập nhật bài viết');
        toast.error('Không thể cập nhật bài viết');
      }
    } catch (err) {
      console.error('Error updating article:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { replace: true });
      } else {
        setError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật bài viết');
        toast.error('Đã xảy ra lỗi khi cập nhật bài viết');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Cập nhật bài viết</h1>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nhập tiêu đề bài viết"
                />
              </div>

              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(category => (
                    <option key={category.categoryId} value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                  Nội dung
                </label>
                <textarea
                  id="content"
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  rows="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Nhập nội dung bài viết"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Kích hoạt bài viết
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/articles-management')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateArticle;
