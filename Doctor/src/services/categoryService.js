import api from './api';

const categoryService = {
  // Create category
  createCategory: (categoryData) => api.post('/Category/Create', categoryData),
  
  // Update category
  updateCategory: (categoryData) => api.put('/Category/Update', categoryData),
  
  // Get all categories
  getAllCategories: () => api.get('/Category/GetAll'),
  
  // Get category by ID
  getCategoryById: (id) => api.get(`/Category/GetByID/${id}`),
  
  // Delete category
  deleteCategory: (id) => api.delete(`/Category/Delete/${id}`)
};

export default categoryService; 