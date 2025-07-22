import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const StandardProtocol = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [regimens, setRegimens] = useState([]);
  const [selectedRegimen, setSelectedRegimen] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Log thông tin state khi component được khởi tạo
    console.log('StandardProtocol - Thông tin nhận được:', {
      locationState: location.state
    });
    fetchStandardRegimens();
  }, []);

  const fetchStandardRegimens = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/ARVRegimens/GetByIsCustomized/false`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        setRegimens(response.data.data);
      } else {
        toast.error('Không thể tải danh sách phác đồ chuẩn');
      }
    } catch (error) {
      console.error('Error fetching standard regimens:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách phác đồ chuẩn');
    } finally {
      setLoading(false);
    }
  };

  const handleRegimenSelect = (regimen) => {
    setSelectedRegimen(regimen);
  };

  const handleNext = () => {
    if (!selectedRegimen) {
      toast.error('Vui lòng chọn một phác đồ');
      return;
    }

    const { testResultId, appointmentId, patientId, doctorId } = location.state || {};

    // Kiểm tra testResultId
    if (!testResultId) {
      toast.error('Không tìm thấy thông tin kết quả khám');
      return;
    }

    // Log thông tin trước khi chuyển trang
    console.log('StandardProtocol - Thông tin chuyển đi:', {
      regimenId: selectedRegimen.regimenId,
      testResultId,
      appointmentId,
      patientId,
      doctorId
    });

    navigate('/treatments/create', {
      state: {
        regimenId: selectedRegimen.regimenId,
        testResultId,
        appointmentId,
        patientId,
        doctorId
      }
    });
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
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Chọn Phác Đồ Chuẩn
            </h1>
          </div>

          {/* Regimens List */}
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chọn
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên Phác Đồ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mô tả
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phù hợp cho
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tần suất
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {regimens.map((regimen) => (
                    <tr 
                      key={regimen.regimenId}
                      className={`hover:bg-gray-50 cursor-pointer ${selectedRegimen?.regimenId === regimen.regimenId ? 'bg-blue-50' : ''}`}
                      onClick={() => handleRegimenSelect(regimen)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="regimen"
                            checked={selectedRegimen?.regimenId === regimen.regimenId}
                            onChange={() => handleRegimenSelect(regimen)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {regimen.regimenName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {regimen.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {regimen.suitableFor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {regimen.frequency} lần/ngày
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
                disabled={!selectedRegimen}
              >
                Tiếp theo
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information Panel */}
        {selectedRegimen && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Thông tin chi tiết</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tác dụng phụ</h3>
                <p className="text-sm text-gray-700">{selectedRegimen.sideEffects}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Hướng dẫn sử dụng</h3>
                <p className="text-sm text-gray-700">{selectedRegimen.usageInstructions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StandardProtocol;
