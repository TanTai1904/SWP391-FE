import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiSave } from 'react-icons/fi';

const ALLOWED_UNITS = [
  'cells/mm³',
  'copies/mL',
  'mg/dL',
  'g/L',
  'IU/L',
  'IU/mL',
  '%',
  'mmHg',
  'S/C',
  'N/A'
];

const CreateTestType = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    testTypeName: '',
    unit: 'mg/dL',
    normalRange: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Tạo object data theo đúng format API yêu cầu
    const requestData = {
      testTypeName: formData.testTypeName,
      unit: formData.unit,
      normalRange: formData.normalRange,
      isActive: true
    };

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/TestType/Create',
        requestData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Tạo loại xét nghiệm thành công');
        navigate('/testType-management');
      } else {
        toast.error(response.data.message || 'Không thể tạo loại xét nghiệm');
      }
    } catch (error) {
      console.error('Error creating test type:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã xảy ra lỗi khi tạo loại xét nghiệm');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Thêm Loại Xét Nghiệm</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="testTypeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên xét nghiệm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="testTypeName"
                  name="testTypeName"
                  required
                  value={formData.testTypeName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập tên xét nghiệm"
                />
              </div>

              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                  Đơn vị <span className="text-red-500">*</span>
                </label>
                <select
                  id="unit"
                  name="unit"
                  required
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  {ALLOWED_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="normalRange" className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị bình thường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="normalRange"
                  name="normalRange"
                  required
                  value={formData.normalRange}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập giá trị bình thường"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/testType-management')}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FiSave className="mr-2" />
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTestType;
