import api from './api';

const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get('/api/Doctor/GetAll');
      console.log('API response (getAllDoctors):', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all doctors:', error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/api/Doctor/GetById/${id}`);
      console.log('API response (getDoctorById):', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorsBySpecialty: async (specialty) => {
    try {
      const response = await api.get(`/api/Doctor/GetBySpecialty/${specialty}`);
      console.log('API response (getDoctorsBySpecialty):', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctors by specialty ${specialty}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorSchedule: async (doctorId) => {
    try {
      const response = await api.get(`/api/Doctor/Schedule/${doctorId}`);
      console.log('API response (getDoctorSchedule):', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching doctor schedule for ID ${doctorId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/api/Doctor/AvailableSlots/${doctorId}/${date}`);
      console.log('API response (getDoctorAvailableSlots):', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching available slots for doctor ID ${doctorId} on ${date}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDashboardSummary: async () => {
    try {
      const response = await api.get('/api/Doctor/dashboard-summary');
      console.log('API response (getDashboardSummary):', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching doctor dashboard summary:', error.response?.data || error.message);
      throw error;
    }
  },
};

export default doctorService; 