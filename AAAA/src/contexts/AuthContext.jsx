import { createContext, useContext, useState, useEffect } from "react";

// 👉 Cấu hình: Bật/tắt mock
const USE_MOCK = false;

// 👉 Chọn service thật hoặc giả
import mockAuthService from "../services/mockAuth";
import realAuthService from "../services/authService";
const authService = USE_MOCK ? mockAuthService : realAuthService;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    isDoctor: user?.role?.toLowerCase() === "doctor",
    isManager: user?.role?.toLowerCase() === "manager",
  };

  console.log("AuthContext: Current auth state:", value);

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
