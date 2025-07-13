import api from './api';

// Helper to handle API requests
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    throw error;
  }
};

const appointmentService = {
  createAppointment: (appointmentData) =>
    handleRequest(api.post('/appointments', appointmentData)),

  getAppointmentById: (id) =>
    handleRequest(api.get(`/appointments/${id}`)),

  getUserAppointments: () =>
    handleRequest(api.get('/appointments/user')),

  updateAppointmentStatus: (id, status) =>
    handleRequest(api.patch(`/appointments/${id}/status`, { status })),

  cancelAppointment: (id, reason) =>
    handleRequest(api.post(`/appointments/${id}/cancel`, { reason })),

  rescheduleAppointment: (id, newDateTime) =>
    handleRequest(api.post(`/appointments/${id}/reschedule`, { newDateTime })),
};

export default appointmentService;