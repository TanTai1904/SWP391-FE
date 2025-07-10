import api from './api';

const emailService = {
  // Send email
  sendEmail: (emailData) => api.post('/Email/SendEmail', emailData),
  
  // Verify patient
  verifyPatient: (verificationData) => api.post('/Email/VerifyPatient', verificationData),
  
  // Send forgot password email
  sendForgotPasswordEmail: (emailData) => api.post('/Email/SendForgotPasswordEmail', emailData),
  
  // Reset password
  resetPassword: (resetData) => api.post('/Email/ResetPassword', resetData)
};

export default emailService; 