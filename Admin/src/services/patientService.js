import api from './api';

const patientService = {
  // Create patient
  createPatient: (patientData) => api.post('/Patient/Create', patientData),
  
  // Update patient
  updatePatient: (patientData) => api.put('/Patient/Update', patientData),
  
  // Get all patients
  getAllPatients: () => api.get('/Patient/GetAll'),
  getAll: () => api.get('/Patient/GetAll'),
  
  // Get patient by ID
  getPatientById: (id) => api.get(`/Patient/GetByID/${id}`),
  
  // Delete patient
  deletePatient: (id) => api.delete(`/Patient/Delete/${id}`)
};

export default patientService; 