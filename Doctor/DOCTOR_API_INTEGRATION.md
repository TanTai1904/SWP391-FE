# Hướng dẫn tích hợp API cho hệ thống bác sĩ

## Tổng quan

Hệ thống bác sĩ đã được tích hợp đầy đủ với tất cả các API backend. Mỗi chức năng đều sử dụng service tương ứng để gọi API.

## Các chức năng đã tích hợp

### 1. Dashboard (Bảng điều khiển)
- **File**: `src/pages/doctor/DoctorDashboard.jsx`
- **Services**: `patientService`, `appointmentService`, `doctorService`
- **Chức năng**: Hiển thị thống kê tổng quan, số liệu bệnh nhân, lịch hẹn

### 2. Quản lý bệnh nhân
- **File**: `src/pages/doctor/PatientManagement.jsx`
- **Service**: `patientService`
- **API Endpoints**:
  - `GET /Patient/GetAll` - Lấy danh sách bệnh nhân
  - `POST /Patient/Create` - Thêm bệnh nhân mới
  - `PUT /Patient/Update` - Cập nhật thông tin bệnh nhân
  - `DELETE /Patient/Delete/{id}` - Xóa bệnh nhân
  - `GET /Patient/GetByID/{id}` - Lấy thông tin chi tiết bệnh nhân

### 3. Thêm bệnh nhân
- **File**: `src/pages/doctor/AddPatient.jsx`
- **Service**: `patientService`
- **Chức năng**: Form thêm bệnh nhân với validation

### 4. Lịch làm việc
- **File**: `src/pages/doctor/Schedule.jsx`
- **Service**: `doctorScheduleService`
- **API Endpoints**:
  - `GET /DoctorSchedule/GetByDoctorId/{doctorId}` - Lấy lịch làm việc
  - `POST /DoctorSchedule/Create` - Tạo lịch làm việc mới
  - `PUT /DoctorSchedule/Update` - Cập nhật lịch làm việc
  - `DELETE /DoctorSchedule/Delete/{id}` - Xóa lịch làm việc

### 5. Phác đồ ARV
- **File**: `src/pages/doctor/ARVProtocols.jsx`
- **Services**: `arvRegimensService`, `arvComponentsService`
- **API Endpoints**:
  - `GET /ARVRegimens/GetAll` - Lấy danh sách phác đồ
  - `POST /ARVRegimens/Create` - Tạo phác đồ mới
  - `PUT /ARVRegimens/Update` - Cập nhật phác đồ
  - `DELETE /ARVRegimens/Delete/{id}` - Xóa phác đồ
  - `GET /ARVComponents/GetAll` - Lấy danh sách thành phần

### 6. Tư vấn & Hẹn khám
- **File**: `src/pages/doctor/Consultation.jsx`
- **Services**: `appointmentService`, `patientService`
- **API Endpoints**:
  - `GET /Appointment/GetByDoctorId/{id}` - Lấy lịch hẹn theo bác sĩ
  - `POST /Appointment/Create` - Tạo lịch hẹn mới
  - `PUT /Appointment/Update` - Cập nhật lịch hẹn
  - `DELETE /Appointment/Delete/{id}` - Xóa lịch hẹn

### 7. Báo cáo
- **File**: `src/pages/doctor/Reports.jsx`
- **Services**: `treatmentService`, `testResultService`, `patientService`, `appointmentService`
- **API Endpoints**:
  - `GET /Treatment/GetAll` - Lấy danh sách điều trị
  - `GET /TestResult/GetAll` - Lấy kết quả xét nghiệm
  - `GET /Patient/GetAll` - Lấy danh sách bệnh nhân
  - `GET /Appointment/GetAllScheduled` - Lấy lịch hẹn đã lên lịch

### 8. Thông tin bác sĩ
- **File**: `src/pages/doctor/DoctorProfile.jsx`
- **Services**: `doctorService`, `doctorScheduleService`
- **API Endpoints**:
  - `GET /Doctor/GetByID/{id}` - Lấy thông tin bác sĩ
  - `PUT /Doctor/Update` - Cập nhật thông tin bác sĩ
  - `GET /DoctorSchedule/GetByDoctorId/{doctorId}` - Lấy lịch làm việc

