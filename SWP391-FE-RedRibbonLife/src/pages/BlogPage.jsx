import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/BlogPage.css';

const categories = [
  "Tất cả",
  "Giáo dục", 
  "Điều trị",
  "Nghiên cứu",
  "Tâm lý",
  "Sức khỏe",
  "Xã hội",
  "Chia sẻ"
];

const blogPosts = [
  {
    id: 1,
    title: "Những tiến bộ mới trong điều trị HIV năm 2024",
    excerpt: "Khám phá những phương pháp điều trị tiên tiến và thuốc mới giúp nâng cao chất lượng cuộc sống cho người nhiễm HIV. Các nghiên cứu mới cho thấy hiệu quả đáng kể...",
    category: "Nghiên cứu",
    author: "TS. Nguyễn Văn Minh",
    date: "2024-03-15",
    readTime: "5 phút đọc",
    featured: true
  },
  {
    id: 2,
    title: "Hiểu về HIV/AIDS và cách phòng ngừa hiệu quả",
    excerpt: "Tìm hiểu về HIV/AIDS, cách lây nhiễm và các biện pháp phòng ngừa hiệu quả trong cuộc sống hàng ngày...",
    category: "Giáo dục",
    author: "BS. Trần Thị Lan",
    date: "2024-03-14",
    readTime: "7 phút đọc"
  },
  {
    id: 3,
    title: "Phác đồ điều trị ARV hiện đại và an toàn",
    excerpt: "Cập nhật về các phác đồ điều trị ARV mới nhất, hiệu quả điều trị và tác dụng phụ cần lưu ý...",
    category: "Điều trị",
    author: "PGS. Lê Văn Hùng", 
    date: "2024-03-13",
    readTime: "6 phút đọc"
  },
  {
    id: 4,
    title: "Chia sẻ hành trình 10 năm sống với HIV",
    excerpt: "Câu chuyện truyền cảm hứng về việc vượt qua khó khăn và xây dựng cuộc sống tích cực cùng với HIV...",
    category: "Chia sẻ",
    author: "Anh Hoàng (Bệnh nhân)",
    date: "2024-03-12",
    readTime: "8 phút đọc"
  },
  {
    id: 5,
    title: "Hỗ trợ tâm lý cho người nhiễm HIV",
    excerpt: "Các biện pháp hỗ trợ tâm lý và xây dựng tinh thần tích cực, vượt qua căng thẳng và lo lắng...",
    category: "Tâm lý",
    author: "ThS. Phạm Thị Mai",
    date: "2024-03-11",
    readTime: "4 phút đọc"
  },
  {
    id: 6,
    title: "Chế độ dinh dưỡng cho người nhiễm HIV",
    excerpt: "Hướng dẫn về chế độ ăn uống và dinh dưỡng phù hợp để tăng cường sức đề kháng và hỗ trợ điều trị...",
    category: "Sức khỏe",
    author: "BS. Đinh Văn Tài",
    date: "2024-03-10",
    readTime: "5 phút đọc"
  },
  {
    id: 7,
    title: "Chống kỳ thị và phân biệt đối xử",
    excerpt: "Làm thế nào để giảm kỳ thị và phân biệt đối xử với người nhiễm HIV trong cộng đồng và gia đình...",
    category: "Xã hội",
    author: "TS. Nguyễn Thị Hoa",
    date: "2024-03-09",
    readTime: "6 phút đọc"
  },
  {
    id: 8,
    title: "Tầm quan trọng của việc tuân thủ điều trị",
    excerpt: "Tại sao việc uống thuốc đều đặn lại quan trọng và cách duy trì thói quen này trong cuộc sống...",
    category: "Giáo dục",
    author: "ThS. Trần Thị Lan",
    date: "2024-03-08",
    readTime: "4 phút đọc"
  }
];

