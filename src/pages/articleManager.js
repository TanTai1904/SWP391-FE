import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiCheck, FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const ArticleManager = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/api/Article/GetAll', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        setArticles(response.data.data);
      } else {
        toast.error('Có lỗi khi tải danh sách bài viết');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        toast.error('Có lỗi khi tải danh sách bài viết');
      }
      setError('Có lỗi xảy ra khi tải danh sách bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8080/api/Article/Delete/${articleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Xóa bài viết thành công');
        fetchArticles();
      } catch (error) {
        toast.error('Có lỗi khi xóa bài viết');
      }
    }
  };

  const toggleStatus = async (article) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:8080/api/Article/Update`,
        {
          ...article,
          isActive: !article.isActive
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      toast.success(`${article.isActive ? 'Ẩn' : 'Hiện'} bài viết thành công`);
      fetchArticles();
    } catch (error) {
      toast.error('Có lỗi khi cập nhật trạng thái bài viết');
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8" style={{ width: '90%', margin: '0 auto' }}>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý bài viết
          </h1>
          <button
            onClick={() => navigate('/articles/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Tạo bài viết mới
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl" style={{ width: '90%', margin: '0 auto' , marginTop: '20px'}}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tiêu đề</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Danh mục</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tác giả</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày tạo</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.articleId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.articleId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {truncateText(article.title, 50)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.categoryName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {article.authorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {moment(article.createDate).format('DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          article.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {article.isActive ? 'Hiện' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/articles/${article.articleId}`)}
                          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
                          title="Xem chi tiết"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => navigate(`/articles/update/${article.articleId}`)}
                          className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => toggleStatus(article)}
                          className={`flex items-center transition-colors duration-200 ${
                            article.isActive
                              ? 'text-red-600 hover:text-red-900'
                              : 'text-green-600 hover:text-green-900'
                          }`}
                          title={article.isActive ? 'Ẩn bài viết' : 'Hiện bài viết'}
                        >
                          {article.isActive ? (
                            <FiX className="w-5 h-5" />
                          ) : (
                            <FiCheck className="w-5 h-5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(article.articleId)}
                          className="flex items-center text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Xóa"
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
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleManager;
