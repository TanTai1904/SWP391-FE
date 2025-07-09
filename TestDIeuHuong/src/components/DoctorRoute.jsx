import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import authService from "../services/authService";

const DoctorRoute = ({ children }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // Kiểm tra và log trạng thái xác thực
    console.log("Auth status:", {
      isAuthenticated,
      user,
      userRole: user?.role,
    });
  }, [isAuthenticated, user]);

  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.log("No user data, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role || user.userType;
  if (userRole !== "doctor" && userRole !== "Doctor") {
    console.log("Not a doctor, redirecting to home");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default DoctorRoute;
