import React from "react";
import styles from "./styles/doctor.module.scss";
import { NavLink, useLocation } from "react-router-dom";
import { Users, Calendar, Activity, Shield, MessageSquare, BarChart3, Settings } from "lucide-react";

const navigationItems = [
  { title: "Trang chủ", url: "/doctor", icon: Activity },
  { title: "Quản lý bệnh nhân", url: "/doctor/patients", icon: Users },
  { title: "Lịch làm việc", url: "/doctor/schedule", icon: Calendar },
  { title: "Phác đồ ARV", url: "/doctor/arv-protocols", icon: Shield },
  { title: "Tư vấn & Hẹn khám", url: "/doctor/consultation", icon: MessageSquare },
  { title: "Báo cáo", url: "/doctor/reports", icon: BarChart3 },
  { title: "Thông tin bác sĩ", url: "/doctor/profile", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className={styles["doctor-sidebar"]}>
      <div className={styles["sidebar-header"]}>
        <div className={styles["sidebar-logo"]}>
          <span className={styles["sidebar-logo-icon"]}> <Activity className="h-7 w-7" /> </span>
          <div>
            <h1 className={styles["sidebar-title"]}>HIV Care System</h1>
            <p className={styles["sidebar-desc"]}>Hệ thống điều trị HIV</p>
          </div>
        </div>
      </div>
      <nav className={styles["sidebar-nav"]}>
        <div className={styles["sidebar-menu-title"]}>Menu</div>
        {navigationItems.map((item) => (
          <NavLink
            key={item.title}
            to={item.url}
            className={({ isActive: navActive }) =>
              [
                styles["sidebar-link"],
                (navActive || isActive(item.url)) ? styles["active"] : ""
              ].join(" ")
            }
            end={item.url === "/doctor"}
          >
            <item.icon className={styles["sidebar-icon"]} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
      <div className={styles["sidebar-footer"]}>© 2025 HIV Care</div>
    </aside>
  );
};

export default AppSidebar;
