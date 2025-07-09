import React from "react";
import styles from "../admin.module.scss";

const AdminSidebar = ({ activeTab, setActiveTab }) => (
  <aside className={styles["admin-sidebar"]}>
    <ul>
      <li className={activeTab === "users" ? styles.active : ""} onClick={() => setActiveTab("users")}>Quản lý User</li>
      <li className={activeTab === "doctors" ? styles.active : ""} onClick={() => setActiveTab("doctors")}>Quản lý Bác sĩ</li>
      <li className={activeTab === "patients" ? styles.active : ""} onClick={() => setActiveTab("patients")}>Quản lý Bệnh nhân</li>
      <li className={activeTab === "appointments" ? styles.active : ""} onClick={() => setActiveTab("appointments")}>Lịch hẹn</li>
      <li className={activeTab === "articles" ? styles.active : ""} onClick={() => setActiveTab("articles")}>Bài viết</li>
      <li className={activeTab === "categories" ? styles.active : ""} onClick={() => setActiveTab("categories")}>Chuyên mục</li>
      <li className={activeTab === "arvcomponents" ? styles.active : ""} onClick={() => setActiveTab("arvcomponents")}>Thành phần ARV</li>
      <li className={activeTab === "arvregimens" ? styles.active : ""} onClick={() => setActiveTab("arvregimens")}>Phác đồ ARV</li>
      <li className={activeTab === "testresults" ? styles.active : ""} onClick={() => setActiveTab("testresults")}>Kết quả xét nghiệm</li>
      <li className={activeTab === "notifications" ? styles.active : ""} onClick={() => setActiveTab("notifications")}>Thông báo</li>
    </ul>
  </aside>
);

export default AdminSidebar;
