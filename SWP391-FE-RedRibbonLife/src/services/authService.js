import api from './api';

// Helper to handle API requests
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  login: async (username, password) => {
    const data = await handleRequest(api.post('/auth/login', { username, password }));
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.username || username);
      if (data.userRole) {
        localStorage.setItem('userRole', data.userRole);
      }
    }
    return data;
  },

  register: (userData) =>
    handleRequest(api.post('/auth/register', userData)),

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore API error, proceed to clear local storage
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
    }
  },

  getCurrentUser: async () => {
    try {
      return await handleRequest(api.get('/auth/me'));
    } catch (error) {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      const userRole = localStorage.getItem('userRole');
      if (token && username) {
        return { username, userRole: userRole || 'Patient' };
      }
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};

export default authService;