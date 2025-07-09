import React, { useEffect, useState } from 'react';
import styles from './styles/doctor.module.scss';
import doctorService from '../../services/doctorService';
import doctorScheduleService from '../../services/doctorScheduleService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Users, Calendar, FileText, CheckCircle, AlertCircle, Activity, Loader2, Save, Edit } from 'lucide-react';

const DoctorProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [workSchedule, setWorkSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({});

  // Lấy doctorId từ localStorage user, ưu tiên doctorId, không dùng id
  const doctorId = (() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.doctorId || user.id || 1;
  })();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      // Lấy tất cả bác sĩ để tìm đúng doctorId
      const allDoctorsResponse = await doctorService.getAllDoctors();
      let actualDoctorData = null;
      if (allDoctorsResponse.data && allDoctorsResponse.data.length > 0) {
        // Tìm bác sĩ có doctorId đúng
        actualDoctorData = allDoctorsResponse.data.find(d => d.doctorId === doctorId);
        // Nếu không tìm thấy thì lấy bác sĩ đầu tiên
        if (!actualDoctorData) actualDoctorData = allDoctorsResponse.data[0];
        // Cập nhật lại localStorage chỉ với doctorId, KHÔNG lưu id
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = { ...user, doctorId: actualDoctorData.doctorId, fullName: actualDoctorData.fullName };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      const [scheduleRes] = await Promise.all([
        doctorScheduleService.getByDoctorId(actualDoctorData?.doctorId || doctorId)
      ]);
      const doctorData = actualDoctorData || {};
      const scheduleData = Array.isArray(scheduleRes.data) ? scheduleRes.data : [];
      setDoctorInfo(doctorData);
      setWorkSchedule(scheduleData);
      setFormData(doctorData); // Initialize form data
    } catch (err) {
      console.error('Lỗi khi tải thông tin bác sĩ:', err);
      setDoctorInfo({
        doctorId: doctorId,
        fullName: '',
        name: '',
        specialization: '',
        license: '',
        experience: '',
        department: '',
        totalPatients: 0,
        monthlyAppointments: 0,
        averageRating: 0,
        completionRate: 0,
        responseTime: '',
        continuingEducation: 0
      });
      setWorkSchedule([]);
      setFormData({});
      setError('Không tìm thấy thông tin bác sĩ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [doctorId]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await doctorService.update(formData);
      setEditing(false);
      fetchData(); // Refresh data
    } catch (err) {
      console.error('Lỗi khi cập nhật thông tin:', err);
      alert('Không thể cập nhật thông tin. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getScheduleStatus = (status) => {
    switch (status) {
      case 'Active':
      case 'Làm việc':
        return <Badge className={styles.badgeCompleted}>Làm việc</Badge>;
      case 'Partial':
      case 'Bán thời gian':
        return <Badge className={styles.badgePending}>Bán thời gian</Badge>;
      case 'Off':
      case 'Nghỉ':
        return <Badge className={styles.badgeCancelled}>Nghỉ</Badge>;
      default:
        return <Badge variant="secondary">{status || 'Chưa xác định'}</Badge>;
    }
  };

  if (loading) return <div className={styles.doctorLoading}><Loader2 className={styles.doctorLoadingIcon} /></div>;
  if (error) return <div className={styles.doctorError}>{error}</div>;
  if (!doctorInfo) return null;

  // Mock performance metrics nếu chưa có API
  const performanceMetrics = {
    totalPatients: doctorInfo.totalPatients || 0,
    monthlyAppointments: doctorInfo.monthlyAppointments || 0,
    averageRating: doctorInfo.averageRating || 4.8,
    completionRate: doctorInfo.completionRate || 96,
    responseTime: doctorInfo.responseTime || '< 2h',
    continuingEducation: doctorInfo.continuingEducation || 24
  };

  return (
    <div className={styles.doctorProfileWrap}>
      <div className={styles.doctorProfileHeader}>
        <div>
          <h1 className={styles.pageTitle}>Hồ sơ bác sĩ</h1>
          <p className={styles.pageDesc}>Quản lý thông tin cá nhân và cài đặt hệ thống</p>
        </div>
        <div className="flex space-x-2">
          {editing ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditing(false);
                  setFormData(doctorInfo); // Reset form data
                }}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </>
          ) : (
            <Button onClick={() => setEditing(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      <Card className={styles.profileCard}>
        <CardContent className={styles.profileCardContent}>
          <div className={styles.profileInfoRow}>
            <div className={styles.profileAvatar}>
              <span className={styles.profileAvatarText}>
                {doctorInfo.fullName?.split(' ').pop()?.charAt(0) || 
                 doctorInfo.name?.split(' ').pop()?.charAt(0) || 'B'}
              </span>
            </div>
            <div className={styles.profileInfoMain}>
              <h2 className={styles.profileName}>
                {doctorInfo.fullName || doctorInfo.name || 'Chưa có tên'}
              </h2>
              <p className={styles.profileSpecialization}>
                {doctorInfo.specialization || doctorInfo.specialty || 'Bác sĩ'}
              </p>
              <div className={styles.profileInfoMeta}>
                <span>📋 {doctorInfo.license || doctorInfo.licenseNumber || '---'}</span>
                <span>⏱️ {doctorInfo.experience || doctorInfo.yearsOfExperience || '--'} kinh nghiệm</span>
                <span>🏥 {doctorInfo.department || doctorInfo.workplace || '--'}</span>
              </div>
            </div>
            <div className={styles.profileRatingWrap}>
              <div className={styles.profileRating}>{performanceMetrics.averageRating}</div>
              <p className={styles.profileRatingLabel}>Đánh giá trung bình</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className={styles.profileStatsGrid}>
        <Card className={styles.profileStatCard}>
          <CardHeader className={styles.profileStatCardHeader}>
            <CardTitle className={styles.profileStatCardTitle}>Tổng BN</CardTitle>
            <Users className={styles.profileStatCardIcon} />
          </CardHeader>
          <CardContent>
            <div className={styles.profileStatValue}>{performanceMetrics.totalPatients}</div>
          </CardContent>
        </Card>
        <Card className={styles.profileStatCard}>
          <CardHeader className={styles.profileStatCardHeader}>
            <CardTitle className={styles.profileStatCardTitle}>Cuộc hẹn/tháng</CardTitle>
            <Calendar className={styles.profileStatCardIcon} />
          </CardHeader>
          <CardContent>
            <div className={styles.profileStatValue}>{performanceMetrics.monthlyAppointments}</div>
          </CardContent>
        </Card>
        <Card className={styles.profileStatCard}>
          <CardHeader className={styles.profileStatCardHeader}>
            <CardTitle className={styles.profileStatCardTitle}>Tỷ lệ hoàn thành</CardTitle>
            <CheckCircle className={styles.profileStatCardIcon} />
          </CardHeader>
          <CardContent>
            <div className={styles.profileStatValue}>{performanceMetrics.completionRate}%</div>
          </CardContent>
        </Card>
        <Card className={styles.profileStatCard}>
          <CardHeader className={styles.profileStatCardHeader}>
            <CardTitle className={styles.profileStatCardTitle}>Thời gian phản hồi</CardTitle>
            <Activity className={styles.profileStatCardIcon} />
          </CardHeader>
          <CardContent>
            <div className={styles.profileStatValue}>{performanceMetrics.responseTime}</div>
          </CardContent>
        </Card>
        <Card className={styles.profileStatCard}>
          <CardHeader className={styles.profileStatCardHeader}>
            <CardTitle className={styles.profileStatCardTitle}>Đào tạo (giờ)</CardTitle>
            <FileText className={styles.profileStatCardIcon} />
          </CardHeader>
          <CardContent>
            <div className={styles.profileStatValue}>{performanceMetrics.continuingEducation}</div>
          </CardContent>
        </Card>
        <Card className={styles.profileStatCard}>
          <CardHeader className={styles.profileStatCardHeader}>
            <CardTitle className={styles.profileStatCardTitle}>Đánh giá</CardTitle>
            <CheckCircle className={styles.profileStatCardIcon} />
          </CardHeader>
          <CardContent>
            <div className={styles.profileStatValue}>{performanceMetrics.averageRating}/5</div>
          </CardContent>
        </Card>
      </div>

      <div className={styles.profileTabBar}>
        <button
          className={activeTab === 'profile' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('profile')}
        >
          Thông tin cá nhân
        </button>
        <button
          className={activeTab === 'schedule' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('schedule')}
        >
          Lịch làm việc
        </button>
        <button
          className={activeTab === 'settings' ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab('settings')}
        >
          Cài đặt
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className={styles.profileTabContentGrid}>
          <Card className={styles.profileTabCard}>
            <CardHeader>
              <CardTitle>Thông tin liên hệ</CardTitle>
            </CardHeader>
            <CardContent className={styles.profileTabCardContent}>
              <div>
                <label className={styles.profileLabel}>Họ và tên</label>
                <Input 
                  value={editing ? formData.fullName || formData.name || '' : doctorInfo.fullName || doctorInfo.name || ''} 
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
              <div>
                <label className={styles.profileLabel}>Số điện thoại</label>
                <Input 
                  value={editing ? formData.phone || '' : doctorInfo.phone || ''} 
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
              <div>
                <label className={styles.profileLabel}>Email</label>
                <Input 
                  value={editing ? formData.email || '' : doctorInfo.email || ''} 
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
              <div>
                <label className={styles.profileLabel}>Địa chỉ</label>
                <Input 
                  value={editing ? formData.address || '' : doctorInfo.address || ''} 
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className={styles.profileTabCard}>
            <CardHeader>
              <CardTitle>Thông tin chuyên môn</CardTitle>
            </CardHeader>
            <CardContent className={styles.profileTabCardContent}>
              <div>
                <label className={styles.profileLabel}>Chuyên khoa</label>
                <Input 
                  value={editing ? formData.specialization || formData.specialty || '' : doctorInfo.specialization || doctorInfo.specialty || ''} 
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
              <div>
                <label className={styles.profileLabel}>Số chứng chỉ hành nghề</label>
                <Input 
                  value={editing ? formData.license || formData.licenseNumber || '' : doctorInfo.license || doctorInfo.licenseNumber || ''} 
                  onChange={(e) => handleInputChange('license', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
              <div>
                <label className={styles.profileLabel}>Kinh nghiệm (năm)</label>
                <Input 
                  value={editing ? formData.experience || formData.yearsOfExperience || '' : doctorInfo.experience || doctorInfo.yearsOfExperience || ''} 
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
              <div>
                <label className={styles.profileLabel}>Nơi làm việc</label>
                <Input 
                  value={editing ? formData.department || formData.workplace || '' : doctorInfo.department || doctorInfo.workplace || ''} 
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  readOnly={!editing}
                  className={styles.profileInput} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'schedule' && (
        <Card className={styles.profileTabCard}>
          <CardHeader>
            <CardTitle>Lịch làm việc</CardTitle>
          </CardHeader>
          <CardContent>
            {workSchedule.length === 0 ? (
              <div className={styles.profileEmpty}>Chưa có lịch làm việc nào.</div>
            ) : (
              <div className={styles.scheduleList}>
                {workSchedule.map((schedule) => (
                  <div key={schedule.id} className={styles.scheduleItem}>
                    <div className={styles.scheduleInfo}>
                      <h3 className={styles.scheduleDay}>
                        {schedule.workDay || schedule.day || 'Chưa có ngày'}
                      </h3>
                      <p className={styles.scheduleTime}>
                        {schedule.startTime || '--'} - {schedule.endTime || '--'}
                      </p>
                    </div>
                    {getScheduleStatus(schedule.status)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <Card className={styles.profileTabCard}>
          <CardHeader>
            <CardTitle>Cài đặt hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div>
                  <h3 className={styles.settingTitle}>Thông báo email</h3>
                  <p className={styles.settingDesc}>Nhận thông báo qua email khi có lịch hẹn mới</p>
                </div>
                <input type="checkbox" defaultChecked className={styles.settingToggle} />
              </div>
              <div className={styles.settingItem}>
                <div>
                  <h3 className={styles.settingTitle}>Thông báo push</h3>
                  <p className={styles.settingDesc}>Nhận thông báo push trên trình duyệt</p>
                </div>
                <input type="checkbox" defaultChecked className={styles.settingToggle} />
              </div>
              <div className={styles.settingItem}>
                <div>
                  <h3 className={styles.settingTitle}>Chế độ tối</h3>
                  <p className={styles.settingDesc}>Bật giao diện tối cho mắt</p>
                </div>
                <input type="checkbox" className={styles.settingToggle} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DoctorProfile;
