import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2 } from 'lucide-react';
import doctorScheduleService from '../../services/doctorScheduleService';
import { ensureValidUser } from '../../utils/doctorUtils';

const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Lấy doctorId từ localStorage
  const [doctorId, setDoctorId] = useState(null);

  useEffect(() => {
    // KHÔNG tự động cập nhật user.id/doctorId từ backend nữa!
    // Chỉ lấy doctorId từ localStorage (user đăng nhập)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const currentDoctorId = user.doctorId || user.id || 1;
    setDoctorId(currentDoctorId);
    console.log('User data from localStorage:', user);
  }, []);

  useEffect(() => {
    if (doctorId) {
      fetchSchedules();
    }
  }, [doctorId]);

  // Helper: always use English day for workDay
  function normalizeWorkDay(day) {
    if (!day) return '';
    if (EN_TO_VI_DAY[day]) return day; // Already English
    const viToEn = {
      'Thứ 2': 'Monday', 'Thứ 3': 'Tuesday', 'Thứ 4': 'Wednesday', 'Thứ 5': 'Thursday', 'Thứ 6': 'Friday', 'Thứ 7': 'Saturday', 'Chủ nhật': 'Sunday'
    };
    return viToEn[day] || day;
  }

  // Helper: always use Vietnamese day for display
  function normalizeWorkDayVi(day) {
    if (!day) return '';
    if (VI_TO_EN_DAY[day]) return day; // Already Vietnamese
    return EN_TO_VI_DAY[day] || day;
  }

  // Fetch schedules from API
  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError('');
      setErrorMessage('');
      const response = await doctorScheduleService.getByDoctorId(doctorId);
      let schedulesArr = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        schedulesArr = response.data.data;
      } else if (Array.isArray(response.data)) {
        schedulesArr = response.data;
      } else if (typeof response.data === 'string') {
        try {
          const parsed = JSON.parse(response.data);
          schedulesArr = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          schedulesArr = [];
        }
      }
      // Chuẩn hóa id và workDay: LUÔN dùng scheduleId từ backend làm id duy nhất
      schedulesArr = schedulesArr.map(s => ({
        ...s,
        id: s.scheduleId, // luôn dùng scheduleId từ backend
        workDay: normalizeWorkDay(s.workDay)
      }));
      setSchedules(schedulesArr);
    } catch (err) {
      const apiError = err?.response?.data?.errors
        ? JSON.stringify(err.response.data.errors)
        : err.message;
      setError('Không thể tải lịch làm việc. ' + apiError);
      setSchedules([]);
      setErrorMessage('Lỗi API: ' + apiError);
      console.error('Error fetching schedules:', err, err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (data = null) => {
    // Nếu data là ngày (chưa có lịch), kiểm tra xem đã có lịch chưa
    if (data && data.workDay && !data.id && !data.scheduleId) {
      const workDayEn = normalizeWorkDay(data.workDay);
      const existingSchedule = schedules.find(s => s.workDay === workDayEn);
      if (existingSchedule) {
        setEditData(existingSchedule);
        setModalOpen(true);
        setErrorMessage('Đã có lịch cho ngày này, bạn có thể chỉnh sửa hoặc xóa!');
        return;
      }
    }
    // Luôn truyền đúng id khi sửa
    setEditData(data);
    setModalOpen(true);
    setErrorMessage('');
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
    setErrorMessage(''); // Clear error message when modal is closed
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa lịch làm việc này?')) {
      return;
    }

    setDeletingId(id);
    try {
      await doctorScheduleService.delete(id);
      setSchedules(schedules => schedules.filter(s => s.id !== id));
      setSuccessMessage('Xóa lịch làm việc thành công!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('Không thể xóa lịch làm việc. Vui lòng thử lại.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (form) => {
    setSaving(true);
    setErrorMessage('');
    if (!doctorId) {
      setErrorMessage('Cannot find doctor information. Please log in again.');
      setSaving(false);
      return;
    }
    const numericDoctorId = parseInt(doctorId);
    if (isNaN(numericDoctorId)) {
      setErrorMessage('Invalid doctor ID. Please check your account.');
      setSaving(false);
      return;
    }
    // Always convert workDay to English before submit
    let workDayEn = normalizeWorkDay(form.workDay);
    if (!workDayEn || !['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].includes(workDayEn)) {
      setErrorMessage('Work day is invalid. Please select a valid day.');
      setSaving(false);
      return;
    }
    if (!numericDoctorId || numericDoctorId <= 0) {
      setErrorMessage('Doctor ID must be a positive number.');
      setSaving(false);
      return;
    }
    // Check for duplicate schedule (only when creating new)
    if (!form.id) {
      const existingSchedule = schedules.find(s => s.workDay === workDayEn);
      if (existingSchedule) {
        setEditData(existingSchedule);
        setErrorMessage(`A schedule for ${EN_TO_VI_DAY[workDayEn] || workDayEn} already exists. You can edit or delete it.`);
        setSaving(false);
        return;
      }
    }
    // Kiểm tra thời gian hợp lệ
    const startTime = new Date(`2000-01-01T${form.startTime}`);
    const endTime = new Date(`2000-01-01T${form.endTime}`);
    const diffHours = (endTime - startTime) / (1000 * 60 * 60);
    if (diffHours < 1) {
      setErrorMessage('Thời gian làm việc phải ít nhất 1 giờ');
      setSaving(false);
      return;
    }
    if (diffHours > 12) {
      setErrorMessage('Thời gian làm việc không được vượt quá 12 giờ');
      setSaving(false);
      return;
    }
    // Build payload with English workDay and time format HH:mm:ss
    const toTimeString = (t) => t.length === 5 ? t + ':00' : t;
    let payload;
    if (form.id) {
      // UPDATE: gửi trực tiếp object, KHÔNG bọc dto (theo swagger mới)
      const scheduleIdNum = Number(form.id);
      if (!scheduleIdNum || isNaN(scheduleIdNum)) {
        setErrorMessage('Lỗi: scheduleId không hợp lệ!');
        setSaving(false);
        return;
      }
      payload = {
        scheduleId: scheduleIdNum,
        startTime: toTimeString(form.startTime),
        endTime: toTimeString(form.endTime)
      };
      console.log('DEBUG scheduleId:', scheduleIdNum, 'Payload:', payload);
    } else {
      // CREATE: gửi đủ trường
      payload = {
        DoctorId: numericDoctorId,
        WorkDay: workDayEn,
        StartTime: toTimeString(form.startTime),
        EndTime: toTimeString(form.endTime)
      };
    }
    const debugMsg = `Payload sent to API: ${JSON.stringify(payload, null, 2)}\nRaw workDay: ${form.workDay}\nRaw doctorId: ${doctorId}`;
    alert(debugMsg);
    console.log('Payload sent to API:', payload, 'Raw workDay:', form.workDay, 'Raw doctorId:', doctorId);
    try {
      let response;
      if (form.id) {
        response = await doctorScheduleService.update(payload);
      } else {
        response = await doctorScheduleService.create(payload);
      }
      if (response.data?.status === true) {
        await fetchSchedules();
        setSuccessMessage(form.id ? 'Schedule updated successfully!' : 'Schedule created successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
        setModalOpen(false);
        setEditData(null);
      } else {
        setErrorMessage(form.id ? 'Update failed!' : 'Create failed!');
      }
    } catch (err) {
      const apiError = err?.response?.data?.errors
        ? JSON.stringify(err.response.data.errors)
        : err.message;
      setErrorMessage('Save schedule error: ' + apiError);
      console.error('Save schedule error:', err, err?.response?.data);
    } finally {
      setSaving(false);
    }
  };

  console.log('Schedules to render:', schedules);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {successMessage}
          </div>
        )}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Lịch làm việc</h1>
            <p className="text-gray-600">Quản lý lịch làm việc bác sĩ</p>
            {doctorId && (
              <p className="text-sm text-gray-500 mt-1">Doctor ID: {doctorId}</p>
            )}
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow" onClick={() => handleOpenModal()}>
            <Calendar className="w-5 h-5" />
            Tạo lịch mới
          </Button>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
          {/* Debug schedules raw data */}
          <div className="mb-4">
            <span className="block text-xs text-gray-500 font-mono mb-1">Schedules raw data:</span>
            <pre className="bg-gray-100 rounded p-2 text-xs text-gray-800 overflow-x-auto max-h-40 border border-gray-200">
              {JSON.stringify(schedules, null, 2)}
            </pre>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Calendar className="inline-block w-6 h-6 text-blue-500" /> Thời khóa biểu làm việc
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-blue-900 font-bold text-center bg-blue-50 rounded-tl-xl">Thứ</th>
                  <th className="px-4 py-2 text-blue-900 font-bold text-center bg-blue-50">Khung giờ làm việc</th>
                  <th className="px-4 py-2 text-blue-900 font-bold text-center bg-blue-50 rounded-tr-xl">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day, idx) => {
                  // Tìm lịch cho ngày này, chấp nhận cả tiếng Anh và tiếng Việt
                  const schedule = schedules.find(s =>
                    s.workDay === day || s.workDay === EN_TO_VI_DAY[day]
                  );
                  const dayColors = [
                    'from-blue-400 to-blue-600',
                    'from-green-400 to-green-500',
                    'from-purple-400 to-purple-600',
                    'from-pink-400 to-pink-500',
                    'from-yellow-400 to-yellow-500',
                    'from-cyan-400 to-cyan-500',
                    'from-gray-400 to-gray-600',
                  ];
                  return (
                    <tr key={day} className="">
                      <td className="px-4 py-3 text-center font-bold">
                        <span className={`inline-block px-3 py-1 rounded-full text-white shadow bg-gradient-to-r ${dayColors[idx]}`}>{EN_TO_VI_DAY[day]}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {schedule ? (
                          <span className="inline-flex items-center gap-2 bg-white border border-blue-200 rounded-lg px-4 py-1 text-blue-900 font-semibold shadow">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            {schedule.startTime} - {schedule.endTime}
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-300">Đã có lịch</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-gray-400 italic">
                            <Calendar className="w-4 h-4 text-gray-300" />
                            Chưa có lịch
                            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">Trống</span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {schedule ? (
                          <div className="flex justify-center gap-2">
                            <Button size="sm" variant="outline" className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold border-0 shadow hover:from-blue-500 hover:to-blue-700 transition" onClick={() => handleOpenModal(schedule)}>Sửa</Button>
                            <Button size="sm" variant="destructive" className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold border-0 shadow hover:from-red-500 hover:to-red-700 transition" onClick={() => handleDelete(schedule.id)} disabled={deletingId === schedule.id}>
                              {deletingId === schedule.id ? (
                                <><Loader2 className="w-4 h-4 mr-1 animate-spin" />Đang xóa...</>
                              ) : 'Xóa'}
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold shadow hover:from-green-500 hover:to-green-700 transition" onClick={() => handleOpenModal({ workDay: day })}>Tạo lịch</Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {modalOpen && (
        <Modal onClose={handleCloseModal} disabled={saving}>
          <ScheduleForm
            initialData={editData}
            onSubmit={handleSubmit}
            onCancel={handleCloseModal}
            saving={saving}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
        </Modal>
      )}
    </div>
  );
};

// Modal component
const Modal = ({ children, onClose, disabled = false }) => {
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !disabled) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [disabled]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div 
        className="absolute inset-0" 
        onClick={disabled ? undefined : onClose}
      />
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative z-10">
        <button 
          className="absolute top-2 right-3 text-2xl text-gray-400 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={onClose}
          disabled={disabled}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

// Form modal cho tạo/sửa lịch
const ScheduleForm = ({ initialData, onSubmit, onCancel, saving = false, errorMessage, setErrorMessage }) => {
  const [form, setForm] = useState(initialData || { workDay: '', startTime: '', endTime: '' });
  const [error, setError] = useState('');
  
  // Reset form when initialData changes
  useEffect(() => {
    setForm({
      workDay: initialData?.workDay || '',
      startTime: initialData?.startTime || '',
      endTime: initialData?.endTime || ''
    });
    setError('');
  }, [initialData]);
  
  const handleChange = e => {
    const { name, value } = e.target;
    // Nếu chọn ngày tiếng Việt thì convert sang tiếng Anh
    if (name === 'workDay') {
      setForm(f => ({ ...f, workDay: VI_TO_EN_DAY[value] || value }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
    setError('');
    setErrorMessage(''); // Clear error message when form changes
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!form.workDay || !form.startTime || !form.endTime) {
      setError('Vui lòng điền đầy đủ thông tin');
      setErrorMessage('Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (form.startTime >= form.endTime) {
      setError('Thời gian kết thúc phải sau thời gian bắt đầu');
      return;
    }
    
    // Kiểm tra thời gian làm việc hợp lý (ít nhất 1 giờ, tối đa 12 giờ)
    const startTime = new Date(`2000-01-01T${form.startTime}`);
    const endTime = new Date(`2000-01-01T${form.endTime}`);
    const diffHours = (endTime - startTime) / (1000 * 60 * 60);
    
    if (diffHours < 1) {
      setError('Thời gian làm việc phải ít nhất 1 giờ');
      return;
    }
    
    if (diffHours > 12) {
      setError('Thời gian làm việc không được vượt quá 12 giờ');
      return;
    }
    
    setError('');
    
    try {
      // Luôn truyền đúng id khi update
      await onSubmit({ ...form, id: initialData?.scheduleId });
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra khi lưu lịch làm việc';
      setError(errorMessage);
      console.error('Lỗi lưu lịch:', err);
    }
  };
  
  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {errorMessage}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ngày làm việc *
        </label>
        <select
          name="workDay"
          value={EN_TO_VI_DAY[form.workDay] || form.workDay}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Chọn ngày</option>
          <option value="Thứ 2">Thứ 2</option>
          <option value="Thứ 3">Thứ 3</option>
          <option value="Thứ 4">Thứ 4</option>
          <option value="Thứ 5">Thứ 5</option>
          <option value="Thứ 6">Thứ 6</option>
          <option value="Thứ 7">Thứ 7</option>
          <option value="Chủ nhật">Chủ nhật</option>
        </select>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ bắt đầu *
          </label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Giờ kết thúc *
          </label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>
      
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={saving}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            initialData ? 'Cập nhật' : 'Tạo mới'
          )}
        </Button>
      </div>
    </form>
  );
};

// Helper: Map tiếng Việt sang tiếng Anh cho ngày trong tuần
const VI_TO_EN_DAY = {
  'Thứ 2': 'Monday',
  'Thứ 3': 'Tuesday',
  'Thứ 4': 'Wednesday',
  'Thứ 5': 'Thursday',
  'Thứ 6': 'Friday',
  'Thứ 7': 'Saturday',
  'Chủ nhật': 'Sunday',
};
const EN_TO_VI_DAY = {
  'Monday': 'Thứ 2',
  'Tuesday': 'Thứ 3',
  'Wednesday': 'Thứ 4',
  'Thursday': 'Thứ 5',
  'Friday': 'Thứ 6',
  'Saturday': 'Thứ 7',
  'Sunday': 'Chủ nhật',
};

export default Schedule;
