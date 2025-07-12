import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_URL}/Auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Username: username,
        Password: password
      })
    });

    const result = await response.json();

    // Kiểm tra response status
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Tên đăng nhập hoặc mật khẩu không chính xác');
      }
      throw new Error(result.message || 'Đăng nhập thất bại');
    }

    // Kiểm tra business status từ API
    if (!result.status || result.statusCode !== 200) {
      if (result.errors && result.errors.length > 0) {
        throw new Error(result.errors.join(', '));
      }
      throw new Error('Đăng nhập thất bại');
    }

    // Lấy token và userDetails từ data
    const { token, userDetails } = result.data;
    if (!token || !userDetails) {
      console.error('Login response:', result);
      throw new Error('Dữ liệu đăng nhập không hợp lệ');
    }

    // Parse JWT token để lấy role
    const tokenData = parseJwt(token);
    const userRole = tokenData?.role;

    // Lưu token, userDetails và userRole
    localStorage.setItem('token', token);
    localStorage.setItem('userDetails', JSON.stringify(userDetails));
    localStorage.setItem('userRole', userRole);
    
    return { token, userDetails, userRole };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Utility function to parse JWT token
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const forgotPassword = async (email, newPassword) => {
  try {
    const response = await fetch(`${API_URL}/Auth/ForgotPassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: newPassword
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response:', errorText);
      throw new Error('Không thể đặt lại mật khẩu. Vui lòng thử lại sau.');
    }

    return await response.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const userDetails = getUserDetails();
    if (!userDetails) {
      return null;
    }
    return userDetails;
  } catch (error) {
    console.error('Get current user error:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('userDetails');
    localStorage.removeItem('userRole');
    return null;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Bạn chưa đăng nhập');
    }

    const response = await fetch(`${API_URL}/User/Update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Cập nhật thông tin thất bại');
    }

    const result = await response.json();
    
    // Cập nhật userDetails trong localStorage
    if (result.data) {
      localStorage.setItem('userDetails', JSON.stringify(result.data));
    }

    return result;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userDetails');
  localStorage.removeItem('userRole');
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getUserDetails = () => {
  const userDetailsStr = localStorage.getItem('userDetails');
  return userDetailsStr ? JSON.parse(userDetailsStr) : null;
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const handleUnauthorized = (navigate) => {
  logout();
  navigate('/login');
  toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    const tokenData = parseJwt(token);
    if (!tokenData) return true;
    
    // exp is in seconds, current time is in milliseconds
    const currentTime = Date.now() / 1000;
    return tokenData.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  const userDetails = getUserDetails();
  return !!(token && userDetails);
};