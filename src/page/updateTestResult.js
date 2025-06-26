import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateTestResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState({
    testResultId: '',
    appointmentId: '',
    patientId: '',
    doctorId: '',
    testTypeId: '',
    resultValue: '',
    notes: '',
    specialNotes: '',
    normalRange: '',
    unit: '',
  });
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    fetchTestResult();
  }, [id]);

  const fetchTestResult = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/TestResult/GetByID/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        const data = response.data.data;
        setTestResult({
          testResultId: data.testResultId,
          appointmentId: data.appointmentId,
          patientId: data.patientId,
          doctorId: data.doctorId,
          testTypeId: data.testTypeId,
          resultValue: data.resultValue || '',
          notes: data.notes || '',
          specialNotes: data.specialNotes || '',
          normalRange: data.normalRange || '',
          unit: data.unit || '',
        });
      } else {
        toast.error('Không thể tải thông tin kết quả xét nghiệm');
        navigate('/testResult-management');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Đã xảy ra lỗi khi tải thông tin kết quả xét nghiệm');
        navigate('/testResult-management');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      
      // Validate appointment ID exists
      if (!testResult.appointmentId) {
        toast.error('Không tìm thấy thông tin cuộc hẹn');
        return;
      }

      // First, check if this appointment already has a test result
      try {
        const checkResponse = await axios.get(
          `${API_URL}/api/TestResult/GetByAppointmentId/${testResult.appointmentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        // If there's an existing test result and it's not the current one
        if (checkResponse.data.status && 
            checkResponse.data.data && 
            checkResponse.data.data.testResultId !== parseInt(testResult.testResultId)) {
          toast.error('Cuộc hẹn này đã có kết quả xét nghiệm khác');
          return;
        }
      } catch (checkError) {
        console.error('Error checking existing test result:', checkError);
      }

      const updateData = {
        testResultId: parseInt(testResult.testResultId),
        appointmentId: parseInt(testResult.appointmentId),
        patientId: parseInt(testResult.patientId),
        doctorId: parseInt(testResult.doctorId),
        testTypeId: parseInt(testResult.testTypeId),
        resultValue: testResult.resultValue,
        notes: testResult.notes || ''
      };

      console.log('Sending update data:', updateData);

      const response = await axios.put(
        `${API_URL}/api/TestResult/Update`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật kết quả xét nghiệm thành công');
        navigate('/testResult-management');
      } else {
        const errorMessage = response.data.errors?.[0] || response.data.message;
        toast.error(errorMessage || 'Không thể cập nhật kết quả xét nghiệm');
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật kết quả xét nghiệm';
        toast.error(errorMessage);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTestResult(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Cập nhật Kết quả Xét nghiệm</h1>
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="resultValue">
            Giá trị kết quả
          </label>
          <input
            type="text"
            id="resultValue"
            name="resultValue"
            value={testResult.resultValue}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Ghi chú
          </label>
          <textarea
            id="notes"
            name="notes"
            value={testResult.notes}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={submitting}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              submitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/testResult-management')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateTestResult; 