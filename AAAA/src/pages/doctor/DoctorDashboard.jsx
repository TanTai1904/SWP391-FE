import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Users,
  Calendar,
  Activity,
  TrendingUp,
  BarChart3,
  UserCheck,
  ChevronRight,
  Shield,
  MessageSquare,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import doctorService from "../../services/doctorService";

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (user?.doctorId) {
      doctorService.getDoctorById(user.doctorId).then(setDoctor).catch(console.error);
    }
  }, [user]);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
        <h1 className="text-3xl font-bold mb-2">Chào mừng, {doctor?.fullName ? `Dr. ${doctor.fullName}` : "Bác sĩ"}</h1>
        <p className="text-blue-100">Hệ thống điều trị HIV và dịch vụ y tế - Bảng điều khiển bác sĩ</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tổng bệnh nhân</CardTitle>
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

        <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cuộc hẹn hôm nay</CardTitle>
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

        <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bệnh nhân đang điều trị</CardTitle>
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

        <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 border-l-4 border-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Tỷ lệ tuân thủ điều trị</CardTitle>
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Chức năng chính</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/doctor/patients">
            <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <UserCheck className="h-8 w-8 text-blue-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quản lý bệnh nhân</h3>
                <p className="text-sm text-gray-600 mb-4">Xem danh sách bệnh nhân, hồ sơ điều trị, lịch khám.</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-blue-50">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/schedule">
            <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lịch làm việc</h3>
                <p className="text-sm text-gray-600 mb-4">Xem và cập nhật lịch làm việc của các bác sĩ.</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-green-50">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/arv-regimen">
            <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Chọn phác đồ ARV</h3>
                <p className="text-sm text-gray-600 mb-4">Lựa chọn / customize phác đồ ARV cho từng bệnh nhân.</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-purple-50">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/consultation">
            <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <MessageSquare className="h-8 w-8 text-orange-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Tư vấn & đặt lịch hẹn</h3>
                <p className="text-sm text-gray-600 mb-4">Xem các lịch hẹn tư vấn, chat hoặc video call với bệnh nhân.</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-orange-50">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/reports">
            <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="h-8 w-8 text-red-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Dashboard & Báo cáo</h3>
                <p className="text-sm text-gray-600 mb-4">Xem số liệu báo cáo, cảnh báo y tế, số lượng bệnh nhân điều trị.</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-red-50">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link to="/doctor/profile">
            <Card className="bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Settings className="h-8 w-8 text-gray-600" />
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Quản lý thông tin bác sĩ</h3>
                <p className="text-sm text-gray-600 mb-4">Quản lý hồ sơ cá nhân, bằng cấp, chuyên môn của bác sĩ.</p>
                <Button variant="outline" size="sm" className="w-full group-hover:bg-gray-50">
                  Truy cập
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 