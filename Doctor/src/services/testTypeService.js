import api from './api';

const testTypeService = {
  // Create test type
  createTestType: (testTypeData) => api.post('/TestType/Create', testTypeData),
  
  // Update test type
  updateTestType: (testTypeData) => api.put('/TestType/Update', testTypeData),
  
  // Get all test types
  getAllTestTypes: () => api.get('/TestType/GetAll'),
  
  // Get test type by ID
  getTestTypeById: (id) => api.get(`/TestType/GetByID/${id}`),
  
  // Delete test type
  deleteTestType: (id) => api.delete(`/TestType/Delete/${id}`)
};

export default testTypeService; 