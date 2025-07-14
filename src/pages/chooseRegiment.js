import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ChooseRegiment = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Kiểm tra dữ liệu khi component mount
    const { testResultId, appointmentId, patientId, doctorId } = location.state || {};
    console.log('ChooseRegiment - Received state:', {
      testResultId,
      appointmentId,
      patientId,
      doctorId
    });

    if (!testResultId) {
      toast.error('Không tìm thấy thông tin kết quả khám');
    }
  }, [location.state]);

  const handleOptionSelect = (path) => {
    const { testResultId, appointmentId, patientId, doctorId } = location.state || {};
    
    if (!testResultId) {
      toast.error('Không tìm thấy thông tin kết quả khám');
      return;
    }

    // Log thông tin trước khi chuyển trang
    console.log('ChooseRegiment - Navigating to:', path, {
      testResultId,
      appointmentId,
      patientId,
      doctorId
    });

    navigate(path, {
      state: {
        testResultId,
        appointmentId,
        patientId,
        doctorId
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Chọn Loại Phác Đồ</h1>
          <p className="text-lg text-gray-600">
            Vui lòng chọn sử dụng phác đồ chuẩn hoặc tạo phác đồ mới
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard Protocol Option */}
          <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => handleOptionSelect('/standard-protocol')}
          >
            <div className="p-8">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Phác Đồ Chuẩn</h2>
              <p className="text-gray-600 mb-6">
                Sử dụng các phác đồ điều trị chuẩn đã được thiết lập và kiểm chứng.
              </p>
              <div className="flex items-center text-blue-600">
                <span className="font-medium">Chọn phác đồ chuẩn</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="bg-blue-50 px-8 py-4">
              <ul className="text-sm text-gray-600">
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Đã được kiểm chứng lâm sàng
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Dễ dàng lựa chọn
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Hướng dẫn sử dụng chi tiết
                </li>
              </ul>
            </div>
          </div>

          {/* Custom Protocol Option */}
          <div 
            className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105"
            onClick={() => handleOptionSelect('/regimens/create')}
          >
            <div className="p-8">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tạo Phác Đồ Mới</h2>
              <p className="text-gray-600 mb-6">
                Tạo phác đồ điều trị mới phù hợp với nhu cầu cụ thể của bệnh nhân.
              </p>
              <div className="flex items-center text-green-600">
                <span className="font-medium">Tạo phác đồ mới</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
            <div className="bg-green-50 px-8 py-4">
              <ul className="text-sm text-gray-600">
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Tùy chỉnh linh hoạt
                </li>
                <li className="flex items-center mb-2">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Phù hợp nhu cầu đặc biệt
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Kết hợp nhiều thành phần
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 transition-colors duration-300"
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegiment;
