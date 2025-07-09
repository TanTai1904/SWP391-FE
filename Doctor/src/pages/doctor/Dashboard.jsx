import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/doctor.module.scss';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  Activity, 
  TrendingUp, 
  UserCheck, 
  Shield, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { QuickActions } from './QuickActions';

const Dashboard = () => {
  // Mock data for statistics and main functions
  const stats = [
    { icon: <Users className={styles.statIcon} />, label: 'Bệnh nhân', value: 189 },
    { icon: <Calendar className={styles.statIcon} />, label: 'Lịch hẹn hôm nay', value: 5 },
    { icon: <TrendingUp className={styles.statIcon} />, label: 'Tỷ lệ tuân thủ', value: '92%' },
    { icon: <AlertCircle className={styles.statIcon} />, label: 'Cảnh báo', value: 8 },
  ];
  const mainFunctions = [
    { icon: <UserCheck className={styles.funcIcon} />, label: 'Quản lý bệnh nhân', desc: 'Xem, thêm, sửa, xóa bệnh nhân', color: styles.funcCardBlue, to: '/doctor/patients' },
    { icon: <Users className={styles.funcIcon} />, label: 'Thêm bệnh nhân', desc: 'Tạo mới hồ sơ bệnh nhân', color: styles.funcCardGreen, to: '/doctor/add-patient' },
    { icon: <Calendar className={styles.funcIcon} />, label: 'Lịch làm việc', desc: 'Quản lý lịch hẹn, ca trực', color: styles.funcCardGreen },
    { icon: <Shield className={styles.funcIcon} />, label: 'Phác đồ ARV', desc: 'Xem, cập nhật phác đồ điều trị', color: styles.funcCardPurple },
    { icon: <MessageSquare className={styles.funcIcon} />, label: 'Tư vấn', desc: 'Tư vấn & nhắn tin bệnh nhân', color: styles.funcCardYellow },
    { icon: <BarChart3 className={styles.funcIcon} />, label: 'Báo cáo', desc: 'Thống kê, xuất báo cáo', color: styles.funcCardIndigo },
    { icon: <Settings className={styles.funcIcon} />, label: 'Hồ sơ bác sĩ', desc: 'Cập nhật thông tin cá nhân', color: styles.funcCardGray },
  ];
  const recentActivities = [
    { icon: <CheckCircle className={styles.activityIconSuccess} />, text: '', time: '' },
    { icon: <AlertCircle className={styles.activityIconWarning} />, text: '', time: '' },
    { icon: <FileText className={styles.activityIconInfo} />, text: '', time: '' },
  ];
  const systemStatus = [
    { label: 'API Server', status: 'Online', icon: <CheckCircle className={styles.statusOnline} /> },
    { label: 'Cơ sở dữ liệu', status: 'Online', icon: <CheckCircle className={styles.statusOnline} /> },
    { label: 'Gửi email', status: 'Tạm thời gián đoạn', icon: <AlertCircle className={styles.statusWarning} /> },
  ];

  return (
    <div className={styles.dashboardWrap}>
      <div className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Tổng quan</h1>
          <p className={styles.pageDesc}>Hệ thống điều trị HIV - Bảng điều khiển bác sĩ</p>
        </div>
        <QuickActions />
      </div>
      {/* Statistics Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            {stat.icon}
            <div>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
      {/* Main Functions */}
      <div className={styles.mainFuncSection}>
        <h2 className={styles.sectionTitle}>Chức năng chính</h2>
        <div className={styles.funcGrid}>
          {mainFunctions.map((func, idx) => (
            func.to ? (
              <Link key={idx} to={func.to} className={`${styles.funcCard} ${func.color}`}>
                {func.icon}
                <div>
                  <div className={styles.funcLabel}>{func.label}</div>
                  <div className={styles.funcDesc}>{func.desc}</div>
                </div>
                <ChevronRight className={styles.funcChevron} />
              </Link>
            ) : (
              <div key={idx} className={`${styles.funcCard} ${func.color}`}>
                {func.icon}
                <div>
                  <div className={styles.funcLabel}>{func.label}</div>
                  <div className={styles.funcDesc}>{func.desc}</div>
                </div>
                <ChevronRight className={styles.funcChevron} />
              </div>
            )
          ))}
        </div>
      </div>
      {/* Bottom Section */}
      <div className={styles.bottomGrid}>
        {/* Recent Activities */}
        <Card className={styles.bottomCard}>
          <CardHeader>
            <CardTitle className={styles.bottomCardTitle}>
              <Clock className={styles.bottomCardIcon} />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className={styles.bottomCardContent}>
            {recentActivities.map((act, idx) => (
              <div key={idx} className={styles.activityItem}>
                {act.icon}
                <div>
                  <div className={styles.activityText}>{act.text}</div>
                  <div className={styles.activityTime}>{act.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* System Status */}
        <Card className={styles.bottomCard}>
          <CardHeader>
            <CardTitle className={styles.bottomCardTitle}>Trạng thái hệ thống</CardTitle>
          </CardHeader>
          <CardContent className={styles.bottomCardContent}>
            {systemStatus.map((sys, idx) => (
              <div key={idx} className={styles.statusItem}>
                {sys.icon}
                <div>
                  <div className={styles.statusLabel}>{sys.label}</div>
                  <div className={styles.statusValue}>{sys.status}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
