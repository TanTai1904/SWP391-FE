import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, Calendar, Users, User, FileText, 
  ClipboardList, Bell, Activity, Pill, Microscope, LogOut
} from 'lucide-react';
import authService from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const DoctorSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Menu items array with path and icons
  const menuItems = [
    { id: "dashboard", label: "Tổng quan", path: "/doctor", icon: <LayoutDashboard size={18} /> },
    { id: "consultation", label: "Lịch hẹn & Tư vấn", path: "/doctor/consultation", icon: <ClipboardList size={18} /> },
    { id: "patients", label: "Bệnh nhân", path: "/doctor/patients", icon: <Users size={18} /> },
    { id: "schedule", label: "Lịch làm việc", path: "/doctor/schedule", icon: <Calendar size={18} /> },
    { id: "treatments", label: "Điều trị", path: "/doctor/treatments", icon: <Activity size={18} /> },
    { id: "tests", label: "Kết quả xét nghiệm", path: "/doctor/tests", icon: <Microscope size={18} /> },
    { id: "arv", label: "Thuốc ARV", path: "/doctor/arv", icon: <Pill size={18} /> },
    { id: "reports", label: "Báo cáo", path: "/doctor/reports", icon: <FileText size={18} /> },
    { id: "notifications", label: "Thông báo", path: "/doctor/notifications", icon: <Bell size={18} /> },
    { id: "profile", label: "Hồ sơ bác sĩ", path: "/doctor/profile", icon: <User size={18} /> }
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  return (
    <aside className="doctor-sidebar">
      <div className="doctor-logo">
        <h2>Red Ribbon Life</h2>
        <p>Hệ thống Bác sĩ</p>
      </div>
      
      <nav className="doctor-nav">
        <ul>
          {menuItems.map(item => (
            <li
              key={item.id}
              className={location.pathname === item.path ? "active" : ""}
            >
              <Link to={item.path}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default DoctorSidebar;
