import React, { useState } from 'react';
import { UserPlus, Save, RefreshCw } from 'lucide-react';

const initialState = {
  name: '',
  age: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  status: 'Đang điều trị',
  note: ''
};

const AddPatient = () => {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Gọi API thêm bệnh nhân ở đây
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setForm(initialState);
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  const handleReset = () => {
    setForm(initialState);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white py-8 px-2">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <UserPlus className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-700 tracking-tight">Thêm bệnh nhân mới</h2>
        </div>
        <p className="text-gray-500 mb-6">Nhập thông tin chi tiết để thêm bệnh nhân vào hệ thống quản lý điều trị HIV.</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Họ tên</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Tuổi</label>
              <input name="age" type="number" min="0" value={form.age} onChange={handleChange} required className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Giới tính</label>
              <select name="gender" value={form.gender} onChange={handleChange} required className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="">Chọn</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Số điện thoại</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Địa chỉ</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Tình trạng</label>
              <select name="status" value={form.status} onChange={handleChange} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none">
                <option value="Đang điều trị">Đang điều trị</option>
                <option value="Cần theo dõi">Cần theo dõi</option>
                <option value="Ổn định">Ổn định</option>
                <option value="Thấp">Thấp</option>
                <option value="Cao">Cao</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-blue-700 mb-1">Ghi chú</label>
              <input name="note" value={form.note} onChange={handleChange} className="w-full border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 pt-2 items-center">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-sky-400 text-white font-semibold px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-sky-500 transition disabled:opacity-60">
              <Save className="w-5 h-5" /> Lưu
            </button>
            <button type="button" onClick={handleReset} className="flex items-center gap-2 border border-blue-400 text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 transition">
              <RefreshCw className="w-5 h-5" /> Nhập lại
            </button>
            {success && <span className="ml-2 px-4 py-1 rounded-full bg-green-100 text-green-700 font-semibold text-sm shadow">Đã lưu!</span>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
