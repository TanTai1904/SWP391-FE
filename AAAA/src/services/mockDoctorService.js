// Mock doctor data
const mockDoctors = [
  {
    id: 1,
    fullName: "Dr. Nguyễn Văn An",
    email: "doctor1@hospital.com",
    phone: "0901234567",
    specialty: "Nội khoa",
    bio: "Bác sĩ chuyên khoa nội với 15 năm kinh nghiệm",
    doctorImage: "doctor1.jpg",
    experience: 15,
    education: "Đại học Y Hà Nội",
    isActive: true,
    createdAt: "2023-01-15T00:00:00Z"
  },
  {
    id: 2,
    fullName: "Dr. Trần Thị Bình",
    email: "doctor2@hospital.com",
    phone: "0901234568",
    specialty: "Ngoại khoa",
    bio: "Bác sĩ phẫu thuật với chuyên môn cao",
    doctorImage: "doctor2.jpg",
    experience: 12,
    education: "Đại học Y Dược TP.HCM",
    isActive: true,
    createdAt: "2023-02-20T00:00:00Z"
  },
  {
    id: 3,
    fullName: "Dr. Lê Văn Cường",
    email: "doctor3@hospital.com",
    phone: "0901234569",
    specialty: "Tim mạch",
    bio: "Chuyên gia tim mạch hàng đầu",
    doctorImage: "doctor3.jpg",
    experience: 20,
    education: "Đại học Y Hà Nội",
    isActive: true,
    createdAt: "2023-03-10T00:00:00Z"
  },
  {
    id: 4,
    fullName: "Dr. Phạm Thị Dung",
    email: "doctor4@hospital.com",
    phone: "0901234570",
    specialty: "Nhi khoa",
    bio: "Bác sĩ nhi khoa tận tâm",
    doctorImage: "doctor4.jpg",
    experience: 8,
    education: "Đại học Y Dược TP.HCM",
    isActive: true,
    createdAt: "2023-04-05T00:00:00Z"
  },
  {
    id: 5,
    fullName: "Dr. Hoàng Văn Em",
    email: "doctor5@hospital.com",
    phone: "0901234571",
    specialty: "Da liễu",
    bio: "Chuyên gia da liễu và thẩm mỹ",
    doctorImage: "doctor5.jpg",
    experience: 10,
    education: "Đại học Y Hà Nội",
    isActive: true,
    createdAt: "2023-05-12T00:00:00Z"
  }
];

const mockDoctorService = {
  getAllDoctors: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockDoctors,
          success: true,
          message: "Lấy danh sách bác sĩ thành công"
        });
      }, 500);
    });
  },

  getDoctorById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const doctor = mockDoctors.find(d => d.id === parseInt(id));
        if (doctor) {
          resolve({
            data: doctor,
            success: true,
            message: "Lấy thông tin bác sĩ thành công"
          });
        } else {
          reject(new Error("Không tìm thấy bác sĩ"));
        }
      }, 300);
    });
  },

  getDoctorsBySpecialty: async (specialty) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredDoctors = mockDoctors.filter(d => 
          d.specialty.toLowerCase().includes(specialty.toLowerCase())
        );
        resolve({
          data: filteredDoctors,
          success: true,
          message: "Lấy danh sách bác sĩ theo chuyên khoa thành công"
        });
      }, 400);
    });
  },

  getDoctorSchedule: async (doctorId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock schedule data
        const schedule = {
          doctorId: doctorId,
          schedules: [
            {
              day: "Monday",
              startTime: "08:00",
              endTime: "17:00",
              isAvailable: true
            },
            {
              day: "Tuesday",
              startTime: "08:00",
              endTime: "17:00",
              isAvailable: true
            },
            {
              day: "Wednesday",
              startTime: "08:00",
              endTime: "17:00",
              isAvailable: true
            },
            {
              day: "Thursday",
              startTime: "08:00",
              endTime: "17:00",
              isAvailable: true
            },
            {
              day: "Friday",
              startTime: "08:00",
              endTime: "17:00",
              isAvailable: true
            }
          ]
        };
        resolve({
          data: schedule,
          success: true,
          message: "Lấy lịch làm việc thành công"
        });
      }, 300);
    });
  },

  getDoctorAvailableSlots: async (doctorId, date) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock available slots
        const slots = [
          "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
          "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
        ];
        resolve({
          data: slots,
          success: true,
          message: "Lấy lịch trống thành công"
        });
      }, 200);
    });
  },

  getDashboardSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const summary = {
          totalPatients: 247,
          appointmentsToday: 18,
          activePatients: 156,
          completedAppointments: 89,
          pendingAppointments: 12,
          totalRevenue: 45000000
        };
        resolve({
          data: summary,
          success: true,
          message: "Lấy thống kê dashboard thành công"
        });
      }, 400);
    });
  }
};

export default mockDoctorService; 