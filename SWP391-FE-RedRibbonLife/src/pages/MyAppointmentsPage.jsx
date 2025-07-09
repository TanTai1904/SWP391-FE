import React, { useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../hooks/useAuth.jsx';
import '../styles/MyAppointmentsPage.css';

const MyAppointmentsPage = () => {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Sample data - simplified structure with only required fields
  const [testResults] = useState([
    {
      appointment_id: 'APT001',
      patient_id: 'PT001',
      doctor_id: 'DR001',
      test_type: 'CD4 Count',
      result_value: '450',
      unit: 'cells/μL',
      normal_range: '500-1200',
      notes: 'Cần theo dõi và tăng cường điều trị'
    },
    {
      appointment_id: 'APT001',
      patient_id: 'PT001',
      doctor_id: 'DR001',
      test_type: 'Viral Load',
      result_value: 'Undetectable',
      unit: 'copies/mL',
      normal_range: '<20',
      notes: 'Kết quả tốt, tiếp tục duy trì'
    },
    {
      appointment_id: 'APT002',
      patient_id: 'PT001',
      doctor_id: 'DR002',
      test_type: 'Hemoglobin',
      result_value: '12.5',
      unit: 'g/dL',
      normal_range: '12-16',
      notes: 'Trong giới hạn bình thường'
    },
    {
      appointment_id: 'APT002',
      patient_id: 'PT001',
      doctor_id: 'DR002',
      test_type: 'White Blood Cells',
      result_value: '6500',
      unit: 'cells/μL',
      normal_range: '4000-11000',
      notes: 'Bình thường'
    },
    {
      appointment_id: 'APT002',
      patient_id: 'PT001',
      doctor_id: 'DR002',
      test_type: 'Liver Function (ALT)',
      result_value: '28',
      unit: 'U/L',
      normal_range: '7-45',
      notes: 'Chức năng gan tốt'
    },
    {
      appointment_id: 'APT003',
      patient_id: 'PT001',
      doctor_id: 'DR003',
      test_type: 'Creatinine',
      result_value: '1.0',
      unit: 'mg/dL',
      normal_range: '0.6-1.2',
      notes: 'Chức năng thận bình thường'
    },
    {
      appointment_id: 'APT003',
      patient_id: 'PT001',
      doctor_id: 'DR003',
      test_type: 'Total Cholesterol',
      result_value: '180',
      unit: 'mg/dL',
      normal_range: '<200',
      notes: 'Cholesterol ở mức tốt'
    },
    {
      appointment_id: 'APT004',
      patient_id: 'PT001',
      doctor_id: 'DR001',
      test_type: 'Blood Sugar',
      result_value: '95',
      unit: 'mg/dL',
      normal_range: '70-100',
      notes: 'Đường huyết bình thường'
    }
  ]);

  // Pagination logic
  const totalPages = Math.ceil(testResults.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = testResults.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  if (!user) {
    return (
      <div>
        <Header />
        <div className="login-prompt">
          <h2>Vui lòng đăng nhập để xem kết quả xét nghiệm</h2>
        </div>
      </div>
    );
  }

  if (testResults.length === 0) {
    return (
      <div>
        <Header />
        <div className="appointments-container">
          <div className="appointments-wrapper">
            <div className="no-appointments">
              <div className="no-appointments-icon">�</div>
              <h3>Chưa có kết quả xét nghiệm nào</h3>
              <p>Bạn chưa có kết quả xét nghiệm nào được ghi nhận.</p>
              <a href="/appointment" className="appointment-link">
                Đặt lịch hẹn mới
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="appointments-container">
        <div className="appointments-wrapper">
          <h1 className="appointments-title">� Kết quả xét nghiệm</h1>
          
          {/* Statistics */}
          <div className="appointments-stats">
            <div className="stat-card">
              <div className="stat-number">{testResults.length}</div>
              <div className="stat-label">Tổng kết quả</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{currentPage}</div>
              <div className="stat-label">Trang hiện tại</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{totalPages}</div>
              <div className="stat-label">Tổng trang</div>
            </div>
          </div>

          {/* Test Results List */}
          <div className="appointments-list">
            {currentRecords.map((result, index) => (
              <div key={index} className="appointment-card">
                <div className="appointment-header">
                  <div className="appointment-date">
                    � {result.test_type}
                  </div>
                  <div className={`appointment-status ${
                    result.notes.toLowerCase().includes('bình thường') || 
                    result.notes.toLowerCase().includes('tốt') || 
                    result.result_value.toLowerCase().includes('undetectable') 
                      ? 'status-completed' 
                      : result.notes.toLowerCase().includes('cần theo dõi')
                      ? 'status-scheduled'
                      : 'status-completed'
                  }`}>
                    {result.notes.toLowerCase().includes('bình thường') || 
                     result.notes.toLowerCase().includes('tốt') || 
                     result.result_value.toLowerCase().includes('undetectable') 
                       ? 'Bình thường' 
                       : 'Cần theo dõi'}
                  </div>
                </div>

                <div className="appointment-body">
                  <div className="test-results-section">
                    <div className="test-results-grid">
                      <div className="test-result-item">
                        <ul className="test-details-list">
                          <li className="test-detail-item">
                            <span className="test-detail-label">Mã lịch hẹn:</span>
                            <span className="test-detail-value">{result.appointment_id}</span>
                          </li>
                          <li className="test-detail-item">
                            <span className="test-detail-label">Mã bệnh nhân:</span>
                            <span className="test-detail-value">{result.patient_id}</span>
                          </li>
                          <li className="test-detail-item">
                            <span className="test-detail-label">Mã bác sĩ:</span>
                            <span className="test-detail-value">{result.doctor_id}</span>
                          </li>
                          <li className="test-detail-item">
                            <span className="test-detail-label">Loại xét nghiệm:</span>
                            <span className="test-detail-value">{result.test_type}</span>
                          </li>
                          <li className="test-detail-item">
                            <span className="test-detail-label">Kết quả:</span>
                            <span className="test-detail-value">{result.result_value}</span>
                          </li>
                          <li className="test-detail-item">
                            <span className="test-detail-label">Đơn vị:</span>
                            <span className="test-detail-value">{result.unit}</span>
                          </li>
                          <li className="test-detail-item">
                            <span className="test-detail-label">Giá trị bình thường:</span>
                            <span className={`test-detail-value ${
                              result.notes.toLowerCase().includes('bình thường') || 
                              result.notes.toLowerCase().includes('tốt') || 
                              result.result_value.toLowerCase().includes('undetectable') 
                                ? 'normal-range' : ''
                            }`}>
                              {result.normal_range}
                            </span>
                          </li>
                        </ul>
                        {result.notes && (
                          <div className="notes-section">
                            <div className="notes-title">Ghi chú</div>
                            <div className="notes-content">{result.notes}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              marginTop: '2rem', 
              gap: '1rem' 
            }}>
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: currentPage === 1 ? '#e0e6ed' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: currentPage === 1 ? '#999' : 'white',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                ← Trước
              </button>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      width: '40px',
                      height: '40px',
                      border: 'none',
                      borderRadius: '8px',
                      background: currentPage === page 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : 'white',
                      color: currentPage === page ? 'white' : '#667eea',
                      cursor: 'pointer',
                      fontWeight: currentPage === page ? '600' : '500',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (currentPage !== page) {
                        e.target.style.background = '#f8f9ff';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentPage !== page) {
                        e.target.style.background = 'white';
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '8px',
                  background: currentPage === totalPages ? '#e0e6ed' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: currentPage === totalPages ? '#999' : 'white',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: '500',
                  transition: 'all 0.3s ease'
                }}
              >
                Sau →
              </button>
            </div>
          )}

          {/* Pagination Info */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '1rem', 
            color: '#666',
            fontSize: '0.9rem'
          }}>
            Hiển thị {startIndex + 1} - {Math.min(endIndex, testResults.length)} trong tổng số {testResults.length} kết quả
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointmentsPage;
