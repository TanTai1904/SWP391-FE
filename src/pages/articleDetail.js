import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ArticleDetail = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8080/api/Article/GetByID/${id}`);
        if (response.data.status) {
          setArticle(response.data.data);
        } else {
          setError('Không thể tải bài viết');
        }
      } catch (err) {
        setError('Đã xảy ra lỗi khi tải bài viết');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center text-red-600">
            <p className="text-xl">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <div className="text-center text-gray-600">
            <p className="text-xl">Không tìm thấy bài viết</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <article className="max-w-3xl mx-auto bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{article.title}</h1>
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4">
                <span>Tác giả: {article.authorName}</span>
                <span>Danh mục: {article.categoryName}</span>
              </div>
            </div>
            {article.isActive && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Đang hoạt động
              </span>
            )}
          </div>
          
          <div className="prose prose-red max-w-none">
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {article.content}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
