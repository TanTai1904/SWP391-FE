import React, { useEffect, useState } from 'react';
import styles from './styles/doctor.module.scss';
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Settings } from 'lucide-react';
import { NotificationDropdown } from './NotificationDropdown';

export function DashboardHeader() {
  const [doctor, setDoctor] = useState({});

  useEffect(() => {
    // Lấy user từ localStorage để luôn đồng bộ đúng tên
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setDoctor(user);
  }, []);

  return (
    <header className={styles.dashboardHeaderBar}>
      <div className={styles.headerLeft}>
        <SidebarTrigger className={styles.sidebarTrigger} />
        <div className={styles.headerTitleWrap}>
          <h2 className={styles.headerTitle}>Hệ thống điều trị HIV</h2>
        </div>
      </div>
      <div className={styles.headerRight}>
        <NotificationDropdown />
        <Button variant="ghost" size="sm" className={styles.headerSettingsBtn}>
          <Settings className={styles.headerSettingsIcon} />
        </Button>
        <div className={styles.headerUserWrap}>
          <div className={styles.headerUserAvatar}>
            {doctor.doctorImage ? (
              <img src={`/public/images/${doctor.doctorImage}`} alt={doctor.fullName} style={{width: 36, height: 36, borderRadius: '50%'}} />
            ) : (
              <span className={styles.headerUserInitial}>{doctor.fullName ? doctor.fullName[0] : 'A'}</span>
            )}
          </div>
          <div className={styles.headerUserInfo}>
            <p className={styles.headerUserName}>{doctor.fullName || 'Bác sĩ'}</p>
            <p className={styles.headerUserRole}>{doctor.bio || 'Bác sĩ chuyên khoa'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
