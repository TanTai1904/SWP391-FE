import React, { useEffect, useState } from 'react';
import arvService from '../../services/arvService';
import ARVComponentForm from './ARVComponentForm';

const ARVComponentList = () => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    setLoading(true);
    try {
      const res = await arvService.getAllComponents();
      setComponents(res.data.data || []);
    } catch (err) {
      setError('Không thể tải danh sách ARV Component');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditData(null);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa?')) {
      try {
        await arvService.deleteComponent(id);
        setMessage('Xóa thành công!');
        fetchComponents();
      } catch (err) {
        setMessage('Xóa thất bại!');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchComponents();
  };

  return (
    <div>
      <h2>Danh sách ARV Components</h2>
      <button onClick={handleAdd}>Thêm mới</button>
      {showForm && (
        <ARVComponentForm editData={editData} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
      )}
      {loading ? <p>Đang tải...</p> : null}
      {error && <p style={{color:'red'}}>{error}</p>}
      {message && <p style={{color:'green'}}>{message}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên thành phần</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {components.map(c => (
            <tr key={c.componentId}>
              <td>{c.componentId}</td>
              <td>{c.componentName}</td>
              <td>{c.description}</td>
              <td>
                <button onClick={() => handleEdit(c)}>Sửa</button>
                <button onClick={() => handleDelete(c.componentId)} style={{marginLeft:8}}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ARVComponentList;
