import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const CreateTreatment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;
  
  // Ensure IDs are numbers from the start
  const testResultId = location.state?.testResultId ? Number(location.state.testResultId) : null;
  const regimenId = location.state?.regimenId ? Number(location.state.regimenId) : null;
  const appointmentId = location.state?.appointmentId ? Number(location.state.appointmentId) : null;
  
  // Get tomorrow's date for minimum start date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  
  const [formData, setFormData] = useState({
    testResultId,
    regimenId,
    startDate: tomorrowStr,
    endDate: tomorrowStr,
    notes: ''
  });

  // Function to validate dates
  const validateDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    // Check if startDate is in the future
    if (startDate <= today) {
      toast.error('Ngày bắt đầu phải là ngày trong tương lai');
      return false;
    }
    
    // Check if endDate is after startDate
    if (endDate <= startDate) {
      toast.error('Ngày kết thúc phải sau ngày bắt đầu');
      return false;
    }
    
    return true;
  };

  useEffect(() => {
    // Log để kiểm tra dữ liệu khi component được khởi tạo
    console.log('Thông tin nhận được từ trang trước:', {
      testResultId,
      regimenId,
      fullLocationState: location.state
    });

    // Validate that we have both IDs and they are valid numbers
    if (!testResultId || !regimenId || isNaN(testResultId) || isNaN(regimenId)) {
      console.log('Thông tin còn thiếu hoặc không hợp lệ:', {
        testResultId: testResultId ? 'Có' : 'Thiếu',
        regimenId: regimenId ? 'Có' : 'Thiếu',
        isValidTestResult: !isNaN(testResultId),
        isValidRegimen: !isNaN(regimenId)
      });
      toast.error('Thiếu thông tin hoặc thông tin không hợp lệ để tạo đơn điều trị');
      navigate(-1);
      return;
    }
  }, [testResultId, regimenId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates before proceeding
    if (!validateDates()) {
      return;
    }
    
    setLoading(true);

    // Ensure IDs are numbers in the final submission
    const submitData = {
      ...formData,
      testResultId: Number(formData.testResultId),
      regimenId: Number(formData.regimenId)
    };

    // Validate data types before sending
    if (isNaN(submitData.testResultId) || isNaN(submitData.regimenId)) {
      toast.error('Dữ liệu không hợp lệ. Vui lòng thử lại.');
      setLoading(false);
      return;
    }

    // Log thông tin trước khi gửi request
    console.log('Dữ liệu gửi đi:', submitData);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/api/Treatment/Create`,
        submitData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.status) {
        // Send email notification
        try {
          const treatmentId = response.data.data.id || response.data.data.treatmentId;
          console.log('Treatment created with ID:', treatmentId);
          
          const emailResponse = await axios.post(
            `${API_URL}/api/Email/SendTreatmentCreatedEmail`,
            { treatmentId: parseInt(treatmentId) },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          if (!emailResponse.data.status) {
            console.error('Failed to send email notification:', emailResponse.data);
          }
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
          // Don't show error to user, just log it
        }

        // Update appointment status to Complete
        try {
          // Đợi 1 giây trước khi cập nhật status
          await new Promise(resolve => setTimeout(resolve, 1000));

          const updateResponse = await axios.put(
            `${API_URL}/api/Appointment/Update`,
            {
              appointmentId: Number(appointmentId),
              status: 'Completed'
            },
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (updateResponse.data.status) {
            toast.success('Tạo đơn điều trị thành công');
            navigate('/appointments/management');
          } else {
            console.error('Error response:', updateResponse.data);
            toast.error(updateResponse.data.message || 'Không thể cập nhật trạng thái cuộc hẹn');
            navigate('/appointments/management');
          }
        } catch (updateError) {
          console.error('Error updating appointment status:', updateError.response?.data || updateError);
          toast.error('Tạo đơn điều trị thành công nhưng không thể cập nhật trạng thái cuộc hẹn');
          navigate('/appointments/management');
        }
      } else {
        toast.error(response.data.message || 'Không thể tạo đơn điều trị');
      }
    } catch (error) {
      console.error('Error creating treatment:', error);
      const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi tạo đơn điều trị';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Tạo Đơn Điều Trị
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            <div className="space-y-6">
              {/* Ngày bắt đầu */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  min={tomorrowStr}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                  required
                />
              </div>

              {/* Ngày kết thúc */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  min={formData.startDate}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                  required
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Ghi chú
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-150"
                  placeholder="Nhập ghi chú về đơn điều trị..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-green-600 rounded-lg text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150"
              >
                Hoàn thành
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTreatment;
