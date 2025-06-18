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
import "../styles/global.css";
import { useNavigate } from "react-router-dom";

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50 dashboard-layout">
      {/* Header */}
      <header className="dashboard-header sticky top-0 z-50">
        <div className="dashboard-header-left flex items-center gap-4">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-3 flex items-center justify-center">
            <Activity className="h-8 w-8" />
          </div>
          <span className="dashboard-header-title text-2xl font-extrabold gradient-text gradient-text-blue tracking-wide">
            BẢNG ĐIỀU KHIỂN BÁC SĨ
          </span>
          <Badge className="ml-2" variant="secondary">Bác sĩ</Badge>
        </div>
        <div className="dashboard-header-right flex items-center gap-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="input-search pl-10 pr-4 py-2"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
          </div>
          <Button variant="ghost" size="sm" className="relative notification-icon-wrapper">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="notification-count">3</span>
          </Button>
          <div className="flex items-center gap-3">
            {doctor.doctorImage && doctor.doctorImage !== "string" ? (
              <img
                src={`/images/${doctor.doctorImage}`}
                alt={doctor.fullName}
                className="user-avatar"
              />
            ) : (
              <div className="user-avatar bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-medium text-lg">
                  {avatarLetter}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="user-name font-semibold text-slate-900">
                {doctor.fullName}
              </span>
              <span className="text-xs text-slate-500">
                {doctor.bio || "Bác sĩ"}
              </span>
            </div>
            <button
              onClick={logout}
              className="logout-button flex items-center gap-2"
              title="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main-content py-8">
        {/* Welcome Section */}
        <div className="welcome-section mb-8 flex items-center gap-4">
          <Shield className="h-10 w-10 text-blue-600" />
          <div>
            <h1 className="welcome-title text-3xl font-extrabold text-blue-900 mb-1">
              Xin chào, Dr. {doctor.fullName}
            </h1>
            <p className="welcome-subtitle text-slate-600">
              Hệ thống điều trị HIV & dịch vụ y tế - Bảng điều khiển dành riêng cho bác sĩ
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Card 1 */}
          <Card className="stat-card stat-card-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="stat-title text-blue-700">Tổng bệnh nhân</CardTitle>
              <Users className="stat-icon h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="stat-value text-2xl font-bold text-blue-900">247</div>
              <p className="stat-trend positive text-xs text-blue-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>
          {/* Card 2 */}
          <Card className="stat-card stat-card-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="stat-title text-green-700">Cuộc hẹn hôm nay</CardTitle>
              <Calendar className="stat-icon h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="stat-value text-2xl font-bold text-green-900">18</div>
              <p className="stat-trend positive text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1 so với tháng trước
              </p>
            </CardContent>
          </Card>
          {/* Card 3 */}
          <Card className="stat-card stat-card-purple">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="stat-title text-purple-700">Bệnh nhân đang điều trị</CardTitle>
              <UserCheck className="stat-icon h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="stat-value text-2xl font-bold text-purple-900">189</div>
              <p className="stat-trend positive text-xs text-purple-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% so với tháng trước
              </p>
            </CardContent>
          </Card>
          {/* Card 4 */}
          <Card className="stat-card stat-card-orange">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="stat-title text-orange-700">Tỷ lệ tuân thủ điều trị</CardTitle>
              <BarChart3 className="stat-icon h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="stat-value text-2xl font-bold text-orange-900">92%</div>
              <p className="stat-trend positive text-xs text-orange-600 flex items-center mt-1">
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
                  onClick={() => navigate("/doctor/patients")}
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
                  onClick={() => navigate("/doctor/schedule")}
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
                  onClick={() => navigate("/doctor/arv")}
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
                  onClick={() => navigate("/doctor/consultation")}
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
                  onClick={() => navigate("/doctor/report")}
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
                  onClick={() => navigate("/doctor/profile")}
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
