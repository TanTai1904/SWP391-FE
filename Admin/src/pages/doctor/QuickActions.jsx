import React from 'react';
import styles from './styles/doctor.module.scss';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Calendar, FileText, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function QuickActions() {
  const navigate = useNavigate();

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-patient':
        toast.success('Chuyển đến trang thêm bệnh nhân mới');
        navigate('/doctor/patients');
        break;
      case 'schedule':
        toast.success('Chuyển đến trang lịch làm việc');
        navigate('/doctor/schedule');
        break;
      case 'reports':
        toast.success('Chuyển đến trang báo cáo');
        navigate('/doctor/reports');
        break;
      case 'consultation':
        toast.success('Chuyển đến trang tư vấn');
        navigate('/doctor/consultation');
        break;
      default:
        toast.info('Chức năng đang được phát triển');
    }
  };

  return (
    <Card className={styles.quickActionsCard}>
      <CardContent className={styles.quickActionsCardContent}>
        <h3 className={styles.quickActionsTitle}>Thao tác nhanh</h3>
        <div className={styles.quickActionsGrid}>
          <Button
            size="sm"
            onClick={() => handleQuickAction('add-patient')}
            className={styles.quickActionBtnPrimary}
          >
            <Plus className={styles.quickActionBtnIcon} />
            Thêm BN
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction('schedule')}
            className={styles.quickActionBtn}
          >
            <Calendar className={styles.quickActionBtnIcon} />
            Đặt lịch
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction('reports')}
            className={styles.quickActionBtn}
          >
            <FileText className={styles.quickActionBtnIcon} />
            Báo cáo
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleQuickAction('consultation')}
            className={styles.quickActionBtn}
          >
            <Users className={styles.quickActionBtnIcon} />
            Tư vấn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
