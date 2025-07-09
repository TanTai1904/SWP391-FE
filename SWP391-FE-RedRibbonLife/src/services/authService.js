import api from './api';

const authService = {  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('username', response.data.username || username);
        // Store additional user data if available
        if (response.data.userRole) {
          localStorage.setItem('userRole', response.data.userRole);
        }
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    } catch (error) {
      // Even if API call fails, remove local storage
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    }
  },getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      // If API call fails, check if we have data in localStorage
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const userRole = localStorage.getItem('userRole');
      
      if (token && username) {
        // Return basic user info from localStorage
        return { 
          username, 
          userRole: userRole || 'Patient' 
        };
      }
      
      // If no token or username, return null
      return null;
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService; 