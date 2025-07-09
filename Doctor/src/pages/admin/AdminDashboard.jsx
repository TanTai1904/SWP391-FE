import React, { useState } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import UserTable from "./components/UserTable";
import DoctorTable from "./components/DoctorTable";
import PatientTable from "./components/PatientTable";
import AppointmentTable from "./components/AppointmentTable";
import ArticleTable from "./components/ArticleTable";
import CategoryTable from "./components/CategoryTable";
import ARVComponentTable from "./components/ARVComponentTable";
import ARVRegimenTable from "./components/ARVRegimenTable";
import TestResultTable from "./components/TestResultTable";
import NotificationTable from "./components/NotificationTable";
import LoginAdmin from "./LoginAdmin";
import styles from "./admin.module.scss";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  if (!isLoggedIn) {
    return <LoginAdmin onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className={styles["admin-dashboard"]}>
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles["admin-main"]}>
        <AdminHeader />
        <div className={styles["admin-content"]}>
          {activeTab === "users" && <UserTable />}
          {activeTab === "doctors" && <DoctorTable />}
          {activeTab === "patients" && <PatientTable />}
          {activeTab === "appointments" && <AppointmentTable />}
          {activeTab === "articles" && <ArticleTable />}
          {activeTab === "categories" && <CategoryTable />}
          {activeTab === "arvcomponents" && <ARVComponentTable />}
          {activeTab === "arvregimens" && <ARVRegimenTable />}
          {activeTab === "testresults" && <TestResultTable />}
          {activeTab === "notifications" && <NotificationTable />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
