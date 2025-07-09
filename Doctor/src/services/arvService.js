import api from './api';

const arvService = {
  // ARV Components
  getAllComponents: () => api.get('/ARVComponents/GetAll'),
  getComponentById: (id) => api.get(`/ARVComponents/GetByID/${id}`),
  createComponent: (data) => api.post('/ARVComponents/Create', data),
  updateComponent: (data) => api.put('/ARVComponents/Update', data),
  deleteComponent: (id) => api.delete(`/ARVComponents/Delete/${id}`),

  // ARV Regimens
  getAllRegimens: () => api.get('/ARVRegimens/GetAll'),
  getRegimenById: (id) => api.get(`/ARVRegimens/GetByID/${id}`),
  createRegimen: (data) => api.post('/ARVRegimens/Create', data),
  updateRegimen: (data) => api.put('/ARVRegimens/Update', data),
  deleteRegimen: (id) => api.delete(`/ARVRegimens/Delete/${id}`),
};

export default arvService;
