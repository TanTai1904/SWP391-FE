import api from './api';

const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get('/doctors');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/doctors/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorsBySpecialty: async (specialty) => {
    try {
      const response = await api.get(`/doctors/specialty/${specialty}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorSchedule: async (doctorId) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/schedule`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getDoctorAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/available-slots`, {
        params: { date }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default doctorService; 