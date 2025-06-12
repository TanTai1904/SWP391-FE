import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppointmentPage from "./pages/AppointmentPage";
import BlogPage from "./pages/BlogPage";
import DoctorsPage from "./pages/DoctorsPage";
import ServicesPage from "./pages/ServicesPage";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorRoute from "./components/DoctorRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AuthRedirector from "./components/AuthRedirector";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagerDashboard from "./pages/ManagerDashboard";
import ManagerRoute from "./components/ManagerRoute";

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
        <Route
          path="/doctor"
          element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <DoctorRoute>
              <DoctorDashboard />
            </DoctorRoute>
          }
        />
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
