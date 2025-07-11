import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const blogPosts = [
  {
    id: 1,
    title: "Hiểu về HIV/AIDS và cách phòng ngừa",
    excerpt: "Tìm hiểu về HIV/AIDS, cách lây nhiễm và các biện pháp phòng ngừa hiệu quả...",
    category: "Giáo dục",
    date: "2024-03-15"
  },
  {
    id: 2,
    title: "Phác đồ điều trị ARV hiện đại",
    excerpt: "Cập nhật về các phác đồ điều trị ARV mới nhất và hiệu quả điều trị...",
    category: "Điều trị",
    date: "2024-03-14"
  },
  {
    id: 3,
    title: "Chống kỳ thị và phân biệt đối xử",
    excerpt: "Làm thế nào để giảm kỳ thị và phân biệt đối xử với người nhiễm HIV...",
    category: "Xã hội",
    date: "2024-03-13"
  },
  {
    id: 4,
    title: "Hỗ trợ tâm lý cho người nhiễm HIV",
    excerpt: "Các biện pháp hỗ trợ tâm lý và xây dựng tinh thần tích cực...",
    category: "Tâm lý",
    date: "2024-03-12"
  },
  {
    id: 5,
    title: "Chế độ dinh dưỡng cho người nhiễm HIV",
    excerpt: "Hướng dẫn về chế độ ăn uống và dinh dưỡng phù hợp...",
    category: "Sức khỏe",
    date: "2024-03-11"
  }
];

const BlogPage = () => {
  return (
    <>
      <Header />
      <main className="blog-page">
        <div className="container">
          <section className="blog-header">
            <h1>Blog & Tài Liệu</h1>
            <p>Thông tin, kiến thức và chia sẻ về HIV/AIDS</p>
          </section>

          <section className="blog-categories">
            <h2>Chủ đề</h2>
            <div className="category-tags">
              <span className="category-tag">Tất cả</span>
              <span className="category-tag">Giáo dục</span>
              <span className="category-tag">Điều trị</span>
              <span className="category-tag">Xã hội</span>
              <span className="category-tag">Tâm lý</span>
              <span className="category-tag">Sức khỏe</span>
            </div>
          </section>

          <section className="blog-grid">
            {blogPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-card-content">
                  <span className="blog-category">{post.category}</span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <span className="blog-date">{post.date}</span>
                    <Link to={`/blog/${post.id}`} className="read-more">
                      Đọc thêm
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BlogPage; 