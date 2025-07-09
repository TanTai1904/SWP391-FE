import React from 'react';

const CategoryList = ({ categories }) => {
  if (!categories || categories.length === 0) {
    return (
      <div className="category-list">
        <h2 className="text-3xl font-bold mb-8 text-center">Danh mục</h2>
        <div className="text-gray-500 text-center">Không có danh mục nào.</div>
      </div>
    );
  }

  return (
    <div className="category-list">
      <h2 className="text-3xl font-bold mb-8 text-center">Danh mục</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          return (
            <div 
              key={category.categoryId}
              className="transform transition-all duration-300 hover:-translate-y-2 cursor-pointer"
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-center text-gray-800 mb-2">
                    {category.categoryName}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList; 