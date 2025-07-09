import React, { useEffect, useState } from 'react';
import styles from './styles/doctor.module.scss';
import api from '../../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Loader2 } from 'lucide-react';

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/Patient/GetAll')
      .then(res => {
        setPatients(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách bệnh nhân.');
        setLoading(false);
      });
  }, []);

  const filteredPatients = (Array.isArray(patients) ? patients : []).filter(patient =>
    (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.phone || '').includes(searchTerm))
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Đang điều trị':
      case 'Active':
        return <span className={`${styles['doctor-badge']} ${styles.active}`}>Đang điều trị</span>;
      case 'Cần theo dõi':
      case 'Follow-up':
        return <span className={`${styles['doctor-badge']} ${styles.followup}`}>Cần theo dõi</span>;
      case 'Mới khám':
      case 'New':
        return <span className={`${styles['doctor-badge']} ${styles.new}`}>Mới khám</span>;
      default:
        return <span className={styles['doctor-badge']}>{status}</span>;
    }
  };

  if (loading) return <div className={styles['doctor-loading']}><Loader2 className={styles['doctor-loading-icon']} /></div>;
  if (error) return <div className={styles['doctor-error']}>{error}</div>;

  return (
    <div className={styles['doctor-main']}>
      <div className={styles['doctor-header']}>
        <div>
          <h1 className={styles['doctor-title']}>Quản lý bệnh nhân</h1>
          <p className={styles['doctor-desc']}>Danh sách và thông tin chi tiết bệnh nhân HIV</p>
        </div>
        <button className={styles['doctor-btn']} onClick={() => window.location.href = '/doctor/add-patient'}>
          <Users className="h-4 w-4 mr-2" />
          Thêm bệnh nhân
        </button>
      </div>
      <div className={styles['doctor-content']}>
        <div className={styles['doctor-search-row']}>
          <Input
            className={styles['doctor-search-input']}
            placeholder="Tìm kiếm theo tên, số điện thoại..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles['doctor-patient-list']}>
          {filteredPatients.length === 0 ? (
            <div className={styles['doctor-empty']}>Không có bệnh nhân nào phù hợp.</div>
          ) : (
            filteredPatients.map((patient) => (
              <div key={patient.id} className={styles['doctor-patient-item']}>
                <div className={styles['doctor-patient-info']}>
                  <div className={styles['doctor-patient-avatar']}>
                    <Users className={styles['doctor-patient-avatar-icon']} />
                  </div>
                  <div>
                    <div className={styles['doctor-patient-name']}>{patient.name || patient.fullName}</div>
                    <div className={styles['doctor-patient-phone']}>{patient.phone}</div>
                  </div>
                </div>
                <div className={styles['doctor-patient-status']}>
                  {getStatusBadge(patient.status)}
                </div>
                <div className={styles['doctor-patient-actions']}>
                  <Button size="sm" variant="outline" className={styles['doctor-action-btn']}>Xem</Button>
                  <Button size="sm" className={styles['doctor-action-btn-primary']}>Sửa</Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
