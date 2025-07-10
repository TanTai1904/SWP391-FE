import api from './api';
import { processApiResponse } from './api';

// Helper function to format dates for API requests (YYYY-MM-DD)
const formatDateForApi = (date) => {
  if (!date) return null;
  
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // If it's already formatted string, return as is
  return date;
};

const adminService = {
  // ========== Authentication ==========
  login: (credentials) => {
    console.log('Admin Login API called with:', { ...credentials, password: '***' });
    return api.post('/Admin/login', credentials)
      .then(response => {
        console.log('Admin login response:', Object.keys(response.data || {}));
        return response;
      })
      .catch(error => {
        console.error('Admin login API error:', error.message);
        throw error;
      });
  },
  
  // Get current admin user
  getCurrentAdmin: () => {
    return api.get('/Admin/me')
      .then(response => {
        console.log('Get current admin response:', response.data);
        return response;
      })
      .catch(error => {
        console.error('Get current admin error:', error.message);
        throw error;
      });
  },
  
  // ========== Admin Management ==========
  getAllAdmins: async () => {
    try {
      const response = await api.get('/Admin/GetAll');
      console.log('Admin data fetched:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching admins:', error.message);
      throw error;
    }
  },
  
  getAdminById: (id) => {
    return api.get(`/Admin/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching admin ${id}:`, error.message);
        throw error;
      });
  },
  
  createAdmin: (adminData) => {
    const formattedData = {
      ...adminData,
      dateOfBirth: formatDateForApi(adminData.dateOfBirth)
    };
    console.log('Creating admin with data:', { ...formattedData, password: '***' });
    
    return api.post('/Admin/Create', formattedData)
      .catch(error => {
        console.error('Error creating admin:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateAdmin: (adminData) => {
    const formattedData = {
      ...adminData,
      dateOfBirth: formatDateForApi(adminData.dateOfBirth)
    };
    console.log('Updating admin with data:', { 
      id: formattedData.userId,
      username: formattedData.username,
      hasPassword: !!formattedData.password 
    });
    
    return api.put('/Admin/Update', formattedData)
      .catch(error => {
        console.error('Error updating admin:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteAdmin: (id) => {
    console.log('Deleting admin with ID:', id);
    return api.delete(`/Admin/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting admin ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Doctor Management ==========
  getAllDoctors: async () => {
    try {
      const response = await api.get('/Doctor/GetAll');
      console.log('Doctor data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching doctors:', error.message);
      throw error;
    }
  },
  
  getDoctorById: (id) => {
    return api.get(`/Doctor/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching doctor ${id}:`, error.message);
        throw error;
      });
  },
  
  createDoctor: (doctorData) => {
    const formattedData = {
      ...doctorData,
      dateOfBirth: formatDateForApi(doctorData.dateOfBirth)
    };
    return api.post('/Doctor/Create', formattedData)
      .catch(error => {
        console.error('Error creating doctor:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateDoctor: (doctorData) => {
    const formattedData = {
      ...doctorData,
      dateOfBirth: formatDateForApi(doctorData.dateOfBirth)
    };
    return api.put('/Doctor/Update', formattedData)
      .catch(error => {
        console.error('Error updating doctor:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteDoctor: (id) => {
    return api.delete(`/Doctor/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting doctor ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Patient Management ==========
  getAllPatients: async () => {
    try {
      const response = await api.get('/Patient/GetAll');
      console.log('Patient data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching patients:', error.message);
      throw error;
    }
  },
  
  getPatientById: (id) => {
    return api.get(`/Patient/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching patient ${id}:`, error.message);
        throw error;
      });
  },
  
  createPatient: (patientData) => {
    const formattedData = {
      ...patientData,
      dateOfBirth: formatDateForApi(patientData.dateOfBirth)
    };
    return api.post('/Patient/Create', formattedData)
      .catch(error => {
        console.error('Error creating patient:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updatePatient: (patientData) => {
    const formattedData = {
      ...patientData,
      dateOfBirth: formatDateForApi(patientData.dateOfBirth)
    };
    return api.put('/Patient/Update', formattedData)
      .catch(error => {
        console.error('Error updating patient:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deletePatient: (id) => {
    return api.delete(`/Patient/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting patient ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Appointment Management ==========
  getAllAppointments: async () => {
    try {
      const response = await api.get('/Appointment/GetAll');
      console.log('Appointment data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching appointments:', error.message);
      throw error;
    }
  },
  
  getAppointmentById: (id) => {
    return api.get(`/Appointment/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching appointment ${id}:`, error.message);
        throw error;
      });
  },
  
  createAppointment: (appointmentData) => {
    const formattedData = {
      ...appointmentData,
      appointmentDate: formatDateForApi(appointmentData.appointmentDate)
    };
    return api.post('/Appointment/Create', formattedData)
      .catch(error => {
        console.error('Error creating appointment:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateAppointment: (appointmentData) => {
    const formattedData = {
      ...appointmentData,
      appointmentDate: formatDateForApi(appointmentData.appointmentDate)
    };
    return api.put('/Appointment/Update', formattedData)
      .catch(error => {
        console.error('Error updating appointment:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteAppointment: (id) => {
    return api.delete(`/Appointment/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting appointment ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Article Management ==========
  getAllArticles: async () => {
    try {
      const response = await api.get('/Article/GetAll');
      console.log('Article data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching articles:', error.message);
      throw error;
    }
  },
  
  getArticleById: (id) => {
    return api.get(`/Article/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching article ${id}:`, error.message);
        throw error;
      });
  },
  
  createArticle: (articleData) => {
    return api.post('/Article/Create', articleData)
      .catch(error => {
        console.error('Error creating article:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateArticle: (articleData) => {
    return api.put('/Article/Update', articleData)
      .catch(error => {
        console.error('Error updating article:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteArticle: (id) => {
    return api.delete(`/Article/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting article ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Category Management ==========
  getAllCategories: async () => {
    try {
      const response = await api.get('/Category/GetAll');
      console.log('Category data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching categories:', error.message);
      throw error;
    }
  },
  
  getCategoryById: (id) => {
    return api.get(`/Category/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching category ${id}:`, error.message);
        throw error;
      });
  },
  
  createCategory: (categoryData) => {
    return api.post('/Category/Create', categoryData)
      .catch(error => {
        console.error('Error creating category:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateCategory: (categoryData) => {
    return api.put('/Category/Update', categoryData)
      .catch(error => {
        console.error('Error updating category:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteCategory: (id) => {
    return api.delete(`/Category/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting category ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== ARV Component Management ==========
  getAllARVComponents: async () => {
    try {
      const response = await api.get('/ARVComponent/GetAll');
      console.log('ARV Component data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching ARV components:', error.message);
      throw error;
    }
  },
  
  getARVComponentById: (id) => {
    return api.get(`/ARVComponent/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching ARV component ${id}:`, error.message);
        throw error;
      });
  },
  
  createARVComponent: (componentData) => {
    return api.post('/ARVComponent/Create', componentData)
      .catch(error => {
        console.error('Error creating ARV component:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateARVComponent: (componentData) => {
    return api.put('/ARVComponent/Update', componentData)
      .catch(error => {
        console.error('Error updating ARV component:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteARVComponent: (id) => {
    return api.delete(`/ARVComponent/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting ARV component ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== ARV Regimen Management ==========
  getAllARVRegimens: async () => {
    try {
      const response = await api.get('/ARVRegimen/GetAll');
      console.log('ARV Regimen data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching ARV regimens:', error.message);
      throw error;
    }
  },
  
  getARVRegimenById: (id) => {
    return api.get(`/ARVRegimen/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching ARV regimen ${id}:`, error.message);
        throw error;
      });
  },
  
  createARVRegimen: (regimenData) => {
    return api.post('/ARVRegimen/Create', regimenData)
      .catch(error => {
        console.error('Error creating ARV regimen:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateARVRegimen: (regimenData) => {
    return api.put('/ARVRegimen/Update', regimenData)
      .catch(error => {
        console.error('Error updating ARV regimen:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteARVRegimen: (id) => {
    return api.delete(`/ARVRegimen/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting ARV regimen ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Test Type Management ==========
  getAllTestTypes: async () => {
    try {
      const response = await api.get('/TestType/GetAll');
      console.log('Test Type data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching test types:', error.message);
      throw error;
    }
  },
  
  getTestTypeById: (id) => {
    return api.get(`/TestType/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching test type ${id}:`, error.message);
        throw error;
      });
  },
  
  createTestType: (typeData) => {
    return api.post('/TestType/Create', typeData)
      .catch(error => {
        console.error('Error creating test type:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateTestType: (typeData) => {
    return api.put('/TestType/Update', typeData)
      .catch(error => {
        console.error('Error updating test type:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteTestType: (id) => {
    return api.delete(`/TestType/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting test type ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Test Result Management ==========
  getAllTestResults: async () => {
    try {
      const response = await api.get('/TestResult/GetAll');
      console.log('Test Result data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching test results:', error.message);
      throw error;
    }
  },
  
  getTestResultById: (id) => {
    return api.get(`/TestResult/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching test result ${id}:`, error.message);
        throw error;
      });
  },
  
  getTestResultsByPatientId: (patientId) => {
    return api.get(`/TestResult/GetByPatientID/${patientId}`)
      .catch(error => {
        console.error(`Error fetching test results for patient ${patientId}:`, error.message);
        throw error;
      });
  },
  
  createTestResult: (resultData) => {
    const formattedData = {
      ...resultData,
      testDate: formatDateForApi(resultData.testDate)
    };
    return api.post('/TestResult/Create', formattedData)
      .catch(error => {
        console.error('Error creating test result:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateTestResult: (resultData) => {
    const formattedData = {
      ...resultData,
      testDate: formatDateForApi(resultData.testDate)
    };
    return api.put('/TestResult/Update', formattedData)
      .catch(error => {
        console.error('Error updating test result:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteTestResult: (id) => {
    return api.delete(`/TestResult/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting test result ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Notification Management ==========
  getAllNotifications: async () => {
    try {
      const response = await api.get('/Notification/GetAll');
      console.log('Notification data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      throw error;
    }
  },
  
  getNotificationById: (id) => {
    return api.get(`/Notification/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching notification ${id}:`, error.message);
        throw error;
      });
  },
  
  createNotification: (notificationData) => {
    return api.post('/Notification/Create', notificationData)
      .catch(error => {
        console.error('Error creating notification:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateNotification: (notificationData) => {
    return api.put('/Notification/Update', notificationData)
      .catch(error => {
        console.error('Error updating notification:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteNotification: (id) => {
    return api.delete(`/Notification/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting notification ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== User Management ==========
  getAllUsers: async () => {
    try {
      const response = await api.get('/User/GetAll');
      console.log('User data fetched:', processApiResponse(response).length);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      throw error;
    }
  },
  
  getUserById: (id) => {
    return api.get(`/User/GetByID/${id}`)
      .catch(error => {
        console.error(`Error fetching user ${id}:`, error.message);
        throw error;
      });
  },
  
  createUser: (userData) => {
    const formattedData = {
      ...userData,
      dateOfBirth: formatDateForApi(userData.dateOfBirth)
    };
    return api.post('/User/Create', formattedData)
      .catch(error => {
        console.error('Error creating user:', error.message, error.response?.data);
        throw error;
      });
  },
  
  updateUser: (userData) => {
    const formattedData = {
      ...userData,
      dateOfBirth: formatDateForApi(userData.dateOfBirth)
    };
    return api.put('/User/Update', formattedData)
      .catch(error => {
        console.error('Error updating user:', error.message, error.response?.data);
        throw error;
      });
  },
  
  deleteUser: (id) => {
    return api.delete(`/User/Delete/${id}`)
      .catch(error => {
        console.error(`Error deleting user ${id}:`, error.message);
        throw error;
      });
  },
  
  // ========== Dashboard Stats ==========
  getDashboardStats: () => {
    return api.get('/Admin/Dashboard')
      .catch(error => {
        console.error('Error fetching dashboard stats:', error.message);
        throw error;
      });
  },
  
  // Helper function to log out
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    console.log('Admin logged out');
  },
  
  // Helper function to check if admin is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('adminToken');
    console.log('Admin authentication check:', !!token);
    return !!token;
  }
};

export default adminService;