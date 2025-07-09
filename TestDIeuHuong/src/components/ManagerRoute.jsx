import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ManagerRoute = ({ children }) => {
  const { isAuthenticated, isManager } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isManager) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ManagerRoute;
