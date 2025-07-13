import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const TestResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [testTypes, setTestTypes] = useState([]);
  const [appointmentData, setAppointmentData] = useState(null);
  const [formData, setFormData] = useState({
    appointmentId: location.state?.appointmentId || '',
    patientId: location.state?.patientId || '',
    doctorId: location.state?.doctorId || '',
    testTypeId: null,
    resultValue: '',
    notes: ''
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
    if (user.userRole !== 'Doctor') {
      toast.error('Bạn không có quyền truy cập trang này');
      navigate('/');
      return;
    }
    if (!location.state?.appointmentId) {
      toast.error('Không tìm thấy thông tin cuộc hẹn');
      navigate('/appointment-manager');
      return;
    }

    // Fetch appointment data and test types
    fetchAppointmentData();
    fetchTestTypes();
  }, [isAuthenticated, user, location.state]);

  const fetchAppointmentData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/Appointment/GetByID/${location.state.appointmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        const appointment = response.data.data;
        setAppointmentData(appointment);
        setFormData(prev => ({
          ...prev,
          testTypeId: appointment.testTypeId,
          patientId: appointment.patientId,
          doctorId: appointment.doctorId
        }));
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      toast.error('Không thể tải thông tin cuộc hẹn');
    }
  };

  const fetchTestTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/TestType/GetAll', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data.status) {
        setTestTypes(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching test types:', error);
      toast.error('Không thể tải danh sách loại xét nghiệm');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.testTypeId) {
      toast.error('Vui lòng chọn loại xét nghiệm');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Format data according to API requirements
      const submitData = {
        appointmentId: parseInt(formData.appointmentId),
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        testTypeId: parseInt(formData.testTypeId),
        resultValue: formData.resultValue,
        notes: formData.notes
      };

      console.log('Submitting data:', submitData);

      const response = await axios.post('http://localhost:8080/api/TestResult/Create', submitData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        toast.success('Tạo kết quả khám thành công');
        navigate('/appointments/management');
      } else {
        toast.error(response.data.message || 'Không thể tạo kết quả khám');
      }
    } catch (error) {
      console.error('Error creating test result:', error);
      toast.error('Đã xảy ra lỗi khi tạo kết quả khám');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Tạo Kết Quả Khám</h1>
          <p className="text-lg text-gray-600">
            Vui lòng điền đầy đủ thông tin kết quả khám cho bệnh nhân
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Test Type Section */}
                <div className="space-y-4">
                  <label className="block text-lg font-semibold text-gray-900">
                    Loại xét nghiệm
                  </label>
                  
                  {appointmentData?.testTypeId ? (
                    // Display existing test type
                    <div className="p-6 rounded-xl bg-gray-50 border-2 border-gray-200">
                      <div className="flex items-center">
                        <span className="text-lg text-gray-700">{appointmentData.testTypeName}</span>
                        <span className="ml-3 px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 rounded-full">
                          Đã chỉ định
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Test type selection grid
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {testTypes.map((testType) => (
                        <button
                          key={testType.testTypeId}
                          type="button"
                          className={`relative p-6 rounded-xl font-medium text-left transition-all duration-300 group hover:shadow-md ${
                            formData.testTypeId === testType.testTypeId
                              ? 'bg-blue-600 text-white shadow-lg transform scale-[1.02]'
                              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-400'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, testTypeId: testType.testTypeId }))}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{testType.testTypeName}</span>
                            {formData.testTypeId === testType.testTypeId && (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Result Value Section */}
                <div className="space-y-4">
                  <label htmlFor="resultValue" className="block text-lg font-semibold text-gray-900">
                    Kết quả khám
                  </label>
                  <div className="relative">
                    <textarea
                      id="resultValue"
                      name="resultValue"
                      rows={4}
                      required
                      className="w-full px-6 py-4 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                      value={formData.resultValue}
                      onChange={handleChange}
                      placeholder="Nhập chi tiết kết quả khám của bệnh nhân..."
                    />
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <label htmlFor="notes" className="block text-lg font-semibold text-gray-900">
                    Ghi chú bổ sung
                  </label>
                  <div className="relative">
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      className="w-full px-6 py-4 text-base rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Nhập các ghi chú bổ sung (nếu có)..."
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/appointment-manager')}
                    className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-300"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      'Lưu kết quả'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultPage;
