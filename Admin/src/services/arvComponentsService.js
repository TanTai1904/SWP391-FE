import api from './api';

const arvComponentsService = {
  // Create ARV component
  createARVComponent: (componentData) => api.post('/ARVComponents/Create', componentData),
  
  // Update ARV component
  updateARVComponent: (componentData) => api.put('/ARVComponents/Update', componentData),
  
  // Get all ARV components
  getAllARVComponents: () => api.get('/ARVComponents/GetAll'),
  
  // Get ARV component by ID
  getARVComponentById: (id) => api.get(`/ARVComponents/GetByID/${id}`),
  
  // Delete ARV component
  deleteARVComponent: (id) => api.delete(`/ARVComponents/Delete/${id}`)
};

export default arvComponentsService; 