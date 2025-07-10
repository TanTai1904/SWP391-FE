import doctorService from '../services/doctorService';

/**
 * Lấy doctor ID thực tế từ hệ thống
 * @returns {Promise<number>} Doctor ID
 */
export const getActualDoctorId = async () => {
  try {
    // Lấy tất cả bác sĩ từ backend
    const allDoctorsResponse = await doctorService.getAllDoctors();
    
    if (allDoctorsResponse.data && allDoctorsResponse.data.length > 0) {
      // Sử dụng bác sĩ đầu tiên
      const firstDoctor = allDoctorsResponse.data[0];
      
      // Cập nhật localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...user, id: firstDoctor.id, doctorId: firstDoctor.id };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return firstDoctor.id;
    }
    
    // Fallback nếu không có bác sĩ nào
    return 1;
  } catch (error) {
    console.error('Lỗi khi lấy doctor ID:', error);
    return 1; // Fallback
  }
};

/**
 * Lấy thông tin bác sĩ thực tế từ hệ thống
 * @returns {Promise<Object>} Doctor data
 */
export const getActualDoctorData = async () => {
  try {
    const allDoctorsResponse = await doctorService.getAllDoctors();
    
    if (allDoctorsResponse.data && allDoctorsResponse.data.length > 0) {
      const firstDoctor = allDoctorsResponse.data[0];
      
      // Cập nhật localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...user, id: firstDoctor.id, doctorId: firstDoctor.id };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return firstDoctor;
    }
    
    // Fallback data
    return {
      id: 1,
      fullName: 'Dr. Nguyễn Văn A',
      name: 'Dr. Nguyễn Văn A',
      specialization: 'Bác sĩ điều trị HIV',
      license: 'BS-001',
      experience: '5 năm',
      department: 'Khoa Nhiễm'
    };
  } catch (error) {
    console.error('Lỗi khi lấy doctor data:', error);
    return {
      id: 1,
      fullName: 'Dr. Nguyễn Văn A',
      name: 'Dr. Nguyễn Văn A',
      specialization: 'Bác sĩ điều trị HIV',
      license: 'BS-001',
      experience: '5 năm',
      department: 'Khoa Nhiễm'
    };
  }
};

/**
 * Lấy doctor ID từ localStorage hoặc fallback
 * @returns {number} Doctor ID
 */
export const getCurrentDoctorId = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return user.id || user.doctorId || 1;
};

/**
 * Đảm bảo user có ID hợp lệ
 * @returns {Promise<void>}
 */
export const ensureValidUser = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Nếu user không có ID hoặc ID là null, lấy từ backend
    if (!user.id || user.id === null) {
      const actualDoctorId = await getActualDoctorId();
      const updatedUser = { ...user, id: actualDoctorId, doctorId: actualDoctorId };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('Đã cập nhật user ID:', actualDoctorId);
    }
  } catch (error) {
    console.error('Lỗi khi đảm bảo user hợp lệ:', error);
  }
}; 