import React, { useState, useEffect } from 'react';
import arvService from '../../services/arvService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const ARVRegimenForm = ({ open, onClose, initialData, components }) => {
  const [regimenName, setRegimenName] = useState(initialData?.regimenName || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [component1Id, setComponent1Id] = useState(initialData?.component1Id || '');
  const [component2Id, setComponent2Id] = useState(initialData?.component2Id || '');
  const [component3Id, setComponent3Id] = useState(initialData?.component3Id || '');
  const [component4Id, setComponent4Id] = useState(initialData?.component4Id || '');
  const [suitableFor, setSuitableFor] = useState(initialData?.suitableFor || '');
  const [sideEffects, setSideEffects] = useState(initialData?.sideEffects || '');
  const [usageInstructions, setUsageInstructions] = useState(initialData?.usageInstructions || '');
  const [frequency, setFrequency] = useState(initialData?.frequency || 1);
  const [isCustomized, setIsCustomized] = useState(initialData?.isCustomized ?? true);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setRegimenName(initialData.regimenName || '');
      setDescription(initialData.description || '');
      setComponent1Id(initialData.component1Id || '');
      setComponent2Id(initialData.component2Id || '');
      setComponent3Id(initialData.component3Id || '');
      setComponent4Id(initialData.component4Id || '');
      setSuitableFor(initialData.suitableFor || '');
      setSideEffects(initialData.sideEffects || '');
      setUsageInstructions(initialData.usageInstructions || '');
      setFrequency(initialData.frequency || 1);
      setIsCustomized(initialData.isCustomized ?? true);
      setIsActive(initialData.isActive ?? true);
    } else {
      setRegimenName('');
      setDescription('');
      setComponent1Id('');
      setComponent2Id('');
      setComponent3Id('');
      setComponent4Id('');
      setSuitableFor('');
      setSideEffects('');
      setUsageInstructions('');
      setFrequency(1);
      setIsCustomized(true);
      setIsActive(true);
    }
  }, [initialData]);

  const validate = () => {
    if (!regimenName.trim()) return 'Tên phác đồ là bắt buộc';
    if (!component1Id) return 'Phải chọn ít nhất 1 thành phần';
    if (!frequency || isNaN(frequency) || frequency < 1) return 'Tần suất phải là số nguyên dương';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const err = validate();
    if (err) { setError(err); return; }
    setLoading(true);
    try {
      const payload = {
        regimenName: regimenName.trim(),
        description: description.trim(),
        component1Id: component1Id ? Number(component1Id) : null,
        component2Id: component2Id ? Number(component2Id) : null,
        component3Id: component3Id ? Number(component3Id) : null,
        component4Id: component4Id ? Number(component4Id) : null,
        suitableFor: suitableFor.trim(),
        sideEffects: sideEffects.trim(),
        usageInstructions: usageInstructions.trim(),
        frequency: Number(frequency),
      };
      if (initialData && initialData.regimenId) {
        payload.regimenId = initialData.regimenId;
        payload.isActive = isActive;
        await arvService.updateRegimen(payload);
      } else {
        payload.isCustomized = isCustomized;
        await arvService.createRegimen(payload);
      }
      if (onClose) onClose(true);
    } catch (err) {
      let msg = 'Lưu thất bại!';
      if (err?.response?.data) {
        if (typeof err.response.data === 'string') msg = err.response.data;
        else if (err.response.data.message) msg = err.response.data.message;
        else if (err.response.data.errors) msg = JSON.stringify(err.response.data.errors);
        else msg = JSON.stringify(err.response.data);
      }
      setError(msg);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.2)',zIndex:1000,display:'flex',alignItems:'center',justifyContent:'center'}}>
      <Card style={{minWidth:480,padding:32,position:'relative',maxWidth:600}}>
        <form onSubmit={handleSubmit}>
          <h2 style={{marginBottom:18}}>{initialData ? 'Sửa' : 'Thêm'} phác đồ ARV</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div style={{gridColumn:'1/3'}}>
              <label style={{fontWeight:500}}>Tên phác đồ<span style={{color:'red'}}>*</span>:</label>
              <input value={regimenName} onChange={e => setRegimenName(e.target.value)} required style={{width:'100%',padding:8,marginTop:4}} />
            </div>
            <div>
              <label>Thành phần 1<span style={{color:'red'}}>*</span>:</label>
              <select value={component1Id} onChange={e => setComponent1Id(e.target.value)} required style={{width:'100%',padding:8,marginTop:4}}>
                <option value="">--Chọn--</option>
                {components.map(c => <option key={c.componentId} value={c.componentId}>{c.componentName}</option>)}
              </select>
            </div>
            <div>
              <label>Thành phần 2:</label>
              <select value={component2Id} onChange={e => setComponent2Id(e.target.value)} style={{width:'100%',padding:8,marginTop:4}}>
                <option value="">--Chọn--</option>
                {components.map(c => <option key={c.componentId} value={c.componentId}>{c.componentName}</option>)}
              </select>
            </div>
            <div>
              <label>Thành phần 3:</label>
              <select value={component3Id} onChange={e => setComponent3Id(e.target.value)} style={{width:'100%',padding:8,marginTop:4}}>
                <option value="">--Chọn--</option>
                {components.map(c => <option key={c.componentId} value={c.componentId}>{c.componentName}</option>)}
              </select>
            </div>
            <div>
              <label>Thành phần 4:</label>
              <select value={component4Id} onChange={e => setComponent4Id(e.target.value)} style={{width:'100%',padding:8,marginTop:4}}>
                <option value="">--Chọn--</option>
                {components.map(c => <option key={c.componentId} value={c.componentId}>{c.componentName}</option>)}
              </select>
            </div>
            <div>
              <label>Tần suất (lần/ngày):</label>
              <input type="number" min={1} value={frequency} onChange={e => setFrequency(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
            </div>
            <div>
              <label>Đối tượng phù hợp:</label>
              <input value={suitableFor} onChange={e => setSuitableFor(e.target.value)} style={{width:'100%',padding:8,marginTop:4}} />
            </div>
            <div style={{gridColumn:'1/3'}}>
              <label>Mô tả:</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} style={{width:'100%',padding:8,marginTop:4,minHeight:40}} />
            </div>
            <div style={{gridColumn:'1/3'}}>
              <label>Tác dụng phụ:</label>
              <textarea value={sideEffects} onChange={e => setSideEffects(e.target.value)} style={{width:'100%',padding:8,marginTop:4,minHeight:40}} />
            </div>
            <div style={{gridColumn:'1/3'}}>
              <label>Hướng dẫn sử dụng:</label>
              <textarea value={usageInstructions} onChange={e => setUsageInstructions(e.target.value)} style={{width:'100%',padding:8,marginTop:4,minHeight:40}} />
            </div>
            {initialData ? (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" checked={isActive} onChange={e=>setIsActive(e.target.checked)} id="isActive" />
                <label htmlFor="isActive">Đang sử dụng</label>
              </div>
            ) : (
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                <input type="checkbox" checked={isCustomized} onChange={e=>setIsCustomized(e.target.checked)} id="isCustomized" />
                <label htmlFor="isCustomized">Phác đồ tuỳ chỉnh</label>
              </div>
            )}
          </div>
          {error && (
            <div style={{background:'#fff0f0',color:'#b71c1c',border:'1px solid #f44336',padding:8,borderRadius:4,margin:'16px 0'}}>
              {error}
            </div>
          )}
          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:18}}>
            <Button type="button" variant="outline" onClick={()=>onClose(false)} disabled={loading}>Hủy</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Đang lưu...' : 'Lưu'}</Button>
          </div>
          {loading && <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,background:'rgba(255,255,255,0.5)',zIndex:2,display:'flex',alignItems:'center',justifyContent:'center'}}><span>Đang xử lý...</span></div>}
        </form>
      </Card>
    </div>
  );
};

export default ARVRegimenForm;
