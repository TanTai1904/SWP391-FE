import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const checkAuth = () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password);
      const userData = response.user || response;
      setUser(userData);
      return userData;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isDoctor: user?.role === "doctor" || user?.role === "Doctor",
    isManager: user?.role === "manager" || user?.role === "Manager",
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
