import api from './api';

const serviceService = {
  getAllServices: async () => {
    try {
      const response = await api.get('/services');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getServiceById: async (id) => {
    try {
      const response = await api.get(`/services/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getServicesByCategory: async (category) => {
    try {
      const response = await api.get(`/services/category/${category}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getServicePricing: async (serviceId) => {
    try {
      const response = await api.get(`/services/${serviceId}/pricing`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default serviceService; 