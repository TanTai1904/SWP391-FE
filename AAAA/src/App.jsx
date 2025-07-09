import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppointmentPage from "./pages/AppointmentPage";
import BlogPage from "./pages/BlogPage";
import DoctorsPage from "./pages/DoctorsPage";
import ServicesPage from "./pages/ServicesPage";
import DoctorLayout from "./pages/doctor/DoctorLayout";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
import DoctorARVRegimen from "./pages/doctor/DoctorARVRegimen";
import DoctorConsultation from "./pages/doctor/DoctorConsultation";
import DoctorReports from "./pages/doctor/DoctorReports";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorRoute from "./components/DoctorRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AuthRedirector from "./components/AuthRedirector";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerRoute from "./components/ManagerRoute";
import ContactPage from "./pages/ContactPage";

const App = () => (
  <AuthProvider>
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/appointment" element={<AppointmentPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route
          path="/doctor/*"
          element={
            <DoctorRoute>
              <DoctorLayout />
            </DoctorRoute>
          }
        >
          <Route index element={<DoctorDashboard />} />
          <Route path="patients" element={<DoctorPatients />} />
          <Route path="schedule" element={<DoctorSchedule />} />
          <Route path="arv-regimen" element={<DoctorARVRegimen />} />
          <Route path="consultation" element={<DoctorConsultation />} />
          <Route path="reports" element={<DoctorReports />} />
          <Route path="profile" element={<DoctorProfile />} />
        </Route>
        <Route
          path="/manager"
          element={
            <ManagerRoute>
              <ManagerDashboard />
            </ManagerRoute>
          }
        />
        <Route path="*" element={<AuthRedirector />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;
