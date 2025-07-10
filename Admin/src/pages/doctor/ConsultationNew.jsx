import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import appointmentService from '../../services/appointmentService';
import styles from './styles/consultation.module.css';
import { 
  Calendar, Users, Loader2, Clock, X, 
  Check, AlertCircle, Search, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Date and time formatting helpers have been removed as they were only used for appointment creation

// Function to process API response
const processApiResponse = (response) => {
  if (!response || !response.data) return [];
  
  // Handle direct data array
  if (Array.isArray(response.data)) {
    return response.data;
  }
  
  // Handle .NET API response with data property
  if (response.data.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  
  // Handle .NET API response with result property
  if (response.data.result && Array.isArray(response.data.result)) {
    return response.data.result;
  }
  
  console.warn('Unexpected API response format:', response.data);
  return [];
};

const Consultation = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [detailsModal, setDetailsModal] = useState({ open: false, appointment: null });
  
  // Removed appointment creation functionality as per requirements

  // Lấy id bác sĩ từ localStorage user
  const doctorId = (() => {
    const user = localStorage.getItem('user');
    try {
      // Log the entire user object to debug
      if (user) {
        const userData = JSON.parse(user);
        console.log('User data from localStorage:', {
          id: userData.id,
          doctorId: userData.doctorId, // Check both possible ID fields
          role: userData.role || 'no role defined',
          tokenExists: !!userData.accessToken,
          tokenStart: userData.accessToken ? userData.accessToken.substring(0, 15) + '...' : 'no token'
        });
        
        // Use doctorId if available, fallback to id
        const finalDoctorId = userData.doctorId || userData.id;
        console.log('Using doctor ID:', finalDoctorId);
        return finalDoctorId;
      }
      console.warn('No user data found in localStorage');
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  })();

  // Load appointments on component mount
  useEffect(() => {
    if (!doctorId) {
      console.error('No doctor ID found, cannot load appointments');
      setError('ID bác sĩ không hợp lệ. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }
    
    console.log('Loading appointments for doctor ID:', doctorId);
    setLoading(true);
    
    api.get(`/Appointment/GetByDoctorId/${doctorId}`)
      .then(res => {
        // Process the response data
        const processedData = processApiResponse(res);
        console.log('Processed appointment data:', processedData);
        
        setAppointments(processedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading appointments:', err);
        
        let errorMessage = 'Không thể tải lịch tư vấn.';
        if (err.response?.status === 403) {
          errorMessage = 'Bạn không có quyền xem lịch tư vấn này. Vui lòng đăng nhập lại.';
        } else if (err.response?.status === 404) {
          errorMessage = 'Không tìm thấy dữ liệu lịch tư vấn cho bác sĩ này.';
        }
        
        setError(errorMessage);
        setLoading(false);
      });
  }, [doctorId]);
  
  // Filter appointments based on search term and status filter
  useEffect(() => {
    if (appointments.length === 0) {
      setFilteredAppointments([]);
      return;
    }
    
    let filtered = [...appointments];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => {
        // Handle different status naming conventions
        const status = apt.status ? apt.status.toLowerCase() : '';
        const filterValue = filterStatus.toLowerCase();
        
        if (filterValue === 'pending') {
          return status === 'pending' || status === 'chờ xác nhận';
        } else if (filterValue === 'confirmed') {
          return status === 'confirmed' || status === 'scheduled' || status === 'đã xác nhận' || status === 'đã lên lịch';
        } else if (filterValue === 'completed') {
          return status === 'completed' || status === 'hoàn thành';
        } else if (filterValue === 'rejected') {
          return status === 'rejected' || status === 'cancelled' || status === 'đã hủy';
        }
        return true;
      });
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.trim().toLowerCase();
      filtered = filtered.filter(apt => 
        (apt.patientName && apt.patientName.toLowerCase().includes(searchLower)) ||
        (apt.appointmentDate && apt.appointmentDate.includes(searchLower)) ||
        (apt.appointmentTime && apt.appointmentTime.includes(searchLower)) ||
        (apt.appointmentType && apt.appointmentType.toLowerCase().includes(searchLower)) ||
        (apt.reason && apt.reason.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, filterStatus]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  // Open appointment details modal
  const openDetailsModal = (appointment) => {
    setDetailsModal({ open: true, appointment });
  };
  
  // Close appointment details modal
  const closeDetailsModal = () => {
    setDetailsModal({ open: false, appointment: null });
  };
  
  // Handle appointment confirmation
  const handleConfirmAppointment = async (appointment) => {
    try {
      const appointmentId = appointment.appointmentId || appointment.id;
      if (!appointmentId) {
        toast.error('ID lịch hẹn không hợp lệ');
        return;
      }
      
      // Sử dụng direct API call thay vì service để xem chi tiết lỗi
      console.log("Đang gửi xác nhận lịch hẹn:", {
        appointmentId: appointmentId,
        status: 'Scheduled',
        doctorId: doctorId
      });
      
      try {
        // Thử cập nhật trạng thái bằng cách gọi trực tiếp đến API
        const response = await api.put('/Appointment/Update', {
          appointmentId: appointmentId,
          status: 'Scheduled',
          doctorId: doctorId
        });
        
        console.log("Kết quả xác nhận lịch hẹn:", response);
      } catch (updateError) {
        console.error('Error updating appointment status:', updateError);
        
        if (updateError.response) {
          console.error('Error details:', {
            status: updateError.response.status,
            data: updateError.response.data
          });
        }
        
        toast.error('Không thể xác nhận lịch hẹn: ' + 
          (updateError.response?.data?.message || updateError.message));
        
        return;
      }
      
      toast.success('Đã xác nhận lịch hẹn');
      
      // Reload appointments
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      const updatedAppointments = processApiResponse(res);
      setAppointments(updatedAppointments);
      setLoading(false);
      
      // Close modal if open
      if (detailsModal.open && detailsModal.appointment?.id === appointmentId) {
        closeDetailsModal();
      }
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Không thể xác nhận lịch hẹn');
    }
  };
  
  // Xử lý hủy lịch hẹn đã được xác nhận
  const handleCancelConfirmation = async (appointment) => {
    try {
      const appointmentId = appointment.appointmentId || appointment.id;
      if (!appointmentId) {
        toast.error('ID lịch hẹn không hợp lệ');
        return;
      }
      
      console.log("Đang gửi yêu cầu xóa lịch hẹn:", appointmentId);
      
      // Sử dụng phương thức xóa lịch hẹn thay vì cập nhật trạng thái
      await appointmentService.deleteAppointment(appointmentId);
      
      toast.success('Đã hủy lịch hẹn thành công');
      
      // Tải lại danh sách lịch hẹn
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      const updatedAppointments = processApiResponse(res);
      setAppointments(updatedAppointments);
      setLoading(false);
      
      // Đóng modal nếu đang mở
      if (detailsModal.open && detailsModal.appointment?.id === appointmentId) {
        closeDetailsModal();
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      
      // Log chi tiết lỗi để debug
      if (error.response) {
        console.error('API error response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      }
      
      // Thử phương pháp thay thế - gọi trực tiếp API delete endpoint
      try {
        const appointmentId = appointment.appointmentId || appointment.id;
        
        await api.delete(`/Appointment/Delete/${appointmentId}`);
        
        toast.success('Đã hủy lịch hẹn thành công');
        
        // Tải lại danh sách lịch hẹn
        setLoading(true);
        const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
        const updatedAppointments = processApiResponse(res);
        setAppointments(updatedAppointments);
        setLoading(false);
        
        // Đóng modal nếu đang mở
        if (detailsModal.open && detailsModal.appointment?.id === appointmentId) {
          closeDetailsModal();
        }
      } catch (secondError) {
        console.error('Error with direct API call:', secondError);
        toast.error('Không thể hủy lịch hẹn. Vui lòng thử lại sau.');
      }
    }
  };
  
  // Handle appointment rejection
  const handleRejectAppointment = async (appointment, reason = 'Bác sĩ không sắp xếp được lịch') => {
    try {
      const appointmentId = appointment.appointmentId || appointment.id;
      if (!appointmentId) {
        toast.error('ID lịch hẹn không hợp lệ');
        return;
      }
      
      // Cố gắng xóa lịch hẹn thay vì cập nhật trạng thái
      try {
        // Thử xóa lịch hẹn
        await appointmentService.deleteAppointment(appointmentId);
      } catch (deleteError) {
        // Nếu xóa không thành công, thử cập nhật trạng thái
        console.log('Không thể xóa, đang thử cập nhật trạng thái...', deleteError);
        
        await api.put('/Appointment/Update', {
          appointmentId: appointmentId,
          status: 'Cancelled',
          doctorId: doctorId,
          note: reason
        });
      }
      
      toast.success('Đã từ chối lịch hẹn');
      
      // Reload appointments
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      const updatedAppointments = processApiResponse(res);
      setAppointments(updatedAppointments);
      setLoading(false);
      
      // Close modal if open
      if (detailsModal.open && detailsModal.appointment?.id === appointmentId) {
        closeDetailsModal();
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error);
      toast.error('Không thể từ chối lịch hẹn');
    }
  };
  
  // Handle marking appointment as completed
  const handleCompleteAppointment = async (appointment) => {
    try {
      const appointmentId = appointment.appointmentId || appointment.id;
      if (!appointmentId) {
        toast.error('ID lịch hẹn không hợp lệ');
        return;
      }
      
      try {
        // Thử cập nhật trạng thái bằng cách gọi trực tiếp đến API
        await api.put('/Appointment/Update', {
          appointmentId: appointmentId,
          status: 'Completed',
          doctorId: doctorId
        });
      } catch (updateError) {
        console.error('Error updating status:', updateError);
        
        // Nếu không thành công, thử xóa lịch hẹn (như là một giải pháp thay thế)
        console.log('Thử xóa lịch hẹn thay vì cập nhật...');
        await appointmentService.deleteAppointment(appointmentId);
        toast.info('Đã xóa lịch hẹn vì không thể cập nhật trạng thái');
        
        // Recarregar lista de compromissos
        setLoading(true);
        const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
        const updatedAppointments = processApiResponse(res);
        setAppointments(updatedAppointments);
        setLoading(false);
        
        // Đóng modal nếu đang mở
        if (detailsModal.open && detailsModal.appointment?.id === appointmentId) {
          closeDetailsModal();
        }
        
        return;
      }
      
      toast.success('Đã đánh dấu lịch hẹn hoàn thành');
      
      // Reload appointments
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      const updatedAppointments = processApiResponse(res);
      setAppointments(updatedAppointments);
      setLoading(false);
      
      // Close modal if open
      if (detailsModal.open && detailsModal.appointment?.id === appointmentId) {
        closeDetailsModal();
      }
    } catch (error) {
      console.error('Error completing appointment:', error);
      toast.error('Không thể đánh dấu lịch hẹn hoàn thành');
    }
  };
  
  // Appointment creation functionality removed as per requirements
  
  // Get badge component based on status
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase() || '';
    
    if (statusLower.includes('confirm') || statusLower.includes('scheduled') || statusLower.includes('xác nhận') || statusLower.includes('lịch')) {
      return <Badge className={styles.badgeConfirmed}>Đã xác nhận</Badge>;
    } else if (statusLower.includes('complet') || statusLower.includes('hoàn thành')) {
      return <Badge className={styles.badgeCompleted}>Hoàn thành</Badge>;
    } else if (statusLower.includes('cancel') || statusLower.includes('reject') || statusLower.includes('hủy')) {
      return <Badge className={styles.badgeRejected}>Đã hủy</Badge>;
    } else if (statusLower.includes('pending') || statusLower.includes('chờ')) {
      return <Badge className={styles.badgePending}>Chờ xác nhận</Badge>;
    }
    
    return <Badge className={styles.badgePending}>{status || 'Không xác định'}</Badge>;
  };
  
  // Get icon based on appointment type
  const getTypeIcon = (type) => {
    const typeLower = type?.toLowerCase() || '';
    
    if (typeLower.includes('trực tiếp')) {
      return <Users className={styles.iconType} size={16} />;
    } else if (typeLower.includes('online') || typeLower.includes('trực tuyến')) {
      return <Calendar className={styles.iconType} size={16} />;
    }
    
    return <FileText className={styles.iconType} size={16} />;
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className={styles.consultationContainer}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick />
      <div className={styles.consultationHeader}>
        <h2 className={styles.consultationTitle}>Quản lý lịch hẹn khám bệnh</h2>
      </div>
      
      <div className={styles.filterSection}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <Input
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân, ngày hẹn..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.filterButtons}>
          <Button 
            variant={filterStatus === 'all' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('all')}
            className={styles.filterButton}
          >
            Tất cả
          </Button>
          <Button 
            variant={filterStatus === 'pending' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('pending')}
            className={styles.filterButton}
          >
            <Badge className={styles.badgePending}>Chờ xác nhận</Badge>
          </Button>
          <Button 
            variant={filterStatus === 'confirmed' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('confirmed')}
            className={styles.filterButton}
          >
            <Badge className={styles.badgeConfirmed}>Đã xác nhận</Badge>
          </Button>
          <Button 
            variant={filterStatus === 'completed' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('completed')}
            className={styles.filterButton}
          >
            <Badge className={styles.badgeCompleted}>Hoàn thành</Badge>
          </Button>
          <Button 
            variant={filterStatus === 'rejected' ? 'default' : 'outline'} 
            onClick={() => handleFilterChange('rejected')}
            className={styles.filterButton}
          >
            <Badge className={styles.badgeRejected}>Đã hủy</Badge>
          </Button>
        </div>
      </div>
      
      {loading && (
        <div className={styles.loading}>
          <Loader2 size={40} className={styles.loadingSpinner} />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}
      
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {!loading && !error && filteredAppointments.length === 0 && (
        <div className={styles.emptyState}>
          <FileText size={48} className={styles.emptyStateIcon} />
          <h3>Không tìm thấy lịch hẹn nào</h3>
          <p>
            {searchTerm || filterStatus !== 'all' 
              ? 'Không có lịch hẹn nào phù hợp với tiêu chí tìm kiếm' 
              : 'Hiện tại bạn chưa có lịch hẹn nào'}
          </p>
        </div>
      )}
      
      {!loading && !error && filteredAppointments.length > 0 && (
        <div className={styles.cardsGrid}>
          {filteredAppointments.map(appointment => (
            <div key={appointment.id || appointment.appointmentId} className={styles.card}>
              <div className={styles.cardHeader}>
                <h3 className={styles.patientName}>
                  {appointment.patientName || 'Bệnh nhân ẩn danh'}
                </h3>
                {getStatusBadge(appointment.status)}
              </div>
              
              <div className={styles.cardContent}>
                <div className={styles.infoRow}>
                  <Calendar size={16} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>Ngày hẹn:</span>
                  <span className={styles.infoValue}>{formatDisplayDate(appointment.appointmentDate)}</span>
                </div>
                
                <div className={styles.infoRow}>
                  <Clock size={16} className={styles.infoIcon} />
                  <span className={styles.infoLabel}>Giờ hẹn:</span>
                  <span className={styles.infoValue}>{appointment.appointmentTime}</span>
                </div>
                
                <div className={styles.infoRow}>
                  {getTypeIcon(appointment.appointmentType)}
                  <span className={styles.infoLabel}>Loại tư vấn:</span>
                  <span className={styles.infoValue}>{appointment.appointmentType || 'Tư vấn trực tiếp'}</span>
                </div>
                
                {appointment.reason && (
                  <div className={styles.infoRow}>
                    <AlertCircle size={16} className={styles.infoIcon} />
                    <span className={styles.infoLabel}>Lý do khám:</span>
                    <span className={styles.infoValue}>{appointment.reason}</span>
                  </div>
                )}
              </div>
              
              <div className={styles.cardActions}>
                {(appointment.status === 'Pending' || appointment.status === 'pending' || 
                  appointment.status === 'Chờ xác nhận') && (
                  <>
                    <Button 
                      className={styles.actionButton + ' ' + styles.successButton} 
                      onClick={() => handleConfirmAppointment(appointment)}
                    >
                      <Check size={16} /> Xác nhận
                    </Button>
                    <Button 
                      className={styles.actionButton + ' ' + styles.dangerButton}
                      onClick={() => handleRejectAppointment(appointment)}
                    >
                      <X size={16} /> Từ chối
                    </Button>
                  </>
                )}
                
                {(appointment.status === 'Scheduled' || appointment.status === 'confirmed' || 
                  appointment.status === 'Đã lên lịch' || appointment.status === 'Đã xác nhận') && (
                  <>
                    <Button 
                      className={styles.actionButton + ' ' + styles.primaryButton}
                      onClick={() => handleCompleteAppointment(appointment)}
                    >
                      <Check size={16} /> Đánh dấu hoàn thành
                    </Button>
                    <Button 
                      className={styles.actionButton + ' ' + styles.warningButton}
                      onClick={() => handleCancelConfirmation(appointment)}
                    >
                      <X size={16} /> Hủy lịch hẹn
                    </Button>
                  </>
                )}
                
                <Button 
                  className={styles.actionButton + ' ' + styles.outlineButton}
                  onClick={() => openDetailsModal(appointment)}
                >
                  Chi tiết
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Appointment Details Modal */}
      {detailsModal.open && detailsModal.appointment && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Chi tiết lịch hẹn</h3>
              <button className={styles.modalClose} onClick={closeDetailsModal}>×</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.appointmentDetails}>
                <div className={styles.detailRow}>
                  <h4 className={styles.detailLabel}>Trạng thái:</h4>
                  <div className={styles.detailValue}>
                    {getStatusBadge(detailsModal.appointment.status)}
                  </div>
                </div>
                
                <div className={styles.detailRow}>
                  <h4 className={styles.detailLabel}>Tên bệnh nhân:</h4>
                  <div className={styles.detailValue}>
                    {detailsModal.appointment.patientName || 'Bệnh nhân ẩn danh'}
                  </div>
                </div>
                
                <div className={styles.detailRow}>
                  <h4 className={styles.detailLabel}>Ngày hẹn:</h4>
                  <div className={styles.detailValue}>
                    {formatDisplayDate(detailsModal.appointment.appointmentDate)}
                  </div>
                </div>
                
                <div className={styles.detailRow}>
                  <h4 className={styles.detailLabel}>Giờ hẹn:</h4>
                  <div className={styles.detailValue}>
                    {detailsModal.appointment.appointmentTime}
                  </div>
                </div>
                
                <div className={styles.detailRow}>
                  <h4 className={styles.detailLabel}>Loại tư vấn:</h4>
                  <div className={styles.detailValue}>
                    {detailsModal.appointment.appointmentType || 'Tư vấn trực tiếp'}
                  </div>
                </div>
                
                {detailsModal.appointment.reason && (
                  <div className={styles.detailRow}>
                    <h4 className={styles.detailLabel}>Lý do khám:</h4>
                    <div className={styles.detailValue}>
                      {detailsModal.appointment.reason}
                    </div>
                  </div>
                )}
                
                {detailsModal.appointment.note && (
                  <div className={styles.detailRow}>
                    <h4 className={styles.detailLabel}>Ghi chú:</h4>
                    <div className={styles.detailValue}>
                      {detailsModal.appointment.note}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              {(detailsModal.appointment.status === 'Pending' || 
                detailsModal.appointment.status === 'pending' || 
                detailsModal.appointment.status === 'Chờ xác nhận') && (
                <>
                  <Button 
                    className={styles.actionButton + ' ' + styles.successButton} 
                    onClick={() => handleConfirmAppointment(detailsModal.appointment)}
                  >
                    <Check size={16} /> Xác nhận
                  </Button>
                  <Button 
                    className={styles.actionButton + ' ' + styles.dangerButton}
                    onClick={() => handleRejectAppointment(detailsModal.appointment)}
                  >
                    <X size={16} /> Từ chối
                  </Button>
                </>
              )}
              
              {(detailsModal.appointment.status === 'Scheduled' || 
                detailsModal.appointment.status === 'confirmed' || 
                detailsModal.appointment.status === 'Đã lên lịch' || 
                detailsModal.appointment.status === 'Đã xác nhận') && (
                <>
                  <Button 
                    className={styles.actionButton + ' ' + styles.primaryButton}
                    onClick={() => handleCompleteAppointment(detailsModal.appointment)}
                  >
                    <Check size={16} /> Đánh dấu hoàn thành
                  </Button>
                  <Button 
                    className={styles.actionButton + ' ' + styles.warningButton}
                    onClick={() => handleCancelConfirmation(detailsModal.appointment)}
                  >
                    <X size={16} /> Hủy lịch hẹn
                  </Button>
                </>
              )}
              
              <Button 
                className={styles.actionButton + ' ' + styles.outlineButton}
                onClick={closeDetailsModal}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Appointment creation functionality removed as per requirements */}
    </div>
  );
};

export default Consultation;
