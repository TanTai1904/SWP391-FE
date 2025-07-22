import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyPage from './pages/VerifyPage';
import ProfilePage from './pages/ProfilePage';
import AppointmentsPage from './pages/AppointmentsPage';
import AppointmentListPage from './pages/AppointmentListPage';
import UpdateAppointmentPage from './pages/updateAppointmentPage';
import AppointmentManager from './pages/AppointmentManager';
import TestResultPage from './pages/testResultPage';
import CategoryManager from './pages/categoryManager';
import CreateCategory from './pages/createCategory';
import UpdateCategory from './pages/updateCategory';
import TestsPage from './pages/TestsPage';
import ArticleManager from './pages/articleManager';
import CreateTreatment from './pages/createTreatment';
import StandardProtocol from './pages/standardProtocol';
import ArticleDetail from './pages/articleDetail';
import CreateArticle from './pages/createArticle';
import UpdateArticle from './pages/updateArticle';
import CreateRegimens from './pages/createRegimens';
import ChooseRegiment from './pages/chooseRegiment';
import ArticlesPage from './pages/ArticlesPage';
import CategoryPage from './pages/CategoryPage';
import UpdateCertificate from './pages/updateCertificate';
import CertificateManagement from './pages/certificateManagement';
import CreateCertificate from './pages/createCertificate';
import ARVComponentManager from './pages/arvComponentManager';
import UpdateARVComponent from './pages/updateARVComponent';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import CreateComponent from './pages/createComponent';
import TestTypeManager from './pages/testTypeManager';
import CreateTestType from './pages/createTestType';
import UpdateTestType from './pages/updateTestType';
import ManagerPage from './pages/managerPage';
import CreateManager from './pages/createManager';
import UpdateManager from './pages/updateManager';
import DoctorManager from './pages/doctormanager';
import CreateDoctor from './pages/createDoctor';
import UpdateDoctor from './pages/updateDoctor';
import StaffManager from './pages/staffManager';
import CreateStaff from './pages/createStaff';
import UpdateStaff from './pages/updateStaff';
import TestResultManager from './pages/testResultManager';
import UpdateTestResult from './pages/updateTestResult';
import TreatmentForPatient from './pages/treatmentForPatient';
import TestResultForPatient from './pages/testResultForPatient';
import ScheduleManager from './pages/scheduleManager';
import CreateSchedule from './pages/createSchedule';
import UpdateSchedule from './pages/updateSchedule';
import ViewListWorkSchedule from './pages/viewListWorkSchedule';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public routes without layout */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify" element={<VerifyPage />} />

            {/* Routes with layout */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      {/* Public routes */}
                      <Route index element={<HomePage />} />
                      <Route path="/articles" element={<ArticlesPage />} />
                      <Route path="/category/:id" element={<CategoryPage />} />

                      {/* Protected routes */}
                      <Route
                        path="/profile/*"
                        element={
                          <PrivateRoute>
                            <ProfilePage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/appointments/create"
                        element={
                          <PrivateRoute>
                            <AppointmentsPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/appointments/list"
                        element={
                          <PrivateRoute>
                            <AppointmentListPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/appointments/management"
                        element={
                          <PrivateRoute>
                            <AppointmentManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/update-appointment/:id"
                        element={
                          <PrivateRoute>
                            <UpdateAppointmentPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/tests/*"
                        element={
                          <PrivateRoute>
                            <TestsPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/treatments/create"
                        element={
                          <PrivateRoute>
                            <CreateTreatment />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/test-result/create"
                        element={
                          <PrivateRoute>
                            <TestResultPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/choose-regiment"
                        element={
                          <PrivateRoute>
                            <ChooseRegiment />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/standard-protocol"
                        element={
                          <PrivateRoute>
                            <StandardProtocol />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/regimens/create"
                        element={
                          <PrivateRoute>
                            <CreateRegimens />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/categories"
                        element={
                          <PrivateRoute>
                            <CategoryManager />
                          </PrivateRoute>
                        }
                      />  
                      <Route  
                        path="/categories/create"
                        element={
                          <PrivateRoute>
                            <CreateCategory />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/categories/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateCategory />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/articles-management"
                        element={
                          <PrivateRoute>
                            <ArticleManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/articles/:id"
                        element={
                          <PrivateRoute>
                            <ArticleDetail />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/articles/create"
                        element={
                          <PrivateRoute>
                            <CreateArticle />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/articles/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateArticle />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/certificate-management"
                        element={
                          <PrivateRoute>
                            <CertificateManagement />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/certificate/create"
                        element={
                          <PrivateRoute>
                            <CreateCertificate />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/certificate/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateCertificate />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/ARVcomponents-management"
                        element={
                          <PrivateRoute>
                            <ARVComponentManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/ARVcomponents"
                        element={
                          <PrivateRoute>
                            <ARVComponentManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/ARVcomponents/create"
                        element={
                          <PrivateRoute>
                            <CreateComponent />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/ARVcomponents/update/:componentId"
                        element={
                          <PrivateRoute>
                            <UpdateARVComponent />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/testType-management"
                        element={
                          <PrivateRoute>
                            <TestTypeManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/test-types/create"
                        element={
                          <PrivateRoute>
                            <CreateTestType />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/test-types/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateTestType />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/manager-management"
                        element={
                          <PrivateRoute>
                            <ManagerPage />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/managers/create"
                        element={
                          <PrivateRoute>
                            <CreateManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/managers/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/doctors-management"
                        element={
                          <PrivateRoute>
                            <DoctorManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/doctors/create"
                        element={
                          <PrivateRoute>
                            <CreateDoctor />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/doctors/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateDoctor />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/staff-management"
                        element={
                          <PrivateRoute>
                            <StaffManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/staffs/create"
                        element={
                          <PrivateRoute>
                            <CreateStaff />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/staffs/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateStaff />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/testResult-management"
                        element={
                          <PrivateRoute>
                            <TestResultManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/test-results/update/:id"
                        element={
                          <PrivateRoute>
                            <UpdateTestResult />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/treatment-for-patient/:appointmentId"
                        element={
                          <PrivateRoute>
                            <TreatmentForPatient />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/test-result-for-patient/:appointmentId"
                        element={
                          <PrivateRoute>
                            <TestResultForPatient />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/schedule-manager/:doctorId"
                        element={
                          <PrivateRoute>
                            <ScheduleManager />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/update-schedule/:scheduleId"
                        element={
                          <PrivateRoute>
                            <UpdateSchedule />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/schedule/create/:doctorId"
                        element={
                          <PrivateRoute>
                            <CreateSchedule />
                          </PrivateRoute>
                        }
                      />
                      <Route
                        path="/my-schedules"
                        element={
                          <PrivateRoute>
                            <ViewListWorkSchedule />
                          </PrivateRoute>
                        }
                      />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
