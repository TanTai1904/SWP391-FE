import React from 'react';
import styles from './styles/doctor.module.scss';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { BreadcrumbNav } from "./BreadcrumbNav";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import PatientManagement from "./PatientManagement";
import Schedule from "./Schedule";
import ARVProtocols from "./ARVProtocols";
import Consultation from "./Consultation";
import Reports from "./Reports";
import DoctorProfile from "./DoctorProfile";

const Index = () => {
  return (
    <SidebarProvider>
      <div className={styles.doctorLayoutWrap}>
        <AppSidebar />
        <div className={styles.doctorLayoutMain}>
          <DashboardHeader />
          <main className={styles.doctorLayoutContent}>
            <BreadcrumbNav />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<PatientManagement />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/arv-protocols" element={<ARVProtocols />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/profile" element={<DoctorProfile />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
