import React, { useEffect, useState } from "react";
import { getAllUsers, createUser, updateUser, deleteUser } from "../services/userService";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ fullname: "", username: "", password: "", role: "User" });
  const [editId, setEditId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllUsers(token);
      setUsers(data);
    } catch (err) {
      setError("Không thể tải danh sách user");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;
    try {
      await deleteUser(id, token);
      fetchUsers();
    } catch {
      alert("Xóa thất bại!");
    }
  };

  const handleEdit = (user) => {
    setFormData({ fullname: user.fullname, username: user.username, password: "", role: user.role });
    setEditId(user.id);
    setShowForm(true);
  };

  const handleAdd = () => {
    setFormData({ fullname: "", username: "", password: "", role: "User" });
    setEditId(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateUser({ ...formData, id: editId }, token);
      } else {
        await createUser(formData, token);
      }
      setShowForm(false);
      fetchUsers();
    } catch {
      alert("Lưu thất bại!");
    }
  };

  return (
    <div>
      <h2>Danh sách User</h2>
      <button onClick={handleAdd}>Thêm User</button>
      <button onClick={fetchUsers} style={{ marginLeft: 8 }}>Tải lại</button>
      {loading && <div>Đang tải...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Username</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullname}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Sửa</button>
                <button onClick={() => handleDelete(u.id)} style={{ marginLeft: 8, color: "red" }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showForm && (
        <form onSubmit={handleSubmit} style={{ marginTop: 16, background: "#f3f4f6", padding: 16, borderRadius: 8 }}>
          <h3>{editId ? "Sửa user" : "Thêm user"}</h3>
          <div>
            <label>Họ tên: </label>
            <input value={formData.fullname} onChange={e => setFormData(f => ({ ...f, fullname: e.target.value }))} required />
          </div>
          <div>
            <label>Username: </label>
            <input value={formData.username} onChange={e => setFormData(f => ({ ...f, username: e.target.value }))} required />
          </div>
          <div>
            <label>Password: </label>
            <input type="password" value={formData.password} onChange={e => setFormData(f => ({ ...f, password: e.target.value }))} required={!editId} />
          </div>
          <div>
            <label>Role: </label>
            <select value={formData.role} onChange={e => setFormData(f => ({ ...f, role: e.target.value }))}>
              <option value="User">User</option>
              <option value="Doctor">Doctor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <button type="submit">Lưu</button>
          <button type="button" onClick={() => setShowForm(false)} style={{ marginLeft: 8 }}>Hủy</button>
        </form>
      )}
    </div>
  );
};

export default UserTable;
