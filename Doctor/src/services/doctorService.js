import api from './api';

const doctorService = {
  // Create doctor
  createDoctor: (doctorData) => api.post('/Doctor/Create', doctorData),
  
  // Update doctor
  updateDoctor: (doctorData) => api.put('/Doctor/Update', doctorData),
  
  // Get all doctors
  getAllDoctors: () => api.get('/Doctor/GetAll'),
  
  // Get doctor by ID
  getDoctorById: (id) => api.get(`/Doctor/GetByID/${id}`),
  
  // Delete doctor
  deleteDoctor: (id) => api.delete(`/Doctor/Delete/${id}`),
  
  update: (doctorData) => doctorService.updateDoctor(doctorData),
  getAll: () => doctorService.getAllDoctors()
};

export default doctorService;