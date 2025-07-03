import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
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
  FileText,
  Search,
  Plus,
  LogOut,
} from "lucide-react";
import "../styles/global.scss";

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:1566/api/Doctor/GetAll", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          console.log("DATA FROM API:", data);
          console.log("USER FROM AUTH:", user);
          const found = data.data.find((d) => {
            // So sánh userName với phần trước @ của email
            if (d.email && user.userName) {
              const emailPrefix = d.email.split('@')[0].toLowerCase().trim();
              if (emailPrefix === user.userName.toLowerCase().trim()) return true;
            }
            // So sánh với fullName nếu cần
            if (d.fullName && user.userName) {
              if (d.fullName.toLowerCase().replace(/\s/g, '') === user.userName.toLowerCase().replace(/\s/g, '')) return true;
            }
            return false;
          });
          console.log("FOUND DOCTOR:", found);
          setDoctor(found);
        } else {
          setDoctor(null);
        }
      } catch (err) {
        setDoctor(null);
      }
    };
    if (user) fetchDoctor();
  }, [user]);

  if (!doctor)
    return (
      <div className="flex items-center justify-center min-h-screen text-lg text-slate-600">
        Đang tải thông tin bác sĩ...
      </div>
    );

  const avatarLetter = doctor.fullName ? doctor.fullName.charAt(0) : "A";

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-2">
                <Activity className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                HIV Care System
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Button>
              <div className="flex items-center space-x-3">
                {doctor.doctorImage && doctor.doctorImage !== "string" ? (
                  <img
                    src={`/images/${doctor.doctorImage}`}
                    alt={doctor.fullName}
                    className="h-10 w-10 rounded-full object-cover border border-blue-200"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {avatarLetter}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-900">
                    {doctor.fullName}
                  </span>
                  <span className="text-xs text-slate-500">
                    {doctor.bio || "Bác sĩ"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="ml-4 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium border border-red-200 hover:bg-red-100 transition flex items-center gap-2"
                  title="Đăng xuất"
                >
                  <LogOut className="h-4 w-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Chào mừng, Dr. {doctor.fullName}
          </h1>
          <p className="text-slate-600">
            Hệ thống điều trị HIV và dịch vụ y tế - Bảng điều khiển bác sĩ
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid-stats mb-8">
          <Card className="stat-card stat-card-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-700">
                Tổng bệnh nhân
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">247</div>
              <p className="text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-700">
                Cuộc hẹn hôm nay
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">18</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1 so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-purple">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-700">
                Bệnh nhân đang điều trị
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">189</div>
              <p className="text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="stat-card stat-card-orange">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-700">
                Tỷ lệ tuân thủ điều trị
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">92%</div>
              <p className="text-xs text-orange-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Functions */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="heading-2">Chức năng chính</h2>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Thêm chức năng
            </Button>
          </div>
          <div className="grid-responsive">
            <Card className="dashboard-card hover-card hover-card-blue">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container icon-container-blue">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="heading-3">Quản lý bệnh nhân</h3>
                <p className="text-body mb-4">
                  Xem danh sách bệnh nhân, hồ sơ điều trị, lịch khám.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-200"
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card hover-card hover-card-green">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container icon-container-green">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="heading-3">Lịch làm việc</h3>
                <p className="text-body mb-4">
                  Xem và cập nhật lịch làm việc của các bác sĩ.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-green-50 group-hover:text-green-600 group-hover:border-green-200"
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card hover-card hover-card-purple">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container icon-container-purple">
                    <Shield className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="heading-3">Chọn phác đồ ARV</h3>
                <p className="text-body mb-4">
                  Lựa chọn / customize phác đồ ARV cho từng bệnh nhân.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-purple-50 group-hover:text-purple-600 group-hover:border-purple-200"
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card hover-card hover-card-orange">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container icon-container-orange">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <h3 className="heading-3">Tư vấn & đặt lịch hẹn</h3>
                <p className="text-body mb-4">
                  Xem các lịch hẹn tư vấn, chat hoặc video call với bệnh nhân.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-orange-50 group-hover:text-orange-600 group-hover:border-orange-200"
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card hover-card hover-card-red">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container icon-container-red">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-red-600 transition-colors" />
                </div>
                <h3 className="heading-3">Dashboard & Báo cáo</h3>
                <p className="text-body mb-4">
                  Xem số liệu báo cáo, cảnh báo y tế, số lượng bệnh nhân điều
                  trị.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-red-50 group-hover:text-red-600 group-hover:border-red-200"
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>

            <Card className="dashboard-card hover-card hover-card-slate">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="icon-container icon-container-slate">
                    <Settings className="h-6 w-6" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                </div>
                <h3 className="heading-3">Quản lý thông tin bác sĩ</h3>
                <p className="text-body mb-4">
                  Quản lý hồ sơ cá nhân, bằng cấp, chuyên môn của bác sĩ.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full group-hover:bg-slate-50 group-hover:text-slate-600 group-hover:border-slate-200"
                >
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center text-slate-900">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="activity-card activity-card-blue">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Cuộc hẹn với bệnh nhân Nguyễn Thị B
                    </p>
                    <p className="text-muted">10:30 AM</p>
                  </div>
                  <Badge className="badge badge-blue">Sắp tới</Badge>
                </div>
              </div>

              <div className="activity-card activity-card-green">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Bệnh nhân mới: Trần Văn C đã đăng ký
                    </p>
                    <p className="text-muted">9:15 AM</p>
                  </div>
                  <Badge className="badge badge-green">Mới</Badge>
                </div>
              </div>

              <div className="activity-card activity-card-red">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Cảnh báo: Bệnh nhân D cần theo dõi viral load
                    </p>
                    <p className="text-muted">8:45 AM</p>
                  </div>
                  <Badge variant="destructive" className="badge">
                    Cảnh báo
                  </Badge>
                </div>
              </div>

              <div className="activity-card activity-card-blue">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Hoàn thành cuộc hẹn với bệnh nhân E
                    </p>
                    <p className="text-muted">8:00 AM</p>
                  </div>
                  <Badge variant="outline" className="badge">
                    Hoàn thành
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="heading-2">Thao tác nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="quick-action-card quick-action-card-blue">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="heading-3">Thêm bệnh nhân mới</h4>
                    <p className="text-body">
                      Đăng ký thông tin bệnh nhân mới vào hệ thống
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gradient-button gradient-button-blue"
                  >
                    Thêm
                  </Button>
                </div>
              </div>

              <div className="quick-action-card quick-action-card-green">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="heading-3">Đặt lịch hẹn khám</h4>
                    <p className="text-body">
                      Tạo cuộc hẹn khám cấp cho bệnh nhân
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gradient-button gradient-button-green"
                  >
                    Đặt lịch
                  </Button>
                </div>
              </div>

              <div className="quick-action-card quick-action-card-purple">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="heading-3">Xem báo cáo tuần</h4>
                    <p className="text-body">
                      Tổng quan số liệu quản lý tuần này
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gradient-button gradient-button-purple"
                  >
                    Xem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
