import React from 'react';
import styles from './styles/doctor.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const routeConfig = {
  '/doctor': [{ label: 'Tổng quan', path: '/doctor' }],
  '/doctor/patients': [
    { label: 'Tổng quan', path: '/doctor' },
    { label: 'Quản lý bệnh nhân', path: '/doctor/patients' }
  ],
  '/doctor/schedule': [
    { label: 'Tổng quan', path: '/doctor' },
    { label: 'Lịch làm việc', path: '/doctor/schedule' }
  ],
  '/doctor/arv-protocols': [
    { label: 'Tổng quan', path: '/doctor' },
    { label: 'Phác đồ ARV', path: '/doctor/arv-protocols' }
  ],
  '/doctor/consultation': [
    { label: 'Tổng quan', path: '/doctor' },
    { label: 'Tư vấn & Hẹn khám', path: '/doctor/consultation' }
  ],
  '/doctor/reports': [
    { label: 'Tổng quan', path: '/doctor' },
    { label: 'Báo cáo', path: '/doctor/reports' }
  ],
  '/doctor/profile': [
    { label: 'Tổng quan', path: '/doctor' },
    { label: 'Hồ sơ bác sĩ', path: '/doctor/profile' }
  ]
};

export function BreadcrumbNav() {
  const location = useLocation();
  const breadcrumbs = routeConfig[location.pathname] || [{ label: 'Tổng quan', path: '/doctor' }];

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className={styles['doctor-breadcrumb']} aria-label="Breadcrumb">
      <ol className={styles['breadcrumb-list']}>
        <li className={styles['breadcrumb-home']}>
          <Link to="/doctor" className={styles['breadcrumb-link']} title="Trang chủ">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className={styles['breadcrumb-home-icon']}><path d="M3 11.5L12 4l9 7.5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10.5V19a1 1 0 001 1h3.5a.5.5 0 00.5-.5V15a1 1 0 011-1h2a1 1 0 011 1v4.5a.5.5 0 00.5.5H18a1 1 0 001-1v-8.5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.path}>
            <li className={styles['breadcrumb-item']}>
              {index > 0 && <ChevronRight className={styles['breadcrumb-sep']} />}
              {index === breadcrumbs.length - 1 ? (
                <span className={styles['breadcrumb-current']}>{item.label}</span>
              ) : (
                <Link
                  to={item.path}
                  className={styles['breadcrumb-link']}
                >
                  {item.label}
                </Link>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
