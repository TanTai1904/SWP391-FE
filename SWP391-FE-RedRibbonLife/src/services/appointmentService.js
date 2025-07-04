import api from './api';

const appointmentService = {
  createAppointment: async (appointmentData) => {
    try {
      const response = await api.post('/appointments', appointmentData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAppointmentById: async (id) => {
    try {
      const response = await api.get(`/appointments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserAppointments: async () => {
    try {
      const response = await api.get('/appointments/user');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateAppointmentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/appointments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  cancelAppointment: async (id, reason) => {
    try {
      const response = await api.post(`/appointments/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  rescheduleAppointment: async (id, newDateTime) => {
    try {
      const response = await api.post(`/appointments/${id}/reschedule`, { newDateTime });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default appointmentService; 