import React from "react";
import { useAuth } from "../contexts/AuthContext";

const ManagerDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">
                  Quản lý hệ thống
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-gray-700 mr-4">
                Xin chào, {user?.userName || "Quản lý"}
              </span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Trang quản lý
            </h2>
            <p className="text-gray-600">
              Đây là trang quản lý hệ thống. Nội dung sẽ được cập nhật sau.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManagerDashboard;
