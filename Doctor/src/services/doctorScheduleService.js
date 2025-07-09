import api from "./api";

const doctorScheduleService = {
  create: (data) => api.post("/DoctorSchedule/Create", data),
  update: (data) => api.put("/DoctorSchedule/Update", data), // Sửa endpoint đúng chuẩn backend
  getByDoctorId: (doctorId) => api.get(`/DoctorSchedule/GetByDoctorId/${doctorId}`),
  getById: (id) => api.get(`/DoctorSchedule/GetByID/${id}`),
  delete: (id) => api.delete(`/DoctorSchedule/Delete/${id}`),
};

export default doctorScheduleService;