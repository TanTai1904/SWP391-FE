import api from './api';

const formatDate = (dateValue) => {
  if (!dateValue) return null;
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue; // Return as-is if invalid
    
    // Format as YYYY-MM-DD for API
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateValue; // Return original on error
  }
};

const appointmentService = {
  // Create appointment with proper payload formatting
  create: (appointmentData) => {
    const payload = {
      ...appointmentData,
      appointmentDate: formatDate(appointmentData.appointmentDate),
      isAnonymous: appointmentData.isAnonymous ?? (appointmentData.patientId === null),
    };
    
    console.log('Creating appointment with formatted payload:', payload);
    return api.post('/Appointment/Create', payload);
  },
  
  // Update appointment with proper payload formatting
  update: (appointmentData) => {
    const payload = {
      ...appointmentData,
      appointmentId: appointmentData.appointmentId || appointmentData.id,
      appointmentDate: formatDate(appointmentData.appointmentDate)
    };
    
    // Remove id if appointmentId is present (API expects appointmentId)
    if (payload.appointmentId && payload.id && payload.appointmentId !== payload.id) {
      delete payload.id;
    }
    
    console.log('Updating appointment with formatted payload:', payload);
    return api.put('/Appointment/Update', payload);
  },
  
  // Update appointment status (using standard update)
  updateStatus: (appointmentId, status, additionalData = {}) => {
    const payload = { 
      appointmentId, 
      status,
      ...additionalData
    };
    
    if (payload.appointmentDate) {
      payload.appointmentDate = formatDate(payload.appointmentDate);
    }
    
    return api.put('/Appointment/Update', payload);
  },
  
  // Get appointments by patient ID
  getByPatientId: (id) => api.get(`/Appointment/GetByPatientId/${id}`),
  
  // Get appointments by doctor ID
  getByDoctorId: (id) => api.get(`/Appointment/GetByDoctorId/${id}`),
  
  // Get appointment by ID
  getById: (id) => api.get(`/Appointment/GetByID/${id}`),
  
  // Get available doctors
  getAvailableDoctors: () => api.get('/Appointment/GetAvailableDoctors'),
  
  // Get all scheduled appointments
  getAllScheduled: () => api.get('/Appointment/GetAllScheduled'),

  // Legacy methods for backward compatibility, updated to use proper API patterns
  createAppointment: async (appointmentData) => {
    const payload = {
      ...appointmentData,
      appointmentDate: formatDate(appointmentData.appointmentDate),
      isAnonymous: appointmentData.isAnonymous ?? (appointmentData.patientId === null),
    };
    
    const response = await api.post('/Appointment/Create', payload);
    return response.data;
  },

  getAppointmentById: async (id) => {
    const response = await api.get(`/Appointment/GetByID/${id}`);
    return response.data;
  },

  getUserAppointments: async () => {
    const response = await api.get('/Appointment/GetAllScheduled');
    return response.data;
  },

  updateAppointmentStatus: async (appointmentId, status) => {
    const payload = { appointmentId, status };
    const response = await api.put(`/Appointment/Update`, payload);
    return response.data;
  },

  cancelAppointment: async (appointmentId, reason) => {
    const payload = { 
      appointmentId, 
      status: 'Cancelled', 
      note: reason || "Appointment cancelled"
    };
    const response = await api.put(`/Appointment/Update`, payload);
    return response.data;
  },

  rescheduleAppointment: async (appointmentId, newDateTime) => {
    const payload = { 
      appointmentId,
      appointmentDate: formatDate(newDateTime)
    };
    const response = await api.put(`/Appointment/Update`, payload);
    return response.data;
  },
  
  // Additional helper methods for the Consultation component
  createNewAppointment: async (appointmentData) => {
    try {
      const formattedData = {
        ...appointmentData,
        appointmentDate: formatDate(appointmentData.appointmentDate),
        isAnonymous: appointmentData.isAnonymous ?? (appointmentData.patientId === null)
      };
      
      // Log auth state before API call
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Authentication state before creating appointment:', {
        tokenExists: !!token,
        userExists: !!user,
        doctorId: formattedData.doctorId,
        payload: formattedData
      });
      
      const response = await api.post('/Appointment/Create', formattedData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      
      // Enhanced error logging
      if (error.response?.status === 403) {
        console.error('Permission denied for appointment creation. Check doctor role and permissions.');
      } else if (error.response?.status === 400) {
        console.error('Invalid appointment data:', error.response.data);
      }
      
      throw error;
    }
  },
  
  updateAppointmentById: async (appointmentId, updateData) => {
    try {
      const payload = {
        ...updateData,
        appointmentId,
        appointmentDate: formatDate(updateData.appointmentDate)
      };
      
      // Use the standard Update endpoint
      const response = await api.put(`/Appointment/Update`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  },
  
  deleteAppointment: async (id) => {
    try {
      const response = await api.delete(`/Appointment/Delete/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting appointment:', error);
      throw error;
    }
  }
};

export default appointmentService;