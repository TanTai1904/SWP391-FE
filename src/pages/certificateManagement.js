import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEye, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import moment from 'moment';
import 'moment/locale/vi';

moment.locale('vi');

const CertificateManagement = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_URL}/api/DoctorCertificate/GetAll`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.status) {
        setCertificates(response.data.data);
      } else {
        toast.error('Có lỗi khi tải danh sách chứng chỉ');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        toast.error('Có lỗi khi tải danh sách chứng chỉ');
      }
      setError('Có lỗi xảy ra khi tải danh sách chứng chỉ');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (certificateId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/api/DoctorCertificate/Delete/${certificateId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        toast.success('Xóa chứng chỉ thành công');
        fetchCertificates();
      } catch (error) {
        toast.error('Có lỗi khi xóa chứng chỉ');
      }
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Không có';
    return moment(date).format('DD/MM/YYYY');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8" style={{ width: '90%', margin: '0 auto' }}>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý chứng chỉ
          </h1>
          <button
            onClick={() => navigate('/certificate/create')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FiPlus className="mr-2" />
            Thêm chứng chỉ mới
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 hover:shadow-xl" style={{ width: '90%', margin: '0 auto', marginTop: '20px' }}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên chứng chỉ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bác sĩ</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nơi cấp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày cấp</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Ngày hết hạn</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {certificates.map((certificate) => (
                  <tr key={certificate.certificateId} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.certificateId}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {certificate.certificateName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {certificate.issuedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(certificate.issueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(certificate.expiryDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/certificate/update/${certificate.certificateId}`)}
                          className="flex items-center text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(certificate.certificateId)}
                          className="flex items-center text-red-600 hover:text-red-900 transition-colors duration-200"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateManagement;
