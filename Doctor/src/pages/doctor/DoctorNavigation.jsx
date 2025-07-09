import React from 'react';
import styles from './styles/doctor.module.scss';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, User, ClipboardList } from 'lucide-react';

const features = [
  {
    title: 'Lịch làm việc',
    desc: 'Xem và quản lý lịch làm việc của bạn.',
    icon: <Calendar size={32} />, 
    route: '/doctor/schedule',
  },
  {
    title: 'Quản lý bệnh nhân',
    desc: 'Danh sách, thêm mới và quản lý bệnh nhân.',
    icon: <Users size={32} />, 
    route: '/doctor/patients',
  },
  {
    title: 'Hồ sơ bác sĩ',
    desc: 'Xem và cập nhật thông tin cá nhân.',
    icon: <User size={32} />, 
    route: '/doctor/profile',
  },
  {
    title: 'Báo cáo',
    desc: 'Xem các báo cáo điều trị, thống kê.',
    icon: <FileText size={32} />, 
    route: '/doctor/reports',
  },
  {
    title: 'Tư vấn',
    desc: 'Quản lý các ca tư vấn.',
    icon: <ClipboardList size={32} />, 
    route: '/doctor/consultation',
  },
];

const DoctorNavigation = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.navigationWrap}>
      <h1 className={styles.pageTitle}>Chức năng bác sĩ</h1>
      <p className={styles.pageDesc}>Chọn chức năng bạn muốn truy cập</p>
      <div className={styles.navigationGrid}>
        {features.map((f, idx) => (
          <div key={idx} className={styles.navigationCard} onClick={() => navigate(f.route)}>
            <div className={styles.navigationIcon}>{f.icon}</div>
            <div className={styles.navigationInfo}>
              <h3 className={styles.navigationTitle}>{f.title}</h3>
              <p className={styles.navigationDesc}>{f.desc}</p>
            </div>
            <button className={styles.navigationBtn}>Truy cập</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorNavigation;
