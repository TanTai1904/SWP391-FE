import api from './api';

const articleService = {
  // Get all articles
  getAllArticles: () => api.get('/Article/GetAll'),
  
  // Get article by ID
  getArticleById: (id) => api.get(`/Article/GetByID/${id}`),
  
  // Create article
  createArticle: (articleData) => api.post('/Article/Create', articleData),
  
  // Update article
  updateArticle: (articleData) => api.put('/Article/Update', articleData),
  
  // Delete article
  deleteArticle: (id) => api.delete(`/Article/Delete/${id}`)
};

export default articleService; 