import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import React, { useEffect } from "react";

const AuthRedirector = () => {
  const { user, isAuthenticated, isDoctor, isManager, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthRedirector: State changed.", {
      isAuthenticated,
      isDoctor,
      isManager,
      user,
      loading,
      currentLocation: location.pathname,
    });
  }, [isAuthenticated, isDoctor, isManager, user, loading, location.pathname]);

  if (loading) {
    console.log("AuthRedirector: AuthContext is still loading.");
    return <div>Redirecting...</div>; // Hoặc một spinner loading
  }

  // Nếu chưa đăng nhập, chuyển đến trang login
  if (!isAuthenticated) {
    console.log("AuthRedirector: Not authenticated, redirecting to /login.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role và chuyển hướng
  if (isDoctor) {
    console.log("AuthRedirector: User is a doctor, redirecting to /doctor.");
    return <Navigate to="/doctor" replace />;
  }

  if (isManager) {
    console.log("AuthRedirector: User is a manager, redirecting to /manager.");
    return <Navigate to="/manager" replace />;
  }

  // Nếu có role khác, chuyển về trang chủ
  if (user?.role) {
    console.log(
      "AuthRedirector: User has an unknown role (",
      user.role,
      "), redirecting to /."
    );
    return <Navigate to="/" replace />;
  }

  // Nếu không có role, hiển thị thông báo lỗi
  console.log(
    "AuthRedirector: User authenticated but no role found. Showing error message."
  );
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi xác thực</h1>
        <p className="text-gray-600">
          Không tìm thấy thông tin vai trò người dùng
        </p>
      </div>
    </div>
  );
};

export default AuthRedirector;
