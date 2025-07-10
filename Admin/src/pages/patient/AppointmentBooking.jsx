import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, Clock, User, CalendarCheck, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import styles from './styles/appointmentBooking.module.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([
    { id: 1, name: 'Tư vấn trực tiếp' },
    { id: 2, name: 'Tư vấn trực tuyến' },
  ]);
  
  const [formData, setFormData] = useState({
    appointmentDate: format(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd'),
    appointmentTime: '09:00',
    doctorId: '',
    appointmentType: 'Tư vấn trực tiếp',
    notes: '',
    isAnonymous: false
  });

  const [errors, setErrors] = useState({});

  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const patientId = user?.userId || null;

  // Fetch available doctors based on selected date and time
  useEffect(() => {
    if (formData.appointmentDate && formData.appointmentTime) {
      setLoading(true);
      api.get(`/api/Appointment/GetAvailableDoctors?appointmentDate=${formData.appointmentDate}&appointmentTime=${formData.appointmentTime}`)
        .then(response => {
          if (response.data && response.data.data) {
            setAvailableDoctors(response.data.data);
          } else {
            setAvailableDoctors([]);
          }
        })
        .catch(error => {
          console.error('Error fetching available doctors:', error);
          // Thêm dữ liệu mẫu nếu API lỗi
          setAvailableDoctors([
            { doctorId: 1, fullName: 'Bs. Nguyễn Văn A', specialty: 'Nội khoa' },
            { doctorId: 2, fullName: 'Bs. Trần Thị B', specialty: 'Da liễu' },
            { doctorId: 3, fullName: 'Bs. Lê Văn C', specialty: 'Tim mạch' }
          ]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [formData.appointmentDate, formData.appointmentTime]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Xóa lỗi khi người dùng thay đổi input
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Vui lòng chọn ngày hẹn';
    }
    
    if (!formData.appointmentTime) {
      newErrors.appointmentTime = 'Vui lòng chọn giờ hẹn';
    }
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Vui lòng chọn bác sĩ';
    }
    
    if (!formData.appointmentType) {
      newErrors.appointmentType = 'Vui lòng chọn loại tư vấn';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatTimeForApi = (timeString) => {
    // Đảm bảo định dạng "HH:mm:ss"
    if (timeString.indexOf(':') === -1) {
      return timeString + ':00:00';
    }
    
    const parts = timeString.split(':');
    if (parts.length === 2) {
      return timeString + ':00';
    }
    
    return timeString;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (!patientId) {
      toast.error('Vui lòng đăng nhập để đặt lịch hẹn');
      navigate('/login');
      return;
    }
    
    setLoading(true);
    
    const appointmentData = {
      patientId: patientId,
      doctorId: parseInt(formData.doctorId),
      appointmentDate: formData.appointmentDate,
      appointmentTime: formatTimeForApi(formData.appointmentTime),
      appointmentType: formData.appointmentType,
      notes: formData.notes,
      isAnonymous: formData.isAnonymous
    };
    
    api.post('/api/Appointment/Create', appointmentData)
      .then(response => {
        toast.success('Đặt lịch hẹn thành công!');
        navigate('/patient/appointments');
      })
      .catch(error => {
        console.error('Error creating appointment:', error);
        toast.error(
          error.response?.data?.errors?.[0] || 
          'Không thể đặt lịch hẹn. Vui lòng thử lại sau.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Tạo danh sách các khung giờ từ 8:00 đến 17:00
  const timeSlots = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  return (
    <div className={styles.bookingContainer}>
      <div className={styles.bookingHeader}>
        <h1 className={styles.bookingTitle}>Đặt lịch hẹn khám bệnh</h1>
        <p className={styles.bookingSubtitle}>
          Vui lòng điền thông tin dưới đây để đặt lịch hẹn với bác sĩ
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>1. Chọn thời gian</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <Calendar className={styles.formIcon} size={16} />
                Ngày hẹn
              </label>
              <Input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleInputChange}
                min={format(new Date(), 'yyyy-MM-dd')}
                className={styles.formInput}
              />
              {errors.appointmentDate && (
                <p className={styles.errorText}>{errors.appointmentDate}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                <Clock className={styles.formIcon} size={16} />
                Giờ hẹn
              </label>
              <select
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleInputChange}
                className={styles.formSelect}
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.appointmentTime && (
                <p className={styles.errorText}>{errors.appointmentTime}</p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>2. Chọn bác sĩ và hình thức tư vấn</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <User className={styles.formIcon} size={16} />
              Bác sĩ
            </label>
            {loading ? (
              <div className={styles.loading}>Đang tải danh sách bác sĩ...</div>
            ) : availableDoctors.length > 0 ? (
              <div className={styles.doctorList}>
                {availableDoctors.map((doctor) => (
                  <div 
                    key={doctor.doctorId} 
                    className={`${styles.doctorCard} ${
                      formData.doctorId === doctor.doctorId.toString() ? styles.selectedDoctor : ''
                    }`}
                    onClick={() => handleInputChange({ 
                      target: { name: 'doctorId', value: doctor.doctorId.toString() }
                    })}
                  >
                    <div className={styles.doctorAvatar}>
                      <User size={32} />
                    </div>
                    <div className={styles.doctorInfo}>
                      <h4 className={styles.doctorName}>{doctor.fullName}</h4>
                      <p className={styles.doctorSpecialty}>{doctor.specialty}</p>
                    </div>
                    <div className={styles.doctorSelect}>
                      <input 
                        type="radio" 
                        name="doctorId" 
                        value={doctor.doctorId} 
                        checked={formData.doctorId === doctor.doctorId.toString()} 
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noDoctors}>
                <AlertCircle size={20} />
                Không có bác sĩ nào rảnh vào thời gian này. Vui lòng chọn ngày hoặc giờ khác.
              </div>
            )}
            {errors.doctorId && (
              <p className={styles.errorText}>{errors.doctorId}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <CalendarCheck className={styles.formIcon} size={16} />
              Loại tư vấn
            </label>
            <div className={styles.appointmentTypeList}>
              {appointmentTypes.map((type) => (
                <div 
                  key={type.id}
                  className={`${styles.typeCard} ${
                    formData.appointmentType === type.name ? styles.selectedType : ''
                  }`}
                  onClick={() => handleInputChange({
                    target: { name: 'appointmentType', value: type.name }
                  })}
                >
                  <div className={styles.typeInfo}>
                    <h4 className={styles.typeName}>{type.name}</h4>
                  </div>
                  <div className={styles.typeSelect}>
                    <input
                      type="radio"
                      name="appointmentType"
                      value={type.name}
                      checked={formData.appointmentType === type.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              ))}
            </div>
            {errors.appointmentType && (
              <p className={styles.errorText}>{errors.appointmentType}</p>
            )}
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>3. Ghi chú bổ sung</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Ghi chú (không bắt buộc)</label>
            <Textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Nhập mô tả triệu chứng hoặc các thông tin khác..."
              className={styles.formTextarea}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formCheckboxLabel}>
              <input
                type="checkbox"
                name="isAnonymous"
                checked={formData.isAnonymous}
                onChange={handleInputChange}
                className={styles.formCheckbox}
              />
              Đặt lịch ẩn danh (thông tin cá nhân sẽ được bảo mật)
            </label>
          </div>
        </div>

        <div className={styles.formActions}>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate('/patient/dashboard')}
            className={styles.cancelButton}
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={loading} 
            className={styles.submitButton}
          >
            {loading ? 'Đang xử lý...' : 'Đặt lịch hẹn'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentBooking;
