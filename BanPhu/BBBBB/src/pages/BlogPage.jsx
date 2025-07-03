import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const blogs = [
  {
    image: "/images/blog1.jpg",
    title: "Những điều cần biết về điều trị HIV",
    excerpt:
      "Tìm hiểu các phương pháp điều trị HIV hiện đại, hiệu quả và an toàn.",
    date: "2024-06-01",
  },
  {
    image: "/images/blog2.jpg",
    title: "Chế độ dinh dưỡng cho người nhiễm HIV",
    excerpt: "Dinh dưỡng hợp lý giúp tăng cường sức khỏe cho người nhiễm HIV.",
    date: "2024-05-20",
  },
  {
    image: "/images/blog3.jpg",
    title: "Tư vấn tâm lý cho bệnh nhân HIV",
    excerpt: "Vai trò của tư vấn tâm lý trong quá trình điều trị HIV.",
    date: "2024-05-10",
  },
];

const BlogPage = () => (
  <>
    <Header />
    <main className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
          Blog & Tin tức
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogs.map((blog, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-6 flex flex-col hover:shadow-lg transition border border-slate-100"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
              <h3 className="font-semibold text-lg text-slate-900 mb-1">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-xs mb-2">
                {new Date(blog.date).toLocaleDateString()}
              </p>
              <p className="text-slate-600 text-sm mb-4">{blog.excerpt}</p>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition">
                Đọc thêm
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default BlogPage;
