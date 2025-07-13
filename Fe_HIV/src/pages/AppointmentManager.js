import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const AppointmentManager = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testResults, setTestResults] = useState({});
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

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

      const response = await axios.get(`http://localhost:8080/api/Appointment/GetByDoctorId/${user.doctorId}`, {
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
            const testResultsResponse = await axios.get(`http://localhost:8080/api/TestResult/GetAll`, {
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
      const response = await axios.put(`http://localhost:8080/api/Appointment/Update`, {
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
    navigate(`/test-result/create`, {
      state: {
        appointmentId,
        patientId,
        doctorId
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
              <tr key={appointment.appointmentId}>
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
                      {!testResults[appointment.appointmentId] && (
                        <button
                          onClick={() => handleCreateTestResult(appointment.appointmentId, appointment.patientId, appointment.doctorId)}
                          className="text-blue-600 hover:text-blue-900 bg-blue-100 px-3 py-1 rounded flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          Tạo kết quả khám
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
