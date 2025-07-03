import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Plus, Edit, Trash2, UserCheck } from 'lucide-react';
import doctorService from "../../services/doctorService";
import { useToast } from "../../hooks/use-toast";

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  specialty: '',
  bio: '',
  experience: '',
  education: '',
};

const DoctorManagement = () => {
  const { toast } = useToast();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data || []);
    } catch (e) {
      toast({ title: 'Lỗi', description: 'Không lấy được danh sách bác sĩ' });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleOpenForm = (doctor = null) => {
    if (doctor) {
      setForm({ ...doctor });
      setEditId(doctor.id);
    } else {
      setForm(initialForm);
      setEditId(null);
    }
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await doctorService.updateDoctor(editId, form);
        toast({ title: 'Cập nhật thành công' });
      } else {
        await doctorService.createDoctor(form);
        toast({ title: 'Thêm mới thành công' });
      }
      fetchDoctors();
      handleCloseForm();
    } catch (err) {
      toast({ title: 'Lỗi', description: 'Không thể lưu bác sĩ' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa bác sĩ này?')) return;
    try {
      await doctorService.deleteDoctor(id);
      toast({ title: 'Đã xóa bác sĩ' });
      fetchDoctors();
    } catch (err) {
      toast({ title: 'Lỗi', description: 'Không thể xóa bác sĩ' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center text-blue-700">
          <UserCheck className="h-8 w-8 mr-2" /> Quản lý bác sĩ
        </h1>
        <Button onClick={() => handleOpenForm()} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" /> Thêm bác sĩ
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bác sĩ ({doctors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 text-left">Họ tên</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Chuyên khoa</th>
                    <th className="p-2 text-left">Kinh nghiệm</th>
                    <th className="p-2 text-left">Học vấn</th>
                    <th className="p-2 text-left">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map((d) => (
                    <tr key={d.id} className="border-b hover:bg-slate-50">
                      <td className="p-2 font-medium">{d.fullName}</td>
                      <td className="p-2">{d.email}</td>
                      <td className="p-2">{d.specialty}</td>
                      <td className="p-2">{d.experience} năm</td>
                      <td className="p-2">{d.education}</td>
                      <td className="p-2 space-x-2">
                        <Button size="sm" variant="outline" onClick={() => handleOpenForm(d)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDelete(d.id)}>
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
            <h2 className="text-xl font-bold mb-4">{editId ? 'Cập nhật bác sĩ' : 'Thêm bác sĩ mới'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Họ tên</label>
                <Input name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <Input name="email" value={form.email} onChange={handleChange} required type="email" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Số điện thoại</label>
                <Input name="phone" value={form.phone} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Chuyên khoa</label>
                <Input name="specialty" value={form.specialty} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Kinh nghiệm (năm)</label>
                <Input name="experience" value={form.experience} onChange={handleChange} required type="number" min="0" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Học vấn</label>
                <Input name="education" value={form.education} onChange={handleChange} required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Tiểu sử</label>
                <Input name="bio" value={form.bio} onChange={handleChange} />
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                <Button type="button" variant="outline" onClick={handleCloseForm}>Hủy</Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Lưu</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement; 