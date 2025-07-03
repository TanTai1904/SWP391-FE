import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi component mount
    const checkAuth = () => {
      console.log("AuthContext: Checking authentication status...");
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          console.log("AuthContext: User found in localStorage:", currentUser);
        } else {
          console.log("AuthContext: No user found in localStorage.");
        }
      } catch (error) {
        console.error("AuthContext: Auth check error:", error);
      } finally {
        setLoading(false);
        console.log("AuthContext: Loading finished.");
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      const userData = await authService.login(username, password);
      setUser(userData);
      console.log("AuthContext: User set after successful login:", userData);
      return userData;
    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    console.log("AuthContext: User logged out.");
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

  console.log("AuthContext: Current auth state:", {
    user,
    isAuthenticated: value.isAuthenticated,
    isDoctor: value.isDoctor,
    isManager: value.isManager,
  });

  if (loading) {
    return <div>Loading authentication...</div>;
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
