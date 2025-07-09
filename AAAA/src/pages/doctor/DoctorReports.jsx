import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useToast } from "../../hooks/use-toast";
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
  AlertCircle,
  FileText,
  Calendar,
  Download
} from 'lucide-react';

const DoctorReports = () => {
  const { toast } = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Mock data for reports
  const patientStats = {
    total: 247,
    newThisMonth: 8,
    activeThisMonth: 189,
    inactiveThisMonth: 12,
    adherenceRate: 92,
    viralSuppression: 87
  };

  const appointmentStats = {
    totalThisMonth: 156,
    completedThisMonth: 142,
    missedThisMonth: 14,
    averageDuration: 28,
    satisfactionRate: 4.6
  };

  const treatmentStats = {
    regimensUsed: 12,
    mostUsedRegimen: 'Dolutegravir + Tenofovir + Emtricitabine',
    sideEffectsReported: 23,
    doseAdjustments: 15
  };

  const alerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Bệnh nhân cần theo dõi',
      description: '5 bệnh nhân có viral load tăng',
      date: '2024-06-25'
    },
    {
      id: 2,
      type: 'info',
      title: 'Thuốc sắp hết hạn',
      description: 'Lô thuốc ABC123 sẽ hết hạn trong 30 ngày',
      date: '2024-06-24'
    },
    {
      id: 3,
      type: 'success',
      title: 'Mục tiêu tuân thủ đạt được',
      description: 'Tỷ lệ tuân thủ tháng này đạt 92%',
      date: '2024-06-23'
    }
  ];

  const monthlyData = [
    { month: 'T1', patients: 220, appointments: 145, adherence: 89 },
    { month: 'T2', patients: 225, appointments: 152, adherence: 91 },
    { month: 'T3', patients: 232, appointments: 148, adherence: 88 },
    { month: 'T4', patients: 238, appointments: 159, adherence: 93 },
    { month: 'T5', patients: 242, appointments: 163, adherence: 90 },
    { month: 'T6', patients: 247, appointments: 156, adherence: 92 }
  ];

  const handleExportReport = (reportType) => {
    toast({
      title: "Xuất báo cáo",
      description: `Đang xuất báo cáo ${reportType}...`,
    });
  };

  const handleGenerateReport = () => {
    toast({
      title: "Tạo báo cáo",
      description: "Đang tạo báo cáo tùy chỉnh...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-red-600" />
            Dashboard & Báo cáo
          </h1>
          <p className="text-gray-600 mt-2">Theo dõi số liệu và phân tích hiệu quả điều trị</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleGenerateReport} variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Tạo báo cáo
          </Button>
          <Button onClick={() => handleExportReport('tổng quan')} className="bg-red-600 hover:bg-red-700">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Chọn khoảng thời gian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            {[
              { key: 'week', label: 'Tuần này' },
              { key: 'month', label: 'Tháng này' },
              { key: 'quarter', label: 'Quý này' },
              { key: 'year', label: 'Năm này' }
            ].map((period) => (
              <Button
                key={period.key}
                variant={selectedPeriod === period.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.key)}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tổng bệnh nhân</p>
                <p className="text-3xl font-bold">{patientStats.total}</p>
                <p className="text-sm text-blue-200 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +{patientStats.newThisMonth} mới
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Tỷ lệ tuân thủ</p>
                <p className="text-3xl font-bold">{patientStats.adherenceRate}%</p>
                <p className="text-sm text-green-200 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +2% so với tháng trước
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Kiểm soát virus</p>
                <p className="text-3xl font-bold">{patientStats.viralSuppression}%</p>
                <p className="text-sm text-purple-200 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +1% so với tháng trước
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Cuộc hẹn</p>
                <p className="text-3xl font-bold">{appointmentStats.totalThisMonth}</p>
                <p className="text-sm text-orange-200 flex items-center mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {appointmentStats.missedThisMonth} bỏ lỡ
                </p>
              </div>
              <Calendar className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Patient Management Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-600" />
              Báo cáo quản lý bệnh nhân
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-700 font-medium">Bệnh nhân mới</p>
                <p className="text-2xl font-bold text-blue-900">{patientStats.newThisMonth}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-700 font-medium">Đang điều trị</p>
                <p className="text-2xl font-bold text-green-900">{patientStats.activeThisMonth}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tỷ lệ tuân thủ điều trị</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${patientStats.adherenceRate}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{patientStats.adherenceRate}%</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kiểm soát virus</span>
                <div className="flex items-center">
                  <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${patientStats.viralSuppression}%` }}
                    ></div>
                  </div>
                  <span className="font-medium">{patientStats.viralSuppression}%</span>
                </div>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExportReport('quản lý bệnh nhân')}
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo chi tiết
            </Button>
          </CardContent>
        </Card>

        {/* Treatment Report */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Báo cáo điều trị
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-700 font-medium">Phác đồ sử dụng</p>
                <p className="text-2xl font-bold text-purple-900">{treatmentStats.regimensUsed}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-700 font-medium">Tác dụng phụ</p>
                <p className="text-2xl font-bold text-red-900">{treatmentStats.sideEffectsReported}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Phác đồ phổ biến nhất:</p>
              <Badge className="bg-purple-100 text-purple-700 text-xs">
                {treatmentStats.mostUsedRegimen}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Điều chỉnh liều:</p>
              <p className="text-sm text-gray-600">{treatmentStats.doseAdjustments} trường hợp trong tháng</p>
            </div>

            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleExportReport('điều trị')}
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất báo cáo điều trị
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            Cảnh báo và thông báo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning' 
                    ? 'bg-yellow-50 border-yellow-400' 
                    : alert.type === 'success'
                    ? 'bg-green-50 border-green-400'
                    : 'bg-blue-50 border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{alert.date}</p>
                    <Button size="sm" variant="outline" className="mt-2">
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend Chart (Simple representation) */}
      <Card>
        <CardHeader>
          <CardTitle>Xu hướng theo tháng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 text-sm font-medium text-gray-600">{data.month}</div>
                <div className="flex-1 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span>BN: {data.patients}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span>Hẹn: {data.appointments}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span>Tuân thủ: {data.adherence}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorReports; 