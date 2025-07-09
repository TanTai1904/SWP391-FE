import React, { useEffect, useState } from 'react';
import api from '../../services/api';
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
      return user ? JSON.parse(user).id : null;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    if (!doctorId) return;
    api.get(`/Appointment/GetByDoctorId/${doctorId}`)
      .then(res => {
        // Đảm bảo appointments luôn là mảng
        let data = res.data;
        if (!Array.isArray(data)) {
          if (data && Array.isArray(data.data)) {
            data = data.data;
          } else {
            data = [];
          }
        }
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải lịch tư vấn.');
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

      const payload = {
        ...newAppointment,
        doctorId: doctorId,
        status: 'Pending',
        // Make sure the date is in the format the API expects
        appointmentDate: new Date(newAppointment.appointmentDate).toISOString()
      };
      
      console.log('Creating appointment with payload:', payload);
      
      // Get token from localStorage
      const user = localStorage.getItem('user');
      let token = '';
      try {
        const userData = JSON.parse(user);
        token = userData && userData.accessToken ? userData.accessToken : '';
        console.log('Using token:', token ? 'Token found' : 'No token');
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
      
      // Use the appointmentService directly
      const response = await api.post('/Appointment/Create', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
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
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) {
          data = data.data;
        } else {
          data = [];
        }
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Create appointment error:', err);
      const errorMessage = err.response?.status === 403 
        ? 'Bạn không có quyền tạo lịch tư vấn. Vui lòng đăng nhập lại với tài khoản có quyền phù hợp.'
        : `Tạo lịch tư vấn thất bại: ${err.response?.data?.message || err.message}`;
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
      setEditForm({
        ...editModal.appointment,
        id: editModal.appointment.appointmentId || editModal.appointment.id,
        appointmentId: editModal.appointment.appointmentId || editModal.appointment.id
      });
    }
  }, [editModal.appointment, editModal.mode]);

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

      // Create complete payload with all necessary fields
      const payload = {
        ...apt,
        id: appointmentId,
        appointmentId: appointmentId,
        status: 'Scheduled'
      };
      
      console.log('Confirming with payload:', payload);

      const user = localStorage.getItem('user');
      let token = '';
      try { token = user ? JSON.parse(user).accessToken : ''; } catch (error) { /* Ignore JSON parsing errors */ }
      
      // Use the Update endpoint consistent with appointmentService
      await api.put(`/Appointment/Update`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      
      setEditModal({ open: false, appointment: null, mode: 'confirm' });
      // Reload
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) data = data.data; else data = [];
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Confirm error:', err);
      setEditError('Xác nhận lịch thất bại: ' + (err.response?.data?.message || err.message));
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

      // Create complete payload with all necessary fields
      const payload = {
        ...apt,
        id: appointmentId,
        appointmentId: appointmentId,
        status: 'Cancelled'
      };
      
      console.log('Rejecting with payload:', payload);

      const user = localStorage.getItem('user');
      let token = '';
      try { token = user ? JSON.parse(user).accessToken : ''; } catch (error) { /* Ignore JSON parsing errors */ }
      
      // Use the Update endpoint consistent with appointmentService
      await api.put(`/Appointment/Update`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      
      setEditModal({ open: false, appointment: null, mode: 'confirm' });
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) data = data.data; else data = [];
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Reject error:', err);
      setEditError('Từ chối lịch thất bại: ' + (err.response?.data?.message || err.message));
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

      const appointmentId = editForm.appointmentId || editForm.id;
      console.log('Editing appointment with ID:', appointmentId);

      // Make sure we're sending the data in the format the API expects
      const payload = {
        ...editForm,
        id: appointmentId,
        appointmentId: appointmentId
      };
      
      console.log('Editing with payload:', payload);

      const user = localStorage.getItem('user');
      let token = '';
      try { token = user ? JSON.parse(user).accessToken : ''; } catch (error) { /* Ignore JSON parsing errors */ }
      
      // Use the correct endpoint based on appointment service
      await api.put(`/Appointment/Update`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      setEditModal({ open: false, appointment: null, mode: 'edit' });
      setEditLoading(false);
      setLoading(true);
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) data = data.data; else data = [];
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Edit error:', err);
      setEditError('Sửa lịch thất bại: ' + (err.response?.data?.message || err.message));
      setEditLoading(false);
    }
  };

  // Xác nhận nhanh
  const handleQuickConfirm = async (apt) => {
    setLoading(true);
    try {
      const appointmentId = apt.appointmentId || apt.id;
      if (!appointmentId) {
        console.error('Không tìm thấy ID lịch hẹn.');
        setLoading(false);
        return;
      }

      // Create complete payload with all necessary fields
      const payload = {
        ...apt,
        id: appointmentId,
        appointmentId: appointmentId,
        status: 'Scheduled'
      };
      
      console.log('Quick confirming with payload:', payload);

      const user = localStorage.getItem('user');
      let token = '';
      try { token = user ? JSON.parse(user).accessToken : ''; } catch (error) { /* Ignore JSON parsing errors */ }
      
      // Use the Update endpoint consistent with appointmentService
      await api.put(`/Appointment/Update`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) data = data.data; else data = [];
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Quick confirm error:', err);
      setLoading(false);
    }
  };

  // Từ chối nhanh
  const handleQuickReject = async (apt) => {
    setLoading(true);
    try {
      const appointmentId = apt.appointmentId || apt.id;
      if (!appointmentId) {
        console.error('Không tìm thấy ID lịch hẹn.');
        setLoading(false);
        return;
      }

      // Create complete payload with all necessary fields
      const payload = {
        ...apt,
        id: appointmentId,
        appointmentId: appointmentId,
        status: 'Cancelled'
      };
      
      console.log('Quick rejecting with payload:', payload);

      const user = localStorage.getItem('user');
      let token = '';
      try { token = user ? JSON.parse(user).accessToken : ''; } catch (error) { /* Ignore JSON parsing errors */ }
      
      // Use the Update endpoint consistent with appointmentService
      await api.put(`/Appointment/Update`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) data = data.data; else data = [];
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Quick reject error:', err);
      setLoading(false);
    }
  };

  // Xóa nhanh
  const handleQuickDelete = async (apt) => {
    // Confirm deletion
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch hẹn này không?')) {
      return;
    }
    
    setLoading(true);
    try {
      const appointmentId = apt.appointmentId || apt.id;
      if (!appointmentId) {
        console.error('Không tìm thấy ID lịch hẹn.');
        setLoading(false);
        return;
      }

      console.log('Deleting appointment with ID:', appointmentId);

      const user = localStorage.getItem('user');
      let token = '';
      try { token = user ? JSON.parse(user).accessToken : ''; } catch (error) { /* Ignore JSON parsing errors */ }
      
      // Use the correct Delete endpoint
      await api.delete(`/Appointment/Delete/${appointmentId}`, { 
        headers: token ? { Authorization: `Bearer ${token}` } : {} 
      });
      
      const res = await api.get(`/Appointment/GetByDoctorId/${doctorId}`);
      let data = res.data;
      if (!Array.isArray(data)) {
        if (data && Array.isArray(data.data)) data = data.data; else data = [];
      }
      setAppointments(data);
      setLoading(false);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Xóa lịch hẹn thất bại: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  return (
    <div className={styles.consultation}>
      <div className={styles.header}>
        <h2>Quản lý lịch tư vấn</h2>
        <Button onClick={() => setShowCreateModal(true)}>Tạo lịch tư vấn</Button>
      </div>
      
      <div className={styles.tabs}>
        <Button
          variant={activeTab === 'appointments' ? 'default' : 'outline'}
          onClick={() => setActiveTab('appointments')}
        >
          Lịch hẹn
        </Button>
        <Button
          variant={activeTab === 'chat' ? 'default' : 'outline'}
          onClick={() => setActiveTab('chat')}
        >
          Trò chuyện
        </Button>
      </div>
      
      <div className={styles.content}>
        {loading ? (
          <Loader2 className={styles.loader} />
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : activeTab === 'appointments' ? (
          <div className={styles.appointmentsList}>
            {appointments.length === 0 ? (
              <div className={styles.empty}>Không có lịch hẹn nào.</div>
            ) : (
              appointments.map((apt) => (
                <div key={apt.appointmentId} className={styles.appointmentCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.patientInfo}>
                      <span className={styles.patientName}>{apt.patientName || 'Bệnh nhân không rõ'}</span>
                      <span className={styles.reason}>{apt.reason || 'Không có lý do'}</span>
                    </div>
                    <div className={styles.status}>{getStatusBadge(apt.status)}</div>
                  </div>
                  <div className={styles.cardBody}>
                    <div className={styles.typeIcon}>{getTypeIcon(apt.appointmentType)}</div>
                    <div className={styles.datetime}>
                      <Calendar className={styles.icon} />
                      <span>{new Date(apt.appointmentDate).toLocaleDateString('vi-VN')}</span>
                      <Clock className={styles.icon} />
                      <span>{apt.appointmentTime}</span>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    {apt.status === 'Pending' && (
                      <>
                        <Button size="sm" onClick={() => handleQuickConfirm(apt)} className={styles.confirmBtn}>Xác nhận</Button>
                        <Button size="sm" variant="outline" onClick={() => handleQuickReject(apt)} className={styles.rejectBtn}>Từ chối</Button>
                      </>
                    )}
                    {apt.status === 'Scheduled' && (
                      <>
                        <Button size="sm" onClick={() => setEditModal({ open: true, appointment: apt, mode: 'edit' })}>Sửa</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleQuickDelete(apt)}>Xóa</Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className={styles.chatContainer}>
            <div className={styles.chatSidebar}>
              {chatHistory.length === 0 ? (
                <div className={styles.empty}>Không có lịch sử trò chuyện.</div>
              ) : (
                <ul className={styles.chatList}>
                  {chatHistory.map((chat) => (
                    <li 
                      key={chat.id} 
                      className={`${styles.chatItem} ${selectedChat?.id === chat.id ? styles.chatItemActive : ''}`}
                      onClick={() => setSelectedChat(chat)}
                    >
                      <div className={styles.chatAvatar}>
                        {chat.patientName ? chat.patientName.charAt(0) : '?'}
                      </div>
                      <div className={styles.chatInfo}>
                        <div className={styles.chatName}>{chat.patientName || 'Bệnh nhân không rõ'}</div>
                        <div className={styles.chatPreview}>{chat.lastMessage}</div>
                      </div>
                      {chat.unread > 0 && <span className={styles.unreadBadge}>{chat.unread}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className={styles.chatMain}>
              {selectedChat ? (
                <>
                  <div className={styles.chatHeader}>
                    <div className={styles.chatAvatar}>
                      {selectedChat.patientName ? selectedChat.patientName.charAt(0) : '?'}
                    </div>
                    <div>
                      <div className={styles.chatName}>{selectedChat.patientName || 'Bệnh nhân không rõ'}</div>
                      <div className={styles.chatStatus}>{selectedChat.status || 'Offline'}</div>
                    </div>
                  </div>
                  
                  <div className={styles.chatMessages}>
                    <div className={styles.empty}>Chưa có tin nhắn. Bắt đầu trò chuyện!</div>
                  </div>
                  
                  <div className={styles.chatInputArea}>
                    <textarea 
                      className={styles.chatInput} 
                      placeholder="Nhập tin nhắn..."
                      rows={2}
                    ></textarea>
                    <Button className={styles.sendButton}>
                      <Send size={18} />
                    </Button>
                  </div>
                </>
              ) : (
                <div className={styles.noChatSelected}>
                  <MessageSquare size={48} className={styles.noChatIcon} />
                  <p>Chọn một cuộc trò chuyện để bắt đầu</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal tạo lịch tư vấn */}
      {showCreateModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Tạo lịch tư vấn</h3>
              <Button
                variant="icon"
                onClick={() => setShowCreateModal(false)}
                className={styles.closeButton}
              >
                <X className={styles.closeIcon} />
              </Button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Họ tên bệnh nhân</label>
                <Input
                  value={newAppointment.patientName}
                  onChange={(e) => setNewAppointment({ ...newAppointment, patientName: e.target.value })}
                  placeholder="Nhập họ tên bệnh nhân"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Ngày hẹn</label>
                <Input
                  type="date"
                  value={newAppointment.appointmentDate}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentDate: e.target.value })}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Giờ hẹn</label>
                <Input
                  type="time"
                  value={newAppointment.appointmentTime}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentTime: e.target.value })}
                  className={styles.timeInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Loại tư vấn</label>
                <select
                  value={newAppointment.appointmentType}
                  onChange={(e) => setNewAppointment({ ...newAppointment, appointmentType: e.target.value })}
                  className={styles.selectInput}
                >
                  <option value="Tư vấn trực tiếp">Tư vấn trực tiếp</option>
                  <option value="Video call">Video call</option>
                  <option value="Chat tư vấn">Chat tư vấn</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Lý do</label>
                <Textarea
                  value={newAppointment.reason}
                  onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                  placeholder="Nhập lý do tư vấn"
                  rows={3}
                />
              </div>
              {createError && <div className={styles.error}>{createError}</div>}
            </div>
            <div className={styles.modalFooter}>
              <Button
                onClick={handleCreateAppointment}
                disabled={creating}
              >
                {creating ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                Tạo lịch tư vấn
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận/từ chối/sửa lịch hẹn */}
      {editModal.open && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>{editModal.mode === 'confirm' ? 'Xác nhận lịch hẹn' : 'Sửa lịch hẹn'}</h3>
              <Button
                variant="icon"
                onClick={() => setEditModal({ open: false, appointment: null, mode: 'confirm' })}
                className={styles.closeButton}
              >
                <X className={styles.closeIcon} />
              </Button>
            </div>
            <div className={styles.modalBody}>
              {editModal.mode === 'confirm' ? (
                <div>
                  <p>Bạn có chắc chắn muốn xác nhận lịch hẹn này không?</p>
                  <div className={styles.info}>
                    <div className={styles.patient}>
                      <strong>{editModal.appointment?.patientName || 'Bệnh nhân không rõ'}</strong>
                      <span>{editModal.appointment?.reason || 'Không có lý do'}</span>
                    </div>
                    <div className={styles.date}>
                      <Calendar className={styles.icon} />
                      <span>{editModal.appointment?.appointmentDate ? 
                        new Date(editModal.appointment.appointmentDate).toLocaleDateString('vi-VN') : ''}</span>
                    </div>
                    <div className={styles.time}>
                      <Clock className={styles.icon} />
                      <span>{editModal.appointment?.appointmentTime}</span>
                    </div>
                  </div>
                  {editError && <div className={styles.error}>{editError}</div>}
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label>Ghi chú</label>
                  <Textarea
                    value={editForm.note}
                    onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
                    placeholder="Nhập ghi chú cho lịch hẹn này"
                    rows={3}
                  />
                  {editError && <div className={styles.error}>{editError}</div>}
                </div>
              )}
            </div>
            <div className={styles.modalFooter}>
              {editModal.mode === 'confirm' ? (
                <div className={styles.actions}>
                  <Button
                    onClick={() => handleConfirm(editModal.appointment)}
                    disabled={editLoading}
                  >
                    {editLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                    Xác nhận
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleReject(editModal.appointment)}
                    disabled={editLoading}
                  >
                    Từ chối
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleEdit}
                  disabled={editLoading}
                >
                  {editLoading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
                  Lưu thay đổi
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