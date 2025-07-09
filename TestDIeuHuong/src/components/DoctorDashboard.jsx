import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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
} from "lucide-react";

const DoctorDashboard = () => {
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
              <span className="text-xl font-semibold text-gray-900">
                HIV Care System
              </span>
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
                <span className="text-sm font-medium text-gray-700">
                  Dr. Nguyễn Văn A
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Chào mừng, Dr. Nguyễn Văn A
          </h1>
          <p className="text-gray-600">
            Hệ thống điều trị HIV và dịch vụ y tế - Bảng điều khiển bác sĩ
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tổng bệnh nhân
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">247</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cuộc hẹn hôm nay
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">18</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +1 so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Bệnh nhân đang điều trị
              </CardTitle>
              <Activity className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">189</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tỷ lệ tuân thủ điều trị
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">92%</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2% so với tháng trước
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Functions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Chức năng chính
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quản lý bệnh nhân
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xem danh sách bệnh nhân, hồ sơ điều trị, lịch khám.
                </p>
                <Button variant="outline" size="sm" className="w-full">
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  Lịch làm việc
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xem và cập nhật lịch làm việc của các bác sĩ.
                </p>
                <Button variant="outline" size="sm" className="w-full">
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  Chọn phác đồ ARV
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Lựa chọn / customize phác đồ ARV cho từng bệnh nhân.
                </p>
                <Button variant="outline" size="sm" className="w-full">
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  Tư vấn & đặt lịch hẹn
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xem các lịch hẹn tư vấn, chat hoặc video call với bệnh nhân.
                </p>
                <Button variant="outline" size="sm" className="w-full">
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  Dashboard & Báo cáo
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xem số liệu báo cáo, cảnh báo y tế, số lượng bệnh nhân điều
                  trị.
                </p>
                <Button variant="outline" size="sm" className="w-full">
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
                <h3 className="font-semibold text-gray-900 mb-2">
                  Quản lý thông tin bác sĩ
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Quản lý hồ sơ cá nhân, bằng cấp, chuyên môn của bác sĩ.
                </p>
                <Button variant="outline" size="sm" className="w-full">
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
                  <p className="text-sm font-medium text-gray-900">
                    Cuộc hẹn với bệnh nhân Nguyễn Thị B
                  </p>
                  <p className="text-xs text-gray-500">10:30 AM</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Sắp tới
                </Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Bệnh nhân mới: Trần Văn C đã đăng ký
                  </p>
                  <p className="text-xs text-gray-500">9:15 AM</p>
                </div>
                <Badge
                  variant="default"
                  className="text-xs bg-green-100 text-green-700"
                >
                  Mới
                </Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Cảnh báo: Bệnh nhân D cần theo dõi viral load
                  </p>
                  <p className="text-xs text-gray-500">8:45 AM</p>
                </div>
                <Badge variant="destructive" className="text-xs">
                  Cảnh báo
                </Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Hoàn thành cuộc hẹn với bệnh nhân E
                  </p>
                  <p className="text-xs text-gray-500">8:00 AM</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  Hoàn thành
                </Badge>
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
                    <h4 className="font-medium text-gray-900">
                      Thêm bệnh nhân mới
                    </h4>
                    <p className="text-sm text-gray-600">
                      Đăng ký thông tin bệnh nhân mới vào hệ thống
                    </p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Thêm
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-green-200 rounded-lg hover:bg-green-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Đặt lịch hẹn khám
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tạo cuộc hẹn khám cấp cho bệnh nhân
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    Đặt lịch
                  </Button>
                </div>
              </div>

              <div className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Xem báo cáo tuần
                    </h4>
                    <p className="text-sm text-gray-600">
                      Tổng quan số liệu quản lý tuần này
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
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
