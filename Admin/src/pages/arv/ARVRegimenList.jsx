import React, { useEffect, useState } from 'react';
import arvService from '../../services/arvService';
import ARVRegimenForm from './ARVRegimenForm';

const ARVRegimenList = () => {
  const [regimens, setRegimens] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [regRes, compRes] = await Promise.all([
        arvService.getAllRegimens(),
        arvService.getAllComponents()
      ]);
      setRegimens(regRes.data.data || []);
      setComponents(compRes.data.data || []);
    } catch (err) {
      setError('Không thể tải danh sách phác đồ ARV');
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
        await arvService.deleteRegimen(id);
        setMessage('Xóa thành công!');
        fetchAll();
      } catch (err) {
        setMessage('Xóa thất bại!');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchAll();
  };

  const getComponentName = (id) => {
    const c = components.find(x => x.componentId === id);
    return c ? c.componentName : '';
  };

  return (
    <div style={{padding:24}}>
      <h2 style={{color:'#1976d2'}}>Phác đồ điều trị ARV</h2>
      <p>Quản lý và lựa chọn phác đồ điều trị kháng retrovirus</p>
      <button style={{marginBottom:16,background:'#1976d2',color:'#fff',padding:'8px 16px',border:'none',borderRadius:4,cursor:'pointer'}} onClick={handleAdd}>+ Tạo phác đồ mới</button>
      {showForm && (
        <ARVRegimenForm editData={editData} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} components={components} />
      )}
      {loading ? <p>Đang tải...</p> : null}
      {error && <p style={{color:'red'}}>{error}</p>}
      {message && <p style={{color:'green'}}>{message}</p>}
      <table style={{width:'100%',borderCollapse:'collapse',marginTop:16}}>
        <thead>
          <tr style={{background:'#f5f5f5'}}>
            <th style={{border:'1px solid #ddd',padding:8}}>ID</th>
            <th style={{border:'1px solid #ddd',padding:8}}>Tên phác đồ</th>
            <th style={{border:'1px solid #ddd',padding:8}}>Mô tả</th>
            <th style={{border:'1px solid #ddd',padding:8}}>Thành phần</th>
            <th style={{border:'1px solid #ddd',padding:8}}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {regimens.map(r => (
            <tr key={r.regimenId}>
              <td style={{border:'1px solid #ddd',padding:8}}>{r.regimenId}</td>
              <td style={{border:'1px solid #ddd',padding:8}}>{r.regimenName}</td>
              <td style={{border:'1px solid #ddd',padding:8}}>{r.description}</td>
              <td style={{border:'1px solid #ddd',padding:8}}>
                {[r.component1Id, r.component2Id, r.component3Id, r.component4Id].filter(Boolean).map(id => getComponentName(id)).join(', ')}
              </td>
              <td style={{border:'1px solid #ddd',padding:8}}>
                <button onClick={() => handleEdit(r)} style={{marginRight:8}}>Sửa</button>
                <button onClick={() => handleDelete(r.regimenId)} style={{color:'red'}}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {regimens.length === 0 && !loading && <p>Chưa có phác đồ nào.</p>}
    </div>
  );
};

export default ARVRegimenList;
