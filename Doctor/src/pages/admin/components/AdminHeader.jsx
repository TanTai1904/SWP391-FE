import React from "react";
import styles from "../admin.module.scss";

const AdminHeader = () => (
  <header className={styles["admin-header"]}>
    <div className={styles["admin-title"]}>Admin Dashboard</div>
    <div className={styles["admin-actions"]}>
      {/* Thêm nút logout, thông báo, avatar admin nếu muốn */}
      <button className={styles["logout-btn"]}>Đăng xuất</button>
    </div>
  </header>
);

export default AdminHeader;
