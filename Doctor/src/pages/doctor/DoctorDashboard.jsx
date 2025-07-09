import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  UserCheck,
  ClipboardList,
  Shield,
  MessageSquare,
  BarChart3,
  Settings,
  Bell,
  ChevronRight,
  Clock,
  AlertCircle,
  CheckCircle,
  FileText
} from 'lucide-react';
import { useNavigate, Outlet } from 'react-router-dom';
import patientService from '../../services/patientService';
import appointmentService from '../../services/appointmentService';
import doctorService from '../../services/doctorService';
import { ensureValidUser } from '../../utils/doctorUtils';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    activePatients: 0,
    complianceRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Đảm bảo user có ID hợp lệ
        await ensureValidUser();
        
        // Lấy thông tin bác sĩ hiện tại
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const doctorId = user.id || user.doctorId || 1; // Fallback
        
        // Lấy danh sách bệnh nhân
        const patientsResponse = await patientService.getAll();
        const totalPatients = patientsResponse.data?.length || 0;
        
        // Lấy lịch hẹn hôm nay
        const today = new Date().toISOString().split('T')[0];
        try {
          const appointmentsResponse = await appointmentService.getByDoctorId(doctorId);
          const appointments = appointmentsResponse.data;
          
          // Kiểm tra xem appointments có phải là array không
          const todayAppointments = Array.isArray(appointments) 
            ? appointments.filter(apt => apt.appointmentDate?.startsWith(today)).length 
            : 0;
          
          // Tính toán bệnh nhân đang điều trị (giả định 80% đang điều trị)
          const activePatients = Math.round(totalPatients * 0.8);
          
          // Tỷ lệ tuân thủ điều trị (giả định 92%)
          const complianceRate = 92;
          
          setStats({
            totalPatients,
            todayAppointments,
            activePatients,
            complianceRate
          });
        } catch (appointmentError) {
          console.log('Không thể lấy lịch hẹn:', appointmentError);
          // Sử dụng giá trị mặc định nếu không lấy được lịch hẹn
          setStats({
            totalPatients,
            todayAppointments: 0,
            activePatients: Math.round(totalPatients * 0.8),
            complianceRate: 92
          });
        }
        
        // Lấy thông tin bác sĩ
        try {
          // Lấy tất cả bác sĩ trước
          const allDoctorsResponse = await doctorService.getAllDoctors();
          console.log('All doctors:', allDoctorsResponse);
          
          if (allDoctorsResponse.data && allDoctorsResponse.data.length > 0) {
            // Sử dụng bác sĩ đầu tiên nếu có
            const firstDoctor = allDoctorsResponse.data[0];
            console.log('Using first doctor:', firstDoctor);
            
            // Cập nhật localStorage với ID bác sĩ thực tế
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...user, id: firstDoctor.id, doctorId: firstDoctor.id };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setDoctorInfo({
              ...firstDoctor,
              totalPatients: totalPatients,
              monthlyAppointments: 0,
              averageRating: 4.8,
              completionRate: 96,
              responseTime: '< 2h',
              continuingEducation: 24
            });
          } else {
            // Fallback nếu không có bác sĩ nào
            setDoctorInfo({
              id: 1,
              fullName: 'Dr. Nguyễn Văn A',
              name: 'Dr. Nguyễn Văn A',
              specialization: 'Bác sĩ điều trị HIV',
              license: 'BS-001',
              experience: '5 năm',
              department: 'Khoa Nhiễm',
              totalPatients: totalPatients,
              monthlyAppointments: 0,
              averageRating: 4.8,
              completionRate: 96,
              responseTime: '< 2h',
              continuingEducation: 24
            });
          }
        } catch (error) {
          console.log('Không thể lấy thông tin bác sĩ:', error);
          // Tạo thông tin bác sĩ mặc định nếu có lỗi
          setDoctorInfo({
            id: 1,
            fullName: 'Dr. Nguyễn Văn A',
            name: 'Dr. Nguyễn Văn A',
            specialization: 'Bác sĩ điều trị HIV',
            license: 'BS-001',
            experience: '5 năm',
            department: 'Khoa Nhiễm',
            totalPatients: totalPatients,
            monthlyAppointments: 0,
            averageRating: 4.8,
            completionRate: 96,
            responseTime: '< 2h',
            continuingEducation: 24
          });
        }
        
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const doctorName = doctorInfo.fullName || doctorInfo.name || 'Dr. Nguyễn Văn A';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 text-white rounded-lg p-2">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-gray-900">HIV Care System</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium text-sm">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700">{doctorName}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng, {doctorName}</h1>
          <p className="text-gray-600">Hệ thống điều trị HIV và dịch vụ y tế - Bảng điều khiển bác sĩ</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tổng bệnh nhân</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.totalPatients}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cuộc hẹn hôm nay</CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.todayAppointments}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1 so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Bệnh nhân đang điều trị</CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : stats.activePatients}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Tỷ lệ tuân thủ điều trị</CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {loading ? '...' : `${stats.complianceRate}%`}
              </div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Functions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Chức năng chính</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quản lý bệnh nhân</h3>
                <p className="text-sm text-gray-600 mb-4">Xem danh sách bệnh nhân, hồ sơ điều trị, lịch khám.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/doctor/patients')}>
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lịch làm việc</h3>
                <p className="text-sm text-gray-600 mb-4">Xem và cập nhật lịch làm việc của các bác sĩ.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/doctor/schedule')}>
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Chọn phác đồ ARV</h3>
                <p className="text-sm text-gray-600 mb-4">Lựa chọn / customize phác đồ ARV cho từng bệnh nhân.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/doctor/arv-protocols')}>
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tư vấn & đặt lịch hẹn</h3>
                <p className="text-sm text-gray-600 mb-4">Xem các lịch hẹn tư vấn, chat hoặc video call với bệnh nhân.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/doctor/consultation')}>
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-red-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dashboard & Báo cáo</h3>
                <p className="text-sm text-gray-600 mb-4">Xem số liệu báo cáo, cảnh báo y tế, số lượng bệnh nhân điều trị.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/doctor/reports')}>
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Settings className="h-8 w-8 text-gray-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quản lý thông tin bác sĩ</h3>
                <p className="text-sm text-gray-600 mb-4">Quản lý hồ sơ cá nhân, bằng cấp, chuyên môn của bác sĩ.</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/doctor/profile')}>
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-900">
                <Clock className="h-5 w-5 mr-2" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Cuộc hẹn với bệnh nhân Nguyễn Thị B</p>
                  <p className="text-xs text-gray-500">10:30 AM</p>
                </div>
                <Badge variant="secondary" className="text-xs">Sắp tới</Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Bệnh nhân mới: Trần Văn C đã đăng ký</p>
                  <p className="text-xs text-gray-500">9:15 AM</p>
                </div>
                <Badge variant="default" className="text-xs bg-green-100 text-green-700">Mới</Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Cảnh báo: Bệnh nhân D cần theo dõi viral load</p>
                  <p className="text-xs text-gray-500">8:45 AM</p>
                </div>
                <Badge variant="destructive" className="text-xs">Cảnh báo</Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Hoàn thành cuộc hẹn với bệnh nhân E</p>
                  <p className="text-xs text-gray-500">8:00 AM</p>
                </div>
                <Badge variant="outline" className="text-xs">Hoàn thành</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-900">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Thêm bệnh nhân mới</h4>
                    <p className="text-sm text-gray-600">Đăng ký thông tin bệnh nhân mới vào hệ thống</p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Thêm
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Đặt lịch hẹn khám</h4>
                    <p className="text-sm text-gray-600">Tạo cuộc hẹn khám cấp cho bệnh nhân</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                    Đặt lịch
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Xem báo cáo tuần</h4>
                    <p className="text-sm text-gray-600">Tổng quan số liệu quản lý tuần này</p>
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white">
                    Xem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Outlet />
    </div>
  );
};

export default DoctorDashboard;