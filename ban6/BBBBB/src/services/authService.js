import api from './api';

const authService = {
  login: async (userName, password) => {
    try {
      const response = await api.post('/api/Auth/login', { userName, password });
      console.log('API login response:', response.data);

      const { username: apiUsername, token } = response.data;

      if (token) {
        const payloadBase64 = token.split('.')[1];
        const decodedPayload = JSON.parse(atob(payloadBase64));
        const userRole = decodedPayload.role;

        const userToStore = {
          userName: apiUsername,
          role: userRole || 'unknown',
        };

        localStorage.setItem('user', JSON.stringify(userToStore));
        localStorage.setItem('token', token);
        console.log('Stored user data:', userToStore);
        return userToStore;
      } else {
        console.warn('Login response missing token:', response.data);
        throw new Error('Phản hồi đăng nhập không hợp lệ: Thiếu token.');
      }
    } catch (error) {
      console.error('Login service error:', error);
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Đăng nhập thất bại. Vui lòng thử lại!');
      }
    }
  },

  register: async (userData) => {
    const response = await api.post('/api/User/Create', userData);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    console.log('Raw user data from localStorage:', userStr);
    if (userStr && userStr !== 'undefined' && userStr !== 'null') {
      try {
        const user = JSON.parse(userStr);
        console.log('Parsed user data:', user);
        return user;
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        return null;
      }
    }
    return null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token;
  }
};

export default authService; 