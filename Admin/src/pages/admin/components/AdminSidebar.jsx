import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ activeModule }) => {
  const location = useLocation();

  // Menu items array with path
  const menuItems = [
    { id: "dashboard", label: "Tổng quan", path: "/admin/dashboard" },
    { id: "admins", label: "Quản lý Admin", path: "/admin/admins" },
    { id: "doctors", label: "Quản lý Bác sĩ", path: "/admin/doctors" },
    { id: "patients", label: "Quản lý Bệnh nhân", path: "/admin/patients" },
    { id: "appointments", label: "Quản lý Lịch hẹn", path: "/admin/appointments" },
    { id: "articles", label: "Quản lý Bài viết", path: "/admin/articles" },
    { id: "categories", label: "Quản lý Chuyên mục", path: "/admin/categories" },
    { id: "arv-components", label: "Thành phần ARV", path: "/admin/arv-components" },
    { id: "arv-regimens", label: "Phác đồ ARV", path: "/admin/arv-regimens" },
    { id: "test-types", label: "Loại xét nghiệm", path: "/admin/test-types" },
    { id: "test-results", label: "Kết quả xét nghiệm", path: "/admin/test-results" },
    { id: "users", label: "Quản lý User", path: "/admin/users" },
    { id: "notifications", label: "Quản lý Thông báo", path: "/admin/notifications" }
  ];
  
  return (
    <aside className="admin-sidebar">
      <div className="admin-logo">
        <h2>Red Ribbon Life</h2>
      </div>
      
      <nav className="admin-nav">
        <ul>
          {menuItems.map(item => (
            <li
              key={item.id}
              className={activeModule === item.id ? "active" : ""}
            >
              <Link to={item.path}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
