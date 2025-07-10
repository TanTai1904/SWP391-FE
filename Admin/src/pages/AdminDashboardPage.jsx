import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import authService from "../services/authService";
import AdminSidebar from "./admin/components/AdminSidebar";
import AdminHeader from "./admin/components/AdminHeader";

// Admin components
import AdminManagement from "./admin/components/AdminManagement";
import DoctorManagement from "./admin/components/DoctorManagement";
import PatientManagement from "./admin/components/PatientManagement";
import AppointmentManagement from "./admin/components/AppointmentManagement";
import ArticleManagement from "./admin/components/ArticleManagement";
import CategoryManagement from "./admin/components/CategoryManagement";
import ARVComponentManagement from "./admin/components/ARVComponentManagement";
import ARVRegimenManagement from "./admin/components/ARVRegimenManagement";
import TestTypeManagement from "./admin/components/TestTypeManagement";
import TestResultManagement from "./admin/components/TestResultManagement";
import UserManagement from "./admin/components/UserManagement";
import NotificationManagement from "./admin/components/NotificationManagement";

import "../styles/admin.css";

const AdminDashboardPage = ({ module }) => {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Determine the active module from the URL path or prop
  const getActiveModuleFromPath = () => {
    if (module) return module;
    
    const path = location.pathname;
    if (path === "/admin/dashboard") return "dashboard";
    
    // Extract module name from path (e.g., /admin/doctors → doctors)
    const pathParts = path.split("/");
    if (pathParts.length >= 3) {
      return pathParts[2];
    }
    
    return "dashboard";
  };
  
  const activeModule = getActiveModuleFromPath();
  
  useEffect(() => {
    const checkAuth = async () => {
      const isLoggedIn = authService.isAdminAuthenticated();
      console.log('Admin authentication check:', isLoggedIn);
      
      if (!isLoggedIn) {
        console.log('Admin not authenticated, redirecting to login');
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      
      try {
        // Fetch admin user data if needed
        const adminUserStr = localStorage.getItem('adminUser');
        if (adminUserStr) {
          const parsedAdminData = JSON.parse(adminUserStr);
          console.log('Admin user data loaded:', {
            id: parsedAdminData.id,
            username: parsedAdminData.username,
            role: parsedAdminData.role,
            hasToken: !!parsedAdminData.accessToken
          });
          
          // Verify that this is an admin user
          const role = parsedAdminData.role;
          if (role === 'Admin' || role === 'admin' || (Array.isArray(role) && role.includes('Admin'))) {
            setAdminData(parsedAdminData);
          } else {
            console.error('Invalid role in admin data:', role);
            setIsAuthenticated(false);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
          }
        } else {
          console.error('No admin user data found in localStorage');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error getting admin data:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLogout = () => {
    authService.adminLogout();
    setIsAuthenticated(false);
  };
  
  if (loading) {
    return <div className="admin-loading">Đang tải...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  
  // Render the appropriate module based on active state
  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return (
          <div className="admin-dashboard-overview">
            <h2>Tổng quan hệ thống</h2>
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <h3>Quản lý admin</h3>
                <p>Quản lý tài khoản admin</p>
                <a 
                  className="admin-button-primary" 
                  href="/admin/admins"
                >
                  Xem chi tiết
                </a>
              </div>
              <div className="admin-stat-card">
                <h3>Quản lý bác sĩ</h3>
                <p>Quản lý thông tin bác sĩ</p>
                <a 
                  className="admin-button-primary" 
                  href="/admin/doctors"
                >
                  Xem chi tiết
                </a>
              </div>
              <div className="admin-stat-card">
                <h3>Quản lý bệnh nhân</h3>
                <p>Quản lý thông tin bệnh nhân</p>
                <a 
                  className="admin-button-primary" 
                  href="/admin/patients"
                >
                  Xem chi tiết
                </a>
              </div>
              <div className="admin-stat-card">
                <h3>Quản lý lịch hẹn</h3>
                <p>Quản lý lịch hẹn bệnh nhân</p>
                <a 
                  className="admin-button-primary" 
                  href="/admin/appointments"
                >
                  Xem chi tiết
                </a>
              </div>
            </div>
          </div>
        );
      case "admins":
        return <AdminManagement />;
      case "doctors":
        return <DoctorManagement />;
      case "patients":
        return <PatientManagement />;
      case "appointments":
        return <AppointmentManagement />;
      case "articles":
        return <ArticleManagement />;
      case "categories":
        return <CategoryManagement />;
      case "arv-components":
        return <ARVComponentManagement />;
      case "arv-regimens":
        return <ARVRegimenManagement />;
      case "test-types":
        return <TestTypeManagement />;
      case "test-results":
        return <TestResultManagement />;
      case "users":
        return <UserManagement />;
      case "notifications":
        return <NotificationManagement />;
      default:
        return <div>Chọn một mục quản lý từ menu bên trái</div>;
    }
  };
  
  return (
    <div className="admin-dashboard">
      <AdminSidebar activeModule={activeModule} />
      
      <div className="admin-main">
        <AdminHeader 
          adminData={adminData} 
          onLogout={handleLogout} 
        />
        
        <div className="admin-content">
          {renderModule()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
