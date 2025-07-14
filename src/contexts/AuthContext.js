import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra authentication khi component mount
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userDetails = authService.getUserDetails();
      
      if (token && userDetails) {
        setUser(userDetails);
      } else {
        // Nếu không có token hoặc userDetails, xóa hết data
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      // Gọi API login để lấy token và userDetails
      const { userDetails } = await authService.login(username, password);
      
      if (!userDetails) {
        throw new Error('Không thể lấy thông tin người dùng');
      }
      
      setUser(userDetails);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      // Đảm bảo xóa hết data nếu có lỗi
      localStorage.removeItem('token');
      localStorage.removeItem('userDetails');
      throw error;
    }
  };

  const logout = () => {
    // Xóa token và user data
    authService.logout();
    // Reset user state
    setUser(null);
    // Chuyển hướng về trang login
    navigate('/login');
  };

  const updateUserInfo = (newUserInfo) => {
    // Cập nhật thông tin người dùng trong localStorage
    const currentUserDetails = authService.getUserDetails();
    const updatedUserDetails = { ...currentUserDetails, ...newUserInfo };
    localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
    
    // Cập nhật state
    setUser(updatedUserDetails);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUserInfo,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 