const BlogStats = () => (
  <section className="blog-stats">
    <div className="blog-container">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-number">50+</div>
          <div className="stat-label">Bài viết chuyên môn</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">1000+</div>
          <div className="stat-label">Lượt đọc hàng tháng</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">20+</div>
          <div className="stat-label">Chuyên gia đóng góp</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">8</div>
          <div className="stat-label">Chủ đề chính</div>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedPost = ({ post }) => (
  <section className="featured-post">
    <div className="featured-post-content">
      <div>
        <div className="featured-badge">
          <i className="fas fa-star"></i>
          Bài viết nổi bật
        </div>
        <h2>{post.title}</h2>
        <p>{post.excerpt}</p>
        <div className="featured-meta">
          <span>
            <i className="fas fa-user-circle"></i>
            {post.author}
          </span>
          <span>
            <i className="fas fa-calendar"></i>
            {post.date}
          </span>
          <span>
            <i className="fas fa-clock"></i>
            {post.readTime}
          </span>
        </div>
        <Link to={`/blog/${post.id}`} className="featured-cta">
          <i className="fas fa-arrow-right"></i>
          Đọc ngay
        </Link>
      </div>
      <div className="featured-image">
        <i className="fas fa-newspaper"></i>
      </div>
    </div>
  </section>
);

const BlogCategories = ({ categories, selectedCategory, setSelectedCategory }) => (
  <section className="blog-categories">
    <div className="categories-container">
      <h2 className="categories-title">Lọc theo chủ đề</h2>
      <div className="category-tags">
        {categories.map(category => (
          <button
            key={category}
            className={`category-tag ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  </section>
);

const BlogGrid = ({ posts }) => (
  <section className="blog-grid">
    {posts.map(post => (
      <article key={post.id} className="blog-card">
        <div className="blog-card-image">
          <i className="fas fa-file-alt"></i>
        </div>
        <div className="blog-card-content">
          <div className="blog-category">{post.category}</div>
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
          <div className="blog-card-footer">
            <div className="blog-meta">
              <span>
                <i className="fas fa-user-circle"></i>
                {post.author}
              </span>
              <span>
                <i className="fas fa-calendar"></i>
                {post.date}
              </span>
              <span>
                <i className="fas fa-clock"></i>
                {post.readTime}
              </span>
            </div>
            <Link to={`/blog/${post.id}`} className="read-more">
              Đọc tiếp <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </article>
    ))}
  </section>
);

const Pagination = () => (
  <section className="pagination">
    <button className="pagination-btn" disabled>
      <i className="fas fa-chevron-left"></i>
    </button>
    <button className="pagination-btn active">1</button>
    <button className="pagination-btn">2</button>
    <button className="pagination-btn">3</button>
    <button className="pagination-btn">
      <i className="fas fa-chevron-right"></i>
    </button>
  </section>
);

const NewsletterSection = ({ email, setEmail, onSubmit }) => (
  <section className="newsletter-section">
    <div className="newsletter-content">
      <h2>Đăng ký nhận tin tức</h2>
      <p>Nhận những bài viết mới nhất và thông tin cập nhật về HIV/AIDS qua email</p>
      <form onSubmit={onSubmit} className="newsletter-form">
        <input
          type="email"
          placeholder="Nhập địa chỉ email của bạn"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="newsletter-input"
          required
        />
        <button type="submit" className="newsletter-btn">
          <i className="fas fa-paper-plane"></i>
          Đăng ký
        </button>
      </form>
    </div>
  </section>
);

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const featuredPost = blogPosts.find(post => post.featured);
  const otherPosts = blogPosts.filter(post => !post.featured);

  const filteredPosts = selectedCategory === "Tất cả"
    ? otherPosts
    : otherPosts.filter(post => post.category === selectedCategory);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', newsletterEmail);
    alert('Đăng ký thành công! Cảm ơn bạn đã quan tâm.');
    setNewsletterEmail("");
  };

  return (
    <div className="blog-page">
      <Header />
      <main className="blog-main">
        {/* Hero Section */}
        <section className="blog-hero">
          <div className="blog-container">
            <div className="blog-hero-content">
              <h1>Blog & Tài Liệu HIV</h1>
              <p>Thông tin y khoa chính xác, kiến thức hữu ích và những chia sẻ truyền cảm hứng về HIV/AIDS</p>
            </div>
          </div>
        </section>

        <BlogStats />

        <div className="blog-container">
          {featuredPost && <FeaturedPost post={featuredPost} />}
          <BlogCategories
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
          <BlogGrid posts={filteredPosts} />
          <Pagination />
          <NewsletterSection
            email={newsletterEmail}
            setEmail={setNewsletterEmail}
            onSubmit={handleNewsletterSubmit}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;