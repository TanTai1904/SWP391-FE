import api from "./api";

// Helper: Lấy token từ localStorage nếu cần
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const doctorService = {
  getAllDoctors: async () => {
    const response = await api.get("/api/Doctor/GetAll");
    return response.data.data;
  },

  getDoctorById: async (id) => {
    try {
      const response = await api.get(`/api/Doctor/GetById/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(` Lỗi lấy bác sĩ ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorsBySpecialty: async (specialty) => {
    try {
      const response = await api.get(`/api/Doctor/GetBySpecialty/${encodeURIComponent(specialty)}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(` Lỗi lấy bác sĩ theo chuyên khoa '${specialty}':`, error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorSchedule: async (doctorId) => {
    try {
      const response = await api.get(`/api/Doctor/Schedule/${doctorId}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(` Lỗi lấy lịch khám bác sĩ ID ${doctorId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDoctorAvailableSlots: async (doctorId, date) => {
    try {
      const response = await api.get(`/api/Doctor/AvailableSlots/${doctorId}/${date}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi lấy lịch trống bác sĩ ID ${doctorId} ngày ${date}:`, error.response?.data || error.message);
      throw error;
    }
  },

  getDashboardSummary: async () => {
    try {
      const response = await api.get("/api/Doctor/dashboard-summary", {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi lấy thống kê dashboard bác sĩ:", error.response?.data || error.message);
      throw error;
    }
  },

  // Thêm mới bác sĩ
  createDoctor: async (doctorData) => {
    try {
      const response = await api.post("/api/Doctor/Create", doctorData, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error("Lỗi tạo bác sĩ:", error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật thông tin bác sĩ
  updateDoctor: async (id, doctorData) => {
    try {
      const response = await api.put(`/api/Doctor/Update/${id}`, doctorData, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi cập nhật bác sĩ ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Xóa bác sĩ
  deleteDoctor: async (id) => {
    try {
      const response = await api.delete(`/api/Doctor/Delete/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi xóa bác sĩ ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Thêm mới lịch làm việc bác sĩ
  createDoctorSchedule: async (doctorId, scheduleData) => {
    try {
      const response = await api.post(`/api/Doctor/Schedule/${doctorId}/Create`, scheduleData, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi tạo lịch làm việc bác sĩ ID ${doctorId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Cập nhật lịch làm việc bác sĩ
  updateDoctorSchedule: async (doctorId, scheduleId, scheduleData) => {
    try {
      const response = await api.put(`/api/Doctor/Schedule/${doctorId}/Update/${scheduleId}`, scheduleData, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi cập nhật lịch làm việc bác sĩ ID ${doctorId}, schedule ID ${scheduleId}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Xóa lịch làm việc bác sĩ
  deleteDoctorSchedule: async (doctorId, scheduleId) => {
    try {
      const response = await api.delete(`/api/Doctor/Schedule/${doctorId}/Delete/${scheduleId}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      console.error(`Lỗi xóa lịch làm việc bác sĩ ID ${doctorId}, schedule ID ${scheduleId}:`, error.response?.data || error.message);
      throw error;
    }
  },
};

export default doctorService;
