import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CategoryList from '../components/HomePage/CategoryList';
import ArticleList from '../components/HomePage/ArticleList';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, articlesResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/Category/GetAll'),
          axios.get('http://localhost:8080/api/Article/GetAll')
        ]);

        const categoriesData = categoriesResponse.data?.data || [];
        const articlesData = articlesResponse.data?.data || [];

        // Filter out inactive articles
        const activeArticles = Array.isArray(articlesData) 
          ? articlesData.filter(article => article.isActive === true)
          : [];

        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        setArticles(activeArticles);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Có lỗi xảy ra khi tải dữ liệu');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-red-600 text-white">
        <div className="container mx-auto px-4 py-20 text-center mt-12">
          <h1 className="text-5xl font-bold mb-8">
            Red Ribbon Life
          </h1>
          <p className="text-xl mb-12">
            Đồng hành cùng bạn trong hành trình chăm sóc sức khỏe và điều trị HIV/AIDS
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              to="/#" 
              className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition duration-300"
            >
              Tìm hiểu thêm
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt lịch dễ dàng</h3>
              <p className="text-gray-600">Đặt lịch hẹn trực tuyến nhanh chóng và thuận tiện</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bác sĩ chuyên môn</h3>
              <p className="text-gray-600">Đội ngũ bác sĩ giàu kinh nghiệm và tận tâm</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Kiến thức y tế</h3>
              <p className="text-gray-600">Cập nhật thông tin và kiến thức về HIV/AIDS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <CategoryList categories={categories} />
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ArticleList articles={articles} categories={categories} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Bạn cần hỗ trợ?</h2>
          <p className="text-xl mb-8">Đội ngũ bác sĩ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
          <Link
            to="/contact"
            className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
          >
            Liên hệ ngay
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 