import api from './api';

const authService = {
  // Login
  login: (credentials) => {
    console.log('Login API called with:', { ...credentials, password: '***' });
    return api.post('/Auth/login', credentials)
      .then(response => {
        console.log('Login response structure:', Object.keys(response.data || {}));
        if (response.data) {
          // Format the response if needed to normalize token format
          if (response.data.accessToken && !response.data.token) {
            response.data.token = response.data.accessToken;
          }
        }
        return response;
      })
      .catch(error => {
        console.error('Login API error:', error.message);
        throw error;
      });
  },
  
  // Admin Login - Uses the same Auth/login endpoint but saves token as adminToken
  adminLogin: (credentials) => {
    console.log('Admin Login API called with:', { ...credentials, password: '***' });
    return api.post('/Auth/login', credentials)
      .then(response => {
        console.log('Admin login response structure:', Object.keys(response.data || {}));
        if (response.data) {
          // Format the response if needed to normalize token format
          if (response.data.accessToken && !response.data.token) {
            response.data.token = response.data.accessToken;
          }
        }
        return response;
      })
      .catch(error => {
        console.error('Admin login API error:', error.message);
        throw error;
      });
  },
  
  // Get current user
  getCurrentUser: () => api.get('/Auth/me'),
  
  // Get current admin
  getCurrentAdmin: () => api.get('/Admin/me'),
  
  // Update password
  updatePassword: (passwordData) => api.put('/Auth/UpdatePassword', passwordData),
  
  // Update admin password
  updateAdminPassword: (passwordData) => api.put('/Admin/UpdatePassword', passwordData),
  
  // Register new user
  register: (userData) => api.post('/User/Create', userData),
  
  // Regular user logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Admin logout
  adminLogout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  // Check if admin is authenticated
  isAdminAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');
    
    if (!token || !adminUser) {
      console.log('Admin authentication failed: Missing token or user data');
      return false;
    }
    
    // Kiểm tra thêm thông tin user để đảm bảo đúng là admin
    try {
      const userData = JSON.parse(adminUser);
      const role = userData.role;
      
      if (!role || (role !== 'Admin' && role !== 'admin' && 
          !(Array.isArray(role) && role.includes('Admin')))) {
        console.log('Admin authentication failed: Invalid role', role);
        return false;
      }
      
      // Kiểm tra token chưa hết hạn
      const parseJwt = (token) => {
        try {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));
          return JSON.parse(jsonPayload);
        } catch (e) {
          return null;
        }
      };
      
      const decoded = parseJwt(token);
      if (decoded && decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          console.log('Admin authentication failed: Token expired');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Admin authentication error:', error);
      return false;
    }
  }
};

export default authService;