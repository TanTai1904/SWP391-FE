import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const DoctorManager = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch doctors data
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:8080/api/Doctor/GetAll',
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status) {
        setDoctors(response.data.data);
      } else {
        toast.error('Không thể tải danh sách bác sĩ');
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching doctors:', error);
        toast.error('Đã xảy ra lỗi khi tải danh sách bác sĩ');
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [navigate]);

  // Handle doctor deletion
  const handleDelete = async (doctor) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) {
      try {
        const token = localStorage.getItem('token');
        const updateData = {
          phoneNumber: doctor.phoneNumber || "",
          fullName: doctor.fullName,
          dateOfBirth: doctor.dateOfBirth,
          gender: doctor.gender,
          address: doctor.address || "",
          isActive: false,
          doctorId: doctor.doctorId,
          bio: doctor.bio || ""
        };

        console.log('Sending update data:', updateData); // Log để debug

        const response = await axios.put(
          'http://localhost:8080/api/Doctor/Update',
          updateData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status) {
          toast.success('Xóa bác sĩ thành công');
          fetchDoctors(); // Tải lại danh sách sau khi xóa
        } else {
          toast.error(response.data.message || 'Không thể xóa bác sĩ');
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 401) {
            navigate('/login');
          } else if (error.response.data && error.response.data.message) {
            toast.error(error.response.data.message);
          } else {
            toast.error('Đã xảy ra lỗi khi xóa bác sĩ');
          }
        } else {
          toast.error('Đã xảy ra lỗi khi kết nối đến server');
        }
      }
    }
  };

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter(doctor => {
    const searchString = searchTerm.toLowerCase();
    return (
      doctor.fullName.toLowerCase().includes(searchString) ||
      doctor.username.toLowerCase().includes(searchString) ||
      doctor.email.toLowerCase().includes(searchString) ||
      doctor.bio.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="container mx-auto px-4 py-8" style={{ width: '80%', margin: '0 auto' }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Bác sĩ</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/doctors/create')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <FiPlus className="mr-2" />
            Thêm bác sĩ
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">Đang tải...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ và tên</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chuyên môn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.userId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{doctor.fullName}</div>
                    <div className="text-sm text-gray-500">{doctor.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {doctor.bio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/doctors/update/${doctor.userId}`)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <FiEdit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor)}
                        className="text-red-600 hover:text-red-900"
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
      )}
    </div>
  );
};

export default DoctorManager;
