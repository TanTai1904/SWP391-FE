import React from 'react';
import { format } from 'date-fns';

const ArticleList = ({ articles, categories }) => {
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : '';
  };

  if (!articles || articles.length === 0) {
    return (
      <div className="article-list">
        <h2 className="text-3xl font-bold mb-8 text-center">Bài viết mới nhất</h2>
        <div className="text-gray-500 text-center">Chưa có bài viết nào.</div>
      </div>
    );
  }

  return (
    <div className="article-list">
      <h2 className="text-3xl font-bold mb-8 text-center">Bài viết mới nhất</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <div 
            key={article.articleId}
            className="transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
          >
            <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow h-full flex flex-col">
              <div className="p-6 flex flex-col flex-grow">
                {/* Category Tag */}
                <div className="flex items-center mb-4">
                  <span className="inline-block bg-red-100 text-red-600 text-sm font-medium px-3 py-1 rounded-full">
                    {getCategoryName(article.categoryId)}
                  </span>
                  <span className="text-gray-500 text-sm ml-auto">
                    {format(new Date(article.createdDate), 'dd/MM/yyyy')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 flex-grow">
                  {article.title}
                </h3>

                {/* Preview Text */}
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.content}
                </p>
              </div>
            </article>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList; 