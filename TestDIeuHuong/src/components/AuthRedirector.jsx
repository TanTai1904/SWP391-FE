import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthRedirector = ({ children }) => {
  const { user, isAuthenticated, isDoctor, isManager } = useAuth();
  const location = useLocation();

  // Nếu chưa đăng nhập, chuyển đến trang login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role và chuyển hướng
  if (isDoctor) {
    return <Navigate to="/doctor" replace />;
  }

  if (isManager) {
    return <Navigate to="/manager" replace />;
  }

  // Nếu có role khác, chuyển về trang chủ
  if (user?.role) {
    return <Navigate to="/" replace />;
  }

  // Nếu không có role, hiển thị thông báo lỗi
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
