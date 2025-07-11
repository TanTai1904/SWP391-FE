import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './NewDoctorLayout.module.css';
import { 
  Home, Users, Calendar, FileText, BarChart2, 
  User, LogOut, Mail, Bell, Settings, MessageSquare, 
  Clipboard, PieChart, Heart, Shield
} from 'lucide-react';

const menu = [
  { 
    label: 'Tổng quan', 
    path: '/doctor', 
    icon: <Home className={styles.menuIcon} />
  },
  { 
    label: 'Bệnh nhân', 
    path: '/doctor/patients', 
    icon: <Users className={styles.menuIcon} />
  },
  { 
    label: 'Lịch làm việc', 
    path: '/doctor/schedule', 
    icon: <Calendar className={styles.menuIcon} />
  },
  { 
    label: 'Lịch hẹn tư vấn', 
    path: '/doctor/consultations', 
    icon: <MessageSquare className={styles.menuIcon} />
  },
  { 
    label: 'ARV', 
    icon: <Shield className={styles.menuIcon} />,
    children: [
      { label: 'Thành phần ARV', path: '/arv/components' },
      { label: 'Phác đồ ARV', path: '/arv/regimens' },
    ]
  },
  { 
    label: 'Xét nghiệm', 
    path: '/doctor/test-management', 
    icon: <Clipboard className={styles.menuIcon} />
  },
  { 
    label: 'Điều trị', 
    path: '/doctor/treatment-management', 
    icon: <Heart className={styles.menuIcon} />
  },
  { 
    label: 'Báo cáo', 
    path: '/doctor/reports', 
    icon: <BarChart2 className={styles.menuIcon} />
  },
  { 
    label: 'Thông báo', 
    path: '/doctor/notification-management', 
    icon: <Bell className={styles.menuIcon} />
  },
];

const NewDoctorLayout = ({ children, breadcrumbs }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitials = user.fullName ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'BS';
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };
  
  return (
    <div className={styles.layoutRoot}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <img src="/images/logo.png" alt="Logo" /> 
          <span>MediCare</span>
        </div>
        <nav>
          <ul>
            {menu.map((item, idx) =>
              item.children ? (
                <li key={idx} className={styles.menuGroup}>
                  <span className={styles.menuGroupLabel}>
                    {item.icon}
                    {item.label}
                  </span>
                  <ul>
                    {item.children.map((sub, i) => (
                      <li key={i} className={location.pathname === sub.path ? styles.active : ''}>
                        <Link to={sub.path}>
                          <span>{sub.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={idx} className={
                  (item.path === '/doctor' && location.pathname === '/doctor') || 
                  (item.path !== '/doctor' && location.pathname.startsWith(item.path)) 
                    ? styles.active 
                    : ''
                }>
                  <Link to={item.path}>
                    <div className={styles.menuItem}>
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                  </Link>
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
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>{userInitials}</div>
              <div className={styles.userDetails}>
                <span className={styles.userName}>{user.fullName || 'Bác sĩ'}</span>
                <span className={styles.userRole}>Bác sĩ</span>
              </div>
            </div>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <LogOut size={16} />
              Đăng xuất
            </button>
          </div>
        </header>
        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
};

export default NewDoctorLayout;
