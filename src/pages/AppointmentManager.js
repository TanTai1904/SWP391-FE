import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const API_URL = process.env.REACT_APP_API_URL;

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
    fetchAppointments();
  }, [isAuthenticated, user]);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!user?.doctorId) {
        toast.error('Không tìm thấy thông tin bác sĩ');
        return;
      }

      const response = await axios.get(`${API_URL}/api/Appointment/GetByDoctorId/${user.doctorId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        const appointmentsData = response.data.data;
        setAppointments(appointmentsData);
        
        // Fetch test results for each appointment
        for (const appointment of appointmentsData) {
          try {
            const testResultsResponse = await axios.get(`${API_URL}/api/TestResult/GetAll`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            if (testResultsResponse.data.status) {
              const testResultsForAppointment = testResultsResponse.data.data.find(
                tr => tr.appointmentId === appointment.appointmentId
              );
              
              setTestResults(prev => ({
                ...prev,
                [appointment.appointmentId]: testResultsForAppointment
              }));
            }
          } catch (error) {
            console.error('Error fetching test results:', error);
          }
        }
      } else {
        toast.error('Không thể tải danh sách cuộc hẹn');
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách cuộc hẹn');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/api/Appointment/Update`, {
        appointmentId: appointmentId,
        status: newStatus
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        toast.success('Cập nhật trạng thái thành công');
        fetchAppointments(); // Refresh the list
      } else {
        toast.error(response.data.message || 'Không thể cập nhật trạng thái');
      }
    } catch (error) {
      console.error('Error updating appointment status:', error);
      toast.error('Đã xảy ra lỗi khi cập nhật trạng thái');
    }
  };

  const handleCreateTestResult = (appointmentId, patientId, doctorId) => {
    const appointment = appointments.find(app => app.appointmentId === appointmentId);
    if (!appointment) return;

    const appointmentDate = new Date(appointment.appointmentDate);
    const currentDate = new Date();
    
    // Reset hours, minutes, seconds and milliseconds for date comparison
    appointmentDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    if (currentDate < appointmentDate) {
      setSelectedAppointment({ appointmentId, patientId, doctorId });
      setShowModal(true);
      return;
    }

    navigate(`/test-result/create`, {
      state: {
        appointmentId,
        patientId,
        doctorId
      }
    });
  };

  const handleCreatePrescription = (appointmentId, patientId, doctorId) => {
    const testResult = testResults[appointmentId];
    if (!testResult) {
      toast.error('Không tìm thấy kết quả khám cho cuộc hẹn này');
      return;
    }

    const testResultId = testResult.testResultId;
    if (!testResultId) {
      toast.error('Không tìm thấy ID kết quả khám');
      return;
    }

    navigate(`/choose-regiment`, {
      state: {
        appointmentId,
        patientId,
        doctorId,
        testResultId
      }
    });
  };

  const handleEditTestResult = (appointmentId, patientId, doctorId) => {
    navigate(`/test-result/edit`, {
      state: {
        appointmentId,
        patientId,
        doctorId
      }
    });
  };

  const formatDateTime = (date, time) => {
    const formattedDate = new Date(date).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    // Cắt bớt phần giây từ chuỗi thời gian (00:00:00 -> 00:00)
    const formattedTime = time.substring(0, 5);
    return (
      <div>
        <div>Ngày: {formattedDate}</div>
        <div>Giờ: {formattedTime}</div>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'Đã lên lịch';
      case 'Confirmed':
        return 'Đã chấp nhận';
      case 'Cancelled':
        return 'Đã hủy';
      case 'Completed':
        return 'Đã hoàn thành';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" style={{ width: '81%' }}>
      <h1 className="text-2xl font-bold mb-6">Quản lý lịch hẹn</h1>
      
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 mt-4">Cảnh báo</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Không thể tạo kết quả khám trước ngày hẹn khám. Vui lòng chờ đến ngày hẹn khám.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Đóng
                </button>
                <button
                  onClick={() => navigate(`/test-result/create`, {
                    state: {
                      appointmentId: selectedAppointment.appointmentId,
                      patientId: selectedAppointment.patientId,
                      doctorId: selectedAppointment.doctorId
                    }
                  })}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 ms-5"
                >
                  Tiếp tục
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bệnh nhân
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giờ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.appointmentId} className={appointment.status === 'Completed' ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.isAnonymous ? "Ẩn danh" : appointment.patientName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {appointment.appointmentTime.substring(0, 5)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {appointment.status === 'Scheduled' && (
                    <div className="space-x-2">
                      <button
                        onClick={() => handleStatusUpdate(appointment.appointmentId, 'Confirmed')}
                        className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded"
                      >
                        Chấp nhận
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(appointment.appointmentId, 'Cancelled')}
                        className="text-red-600 hover:text-red-900 bg-red-100 px-3 py-1 rounded"
                      >
                        Hủy lịch
                      </button>
                    </div>
                  )}
                  {appointment.status === 'Confirmed' && (
                    <div className="space-x-2">
                      {!testResults[appointment.appointmentId] ? (
                        <button
                          onClick={() => handleCreateTestResult(appointment.appointmentId, appointment.patientId, appointment.doctorId)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Tạo kết quả khám
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCreatePrescription(
                            appointment.appointmentId,
                            appointment.patientId,
                            appointment.doctorId
                          )}
                          className="text-green-600 hover:text-green-900 bg-green-100 px-3 py-1 rounded flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          Tạo đơn thuốc
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AppointmentManager;