import React, { useEffect, useState } from 'react';
import styles from './styles/doctor.module.scss';
import arvService from '../../services/arvService';
import ARVRegimenForm from '../arv/ARVRegimenForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import DoctorLayout from './DoctorLayout';

const ARVProtocols = () => {
  const [protocols, setProtocols] = useState([]);
  const [components, setComponents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProtocol, setEditProtocol] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [refresh]);

  const fetchAll = async () => {
    try {
      const [regRes, compRes] = await Promise.all([
        arvService.getAllRegimens(),
        arvService.getAllComponents()
      ]);
      setProtocols(regRes.data.data || []);
      setComponents(compRes.data.data || []);
    } catch (err) {
      alert('Không thể tải danh sách phác đồ.');
    }
  };

  const handleCreate = () => {
    setEditProtocol(null);
    setShowForm(true);
  };

  const handleFormClose = (success) => {
    setShowForm(false);
    setEditProtocol(null);
    if (success) setRefresh(r => !r);
  };

  const handleCardClick = (id) => {
    navigate(`/arv/regimens/${id}`);
  };

  const getComponentName = (id) => {
    const c = components.find(x => x.componentId === id);
    return c ? c.componentName : '';
  };

  return (
    <DoctorLayout breadcrumbs={<>
      <Link to="/doctor">Trang chủ</Link> / <span>Phác đồ ARV</span>
    </>}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
          <div>
            <h1 className={styles['doctor-title']}>Danh sách phác đồ ARV</h1>
            <p className={styles['doctor-desc']}>Quản lý, tìm kiếm và thao tác với các phác đồ điều trị ARV</p>
          </div>
          <Button size="lg" onClick={handleCreate} style={{fontWeight:600}}>+ Tạo phác đồ mới</Button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))',gap:32}}>
          {protocols.map(protocol => (
            <Card
              key={protocol.regimenId}
              className={styles['protocol-card']}
              style={{
                cursor:'pointer',
                padding:28,
                borderRadius:18,
                boxShadow:'0 4px 24px 0 #e0e7ef',
                border:'1px solid #f0f2f5',
                background:'#fff',
                transition:'box-shadow .2s,transform .2s',
                minHeight:180,
                display:'flex',flexDirection:'column',justifyContent:'space-between',
              }}
              onClick={()=>handleCardClick(protocol.regimenId)}
              onMouseOver={e=>e.currentTarget.style.boxShadow='0 8px 32px 0 #b6c6e2'}
              onMouseOut={e=>e.currentTarget.style.boxShadow='0 4px 24px 0 #e0e7ef'}
            >
              <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                <FileText className={styles['protocol-icon']} style={{color:'#1976d2',fontSize:28}} />
                <span style={{fontWeight:700,fontSize:20,letterSpacing:0.2}}>{protocol.regimenName}</span>
              </div>
              <div
                style={{
                  color:'#444',
                  marginBottom:12,
                  fontSize:15,
                  display:'-webkit-box',
                  WebkitLineClamp:2,
                  WebkitBoxOrient:'vertical',
                  overflow:'hidden',
                  textOverflow:'ellipsis',
                  minHeight:38,
                  lineHeight:'1.3',
                  background:'#f8fafc',
                  borderRadius:8,
                  padding:'6px 12px',
                  fontStyle:'italic',
                }}
                title={protocol.description}
              >
                {protocol.description}
              </div>
              <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:8}}>
                {[protocol.component1Id, protocol.component2Id, protocol.component3Id, protocol.component4Id].filter(Boolean).map(id => (
                  <span
                    key={id}
                    style={{
                      background:'linear-gradient(90deg,#e3f2fd 60%,#f0f7fa 100%)',
                      color:'#1976d2',
                      borderRadius:16,
                      padding:'4px 14px',
                      fontSize:13,
                      fontWeight:500,
                      display:'flex',
                      alignItems:'center',
                      gap:4,
                      boxShadow:'0 1px 4px #e3eaf2',
                      transition:'background .2s',
                    }}
                    onMouseOver={e=>e.currentTarget.style.background='#bbdefb'}
                    onMouseOut={e=>e.currentTarget.style.background='linear-gradient(90deg,#e3f2fd 60%,#f0f7fa 100%)'}
                  >
                    <CheckCircle size={13} style={{marginRight:2}}/> {getComponentName(id)}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
        {showForm && (
          <ARVRegimenForm
            open={showForm}
            onClose={handleFormClose}
            initialData={editProtocol}
            components={components}
          />
        )}
      </div>
    </DoctorLayout>
  );
};

export default ARVProtocols;
