import React, { useEffect, useState } from 'react';
import styles from './styles/doctor.module.scss';
import api from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Calendar, Loader2, Search, Filter, Download, Eye, Edit, Trash2 } from 'lucide-react';

const statusOptions = [
  { value: '', label: 'Tất cả' },
  { value: 'Pending', label: 'Chờ xử lý' },
  { value: 'In Progress', label: 'Đang thực hiện' },
  { value: 'Completed', label: 'Hoàn thành' },
  { value: 'Not Started', label: 'Chưa bắt đầu' },
];

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    api.get('/Treatment/GetAll')
      .then(res => {
        setReports(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Không thể tải danh sách báo cáo.');
        setLoading(false);
      });
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
      case 'Chờ xử lý':
        return <Badge className={styles.badgePending}>Chờ xử lý</Badge>;
      case 'In Progress':
      case 'Đang thực hiện':
        return <Badge className={styles.badgeScheduled}>Đang thực hiện</Badge>;
      case 'Completed':
      case 'Hoàn thành':
        return <Badge className={styles.badgeCompleted}>Hoàn thành</Badge>;
      case 'Not Started':
      case 'Chưa bắt đầu':
        return <Badge className={styles.badgeCancelled}>Chưa bắt đầu</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredReports = reports.filter(r => {
    const matchSearch =
      r.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.treatmentName?.toLowerCase().includes(search.toLowerCase()) ||
      r.type?.toLowerCase().includes(search.toLowerCase()) ||
      r.treatmentType?.toLowerCase().includes(search.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = status ? (r.status === status || r.status === statusOptions.find(o => o.value === status)?.label) : true;
    return matchSearch && matchStatus;
  });

  const handleView = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  if (loading) return <div className={styles.doctorLoading}><Loader2 className={styles.doctorLoadingIcon} /></div>;
  if (error) return <div className={styles.doctorError}>{error}</div>;

  return (
    <div className={styles.reportsWrap}>
      <div className={styles.reportsHeader}>
        <div>
          <h1 className={styles.pageTitle}>Báo cáo & Thống kê</h1>
          <p className={styles.pageDesc}>Tổng quan số liệu và báo cáo hoạt động điều trị HIV</p>
        </div>
        <div className={styles.reportsHeaderActions}>
          <Button variant="outline" className={styles.reportsBtn}>
            <Download className={styles.reportsBtnIcon} />
            Xuất Excel
          </Button>
          <Button className={styles.reportsBtnPrimary}>
            <BarChart3 className={styles.reportsBtnIcon} />
            Tạo báo cáo mới
          </Button>
        </div>
      </div>
      <div className={styles.reportsFilterBar}>
        <div className={styles.reportsSearchWrap}>
          <Search className={styles.reportsSearchIcon} />
          <input
            className={styles.reportsSearchInput}
            placeholder="Tìm kiếm báo cáo, mô tả, loại..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.reportsStatusFilterWrap}>
          <Filter className={styles.reportsStatusFilterIcon} />
          <select
            className={styles.reportsStatusFilterSelect}
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>
      <Card className={styles.reportsCard}>
        <CardHeader>
          <CardTitle>Danh sách báo cáo điều trị</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.reportsList}>
            {filteredReports.length === 0 && <div className={styles.reportsEmpty}>Không có báo cáo nào.</div>}
            {filteredReports.map((report) => (
              <div key={report.id} className={styles.reportsItem}>
                <div className={styles.reportsItemTop}>
                  <div>
                    <h3 className={styles.reportsItemTitle}>{report.name || report.treatmentName || 'Báo cáo điều trị'}</h3>
                    <p className={styles.reportsItemType}>{report.type || report.treatmentType || 'Điều trị'}</p>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                <p className={styles.reportsItemDesc}>{report.description || report.note || ''}</p>
                <div className={styles.reportsItemBottom}>
                  <div className={styles.reportsItemDate}>
                    <Calendar className={styles.reportsItemDateIcon} />
                    Hạn: {report.dueDate || report.endDate || '--'}
                  </div>
                  <div className={styles.reportsItemActions}>
                    <Button variant="outline" size="sm" className={styles.reportsActionBtn} onClick={() => handleView(report)}>
                      <Eye className={styles.reportsActionBtnIcon} /> Xem chi tiết
                    </Button>
                    <Button size="sm" variant="outline" className={styles.reportsActionBtn}>
                      <Edit className={styles.reportsActionBtnIcon} /> Sửa
                    </Button>
                    <Button size="sm" variant="outline" className={styles.reportsActionBtnDanger}>
                      <Trash2 className={styles.reportsActionBtnIcon} /> Xóa
                    </Button>
                    {report.status !== 'Completed' && (
                      <Button size="sm" className={styles.reportsActionBtnPrimary}>Bắt đầu</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Modal xem chi tiết */}
      {showModal && selectedReport && (
        <div className={styles.reportsModalOverlay} onClick={handleCloseModal}>
          <div className={styles.reportsModal} onClick={e => e.stopPropagation()}>
            <div className={styles.reportsModalHeader}>
              <h2 className={styles.reportsModalTitle}>{selectedReport.name || selectedReport.treatmentName || 'Báo cáo điều trị'}</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseModal} className={styles.reportsModalClose}>
                Đóng
              </Button>
            </div>
            <div className={styles.reportsModalContent}>
              <div className={styles.reportsModalRow}><b>Loại:</b> {selectedReport.type || selectedReport.treatmentType || 'Điều trị'}</div>
              <div className={styles.reportsModalRow}><b>Mô tả:</b> {selectedReport.description || selectedReport.note || '--'}</div>
              <div className={styles.reportsModalRow}><b>Hạn:</b> {selectedReport.dueDate || selectedReport.endDate || '--'}</div>
              <div className={styles.reportsModalRow}><b>Trạng thái:</b> {getStatusBadge(selectedReport.status)}</div>
              {/* Có thể bổ sung thêm các trường khác nếu có */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
