import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

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

const UpdateTestType = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    testTypeId: 0,
    testTypeName: '',
    unit: 'mg/dL',
    normalRange: '',
    isActive: true
  });

  useEffect(() => {
    fetchTestType();
  }, [id]);

  const fetchTestType = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8080/api/TestType/GetByID/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status && response.data.data) {
        const testType = response.data.data;
        setFormData({
          testTypeId: testType.testTypeId,
          testTypeName: testType.testTypeName,
          unit: testType.unit,
          normalRange: testType.normalRange,
          isActive: testType.isActive
        });
      } else {
        toast.error('Không thể tải thông tin loại xét nghiệm');
        navigate('/testType-management');
      }
    } catch (error) {
      console.error('Error fetching test type:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy loại xét nghiệm');
        navigate('/testType-management');
      } else {
        toast.error('Đã xảy ra lỗi khi tải thông tin loại xét nghiệm');
      }
      navigate('/testType-management');
    }
  };

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

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8080/api/TestType/Update',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật loại xét nghiệm thành công');
        navigate('/testType-management');
      } else {
        toast.error(response.data.message || 'Không thể cập nhật loại xét nghiệm');
      }
    } catch (error) {
      console.error('Error updating test type:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Đã xảy ra lỗi khi cập nhật loại xét nghiệm');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mt-6">Cập nhật loại xét nghiệm</h1>
          <p className="mt-2 text-gray-600">Chỉnh sửa thông tin chi tiết của loại xét nghiệm</p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Test Type Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Tên loại xét nghiệm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="testTypeName"
                  value={formData.testTypeName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Nhập tên loại xét nghiệm"
                  required
                />
              </div>

              {/* Unit Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Đơn vị <span className="text-red-500">*</span>
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 bg-white"
                  required
                >
                  {ALLOWED_UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              {/* Normal Range Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Giá trị bình thường <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="normalRange"
                  value={formData.normalRange}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  placeholder="Ví dụ: 70-120 mg/dL"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Nhập khoảng giá trị bình thường cho loại xét nghiệm này
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/testType-management')}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                      <span>Đang xử lý...</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiSave className="w-5 h-5 mr-2" />
                      <span>Lưu thay đổi</span>
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTestType;
