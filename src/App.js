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
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

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
