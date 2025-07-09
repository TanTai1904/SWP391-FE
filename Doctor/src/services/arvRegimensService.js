import api from './api';

const arvRegimensService = {
  // Create ARV regimen
  createARVRegimen: (regimenData) => api.post('/ARVRegimens/Create', regimenData),
  
  // Update ARV regimen
  updateARVRegimen: (regimenData) => api.put('/ARVRegimens/Update', regimenData),
  
  // Get all ARV regimens
  getAllARVRegimens: () => api.get('/ARVRegimens/GetAll'),
  getAll: () => api.get('/ARVRegimens/GetAll'),
  
  // Get ARV regimen by ID
  getARVRegimenById: (id) => api.get(`/ARVRegimens/GetByID/${id}`),
  
  // Delete ARV regimen
  deleteARVRegimen: (id) => api.delete(`/ARVRegimens/Delete/${id}`)
};

export default arvRegimensService; 