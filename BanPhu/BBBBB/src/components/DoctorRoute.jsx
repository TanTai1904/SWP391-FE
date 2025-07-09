import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DoctorRoute = ({ children }) => {
  const { user, isAuthenticated, isDoctor, loading } = useAuth();

  useEffect(() => {
    console.log("DoctorRoute: State changed.", {
      isAuthenticated,
      isDoctor,
      user,
      loading,
    });
  }, [isAuthenticated, isDoctor, user, loading]);

  if (loading) {
    console.log("DoctorRoute: AuthContext is still loading.");
    return <div>Loading route...</div>;
  }

  if (!isAuthenticated) {
    console.log("DoctorRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    console.log("DoctorRoute: No user data, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!isDoctor) {
    console.log(
      "DoctorRoute: User is not a doctor (",
      user?.role,
      "), redirecting to home"
    );
    return <Navigate to="/" replace />;
  }

  console.log("DoctorRoute: User is a doctor, rendering children.");
  return children;
};

export default DoctorRoute;
