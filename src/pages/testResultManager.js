import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiSearch, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FiEdit2 } from 'react-icons/fi';

const TestResultManager = () => {
  const [testResults, setTestResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/TestResult/GetAll', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        setTestResults(response.data.data);
      } else {
        toast.error('Không thể tải danh sách kết quả xét nghiệm');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        toast.error('Đã xảy ra lỗi khi tải danh sách kết quả xét nghiệm');
      }
    } finally {
      setLoading(false);
    }
  };

  // Format date to display in Vietnamese format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Format time to display in 24-hour format
  const formatTime = (timeString) => {
    return timeString;
  };

  // Filter test results based on search term
  const filteredResults = testResults.filter(result => {
    const searchString = searchTerm.toLowerCase();
    return (
      result.patientName?.toLowerCase().includes(searchString) ||
      result.doctorName?.toLowerCase().includes(searchString) ||
      result.testTypeName?.toLowerCase().includes(searchString) ||
      result.resultValue?.toLowerCase().includes(searchString)
    );
  });

  const handleUpdate = (testResultId) => {
    navigate(`/test-results/update/${testResultId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8" style={{ width: '90%', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Kết quả Xét nghiệm</h1>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bác sĩ</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại xét nghiệm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kết quả</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn vị</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày hẹn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giờ hẹn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ghi chú</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr key={result.testResultId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{result.testResultId}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{result.patientName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{result.doctorName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{result.testTypeName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <span className="font-medium text-blue-600">{result.resultValue}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{result.unit}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(result.appointmentDate)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {formatTime(result.appointmentTime)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {result.notes}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    <button
                      onClick={() => handleUpdate(result.testResultId)}
                      className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                      title="Cập nhật"
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan="9" className="px-4 py-3 text-center text-gray-500">
                    Không tìm thấy kết quả xét nghiệm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TestResultManager;
