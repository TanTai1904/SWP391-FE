import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getToken, isTokenExpired, handleUnauthorized, getUserRole, getUserDetails } from '../services/authService';
import { toast } from 'react-toastify';

const AppointmentsPage = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentType, setAppointmentType] = useState('appointment'); // 'appointment' or 'medication'
  const [testTypes, setTestTypes] = useState([]);
  const [selectedTestType, setSelectedTestType] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra role khi component mount
    const checkUserRole = () => {
      const token = getToken();
      const userRole = getUserRole();

      if (!token) {
        navigate('/login');
        return;
      }

      if (userRole?.toLowerCase() !== 'patient') {
        // Nếu không phải patient, chuyển hướng về trang chủ
        navigate('/');
        return;
      }
    };

    checkUserRole();
  }, [navigate]);

  useEffect(() => {
    // Fetch test types when component mounts
    const fetchTestTypes = async () => {
      const token = getToken();
      try {
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
      }
    };

    fetchTestTypes();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Ensure time is in HH:mm:00 format
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const fetchDoctorDetails = async (doctorId) => {
    const token = getToken();
    try {
      const response = await axios.get(`http://localhost:8080/api/Doctor/GetByID/${doctorId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        const doctorDetails = response.data.data;
        setAvailableDoctors(prev => 
          prev.map(doctor => 
            doctor.doctorId === doctorId 
              ? { ...doctor, details: doctorDetails }
              : doctor
          )
        );
      }
    } catch (error) {
      console.error('Error fetching doctor details:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSelectedDoctor(null);

    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const formattedDate = formatDate(date);
      const formattedTime = formatTime(time);
      
      const response = await axios.get(`http://localhost:8080/api/Appointment/GetAvailableDoctors`, {
        params: {
          appointmentDate: formattedDate,
          appointmentTime: formattedTime
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        const doctors = response.data.data.availableDoctors;
        setAvailableDoctors(doctors);
        
        // Fetch details for each doctor
        doctors.forEach(doctor => {
          fetchDoctorDetails(doctor.doctorId);
        });

        if (doctors.length === 0) {
          setError('Không tìm thấy bác sĩ nào phù hợp với thời gian đã chọn');
        }
      } else {
        setError('Không tìm thấy bác sĩ nào phù hợp với thời gian đã chọn');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.');
        console.error('Error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!date || !time || !selectedDoctor) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    // Validate appointment type and test type
    if (appointmentType === 'medication' && !selectedTestType) {
      toast.error('Vui lòng chọn loại xét nghiệm');
      return;
    }

    try {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        handleUnauthorized(navigate);
        return;
      }

      const userDetails = getUserDetails();
      if (!userDetails || !userDetails.userId) {
        toast.error('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.');
        navigate('/login');
        return;
      }

      const formattedDate = formatDate(date);
      const formattedTime = formatTime(time);

      // Validate date and time
      if (!formattedDate || !formattedTime) {
        toast.error('Thời gian không hợp lệ');
        return;
      }

      const appointmentData = {
        patientId: parseInt(userDetails.userId),
        doctorId: parseInt(selectedDoctor),
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentType: appointmentType === 'medication' ? 'Medication' : 'Appointment',
        testTypeId: appointmentType === 'medication' ? parseInt(selectedTestType) : null,
        isAnonymous: isAnonymous,
        status: "Pending"
      };

      console.log('Sending appointment data:', appointmentData);

      const response = await axios.post(
        'http://localhost:8080/api/Appointment/Create',
        appointmentData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Đặt lịch hẹn thành công');
        navigate('/appointments/list');
      } else {
        toast.error(response.data.message || 'Không thể đặt lịch hẹn');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // Handle specific error cases
      if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.message;
        
        switch (status) {
          case 401:
            handleUnauthorized(navigate);
            break;
          case 400:
            toast.error(errorMessage || 'Thời gian không hợp lệ. Vui lòng kiểm tra lại.');
            break;
          case 500:
            toast.error('Lỗi máy chủ. Vui lòng thử lại sau hoặc liên hệ quản trị viên.');
            break;
          default:
            toast.error('Đã xảy ra lỗi khi đặt lịch hẹn. Vui lòng thử lại.');
        }
      } else if (error.request) {
        toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        toast.error('Đã xảy ra lỗi khi đặt lịch hẹn');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Đặt Lịch Khám Bệnh</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Chọn thời gian phù hợp để gặp bác sĩ chuyên môn của chúng tôi
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ngày khám */}
              <div className="space-y-2">
                <label htmlFor="date" className="block text-lg font-medium text-gray-700">
                  Ngày khám
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
              </div>

              {/* Giờ khám */}
              <div className="space-y-2">
                <label htmlFor="time" className="block text-lg font-medium text-gray-700">
                  Giờ khám
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="time"
                    value={time}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9:]*$/.test(value) && value.length <= 5) {
                        setTime(value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const [hours, minutes] = value.split(':').map(Number);
                        if (hours >= 8 && hours <= 18 && minutes === 0) {
                          const formattedTime = `${hours.toString().padStart(2, '0')}:00`;
                          setTime(formattedTime);
                          setError(null); // Clear any existing error
                        } else {
                          setTime('');
                          if (minutes !== 0) {
                            toast.error('Vui lòng chỉ nhập giờ đúng định dạngdạng Ví dụ: 08:00, 09:00, 10:00...', {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                            });
                          } else {
                            setError('Vui lòng nhập giờ từ 08:00 đến 18:00');
                            toast.error('Vui lòng nhập giờ từ 08:00 đến 18:00. Chúng tôi chỉ làm việc trong giờ hành chính.', {
                              position: "top-right",
                              autoClose: 5000,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                            });
                          }
                        }
                      }
                    }}
                    placeholder="08:00"
                    pattern="([0-1][0-9]|2[0-3]):00"
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    required
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">Thời gian từ 08:00 - 18:00 (chỉ nhập giờ tròn)</p>
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tìm kiếm...
                  </div>
                ) : (
                  'Tìm bác sĩ'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Doctor List */}
        {availableDoctors.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Danh sách bác sĩ có lịch trống</h2>
            <div className="grid gap-6">
              {availableDoctors.map((doctor) => (
                <div
                  key={doctor.doctorId}
                  className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    selectedDoctor === doctor.doctorId ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Thông tin bác sĩ */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {doctor.doctorName}
                        </h3>
                        {doctor.details && (
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              <span className="font-medium">{doctor.details.phoneNumber}</span>
                            </div>
                            <div className="flex items-start text-gray-600">
                              <svg className="w-5 h-5 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                              <span className="font-medium">{doctor.details.bio}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Nút chọn */}
                      <button
                        className={`px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 transform ${
                          selectedDoctor === doctor.doctorId
                            ? 'bg-green-600 text-white shadow-lg hover:bg-green-700'
                            : 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-600 hover:text-white'
                        }`}
                        onClick={() => setSelectedDoctor(doctor.doctorId)}
                      >
                        {selectedDoctor === doctor.doctorId ? 'Đã chọn' : 'Chọn bác sĩ'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Appointment Type Selection */}
            {selectedDoctor && (
              <div className="mt-10 space-y-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Chọn loại lịch hẹn</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className={`p-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                        appointmentType === 'appointment'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAppointmentType('appointment')}
                    >
                      Khám bệnh
                    </button>
                    <button
                      className={`p-4 rounded-xl font-semibold text-base transition-all duration-300 ${
                        appointmentType === 'medication'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setAppointmentType('medication')}
                    >
                      Xét nghiệm
                    </button>
                  </div>
                </div>

                {/* Test Type Selection for Medication */}
                {appointmentType === 'medication' && (
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Chọn loại xét nghiệm</h3>
                    <div className="grid gap-4">
                      {testTypes.map((testType) => (
                        <button
                          key={testType.testTypeId}
                          className={`p-4 rounded-xl font-semibold text-base transition-all duration-300 text-left ${
                            selectedTestType === testType.testTypeId
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => setSelectedTestType(testType.testTypeId)}
                        >
                          {testType.testTypeName}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Anonymous Booking Option */}
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Đặt lịch ẩn danh</h3>
                      <p className="text-gray-600 mt-2">
                        Thông tin của bạn sẽ được bảo mật khi đặt lịch ẩn danh
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                      />
                      <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>

                {/* Book Appointment Button */}
                <div className="flex justify-center">
                  <button
                    className="px-10 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:from-green-700 hover:to-green-800 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBookAppointment}
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Đang xử lý...</span>
                      </div>
                    ) : (
                      'Xác nhận đặt lịch'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage; 