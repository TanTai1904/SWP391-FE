import api from './api';

const doctorService = {
  getAllDoctors: async () => {
    try {
      const response = await api.get('/Doctor/GetAll', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Doctor service response:', response);
      
      // Backend trả về format APIResponse với structure: { status, statusCode, data, errors }
      if (response.data && response.data.status && response.data.data) {
        return {
          status: true,
          data: response.data.data
        };
      } else if (response.data && Array.isArray(response.data)) {
        // Fallback nếu API trả về array trực tiếp
        return {
          status: true,
          data: response.data
        };
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error in getAllDoctors:', error);
      
      // Nếu là lỗi 401 (Unauthorized), có thể trả về mock data để test
      if (error.response?.status === 401) {
        console.warn('Unauthorized - using mock data for testing');
        return {
          status: true,
          data: [
            {
              doctorID: 1,
              fullName: "Bác sĩ Nguyễn Văn A",
              specialty: "HIV/AIDS",
              experience: "10",
              education: "Đại học Y Hà Nội",
              phone: "0123456789",
              bio: "Bác sĩ chuyên khoa HIV/AIDS với 10 năm kinh nghiệm trong điều trị và tư vấn bệnh nhân."
            },
            {
              doctorID: 2,
              fullName: "Bác sĩ Trần Thị B",
              specialty: "Nội khoa",
              experience: "8",
              education: "Đại học Y TP.HCM",
              phone: "0987654321",
              bio: "Chuyên gia về nội khoa tổng hợp và các bệnh truyền nhiễm."
            }
          ]
        };
      }
      
      throw error;
    }
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/Doctor/GetByID/${id}`);
      if (response.data && response.data.status) {
        return response.data;
      } else {
        throw new Error('Doctor not found');
      }
    } catch (error) {
      console.error('Error in getDoctorById:', error);
      throw error;
    }
  },
  getDoctorsBySpecialty: async (specialty) => {
    const response = await api.get(`/doctors/specialty/${specialty}`);
    return response.data;
  },

  getDoctorSchedule: async (doctorId) => {
    const response = await api.get(`/doctors/${doctorId}/schedule`);
    return response.data;
  },

  getDoctorAvailableSlots: async (doctorId, date) => {
    const response = await api.get(`/doctors/${doctorId}/available-slots`, {
      params: { date }
    });
    return response.data;
  },

  // Thêm function tạo doctor mới
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post('/Doctor/Create', doctorData);
      if (response.data && response.data.status) {
        return response.data;
      } else {
        throw new Error('Failed to create doctor');
      }
    } catch (error) {
      console.error('Error in createDoctor:', error);
      throw error;
    }
  },

  // Thêm function cập nhật doctor
  updateDoctor: async (doctorData) => {
    try {
      const response = await api.put('/Doctor/Update', doctorData);
      if (response.data && response.data.status) {
        return response.data;
      } else {
        throw new Error('Failed to update doctor');
      }
    } catch (error) {
      console.error('Error in updateDoctor:', error);
      throw error;
    }
  }
};

export default doctorService; 