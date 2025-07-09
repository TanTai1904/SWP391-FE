import axios from 'axios';

const BASE_URL = 'http://localhost:1566/api'; // Updated port to 1566

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage 'token' or from 'user.accessToken'
    let token = localStorage.getItem('token');
    
    // If token not found in 'token', try to get it from 'user'
    if (!token) {
      try {
        const user = localStorage.getItem('user');
        if (user) {
          const userData = JSON.parse(user);
          token = userData.accessToken;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Using auth token:', token.substring(0, 10) + '...');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`API Response ${response.config.method.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.warn('Unauthorized access, redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    } else if (error.response?.status === 400) {
      console.error('Bad Request - Invalid Data:', error.response.data);
    } else if (error.response?.status === 403) {
      console.error('Forbidden - Insufficient Permissions');
    }
    
    return Promise.reject(error);
  }
);

export default api; 