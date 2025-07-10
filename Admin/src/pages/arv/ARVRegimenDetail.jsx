import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import arvService from '../../services/arvService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, ArrowLeft } from 'lucide-react';
import styles from '../doctor/styles/doctor.module.scss';
import ARVRegimenForm from './ARVRegimenForm';

const ARVRegimenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [protocol, setProtocol] = useState(null);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const [regimenRes, compRes] = await Promise.all([
        arvService.getRegimenById(id),
        arvService.getAllComponents()
      ]);
      setProtocol(regimenRes.data.data);
      setComponents(compRes.data.data || []);
    } catch {
      setError('Không thể tải chi tiết phác đồ.');
    }
    setLoading(false);
  };

  const getComponentName = (cid) => {
    const c = components.find(x => x.componentId === cid);
    return c ? c.componentName : '';
  };

  const handleDelete = async () => {
    if (window.confirm('Bạn có chắc muốn xóa phác đồ này?')) {
      try {
        await arvService.deleteRegimen(id);
        navigate('/arv/regimens');
      } catch {
        alert('Xóa thất bại!');
      }
    }
  };

  if (loading) return <div className={styles['doctor-loading']}>Đang tải...</div>;
  if (error) return <div className={styles['doctor-error']}>{error}</div>;
  if (!protocol) return <div className={styles['protocol-empty']}>Không có dữ liệu phác đồ.</div>;

  return (
    <div className={styles['doctor-main']} style={{maxWidth:600,margin:'32px auto'}}>
      <Button variant="ghost" onClick={()=>navigate('/arv/regimens')} style={{marginBottom:16}}>
        <ArrowLeft style={{marginRight:4}}/> Quay lại danh sách
      </Button>
      <Card style={{padding:24}}>
        <div className={styles['protocol-detail-header']}>
          <h2 className={styles['doctor-card-title']}>
            <FileText className={styles['protocol-icon']} /> {protocol.regimenName}
          </h2>
        </div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button size="sm" onClick={()=>setShowForm(true)}>Sửa</Button>
          <Button size="sm" variant="destructive" onClick={handleDelete}>Xóa</Button>
        </div>
        <div className={styles['protocol-detail-section']}>
          <h4 className={styles['protocol-detail-label']}>Mô tả</h4>
          <p className={styles['protocol-detail-desc']}>
            {protocol.description || 'Không có mô tả.'}
          </p>
        </div>
        <div className={styles['protocol-detail-section']}>
          <h4 className={styles['protocol-detail-label']}>Thành phần thuốc</h4>
          <ul className={styles['protocol-detail-list']}>
            {[protocol.component1Id, protocol.component2Id, protocol.component3Id, protocol.component4Id].filter(Boolean).map(id => (
              <li key={id} className={styles['protocol-detail-pill']}>
                <CheckCircle className={styles['protocol-detail-pill-icon']} /> {getComponentName(id)}
              </li>
            ))}
          </ul>
        </div>
      </Card>
      {showForm && (
        <ARVRegimenForm
          open={showForm}
          onClose={(success) => { setShowForm(false); if(success) fetchDetail(); }}
          initialData={protocol}
          components={components}
        />
      )}
    </div>
  );
};

export default ARVRegimenDetail;
