import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getToken, handleUnauthorized } from '../services/authService';

const UpdateAppointmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [searchingDoctors, setSearchingDoctors] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  // Thêm object để map status từ tiếng Anh sang tiếng Việt
  const statusMapping = {
    'Scheduled': 'Đã lên lịch',
    'Completed': 'Đã hoàn thành',
    'Cancelled': 'Đã hủy'
  };

  // Thêm object để map màu sắc cho từng status
  const statusColorMapping = {
    'Scheduled': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handleDateTimeChange = (newDate, newTime) => {
    setDate(newDate);
    setTime(newTime);
    if (newDate && newTime) {
      setHasSearched(true);
      searchAvailableDoctors(newDate, newTime);
    }
  };

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
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const getStatusText = (status) => {
    return statusMapping[status] || status;
  };

  const fetchAppointment = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Appointment/GetByID/${id}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.data.statusCode === 200) {
        const appointmentData = response.data.data;
        setAppointment(appointmentData);
        
        const initialDate = appointmentData.appointmentDate;
        const initialTime = appointmentData.appointmentTime.substring(0, 5);
        
        setDate(initialDate);
        setTime(initialTime);
        setSelectedDoctor(appointmentData.doctorId);
        
        // Tìm kiếm bác sĩ với ngày giờ ban đầu nhưng không hiển thị thông báo
        searchAvailableDoctors(initialDate, initialTime, true);
      } else {
        toast.error('Không thể tải thông tin lịch hẹn');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized(navigate);
      } else {
        toast.error('Đã xảy ra lỗi khi tải thông tin lịch hẹn');
      }
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableDoctors = async (searchDate, searchTime, isInitialLoad = false) => {
    if (!searchDate || !searchTime) return;
    
    setSearchingDoctors(true);
    try {
      const formattedDate = formatDate(searchDate);
      const formattedTime = formatTime(searchTime);
      
      const response = await axios.get(`${API_URL}/api/Appointment/GetAvailableDoctors`, {
        params: {
          appointmentDate: formattedDate,
          appointmentTime: formattedTime
        },
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (response.data.status) {
        const doctors = response.data.data.availableDoctors;
        setAvailableDoctors(doctors);
        
        // Chỉ hiển thị thông báo khi không phải là lần tải đầu tiên
        if (doctors.length === 0 && !isInitialLoad && hasSearched) {
          toast.warning('Không tìm thấy bác sĩ nào phù hợp với thời gian đã chọn');
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized(navigate);
      } else if (!isInitialLoad) {
         console.log(error);
      }
    } finally {
      setSearchingDoctors(false);
    }
  };

  const handleUpdateAppointment = async () => {
    try {
      const formattedDate = formatDate(date);
      const formattedTime = formatTime(time);

      const updateData = {
        appointmentId: appointment.appointmentId, // Thêm appointmentId
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        doctorId: selectedDoctor,
        status: appointment.status, // Keep the existing status
        appointmentType: appointment.appointmentType, // Thêm appointmentType
        testTypeId: appointment.testTypeId // Thêm testTypeId nếu có
      };

      const response = await axios.put(
        `${API_URL}/api/Appointment/Update`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật lịch hẹn thành công!');
        navigate('/appointments/list');
      } else {
        toast.error(response.data.message || 'Cập nhật lịch hẹn thất bại');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        handleUnauthorized(navigate);
      } else {
        console.error('Error updating appointment:', error);
        toast.error('Đã xảy ra lỗi khi cập nhật lịch hẹn');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Không tìm thấy lịch hẹn</h2>
          <p className="text-gray-500 mb-4">Lịch hẹn này có thể đã bị xóa hoặc không tồn tại</p>
          <button
            onClick={() => navigate('/appointments/list')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Chi tiết lịch hẹn</h1>
          <p className="text-gray-600">Cập nhật thông tin lịch hẹn của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Thông tin lịch hẹn */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Thông tin lịch hẹn hiện tại</h2>
              <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                statusColorMapping[appointment.status] || 'bg-gray-100 text-gray-800'
              }`}>
                {getStatusText(appointment.status)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Bác sĩ phụ trách</h3>
                  <p className="text-lg text-gray-800">{appointment.doctorName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Loại lịch hẹn</h3>
                  <p className="text-lg text-gray-800">{appointment.appointmentType}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                {appointment.testTypeName && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Loại xét nghiệm</h3>
                    <p className="text-lg text-gray-800">{appointment.testTypeName}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Ngày tạo</h3>
                  <p className="text-lg text-gray-800">{new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form cập nhật */}
          <div className="p-8 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Cập nhật lịch hẹn</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Ngày hẹn */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Ngày hẹn
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => handleDateTimeChange(e.target.value, time)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                />
              </div>

              {/* Thời gian */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Thời gian
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^[0-9:]*$/.test(value) && value.length <= 5) {
                        handleDateTimeChange(date, value);
                      }
                    }}
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value) {
                        const [hours, minutes] = value.split(':').map(Number);
                        if (hours >= 8 && hours <= 18 && minutes === 0) {
                          handleDateTimeChange(date, `${hours.toString().padStart(2, '0')}:00`);
                        } else {
                          handleDateTimeChange(date, '');
                          toast.error('Vui lòng nhập giờ từ 08:00 đến 18:00 (chỉ nhập giờ tròn)');
                        }
                      }
                    }}
                    placeholder="08:00"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Thời gian từ 08:00 - 18:00 (chỉ nhập giờ tròn)</p>
              </div>
            </div>

            {/* Loading State for Doctor Search */}
            {searchingDoctors && (
              <div className="flex justify-center py-8 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <svg className="animate-spin h-6 w-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-blue-600 text-lg">Đang tìm kiếm bác sĩ phù hợp...</span>
                </div>
              </div>
            )}

            {/* Available Doctors */}
            {availableDoctors.length > 0 && (
              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Bác sĩ có lịch trống ({availableDoctors.length})
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {availableDoctors.map((doctor) => (
                    <div
                      key={doctor.doctorId}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedDoctor === doctor.doctorId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              selectedDoctor === doctor.doctorId ? 'bg-blue-500' : 'bg-gray-200'
                            }`}>
                              <svg className={`w-6 h-6 ${selectedDoctor === doctor.doctorId ? 'text-white' : 'text-gray-500'}`} 
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{doctor.doctorName}</h4>
                            <p className="text-sm text-gray-500">Bác sĩ</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedDoctor(doctor.doctorId)}
                          className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                            selectedDoctor === doctor.doctorId
                              ? 'bg-blue-500 text-white hover:bg-blue-600'
                              : 'border border-blue-500 text-blue-500 hover:bg-blue-50'
                          }`}
                        >
                          {selectedDoctor === doctor.doctorId ? 'Đã chọn' : 'Chọn'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                onClick={() => navigate('/appointments/list')}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                Quay lại
              </button>
              <button
                onClick={handleUpdateAppointment}
                className="px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Cập nhật lịch hẹn</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointmentPage; 