import api from './api';

const authService = {
  login: async (userName, password) => {
    try {
      const response = await api.post('/api/Login/login', { userName, password });
      console.log('API login response:', response.data);

      // Giả định nếu API trả về trực tiếp user data hoặc một đối tượng có token và user/userName
      let userToStore = null;
      if (response.data.token) {
        userToStore = response.data.user || {
          userName: response.data.userName || userName,
          role: response.data.role || response.data.userType || 'unknown',
        };
      } else if (response.data.userName || response.data.role || response.data.userType) {
        // Nếu API trả về trực tiếp user data mà không có token lồng ghép
        userToStore = {
          userName: response.data.userName || userName,
          role: response.data.role || response.data.userType || 'unknown',
        };
      } else {
        console.warn('Login response missing token or user data in expected format:', response.data);
        throw new Error('Phản hồi đăng nhập không hợp lệ.');
      }

      if (userToStore) {
        localStorage.setItem('user', JSON.stringify(userToStore));
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        console.log('Stored user data:', userToStore);
      } else {
        throw new Error('Không thể lưu thông tin người dùng.');
      }
      return response.data;
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
    const response = await api.post('/api/Login/register', userData);
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
    // Implement actual token validation if needed
    return !!token;
  }
};

export default authService; 