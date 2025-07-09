import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Calendar, 
  Clock,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { useToast } from "../../hooks/use-toast";
import doctorService from "../../services/doctorService";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../../components/ui/input";

const DoctorSchedule = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ day: '', startTime: '', endTime: '', isAvailable: true });
  const [editId, setEditId] = useState(null);

  const fetchSchedules = async () => {
    if (!user?.doctorId) return;
    setLoading(true);
    try {
      const data = await doctorService.getDoctorSchedule(user.doctorId);
      setSchedules(data?.schedules || []);
    } catch (e) {
      toast({ title: 'Lỗi', description: 'Không lấy được lịch làm việc' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line
  }, [user]);

  const handleOpenForm = (schedule = null) => {
    if (schedule) {
      setForm({ ...schedule });
      setEditId(schedule.id);
    } else {
      setForm({ day: '', startTime: '', endTime: '', isAvailable: true });
      setEditId(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm({ day: '', startTime: '', endTime: '', isAvailable: true });
    setEditId(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await doctorService.updateDoctorSchedule(user.doctorId, editId, form);
        toast({ title: 'Cập nhật lịch thành công' });
      } else {
        await doctorService.createDoctorSchedule(user.doctorId, form);
        toast({ title: 'Thêm lịch thành công' });
      }
      fetchSchedules();
      handleCloseForm();
    } catch (err) {
      toast({ title: 'Lỗi', description: 'Không thể lưu lịch làm việc' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa lịch này?')) return;
    try {
      await doctorService.deleteDoctorSchedule(user.doctorId, id);
      toast({ title: 'Đã xóa lịch' });
      fetchSchedules();
    } catch (err) {
      toast({ title: 'Lỗi', description: 'Không thể xóa lịch' });
    }
  };

  const getWeekDays = (date) => {
    const week = [];
    const startDate = new Date(date);
    startDate.setDate(date.getDate() - date.getDay() + 1); // Start from Monday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDays = getWeekDays(new Date());

  const handleAddAppointment = () => {
    toast({
      title: "Thêm cuộc hẹn mới",
      description: "Đang mở form tạo cuộc hẹn mới...",
    });
  };

  const handleAppointmentAction = (action, appointmentId) => {
    toast({
      title: `${action} cuộc hẹn`,
      description: `Đang thực hiện ${action.toLowerCase()} cho cuộc hẹn #${appointmentId}`,
    });
  };

  const getAppointmentTypeBadge = (type) => {
    switch (type) {
      case 'consultation':
        return <Badge className="bg-blue-100 text-blue-700">Tư vấn</Badge>;
      case 'followup':
        return <Badge className="bg-green-100 text-green-700">Tái khám</Badge>;
      case 'emergency':
        return <Badge className="bg-red-100 text-red-700">Cấp cứu</Badge>;
      default:
        return <Badge variant="secondary">Khác</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-700">Đã đặt lịch</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getTodayAppointments = () => {
    const today = new Date().toDateString();
    return schedules.filter(apt => apt.status === 'scheduled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="h-8 w-8 mr-3 text-green-600" />
            Lịch làm việc
          </h1>
          <p className="text-gray-600 mt-2">Quản lý lịch hẹn và thời gian làm việc</p>
        </div>
        <Button onClick={handleAddAppointment} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm cuộc hẹn
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Hôm nay</p>
                <p className="text-3xl font-bold">{getTodayAppointments().length}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Tuần này</p>
                <p className="text-3xl font-bold">28</p>
              </div>
              <Calendar className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Hoàn thành</p>
                <p className="text-3xl font-bold">{schedules.filter(a => a.status === 'completed').length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Cấp cứu</p>
                <p className="text-3xl font-bold">{schedules.filter(a => a.type === 'emergency').length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Calendar */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Lịch tuần</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium px-4">
                {weekDays[0].toLocaleDateString('vi-VN')} - {weekDays[6].toLocaleDateString('vi-VN')}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day, index) => (
              <div key={index} className="border rounded-lg p-3 min-h-[200px]">
                <div className="text-center mb-2">
                  <p className="text-sm font-medium text-gray-600">
                    {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {day.getDate()}
                  </p>
                </div>
                <div className="space-y-1">
                  {/* Sample appointments for today */}
                  {day.toDateString() === new Date().toDateString() && (
                    <>
                      <div className="bg-blue-100 p-2 rounded text-xs">
                        <p className="font-medium">09:00 - Nguyễn Văn A</p>
                        <p className="text-gray-600">Tư vấn</p>
                      </div>
                      <div className="bg-green-100 p-2 rounded text-xs">
                        <p className="font-medium">14:00 - Trần Thị B</p>
                        <p className="text-gray-600">Tái khám</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Danh sách lịch làm việc */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch làm việc của tôi ({schedules.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Ngày</th>
                    <th className="p-2 text-left">Bắt đầu</th>
                    <th className="p-2 text-left">Kết thúc</th>
                    <th className="p-2 text-left">Trạng thái</th>
                    <th className="p-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s.id || s.day} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-medium">{s.day}</td>
                      <td className="p-2">{s.startTime}</td>
                      <td className="p-2">{s.endTime}</td>
                      <td className="p-2">{s.isAvailable ? <Badge className="bg-green-100 text-green-700">Làm việc</Badge> : <Badge className="bg-red-100 text-red-700">Nghỉ</Badge>}</td>
                      <td className="p-2 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenForm(s)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">{editId ? 'Cập nhật lịch làm việc' : 'Thêm lịch làm việc mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Ngày</label>
                <Input name="day" value={form.day} onChange={handleChange} required placeholder="Monday, Tuesday..." />
              </div>
              <div>
                <label className="block mb-1 font-medium">Bắt đầu</label>
                <Input name="startTime" value={form.startTime} onChange={handleChange} required type="time" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Kết thúc</label>
                <Input name="endTime" value={form.endTime} onChange={handleChange} required type="time" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="isAvailable" checked={form.isAvailable} onChange={handleChange} id="isAvailable" />
                <label htmlFor="isAvailable">Có làm việc</label>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm}>Hủy</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">Lưu</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorSchedule; 