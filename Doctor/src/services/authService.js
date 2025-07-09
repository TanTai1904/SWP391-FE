import api from './api';

const authService = {
  // Login
  login: (credentials) => api.post('/Auth/login', credentials),
  
  // Get current user
  getCurrentUser: () => api.get('/Auth/me'),
  
  // Update password
  updatePassword: (passwordData) => api.put('/Auth/UpdatePassword', passwordData),
  
  // Legacy methods for backward compatibility
  register: (userData) => api.post('/User/Create', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;