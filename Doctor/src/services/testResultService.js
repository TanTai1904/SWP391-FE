import api from './api';

const testResultService = {
  // Create test result
  createTestResult: (testResultData) => api.post('/TestResult/Create', testResultData),
  
  // Update test result
  updateTestResult: (testResultData) => api.put('/TestResult/Update', testResultData),
  
  // Get all test results
  getAllTestResults: () => api.get('/TestResult/GetAll'),
  
  // Get test result by ID
  getTestResultById: (id) => api.get(`/TestResult/GetByID/${id}`),
  
  // Delete test result
  deleteTestResult: (id) => api.delete(`/TestResult/Delete/${id}`)
};

export default testResultService; 