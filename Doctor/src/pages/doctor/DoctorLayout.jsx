import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './DoctorLayout.module.css';

const menu = [
  { label: 'Dashboard', path: '/doctor' },
  { label: 'Bệnh nhân', path: '/doctor/patients' },
  { label: 'Lịch hẹn', path: '/doctor/schedule' },
  { label: 'ARV', children: [
    { label: 'Thành phần ARV', path: '/arv/components' },
    { label: 'Phác đồ ARV', path: '/arv/regimens' },
  ]},
  { label: 'Báo cáo', path: '/doctor/reports' },
  { label: 'Hồ sơ cá nhân', path: '/doctor/profile' },
];

const DoctorLayout = ({ children, breadcrumbs }) => {
  const location = useLocation();
  return (
    <div className={styles.layoutRoot}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}><img src="/images/logo.png" alt="Logo" /> <span>RRL Doctor</span></div>
        <nav>
          <ul>
            {menu.map((item, idx) =>
              item.children ? (
                <li key={idx} className={styles.menuGroup}>
                  <span>ARV</span>
                  <ul>
                    {item.children.map((sub, i) => (
                      <li key={i} className={location.pathname.startsWith(sub.path) ? styles.active : ''}>
                        <Link to={sub.path}>{sub.label}</Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={idx} className={location.pathname.startsWith(item.path) ? styles.active : ''}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              )
            )}
          </ul>
        </nav>
      </aside>
      <main className={styles.contentArea}>
        <header className={styles.header}>
          {breadcrumbs && <div className={styles.breadcrumbs}>{breadcrumbs}</div>}
          <div className={styles.userInfo}>
            <span>👨‍⚕️ {JSON.parse(localStorage.getItem('user')||'{}').fullName || 'Bác sĩ'}</span>
            <Link to="/login" className={styles.logoutBtn} onClick={()=>{localStorage.clear();}}>Đăng xuất</Link>
          </div>
        </header>
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
};

export default DoctorLayout;
