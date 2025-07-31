import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const CreateRegimens = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    regimenName: '',
    component1Id: '',
    component2Id: '',
    component3Id: '',
    component4Id: '',
    description: '',
    suitableFor: '',
    sideEffects: '',
    usageInstructions: '',
    frequency: 2,
    isCustomized: true
  });
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    // Log thông tin state khi component được khởi tạo
    console.log('CreateRegimens - Thông tin nhận được:', {
      locationState: location.state
    });
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/ARVComponents/GetAll`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status) {
        // Lọc chỉ lấy các component có isActive là true
        const activeComponents = response.data.data.filter(component => component.isActive);
        setComponents(activeComponents);
      } else {
        toast.error('Không thể tải danh sách thuốc');
      }
    } catch (error) {
      console.error('Error fetching components:', error);
      toast.error('Đã xảy ra lỗi khi tải danh sách thuốc');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xem có ít nhất 1 thành phần được chọn
    const selectedComponents = [
      formData.component1Id,
      formData.component2Id,
      formData.component3Id,
      formData.component4Id
    ].filter(id => id !== '');

    if (selectedComponents.length === 0) {
      toast.error('Vui lòng chọn ít nhất một thành phần thuốc');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/api/ARVRegimens/Create`, 
        {
          ...formData,
          // Chuyển đổi các ID thành số hoặc null
          component1Id: formData.component1Id ? parseInt(formData.component1Id) : null,
          component2Id: formData.component2Id ? parseInt(formData.component2Id) : null,
          component3Id: formData.component3Id ? parseInt(formData.component3Id) : null,
          component4Id: formData.component4Id ? parseInt(formData.component4Id) : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Tạo phác đồ thành công');
        const regimenId = response.data.data.regimenId;

        const { testResultId, appointmentId, patientId, doctorId } = location.state || {};

        // Kiểm tra testResultId
        if (!testResultId) {
          toast.error('Không tìm thấy thông tin kết quả khám');
          return;
        }

        // Log thông tin trước khi chuyển trang
        console.log('CreateRegimens - Thông tin chuyển đi:', {
          regimenId,
          testResultId,
          appointmentId,
          patientId,
          doctorId
        });

        navigate('/treatments/create', {
          state: {
            regimenId,
            testResultId,
            appointmentId,
            patientId,
            doctorId
          }
        });
      } else {
        toast.error(response.data.message || 'Không thể tạo phác đồ');
      }
    } catch (error) {
      console.error('Error creating regimen:', error);
      toast.error('Đã xảy ra lỗi khi tạo phác đồ');
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
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tạo Phác Đồ Mới
            </h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6">
            {/* Tên Phác Đồ */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="regimenName">
                Tên Phác Đồ
              </label>
              <input
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                id="regimenName"
                type="text"
                name="regimenName"
                value={formData.regimenName}
                onChange={handleInputChange}
                required
                placeholder="Nhập tên phác đồ"
              />
            </div>

            {/* Components Selection */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Thành phần thuốc (Chọn ít nhất 1)</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((num) => (
                  <div key={num} className="relative">
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Thành phần {num}
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 appearance-none bg-white"
                      name={`component${num}Id`}
                      value={formData[`component${num}Id`]}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn thuốc</option>
                      {components.map(comp => (
                        <option 
                          key={comp.componentId} 
                          value={comp.componentId}
                          title={comp.description} // Thêm tooltip hiển thị mô tả khi hover
                        >
                          {comp.componentName}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 pt-6">
                      <svg className="fill-current h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Description Fields */}
            <div className="space-y-6">
              {[
                { name: 'description', label: 'Mô tả', rows: 3 },
                { name: 'suitableFor', label: 'Phù hợp cho', rows: 2 },
                { name: 'sideEffects', label: 'Tác dụng phụ', rows: 3 },
                { name: 'usageInstructions', label: 'Hướng dẫn sử dụng', rows: 3 }
              ].map((field) => (
                <div key={field.name} className="bg-white rounded-lg">
                  <label className="block text-gray-700 text-sm font-semibold mb-2">
                    {field.label}
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleInputChange}
                    rows={field.rows}
                    required
                    placeholder={`Nhập ${field.label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Frequency Selection */}
            <div className="mt-6 bg-gray-50 rounded-lg p-6">
              <label className="block text-gray-700 text-sm font-semibold mb-4">
                Tần suất sử dụng
              </label>
              <div className="flex gap-6">
                {[1, 2].map((num) => (
                  <label key={num} className="relative">
                    <input
                      type="radio"
                      name="frequency"
                      value={num}
                      checked={formData.frequency === num}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        frequency: parseInt(e.target.value)
                      }))}
                      className="sr-only"
                    />
                    <div className={`
                      cursor-pointer px-6 py-3 rounded-lg flex items-center
                      ${formData.frequency === num 
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-700' 
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                      }
                    `}>
                      <span className="font-medium">{num} lần/ngày</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-150"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
              >
                Tiếp theo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRegimens;
