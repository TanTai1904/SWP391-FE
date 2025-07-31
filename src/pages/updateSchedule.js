import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const API_URL = `${process.env.REACT_APP_API_URL}/api`;

const UpdateSchedule = () => {
  const navigate = useNavigate();
  const { scheduleId } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [formData, setFormData] = useState({
    startTime: '',
    endTime: ''
  });

  // Tạo mảng các giờ làm việc từ 8:00 đến 18:00
  const timeOptions = Array.from({ length: 11 }, (_, index) => {
    const hour = index + 8;
    return {
      value: `${hour.toString().padStart(2, '0')}:00`,
      label: `${hour.toString().padStart(2, '0')}:00`
    };
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Vui lòng đăng nhập để cập nhật lịch làm việc');
        }

        const response = await fetch(`${API_URL}/DoctorSchedule/GetById/${scheduleId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        
        if (response.ok && data.status) {
          setSchedule(data.data);
          // Chỉ lấy phần giờ:phút từ startTime và endTime
          setFormData({
            startTime: data.data.startTime.substring(0, 5),
            endTime: data.data.endTime.substring(0, 5)
          });
        } else {
          throw new Error(data.message || 'Không thể tải thông tin lịch làm việc');
        }
      } catch (err) {
        console.error('Error fetching schedule:', err);
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [scheduleId]);

  const handleTimeChange = (value, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Kiểm tra nếu giờ kết thúc nhỏ hơn hoặc bằng giờ bắt đầu
    if (field === 'endTime' && formData.startTime) {
      const startHour = parseInt(formData.startTime.split(':')[0]);
      const endHour = parseInt(value.split(':')[0]);
      if (endHour <= startHour) {
        toast.error('Giờ kết thúc phải sau giờ bắt đầu');
        setFormData(prev => ({
          ...prev,
          [field]: ''
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.startTime || !formData.endTime) {
      toast.error('Vui lòng chọn giờ bắt đầu và giờ kết thúc');
      return;
    }

    const startHour = parseInt(formData.startTime.split(':')[0]);
    const endHour = parseInt(formData.endTime.split(':')[0]);
    if (endHour <= startHour) {
      toast.error('Giờ kết thúc phải sau giờ bắt đầu');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vui lòng đăng nhập để cập nhật lịch làm việc');
      }

      const requestData = {
        scheduleId: Number(scheduleId),
        startTime: formData.startTime + ':00',
        endTime: formData.endTime + ':00'
      };

      const response = await fetch(`${API_URL}/DoctorSchedule/Update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();

      if (response.ok && data.status) {
        toast.success('Cập nhật lịch làm việc thành công');
        navigate(`/schedule-manager/${schedule.doctorId}`);
      } else {
        throw new Error(data.message || 'Không thể cập nhật lịch làm việc');
      }
    } catch (err) {
      console.error('Error updating schedule:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600 mb-4">{error}</h3>
          <button
            onClick={() => navigate(`/schedule-manager/${schedule.doctorId}`)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">Cập nhật lịch làm việc</h1>
              <button
                onClick={() => navigate(`/schedule-manager/${schedule.doctorId}`)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại
              </button>
            </div>
            {schedule && (
              <div className="mt-4 bg-blue-50 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Đang cập nhật lịch làm việc của bác sĩ <span className="font-medium">{schedule.fullName}</span>
                    </p>
                    <p className="mt-1 text-sm text-blue-700">
                      Ngày làm việc: <span className="font-medium">{schedule.workDay}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">
                  Giờ bắt đầu
                </label>
                <select
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) => handleTimeChange(e.target.value, 'startTime')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Chọn giờ bắt đầu</option>
                  {timeOptions.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">
                  Giờ kết thúc
                </label>
                <select
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => handleTimeChange(e.target.value, 'endTime')}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">Chọn giờ kết thúc</option>
                  {timeOptions.map(time => (
                    <option key={time.value} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateSchedule;
