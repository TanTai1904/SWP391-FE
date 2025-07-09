import api from './api';

const userService = {
  // Create user
  createUser: (userData) => api.post('/User/Create', userData),
  
  // Get all users
  getAllUsers: () => api.get('/User/All'),
  
  // Get user by fullname
  getUserByFullname: (fullname) => api.get(`/User/${fullname}`),
  
  // Update user
  updateUser: (userData) => api.put('/User/Update', userData)
};

export default userService; 