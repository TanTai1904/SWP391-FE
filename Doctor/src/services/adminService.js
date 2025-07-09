import api from './api';

const adminService = {
  // Create admin
  createAdmin: (adminData) => api.post('/Admin/Create', adminData),
  
  // Update admin
  updateAdmin: (adminData) => api.put('/Admin/Update', adminData),
  
  // Get all admins
  getAllAdmins: () => api.get('/Admin/GetAll'),
  
  // Get admin by ID
  getAdminById: (id) => api.get(`/Admin/GetByID/${id}`),
  
  // Delete admin
  deleteAdmin: (id) => api.delete(`/Admin/Delete/${id}`)
};

export default adminService; 