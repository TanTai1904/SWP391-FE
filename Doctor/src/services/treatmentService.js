import api from './api';

const treatmentService = {
  // Create treatment
  createTreatment: (treatmentData) => api.post('/Treatment/Create', treatmentData),
  
  // Update treatment
  updateTreatment: (treatmentData) => api.put('/Treatment/Update', treatmentData),
  
  // Get all treatments
  getAllTreatments: () => api.get('/Treatment/GetAll'),
  
  // Get treatment by ID
  getTreatmentById: (id) => api.get(`/Treatment/GetByID/${id}`),
  
  // Delete treatment
  deleteTreatment: (id) => api.delete(`/Treatment/Delete/${id}`)
};

export default treatmentService; 