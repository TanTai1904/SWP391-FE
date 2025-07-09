import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth.jsx';

const NotificationsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');

  if (!user) {
    return (
      <div>
        <Header />
        <div style={{ paddingTop: '100px', textAlign: 'center' }}>
          <h2>Vui lòng đăng nhập để xem thông báo</h2>
        </div>
      </div>
    );
  }

  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch hẹn với BS. Nguyễn Văn A vào 15:00 ngày mai',
      time: '2 giờ trước',
      unread: true,
      icon: '📅'
    },
    {
      id: 2,
      type: 'medication',
      title: 'Nhắc nhở uống thuốc',
      message: 'Đã đến giờ uống Efavirenz 600mg',
      time: '30 phút trước',
      unread: true,
      icon: '💊'
    },
    {
      id: 3,
      type: 'test-result',
      title: 'Kết quả xét nghiệm',
      message: 'Kết quả xét nghiệm CD4 đã có. Vui lòng xem trong hồ sơ y tế.',
      time: '1 ngày trước',
      unread: false,
      icon: '🔬'
    },
    {
      id: 4,
      type: 'system',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống đã được cập nhật với các tính năng mới',
      time: '3 ngày trước',
      unread: false,
      icon: '⚙️'
    },
    {
      id: 5,
      type: 'health-tip',
      title: 'Mẹo sức khỏe',
      message: 'Tập thể dục đều đặn giúp tăng cường hệ miễn dịch',
      time: '1 tuần trước',
      unread: false,
      icon: '💡'
    }
  ];

  const filteredNotifications = activeTab === 'unread' 
    ? notifications.filter(n => n.unread)
    : notifications;

  return (
    <div>
      <Header />
      <div style={{ paddingTop: '100px', padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1>🔔 Thông báo</h1>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', marginBottom: '2rem' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                background: activeTab === 'all' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9ff',
                color: activeTab === 'all' ? 'white' : '#667eea',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Tất cả ({notifications.length})
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                background: activeTab === 'unread' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9ff',
                color: activeTab === 'unread' ? 'white' : '#667eea',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
            >
              Chưa đọc ({notifications.filter(n => n.unread).length})
            </button>
          </div>

          {/* Notifications List */}
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredNotifications.map(notification => (
              <div
                key={notification.id}
                style={{
                  background: 'white',
                  padding: '1.5rem',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  border: notification.unread ? '2px solid #667eea30' : '1px solid #e0e6ed',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                }}
              >
                {notification.unread && (
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    width: '10px',
                    height: '10px',
                    background: '#e74c3c',
                    borderRadius: '50%'
                  }} />
                )}
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{
                    fontSize: '2rem',
                    width: '50px',
                    height: '50px',
                    background: '#f8f9ff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {notification.icon}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      margin: '0 0 0.5rem 0', 
                      color: notification.unread ? '#333' : '#666',
                      fontWeight: notification.unread ? '600' : '500'
                    }}>
                      {notification.title}
                    </h3>
                    <p style={{ 
                      margin: '0 0 0.75rem 0', 
                      color: '#666', 
                      lineHeight: 1.5 
                    }}>
                      {notification.message}
                    </p>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: '#999' 
                    }}>
                      {notification.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredNotifications.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <h3>Không có thông báo nào</h3>
              <p style={{ color: '#666' }}>
                {activeTab === 'unread' ? 'Tất cả thông báo đã được đọc' : 'Bạn chưa có thông báo nào'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
