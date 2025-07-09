import api from './api';

const appointmentService = {
  // Create appointment
  create: (appointmentData) => api.post('/Appointment/Create', appointmentData),
  
  // Update appointment
  update: (appointmentData) => api.put('/Appointment/Update', appointmentData),
  
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

  // Legacy methods for backward compatibility
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/Appointment/Create', appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/Appointment/GetByID/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserAppointments: async () => {
    try {
      const response = await api.get('/Appointment/GetAllScheduled');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await api.put(`/Appointment/Update`, { id, status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelAppointment: async (id, reason) => {
    try {
      const response = await api.put(`/Appointment/Update`, { id, status: 'Cancelled', reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rescheduleAppointment: async (id, newDateTime) => {
    try {
      const response = await api.put(`/Appointment/Update`, { id, appointmentDate: newDateTime });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Additional helper methods for the Consultation component
  createNewAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/Appointment/Create', appointmentData);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  updateAppointmentById: async (id, updateData) => {
    try {
      const payload = {
        ...updateData,
        id
      };
      const response = await api.put('/Appointment/Update', payload);
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