## Cấu trúc Services

Tất cả services được đặt trong thư mục `src/services/`:

```
src/services/
├── api.js                    # Cấu hình axios và interceptors
├── patientService.js         # Quản lý bệnh nhân
├── appointmentService.js     # Quản lý lịch hẹn
├── doctorService.js          # Quản lý bác sĩ
├── doctorScheduleService.js  # Quản lý lịch làm việc
├── arvRegimensService.js     # Quản lý phác đồ ARV
├── arvComponentsService.js   # Quản lý thành phần ARV
├── treatmentService.js       # Quản lý điều trị
├── testResultService.js      # Quản lý kết quả xét nghiệm
├── articleService.js         # Quản lý bài viết
├── categoryService.js        # Quản lý danh mục
├── notificationService.js    # Quản lý thông báo
├── emailService.js           # Quản lý email
└── authService.js            # Xác thực
```

## Cách sử dụng Service

### Ví dụ sử dụng patientService:

```javascript
import patientService from '../../services/patientService';

// Lấy danh sách bệnh nhân
const fetchPatients = async () => {
  try {
    const response = await patientService.getAll();
    const patients = response.data;
    // Xử lý dữ liệu
  } catch (error) {
    console.error('Lỗi khi tải bệnh nhân:', error);
  }
};

// Thêm bệnh nhân mới
const addPatient = async (patientData) => {
  try {
    await patientService.create(patientData);
    // Xử lý thành công
  } catch (error) {
    console.error('Lỗi khi thêm bệnh nhân:', error);
  }
};
```

## Xử lý lỗi

Tất cả services đều có xử lý lỗi thống nhất:

1. **401 Unauthorized**: Tự động logout và chuyển về trang login
2. **Network Error**: Hiển thị thông báo lỗi cho người dùng
3. **Validation Error**: Hiển thị lỗi validation từ backend

## Authentication

Hệ thống sử dụng JWT token được lưu trong localStorage:

```javascript
// Tự động thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## Cấu hình API

File `src/services/api.js` chứa cấu hình chính:

```javascript
const BASE_URL = 'http://localhost:1566/api';
```

Đảm bảo backend server đang chạy trên port 1566.

## Testing

Sử dụng trang test để kiểm tra tất cả API:
- **File**: `src/pages/doctor/ApiTestPage.jsx`
- **Chức năng**: Test connectivity và response time của tất cả API

## Lưu ý quan trọng

1. **Doctor ID**: Hệ thống tự động lấy doctorId từ localStorage user
2. **Fallback**: Nếu không có doctorId, sử dụng giá trị mặc định (3)
3. **Error Handling**: Tất cả API calls đều có try-catch
4. **Loading States**: Hiển thị loading khi đang gọi API
5. **Validation**: Form validation trước khi gửi dữ liệu

## Troubleshooting

### Lỗi 401 Unauthorized
- Kiểm tra token trong localStorage
- Đăng nhập lại để lấy token mới

### Lỗi 400 Bad Request
- Kiểm tra format dữ liệu gửi lên
- Đảm bảo tất cả required fields đã được điền

### Lỗi Network
- Kiểm tra backend server có đang chạy không
- Kiểm tra URL và port trong api.js

### Lỗi CORS
- Đảm bảo backend có cấu hình CORS cho frontend domain

## Cập nhật và bảo trì

1. **Thêm API mới**: Tạo service mới trong `src/services/`
2. **Cập nhật endpoint**: Chỉ cần sửa trong service tương ứng
3. **Thêm validation**: Cập nhật trong component form
4. **Thêm error handling**: Cập nhật trong service hoặc component

## Kết luận

Hệ thống bác sĩ đã được tích hợp đầy đủ với tất cả API backend. Mỗi chức năng đều có:
- Service riêng để gọi API
- Error handling
- Loading states
- Validation
- User-friendly interface

Để sử dụng, chỉ cần đảm bảo backend server đang chạy và có dữ liệu test. 