import api from './api';

const notificationService = {
  // Test morning job
  testMorningJob: () => api.post('/Notification/test-morning-job'),
  
  // Test evening job
  testEveningJob: () => api.post('/Notification/test-evening-job'),
  
  // Send appointment reminders
  sendAppointmentReminders: () => api.post('/Notification/send-appointment-reminders'),
  
  // Send medication reminders
  sendMedicationReminders: (frequency) => api.post(`/Notification/send-medication-reminders/${frequency}`)
};

export default notificationService; 