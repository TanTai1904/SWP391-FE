import React, { useState, useEffect } from 'react';
import arvService from '../../services/arvService';

const ARVComponentForm = ({ editData, onSuccess, onCancel }) => {
  const [componentName, setComponentName] = useState(editData?.componentName || '');
  const [description, setDescription] = useState(editData?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editData) {
      setComponentName(editData.componentName || '');
      setDescription(editData.description || '');
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (editData) {
        await arvService.updateComponent({
          componentId: editData.componentId,
          componentName,
          description
        });
      } else {
        await arvService.createComponent({
          componentName,
          description
        });
      }
      onSuccess();
    } catch (err) {
      setError('Lưu thất bại!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{marginBottom:16}}>
      <h3>{editData ? 'Sửa' : 'Thêm'} ARV Component</h3>
      <div>
        <label>Tên thành phần:</label>
        <input value={componentName} onChange={e => setComponentName(e.target.value)} required />
      </div>
      <div>
        <label>Mô tả:</label>
        <input value={description} onChange={e => setDescription(e.target.value)} required />
      </div>
      {error && <p style={{color:'red'}}>{error}</p>}
      <button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</button>
      {onCancel && <button type="button" onClick={onCancel} style={{marginLeft:8}}>Hủy</button>}
    </form>
  );
};

export default ARVComponentForm;
