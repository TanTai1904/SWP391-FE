import React from 'react';
import { useParams } from 'react-router-dom';
import ArticleList from '../components/HomePage/ArticleList';

const CategoryPage = ({ articles, categories }) => {
  const { id } = useParams();
  const categoryId = parseInt(id);
  
  const category = categories.find(cat => cat.category_id === categoryId);
  const filteredArticles = articles.filter(article => article.category_id === categoryId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {category ? category.category_name : 'Danh mục không tồn tại'}
      </h1>
      
      <ArticleList 
        articles={filteredArticles}
        categories={categories}
      />
    </div>
  );
};

export default CategoryPage; 