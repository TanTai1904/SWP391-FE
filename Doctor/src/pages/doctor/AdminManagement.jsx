import React, { useState, useEffect } from 'react';
import adminService from '../../services/adminService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'admin'
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllAdmins();
      setAdmins(response.data || []);
    } catch (error) {
      console.error('Error loading admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminService.updateAdmin({ ...formData, id: editingId });
      } else {
        await adminService.createAdmin(formData);
      }
      setFormData({ username: '', email: '', fullName: '', phoneNumber: '', role: 'admin' });
      setEditingId(null);
      setShowForm(false);
      loadAdmins();
    } catch (error) {
      console.error('Error saving admin:', error);
    }
  };

  const handleEdit = (admin) => {
    setFormData({
      username: admin.username || '',
      email: admin.email || '',
      fullName: admin.fullName || '',
      phoneNumber: admin.phoneNumber || '',
      role: admin.role || 'admin'
    });
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin?')) {
      try {
        await adminService.deleteAdmin(id);
        loadAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Management</h1>
        <Button onClick={() => setShowForm(true)}>Add New Admin</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit Admin' : 'Add New Admin'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Input
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ username: '', email: '', fullName: '', phoneNumber: '', role: 'admin' });
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid gap-4">
          {admins.map((admin) => (
            <Card key={admin.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{admin.fullName || admin.username}</h3>
                    <p className="text-sm text-gray-600">{admin.email}</p>
                    <p className="text-sm text-gray-600">{admin.phoneNumber}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">{admin.role}</Badge>
                    <Button size="sm" onClick={() => handleEdit(admin)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(admin.id)}>Delete</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminManagement; 