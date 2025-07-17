import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateCertificate = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [certificate, setCertificate] = useState({
    certificateId: 0,
    doctorId: '',
    certificateName: '',
    issuedBy: '',
    issueDate: '',
    expiryDate: ''
  });

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `http://localhost:8080/api/DoctorCertificate/GetById/${id}`;
        console.log('Calling API URL:', apiUrl);
        
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.data) {
          const cert = response.data.data;
          setCertificate({
            certificateId: cert.certificateId,
            doctorId: cert.doctorId,
            certificateName: cert.certificateName,
            issuedBy: cert.issuedBy,
            issueDate: cert.issueDate ? cert.issueDate.split('T')[0] : '',
            expiryDate: cert.expiryDate ? cert.expiryDate.split('T')[0] : ''
          });
        } else {
          toast.error('Không tìm thấy thông tin chứng chỉ');
        }
      } catch (error) {
        console.error('Error fetching certificate:', error);
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data
        });
        toast.error('Không thể tải thông tin chứng chỉ');
      }
    };

    if (id) {
      fetchCertificate();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCertificate(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/api/DoctorCertificate/Update`, 
        certificate,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        toast.success('Cập nhật chứng chỉ thành công');
        navigate('/certificate-management');
      } else {
        toast.error('Không thể cập nhật chứng chỉ');
      }
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast.error('Có lỗi xảy ra khi cập nhật chứng chỉ');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cập Nhật Chứng Chỉ</h1>
            <p className="text-gray-600">Cập nhật thông tin chứng chỉ chuyên môn</p>
          </div>

          {/* Card Container */}
          <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Certificate Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="certificateName">
                  Tên Chứng Chỉ
                </label>
                <input
                  type="text"
                  id="certificateName"
                  name="certificateName"
                  value={certificate.certificateName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  placeholder="Nhập tên chứng chỉ"
                />
              </div>

              {/* Issuing Organization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="issuedBy">
                  Đơn Vị Cấp
                </label>
                <input
                  type="text"
                  id="issuedBy"
                  name="issuedBy"
                  value={certificate.issuedBy}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                  placeholder="Nhập tên đơn vị cấp"
                />
              </div>

              {/* Date Fields Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Issue Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="issueDate">
                    Ngày Cấp
                  </label>
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={certificate.issueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="expiryDate">
                    Ngày Hết Hạn
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={certificate.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/certificate-management')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cập Nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCertificate;
