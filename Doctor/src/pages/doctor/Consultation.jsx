import React, { useEffect, useState } from 'react';
import api, { validateDate, formatTimeForApi } from '../../services/api';
import styles from './styles/consultation.module.css';
import { 
  MessageSquare, Calendar, Users, Loader2, Clock, X, 
  Check, AlertCircle, Trash2, Edit, Plus, 
  UserCircle, ChevronRight, Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Consultation = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // State để quản lý cuộc trò chuyện đang được chọn
  const [selectedChat, setSelectedChat] = useState(null);

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
        // Import the utility function
        const { processApiResponse } = require('../../services/api');
        
        // Use the utility to handle different response structures
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

  // Mock chat history (nếu chưa có API)
  const chatHistory = [
    {
      id: 1,
      patientName: '', // Xóa tên mẫu, để trống hoặc lấy từ API
      lastMessage: '',
      timestamp: '',
      unread: 0,
      status: ''
    },
    {
      id: 2,
      patientName: 'Trần Thị B',
      lastMessage: 'Em có thể đổi giờ hẹn khám được không ạ?',
      timestamp: '9:45 AM',
      unread: 2,
      status: 'Offline'
    },
    {
      id: 3,
      patientName: 'Lê Văn C',
      lastMessage: 'Kết quả xét nghiệm của em đã có chưa bác sĩ?',
      timestamp: 'Yesterday',
      unread: 1,
      status: 'Online'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
      case 'Đã lên lịch':
        return <Badge className={styles.badgeScheduled}>Đã lên lịch</Badge>;
      case 'Completed':
      case 'Hoàn thành':
        return <Badge className={styles.badgeCompleted}>Hoàn thành</Badge>;
      case 'Pending':
      case 'Chờ xác nhận':
        return <Badge className={styles.badgePending}>Chờ xác nhận</Badge>;
      case 'Cancelled':
      case 'Đã hủy':
        return <Badge className={styles.badgeCancelled}>Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Tư vấn trực tiếp':
        return <Users className={styles.iconType} />;
      case 'Video call':
        return <Calendar className={styles.iconType} />;
      case 'Chat tư vấn':
        return <MessageSquare className={styles.iconType} />;
      default:
        return <MessageSquare className={styles.iconType} />;
    }
  };

  // Modal tạo lịch tư vấn
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    appointmentDate: '',
    appointmentTime: '',
    appointmentType: 'Tư vấn trực tiếp',
    reason: ''
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateAppointment = async () => {
    setCreating(true);
    setCreateError('');
    try {
      // Validate required fields
      if (!newAppointment.patientName || !newAppointment.appointmentDate || !newAppointment.appointmentTime) {
        setCreateError('Vui lòng điền đầy đủ thông tin bắt buộc: tên bệnh nhân, ngày và giờ hẹn.');
        setCreating(false);
        return;
      }
      
      // Validate date is not in the past
      if (!validateDate(newAppointment.appointmentDate)) {
        setCreateError('Ngày hẹn không thể là ngày trong quá khứ.');
        setCreating(false);
        return;
      }

      // Get user info for token debugging
      const userStr = localStorage.getItem('user');
      const directToken = localStorage.getItem('token');
      console.log('Authentication state before creating appointment:', {
        directTokenExists: !!directToken,
        directTokenLength: directToken ? directToken.length : 0,
        userDataExists: !!userStr
      });
      
      if (!doctorId) {
        setCreateError('Không tìm thấy ID bác sĩ. Vui lòng đăng nhập lại.');
        setCreating(false);
        return;
      }

      // Format date properly as yyyy-MM-dd for API
      let formattedDate = newAppointment.appointmentDate;
      try {
        if (formattedDate) {
          const date = new Date(formattedDate);
          if (!isNaN(date.getTime())) {
            // Format as yyyy-MM-dd (the API expects this format)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
            console.log('Formatted date for API:', formattedDate);
          }
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
      
      // Format time properly with seconds (HH:mm:ss)
      const formattedTime = formatTimeForApi(newAppointment.appointmentTime);

      // Create a clean payload according to API docs (see Swagger)
      const payload = {
        patientId: null,          // null for anonymous
        doctorId: doctorId,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentType: newAppointment.appointmentType || "Tư vấn trực tiếp",
        isAnonymous: true,        // Mark as anonymous since we're not providing patientId
        // These are additional fields our app uses but aren't required by API
        patientName: newAppointment.patientName || "",
        reason: newAppointment.reason || "",
        note: newAppointment.note || "",
        status: 'Pending'
      };
      
      console.log('Creating appointment with payload:', payload);
      
      // Use the api instance with explicit headers for debugging
      const response = await api.post('/Appointment/Create', payload);
      
      console.log('Create appointment response:', response);
      
      setShowCreateModal(false);
      setNewAppointment({
        patientName: '',
        appointmentDate: '',
        appointmentTime: '',
        appointmentType: 'Tư vấn trực tiếp',
        reason: ''
      });
      setCreating(false);
      
      // Reload list
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      
      // Handle different API response structures
      const { processApiResponse } = require('../../services/api');
      const processedData = processApiResponse(res);
      
      setAppointments(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Create appointment error:', err);
      // Provide more detailed error messages
      let errorMessage = 'Tạo lịch tư vấn thất bại';
      
      if (err.response?.status === 403) {
        errorMessage = 'Bạn không có quyền tạo lịch tư vấn. Vui lòng đăng nhập lại với tài khoản có quyền phù hợp.';
      } else if (err.response?.status === 400) {
        // Try to extract validation errors
        const errorData = err.response.data;
        if (errorData.errors) {
          const errorFields = Object.keys(errorData.errors);
          if (errorFields.length > 0) {
            errorMessage = `Dữ liệu không hợp lệ: ${errorFields.join(', ')}`;
          } else {
            errorMessage = 'Dữ liệu không hợp lệ, vui lòng kiểm tra lại.';
          }
        } else if (errorData.message) {
          errorMessage = `Lỗi: ${errorData.message}`;
        }
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setCreateError(errorMessage);
      setCreating(false);
    }
  };

  // Modal xác nhận/từ chối/sửa lịch hẹn
  const [editModal, setEditModal] = useState({ open: false, appointment: null, mode: 'confirm' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (editModal.appointment && editModal.mode === 'edit') {
      // Include all the needed fields, especially the ID
      // Also ensure the date format is properly handled
      const appointment = editModal.appointment;
      const appointmentId = appointment.appointmentId || appointment.id;
      
      // Format the date properly if it exists
      let formattedDate = appointment.appointmentDate;
      try {
        if (formattedDate) {
          // Try to standardize the date format for the API
          formattedDate = new Date(formattedDate).toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
      
      setEditForm({
        id: appointmentId,
        appointmentId: appointmentId,
        doctorId: doctorId,
        patientName: appointment.patientName,
        appointmentDate: formattedDate,
        appointmentTime: appointment.appointmentTime,
        reason: appointment.reason,
        note: appointment.note,
        status: appointment.status,
        appointmentType: appointment.appointmentType || 'Tư vấn trực tiếp'
      });
    }
  }, [editModal.appointment, editModal.mode, doctorId]);

  // Xác nhận lịch
  const handleConfirm = async (apt) => {
    setEditLoading(true);
    setEditError('');
    try {
      const appointmentId = apt.appointmentId || apt.id;
      if (!appointmentId) {
        setEditError('Không tìm thấy ID lịch hẹn.');
        setEditLoading(false);
        return;
      }

      console.log('Confirming appointment with ID:', appointmentId);
      
      // Format date properly if needed
      let formattedDate = apt.appointmentDate;
      try {
        if (formattedDate && !formattedDate.includes('-')) {
          const date = new Date(formattedDate);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
          }
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
      
      // Format time properly with seconds (HH:mm:ss)
      const formattedTime = formatTimeForApi(apt.appointmentTime);
      
      // Use the standard Update endpoint with proper payload structure according to API docs
      const cleanPayload = {
        appointmentId: appointmentId, // API requires this field
        doctorId: doctorId,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentType: apt.appointmentType || "Tư vấn trực tiếp",
        status: 'Scheduled' // Set status to Scheduled for confirmation
      };
      
      console.log('Confirming appointment with payload:', cleanPayload);
      await api.put(`/Appointment/Update`, cleanPayload);
      
      setEditModal({ open: false, appointment: null, mode: 'confirm' });
      
      // Reload appointments list
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      
      // Handle different API response structures
      const { processApiResponse } = require('../../services/api');
      const processedData = processApiResponse(res);
      
      setAppointments(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Confirm error:', err);
      // Show more detailed error messages
      let errorMessage = 'Xác nhận lịch thất bại';
      
      if (err.response?.status === 403) {
        errorMessage += ': Bạn không có quyền xác nhận lịch hẹn này.';
      } else if (err.response?.status === 400 && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors) {
          // Check specifically for appointmentTime format issues
          if (errorData.errors['$.appointmentTime']) {
            errorMessage += ': Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng HH:mm:ss.';
          } else {
            errorMessage += `: Dữ liệu không hợp lệ - ${Object.keys(errorData.errors).join(', ')}`;
          }
        } else if (errorData.message) {
          errorMessage += `: ${errorData.message}`;
        }
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setEditError(errorMessage);
      setEditLoading(false);
    }
  };
  
  // Từ chối lịch
  const handleReject = async (apt) => {
    setEditLoading(true);
    setEditError('');
    try {
      const appointmentId = apt.appointmentId || apt.id;
      if (!appointmentId) {
        setEditError('Không tìm thấy ID lịch hẹn.');
        setEditLoading(false);
        return;
      }

      console.log('Rejecting appointment with ID:', appointmentId);
      
      // Format date properly if needed
      let formattedDate = apt.appointmentDate;
      try {
        if (formattedDate && !formattedDate.includes('-')) {
          const date = new Date(formattedDate);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
          }
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
      
      // Format time properly with seconds (HH:mm:ss)
      const formattedTime = formatTimeForApi(apt.appointmentTime);
      
      // Use the standard Update endpoint with proper payload structure according to API docs
      const cleanPayload = {
        appointmentId: appointmentId, // API requires this field
        doctorId: doctorId,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentType: apt.appointmentType || "Tư vấn trực tiếp",
        status: 'Cancelled' // Set status to Cancelled for rejection
      };
      
      console.log('Rejecting appointment with payload:', cleanPayload);
      await api.put(`/Appointment/Update`, cleanPayload);
      
      setEditModal({ open: false, appointment: null, mode: 'confirm' });
      
      // Reload appointments list
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      
      // Handle different API response structures
      const { processApiResponse } = require('../../services/api');
      const processedData = processApiResponse(res);
      
      setAppointments(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Reject error:', err);
      
      // Show more detailed error messages
      let errorMessage = 'Từ chối lịch thất bại';
      
      if (err.response?.status === 403) {
        errorMessage += ': Bạn không có quyền từ chối lịch hẹn này.';
      } else if (err.response?.status === 400 && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors) {
          // Check specifically for appointmentTime format issues
          if (errorData.errors['$.appointmentTime']) {
            errorMessage += ': Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng HH:mm:ss.';
          } else {
            errorMessage += `: Dữ liệu không hợp lệ - ${Object.keys(errorData.errors).join(', ')}`;
          }
        } else if (errorData.message) {
          errorMessage += `: ${errorData.message}`;
        }
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setEditError(errorMessage);
      setEditLoading(false);
    }
  };
  
  // Sửa lịch
  const handleEdit = async () => {
    setEditLoading(true);
    setEditError('');
    try {
      // Make sure we have the appointment ID
      if (!editForm.id && !editForm.appointmentId) {
        setEditError('Không tìm thấy ID lịch hẹn.');
        setEditLoading(false);
        return;
      }

      // Validate date is not in the past
      if (!validateDate(editForm.appointmentDate)) {
        setEditError('Ngày hẹn không thể là ngày trong quá khứ.');
        setEditLoading(false);
        return;
      }

      const appointmentId = editForm.appointmentId || editForm.id;
      console.log('Editing appointment with ID:', appointmentId);

      // Format date properly for the API
      let formattedDate = editForm.appointmentDate;
      try {
        if (formattedDate) {
          const date = new Date(formattedDate);
          if (!isNaN(date.getTime())) {
            // Format as yyyy-MM-dd (the API expects this format)
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;
            console.log('Formatted date for API:', formattedDate);
          }
        }
      } catch (error) {
        console.error('Error formatting date:', error);
      }
      
      // Format time properly with seconds (HH:mm:ss)
      const formattedTime = formatTimeForApi(editForm.appointmentTime);

      // Prepare a clean payload with properly formatted values according to the API docs
      const cleanPayload = {
        appointmentId: appointmentId,  // API requires this field
        doctorId: doctorId,  // Use doctorId from the component state
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        appointmentType: editForm.appointmentType || "Tư vấn trực tiếp",
        status: editForm.status || "Scheduled"
      };
      
      console.log('Editing appointment with payload:', cleanPayload);
      
      // Use the standard Update endpoint
      await api.put(`/Appointment/Update`, cleanPayload);
      
      setEditModal({ open: false, appointment: null, mode: 'edit' });
      setEditLoading(false);
      
      // Reload appointments
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      
      // Handle different API response structures
      const { processApiResponse } = require('../../services/api');
      const processedData = processApiResponse(res);
      
      setAppointments(processedData);
      setLoading(false);
    } catch (err) {
      console.error('Edit appointment error:', err);
      
      // Show more detailed error messages
      let errorMessage = 'Cập nhật lịch thất bại';
      
      if (err.response?.status === 403) {
        errorMessage += ': Bạn không có quyền cập nhật lịch hẹn này.';
      } else if (err.response?.status === 400 && err.response.data) {
        const errorData = err.response.data;
        if (errorData.errors) {
          // Check specifically for appointmentTime format issues
          if (errorData.errors['$.appointmentTime']) {
            errorMessage += ': Định dạng thời gian không hợp lệ. Vui lòng sử dụng định dạng HH:mm:ss.';
          } else {
            errorMessage += `: Dữ liệu không hợp lệ - ${Object.keys(errorData.errors).join(', ')}`;
          }
        } else if (errorData.message) {
          errorMessage += `: ${errorData.message}`;
        }
      } else if (err.message) {
        errorMessage += `: ${err.message}`;
      }
      
      setEditError(errorMessage);
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.consultationContainer}>
      <div className={styles.tabs}>
        <div 
          className={`${styles.tab} ${activeTab === 'appointments' ? styles.active : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Lịch hẹn
        </div>
        <div 
          className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Trò chuyện
        </div>
      </div>
      
      {loading && <Loader2 className={styles.loader} />}
      
      {error && <div className={styles.error}>{error}</div>}
      
      {activeTab === 'appointments' && !loading && (
        <div className={styles.appointmentsList}>
          <div className={styles.appointmentsHeader}>
            <Button
              onClick={() => setShowCreateModal(true)}
              className={styles.createButton}
            >
              <Plus size={16} />
              Tạo lịch hẹn mới
            </Button>
          </div>
          {appointments.length === 0 ? (
            <div className={styles.noAppointments}>
              Chưa có lịch hẹn nào.
            </div>
          ) : (
            appointments.map(appointment => (
              <div key={appointment.appointmentId} className={styles.appointmentItem}>
                <div className={styles.appointmentDetails}>
                  <div className={styles.appointmentHeader}>
                    <div className={styles.patientName}>{appointment.patientName || 'Bệnh nhân không rõ'}</div>
                    <div className={styles.appointmentStatus}>
                      {getStatusBadge(appointment.status)}
                    </div>
                  </div>
                  <div className={styles.appointmentInfo}>
                    <div className={styles.appointmentTime}>
                      <Clock className={styles.clockIcon} />
                      {new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', { year: 'numeric', month: '2-digit', day: '2-digit' })} - {appointment.appointmentTime}
                    </div>
                    <div className={styles.appointmentType}>
                      {getTypeIcon(appointment.appointmentType)}
                      {appointment.appointmentType}
                    </div>
                  </div>
                </div>
                <div className={styles.appointmentActions}>
                  <Button 
                    onClick={() => {
                      setEditModal({ open: true, appointment, mode: 'edit' });
                    }}
                    variant="outline"
                    size="sm"
                    className={styles.editButton}
                  >
                    <Edit className={styles.editIcon} />
                    Sửa
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditModal({ open: true, appointment, mode: 'confirm' });
                    }}
                    variant="default"
                    size="sm"
                    className={styles.confirmButton}
                  >
                    <Check className={styles.confirmIcon} />
                    Xác nhận
                  </Button>
                  <Button 
                    onClick={() => {
                      setEditModal({ open: true, appointment, mode: 'reject' });
                    }}
                    variant="destructive"
                    size="sm"
                    className={styles.rejectButton}
                  >
                    <Trash2 className={styles.rejectIcon} />
                    Từ chối
                  </Button>
                </div>
              </div>
            ))
          }
        </div>
      )}
      
      {activeTab === 'chat' && !loading && (
        <div className={styles.chatContainer}>
          {chatHistory.length === 0 ? (
            <div className={styles.noChats}>
              Chưa có cuộc trò chuyện nào.
            </div>
          ) : (
            chatHistory.map(chat => (                <div key={chat.id} className={styles.chatItem}>
                <div className={styles.chatHeader}>
                  <div className={styles.patientName}>{chat.patientName || 'Bệnh nhân không rõ'}</div>
                  <div className={styles.chatStatus}>
                    <Badge variant={chat.status === 'Online' ? "default" : "secondary"} className={chat.status === 'Online' ? "bg-green-100 text-green-700" : ""}>
                      {chat.status}
                    </Badge>
                  </div>
                </div>
                <div className={styles.chatBody}>
                  <div className={styles.lastMessage}>{chat.lastMessage}</div>
                  <div className={styles.timestamp}>{chat.timestamp}</div>
                </div>
                <div className={styles.unreadCount}>
                  {chat.unread > 0 && (
                    <Badge variant="destructive" className={styles.badgeUnread}>
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}
      
      {/* Modal tạo lịch tư vấn */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Tạo lịch tư vấn mới</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowCreateModal(false)}
              >
                <X className={styles.closeIcon} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Tên bệnh nhân</label>
                <Input 
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                  className={styles.input}
                  placeholder="Nhập tên bệnh nhân"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Ngày hẹn</label>
                <Input 
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                  className={styles.input}
                  min={new Date().toISOString().split('T')[0]} // Prevent selecting dates in the past
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Giờ hẹn</label>
                <Input 
                  type="time"
                  value={newAppointment.appointmentTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentTime: e.target.value })}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Loại hẹn</label>
                <select 
                  value={newAppointment.appointmentType}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentType: e.target.value })}
                  className={styles.select}
                >
                  <option value="Tư vấn trực tiếp">Tư vấn trực tiếp</option>
                  <option value="Video call">Video call</option>
                  <option value="Chat tư vấn">Chat tư vấn</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Lý do</label>
                <Textarea 
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  className={styles.textarea}
                  placeholder="Nhập lý do hẹn khám"
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
            </div>
            <div className={styles.modalFooter}>
              <Button 
                onClick={handleCreateAppointment}
                variant="primary"
                className={styles.submitButton}
                loading={creating}
              >
                Tạo lịch hẹn
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal xác nhận/từ chối/sửa lịch hẹn */}
      {(editModal.open) && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                {editModal.mode === 'confirm' && 'Xác nhận lịch hẹn'}
                {editModal.mode === 'reject' && 'Từ chối lịch hẹn'}
                {editModal.mode === 'edit' && 'Sửa lịch hẹn'}
              </h3>
              <button 
                className={styles.closeButton}
                onClick={() => setEditModal({ open: false, appointment: null, mode: 'confirm' })}
              >
                <X className={styles.closeIcon} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {editModal.mode !== 'edit' ? (
                <div className={styles.confirmationMessage}>
                  Bạn có chắc chắn muốn {editModal.mode === 'confirm' ? 'xác nhận' : 'từ chối'} lịch hẹn này?
                </div>
              ) : (
                <>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ngày hẹn</label>
                    <Input 
                      type="date"
                      value={editForm.appointmentDate}
                      onChange={(e) => setEditForm({ ...editForm, appointmentDate: e.target.value })}
                      className={styles.input}
                      min={new Date().toISOString().split('T')[0]} // Prevent selecting dates in the past
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Giờ hẹn</label>
                    <Input 
                      type="time"
                      value={editForm.appointmentTime}
                      onChange={(e) => setEditForm({ ...editForm, appointmentTime: e.target.value })}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Ghi chú</label>
                    <Textarea 
                      value={editForm.note}
                      onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                      className={styles.textarea}
                      placeholder="Nhập ghi chú cho lịch hẹn"
                    />
                  </div>
                </>
              )}
              
              {editError && <div className={styles.error}>{editError}</div>}
            </div>
            <div className={styles.modalFooter}>
              {editModal.mode === 'edit' ? (
                <Button 
                  onClick={handleEdit}
                  variant="primary"
                  className={styles.submitButton}
                  loading={editLoading}
                >
                  Lưu thay đổi
                </Button>
              ) : (
                <Button 
                  onClick={editModal.mode === 'confirm' ? () => handleConfirm(editModal.appointment) : () => handleReject(editModal.appointment)}
                  variant={editModal.mode === 'confirm' ? "default" : "destructive"}
                  className={styles.submitButton}
                  loading={editLoading}
                >
                  {editModal.mode === 'confirm' ? 'Xác nhận' : 'Từ chối'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Consultation;