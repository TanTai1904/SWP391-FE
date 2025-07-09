import axios from 'axios';

const BASE_URL = 'http://localhost:1566/api'; // Updated port to 1566

// Helper function to format time for API (HH:mm:ss format)
export const formatTimeForApi = (time) => {
  if (!time) return "00:00:00";
  
  // If it already has seconds, return as is
  if (time.split(':').length > 2) return time;
  
  // Otherwise add seconds
  return `${time}:00`;
};

// Helper function to validate dates
export const validateDate = (date) => {
  if (!date) return false;
  
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time part to compare only dates
  
  return selectedDate >= today;
};

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (try both locations)
    let token = localStorage.getItem('token');
    let userToken = null;
    let userData = null;
    
    // Also try to get token from user object as backup
    try {
      const user = localStorage.getItem('user');
      if (user) {
        userData = JSON.parse(user);
        userToken = userData.accessToken;
        
        // Log detailed user info for debugging
        console.log('User data from localStorage:', {
          id: userData.id || userData.doctorId,
          role: userData.role || 'no role defined',
          hasDirectToken: !!token,
          hasUserToken: !!userToken,
          endpoint: config.url
        });
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
    
    // Use token from either source (prioritize direct token)
    const finalToken = token || userToken;
    
    if (finalToken) {
      config.headers.Authorization = `Bearer ${finalToken}`;
      console.log('Using auth token:', finalToken.substring(0, 10) + '...' + ' for endpoint:', config.url);
      
      // Debug permissions for appointment endpoints
      if (config.url.includes('/Appointment/')) {
        console.log('🔐 Request to appointment endpoint:', {
          url: config.url,
          method: config.method,
          userId: userData?.id || userData?.doctorId || 'unknown',
          userRole: userData?.role || 'unknown',
          tokenLength: finalToken.length
        });
      }
    } else {
      console.warn('⚠️ No token found for API request to:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response ${response.config.method.toUpperCase()} ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    try {
      // Log detailed error information
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Handle specific HTTP status codes
      if (error.response?.status === 401) {
        console.warn('🔒 Unauthorized access, redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (error.response?.status === 400) {
        // Try to get specific validation errors from response
        const errorData = error.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          console.error('🚨 Bad Request - Invalid Data:', errorData);
          
          // Check for validation errors in the common .NET format
          if (errorData.errors) {
            console.error('Validation Errors:', errorData.errors);
            
            // Log each validation error for clarity
            Object.keys(errorData.errors).forEach(key => {
              console.error(`Field '${key}':`, errorData.errors[key]);
            });
          }
        } else {
          console.error('Bad Request with non-object response:', errorData);
        }
      } else if (error.response?.status === 403) {
        console.error('🔐 Forbidden - Insufficient Permissions:', {
          url: error.config?.url,
          method: error.config?.method?.toUpperCase() || 'UNKNOWN',
          response: error.response?.data || 'No response data'
        });
        
        // Detailed token debugging for 403 errors
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        console.error('403 Error - Authentication Details:', {
          directTokenExists: !!token,
          directTokenLength: token ? token.length : 0,
          directTokenStart: token ? token.substring(0, 15) + '...' : 'no direct token',
          userObjectExists: !!user
        });
        
        if (user) {
          try {
            const userData = JSON.parse(user);
            console.error('403 Error - User Details:', {
              id: userData.id || userData.doctorId || 'missing ID',
              role: userData.role || 'no role',
              userTokenExists: !!userData.accessToken,
              userTokenLength: userData.accessToken ? userData.accessToken.length : 0,
              userTokenStart: userData.accessToken ? userData.accessToken.substring(0, 15) + '...' : 'no user token'
            });
          } catch (e) { 
            console.error('Error parsing user data during 403 error:', e);
          }
        }
      } else if (error.response?.status === 404) {
        console.error('🔍 Not Found - API endpoint not available:', error.config?.url);
      } else {
        console.error('❌ Unhandled API Error:', error.message);
      }
    } catch (loggingError) {
      console.error('Error while handling API error:', loggingError);
    }
    
    return Promise.reject(error);
  }
);

// Utility function to safely process API responses that may vary in structure
export const processApiResponse = (response) => {
  if (!response) return [];
  
  // Handle different response structures
  let data = response.data;
  
  // Case 1: Direct array
  if (Array.isArray(data)) {
    return data;
  }
  
  // Case 2: Array in data property
  if (data && Array.isArray(data.data)) {
    return data.data;
  }
  
  // Case 3: Data is an object but not the expected format
  if (data && typeof data === 'object') {
    // Try to find any array property
    const arrayProps = Object.keys(data).filter(key => Array.isArray(data[key]));
    if (arrayProps.length > 0) {
      return data[arrayProps[0]]; // Return first array found
    }
    
    // If no arrays found, return data as single-item array
    return [data];
  }
  
  // Fall back to empty array if data is not processable
  return [];
};

// Special appointment API wrapper functions to ensure correct payload formatting
export const appointmentApi = {
  create: async (data) => {
    try {
      // Format the date correctly
      let appointmentDate = data.appointmentDate;
      if (appointmentDate && appointmentDate instanceof Date) {
        const year = appointmentDate.getFullYear();
        const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
        const day = String(appointmentDate.getDate()).padStart(2, '0');
        appointmentDate = `${year}-${month}-${day}`;
      } else if (appointmentDate && typeof appointmentDate === 'string' && !appointmentDate.includes('-')) {
        // Try to parse and format the date
        const date = new Date(appointmentDate);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          appointmentDate = `${year}-${month}-${day}`;
        }
      }
      
      // Create clean payload with properly named fields
      const payload = {
        doctorId: data.doctorId,
        patientId: data.patientId || null,
        patientName: data.patientName || "",
        appointmentDate,
        appointmentTime: data.appointmentTime || "00:00",
        appointmentType: data.appointmentType || "Tư vấn trực tiếp",
        reason: data.reason || "",
        note: data.note || "",
        isAnonymous: data.isAnonymous ?? (data.patientId === null),
        status: data.status || 'Pending'
      };
      
      console.log('Creating appointment with API wrapper:', payload);
      
      // Log auth state before making the request
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      console.log('Auth state before create appointment:', {
        directTokenExists: !!token,
        userExists: !!userStr
      });
      
      return await api.post('/Appointment/Create', payload);
    } catch (error) {
      console.error('Error in appointment create wrapper:', error);
      throw error;
    }
  },
  
  update: async (data) => {
    try {
      // Format the date correctly
      let appointmentDate = data.appointmentDate;
      if (appointmentDate && appointmentDate instanceof Date) {
        const year = appointmentDate.getFullYear();
        const month = String(appointmentDate.getMonth() + 1).padStart(2, '0');
        const day = String(appointmentDate.getDate()).padStart(2, '0');
        appointmentDate = `${year}-${month}-${day}`;
      } else if (appointmentDate && typeof appointmentDate === 'string' && !appointmentDate.includes('-')) {
        // Try to parse and format the date
        const date = new Date(appointmentDate);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          appointmentDate = `${year}-${month}-${day}`;
        }
      }
      
      // Use appointmentId from either id or appointmentId field
      const appointmentId = data.appointmentId || data.id;
      if (!appointmentId) {
        throw new Error('Missing appointmentId or id field for update operation');
      }
      
      // Create clean payload with properly named fields
      const payload = {
        appointmentId,
        doctorId: data.doctorId,
        appointmentDate,
        appointmentTime: data.appointmentTime || "00:00",
        appointmentType: data.appointmentType || "Tư vấn trực tiếp",
        status: data.status || 'Pending',
        // Optional fields
        patientName: data.patientName || "",
        reason: data.reason || "",
        note: data.note || ""
      };
      
      console.log('Updating appointment with API wrapper:', payload);
      return await api.put('/Appointment/Update', payload);
    } catch (error) {
      console.error('Error in appointment update wrapper:', error);
      throw error;
    }
  },
  
  getByDoctorId: async (doctorId) => {
    try {
      const response = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      return processApiResponse(response);
    } catch (error) {
      console.error(`Error fetching appointments for doctor ${doctorId}:`, error);
      throw error;
    }
  }
};

export default api;