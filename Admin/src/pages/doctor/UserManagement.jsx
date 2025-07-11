import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    role: 'patient'
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      setUsers(response.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await userService.updateUser({ ...formData, id: editingId });
      } else {
        await userService.createUser(formData);
      }
      setFormData({ username: '', email: '', fullName: '', phoneNumber: '', role: 'patient' });
      setEditingId(null);
      setShowForm(false);
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      fullName: user.fullName || '',
      phoneNumber: user.phoneNumber || '',
      role: user.role || 'patient'
    });
    setEditingId(user.id);
    setShowForm(true);
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'destructive',
      doctor: 'default',
      patient: 'secondary',
      nurse: 'outline'
    };
    return <Badge variant={variants[role] || 'outline'}>{role}</Badge>;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button onClick={() => setShowForm(true)}>Add New User</Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{editingId ? 'Edit User' : 'Add New User'}</CardTitle>
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
                <select
                  className="border rounded p-2"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingId ? 'Update' : 'Create'}</Button>
                <Button type="button" variant="outline" onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ username: '', email: '', fullName: '', phoneNumber: '', role: 'patient' });
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
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{user.fullName || user.username}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">{user.phoneNumber}</p>
                    <p className="text-sm text-gray-600">Username: {user.username}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleEdit(user)}>Edit</Button>
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

export default UserManagement; 