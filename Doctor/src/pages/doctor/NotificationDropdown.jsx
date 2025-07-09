import React, { useState } from 'react';
import styles from './styles/doctor.module.scss';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    type: 'appointment',
    title: 'Cuộc hẹn sắp tới',
    message: 'Bệnh nhân Nguyễn Thị B - 10:30 AM hôm nay',
    time: '5 phút trước',
    read: false
  },
  {
    id: '2',
    type: 'alert',
    title: 'Cảnh báo viral load',
    message: 'Bệnh nhân Trần Văn C cần kiểm tra viral load khẩn cấp',
    time: '15 phút trước',
    read: false
  },
  {
    id: '3',
    type: 'success',
    title: 'Bệnh nhân mới',
    message: 'Lê Thị D đã hoàn thành đăng ký thành công',
    time: '1 giờ trước',
    read: false
  },
  {
    id: '4',
    type: 'info',
    title: 'Báo cáo tuần',
    message: 'Báo cáo thống kê tuần này đã sẵn sàng',
    time: '2 giờ trước',
    read: true
  },
  {
    id: '5',
    type: 'appointment',
    title: 'Lịch hẹn đã hoàn thành',
    message: 'Cuộc hẹn với bệnh nhân Phạm Văn E đã kết thúc',
    time: '3 giờ trước',
    read: true
  }
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Clock className={styles.notifIconAppointment} />;
      case 'alert':
        return <AlertCircle className={styles.notifIconAlert} />;
      case 'success':
        return <CheckCircle className={styles.notifIconSuccess} />;
      case 'info':
        return <FileText className={styles.notifIconInfo} />;
      default:
        return <Bell className={styles.notifIconDefault} />;
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  return (
    <div className={styles.notifDropdownWrap}>
      <Button 
        variant="ghost" 
        size="sm" 
        className={styles.notifBtn}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className={styles.notifBellIcon} />
        {unreadCount > 0 && (
          <span className={styles.notifBadge}>{unreadCount}</span>
        )}
      </Button>

      {isOpen && (
        <div className={styles.notifDropdownPanel}>
          <div className={styles.notifDropdownHeader}>
            <div className={styles.notifDropdownTitle}>Thông báo</div>
            <div className={styles.notifDropdownActions}>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className={styles.notifDropdownMarkAll}
                >
                  Đánh dấu đã đọc
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className={styles.notifDropdownClose}
              >
                <X className={styles.notifDropdownCloseIcon} />
              </Button>
            </div>
          </div>

          <div className={styles.notifDropdownListWrap}>
            {notifications.length === 0 ? (
              <div className={styles.notifDropdownEmpty}>Không có thông báo nào</div>
            ) : (
              <div className={styles.notifDropdownList}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={[
                      styles.notifDropdownItem,
                      notification.read ? styles.notifDropdownItemRead : styles.notifDropdownItemUnread
                    ].join(' ')}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className={styles.notifDropdownItemRow}>
                      {getNotificationIcon(notification.type)}
                      <div className={styles.notifDropdownItemContent}>
                        <div className={styles.notifDropdownItemTitleRow}>
                          <span className={styles.notifDropdownItemTitle}>{notification.title}</span>
                          {!notification.read && (
                            <span className={styles.notifDropdownItemDot}></span>
                          )}
                        </div>
                        <div className={styles.notifDropdownItemMsg}>{notification.message}</div>
                        <div className={styles.notifDropdownItemTime}>{notification.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.notifDropdownFooter}>
            <Button variant="outline" size="sm" className={styles.notifDropdownFooterBtn}>
              Xem tất cả thông báo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
