import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppointmentPage from "./pages/AppointmentPage";
import BlogPage from "./pages/BlogPage";
import DoctorsPage from "./pages/DoctorsPage";
import ServicesPage from "./pages/ServicesPage";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientManagement from "./pages/doctor/PatientManagement";
import Schedule from "./pages/doctor/Schedule";
import ARVProtocols from "./pages/doctor/ARVProtocols";
import Consultation from "./pages/doctor/Consultation";
import ConsultationPage from "./pages/doctor/ConsultationPage";
import Reports from "./pages/doctor/Reports";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import ContactPage from "./pages/ContactPage";

// New API Integration Pages
import AdminManagement from "./pages/doctor/AdminManagement";
import TestManagement from "./pages/doctor/TestManagement";
import TreatmentManagement from "./pages/doctor/TreatmentManagement";
import CategoryManagement from "./pages/doctor/CategoryManagement";
import UserManagement from "./pages/doctor/UserManagement";
import NotificationManagement from "./pages/doctor/NotificationManagement";
import EmailManagement from "./pages/doctor/EmailManagement";
import { ARVComponentList, ARVRegimenList } from "./pages/arv";
import ARVRegimenDetail from './pages/arv/ARVRegimenDetail';

const App = () => (
  <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/appointment" element={<AppointmentPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      {/* ARV routes */}
      <Route path="/arv/components" element={<ARVComponentList />} />
      <Route path="/arv/regimens" element={<ARVProtocols />} />
      <Route path="/arv/regimens/:id" element={<ARVRegimenDetail />} />
      
      {/* Doctor dashboard routes */}
      <Route path="/doctor" element={<DoctorDashboard />}>
        <Route path="patients" element={<PatientManagement />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="arv-protocols" element={<ARVProtocols />} />
        <Route path="consultation" element={<Consultation />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<DoctorProfile />} />
        {/* New API Integration Routes */}
        <Route path="admin-management" element={<AdminManagement />} />
        <Route path="test-management" element={<TestManagement />} />
        <Route path="treatment-management" element={<TreatmentManagement />} />
        <Route path="category-management" element={<CategoryManagement />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="notification-management" element={<NotificationManagement />} />
        <Route path="email-management" element={<EmailManagement />} />
      </Route>
      
      {/* Trang riêng biệt cho Lịch hẹn tư vấn */}
      <Route path="/doctor/consultations" element={<ConsultationPage />} />
    </Routes>
  </Router>
);

export default App;
