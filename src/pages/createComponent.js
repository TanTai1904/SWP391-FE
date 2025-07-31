import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const CreateComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [component, setComponent] = useState({
    componentName: '',
    description: '',
    isActive: true
  });
  const API_URL = process.env.REACT_APP_API_URL;

  const validateForm = () => {
    const errors = {};
    
    if (!component.componentName.trim()) {
      errors.componentName = 'Tên thành phần không được để trống';
    }

    if (!component.description.trim()) {
      errors.description = 'Mô tả không được để trống';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userDetails = JSON.parse(localStorage.getItem('userDetails'));
      
      if (!token || !userDetails) {
        navigate('/login', { replace: true });
        return;
      }

      const createData = {
        componentName: component.componentName.trim(),
        description: component.description.trim(),
        isActive: component.isActive
      };

      console.log('Sending create data:', createData);

      const response = await axios.post(
        `${API_URL}/api/ARVComponents/Create`,
        createData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.status) {
        toast.success('Thêm thành phần thành công!');
        navigate('/ARVcomponents', { replace: true });
      } else {
        setError(response.data.message || 'Không thể thêm thành phần');
        toast.error('Thêm thất bại');
      }
    } catch (err) {
      console.error('Error creating component:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userDetails');
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        navigate('/login', { replace: true });
      } else if (err.response?.status === 400 && err.response?.data?.errors) {
        const serverErrors = {};
        if (Array.isArray(err.response.data.errors.ComponentName)) {
          serverErrors.componentName = err.response.data.errors.ComponentName[0];
        }
        if (Array.isArray(err.response.data.errors.Description)) {
          serverErrors.description = err.response.data.errors.Description[0];
        }
        setValidationErrors(serverErrors);
        toast.error('Vui lòng kiểm tra lại thông tin nhập vào');
      } else {
        const errorMessage = err.response?.data?.message || 'Đã xảy ra lỗi khi thêm mới';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setComponent(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Thêm Thành phần ARV</h1>
            
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="componentName" className="block text-sm font-medium text-gray-700 mb-1">
                  Tên thành phần
                </label>
                <input
                  type="text"
                  id="componentName"
                  name="componentName"
                  required
                  value={component.componentName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    validationErrors.componentName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập tên thành phần"
                />
                {validationErrors.componentName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.componentName}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  value={component.description}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    validationErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nhập mô tả"
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => navigate('/ARVcomponents')}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? 'Đang xử lý...' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComponent;
