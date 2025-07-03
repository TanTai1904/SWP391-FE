import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import { 
  Users, 
  Search,
  Plus,
  Eye,
  Edit,
  FileText,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const mockPatients = [
  {
    id: '001',
    name: 'Nguyễn Văn A',
    age: 35,
    gender: 'Nam',
    phone: '0901234567',
    status: 'active',
    lastVisit: '2024-06-20',
    nextAppointment: '2024-07-15',
    viralLoad: 'Undetectable',
    cd4Count: 450
  },
  {
    id: '002',
    name: 'Trần Thị B',
    age: 28,
    gender: 'Nữ',
    phone: '0907654321',
    status: 'warning',
    lastVisit: '2024-06-18',
    nextAppointment: '2024-06-28',
    viralLoad: '2000 copies/mL',
    cd4Count: 280
  },
  {
    id: '003',
    name: 'Lê Minh C',
    age: 42,
    gender: 'Nam',
    phone: '0912345678',
    status: 'active',
    lastVisit: '2024-06-22',
    nextAppointment: '2024-07-20',
    viralLoad: 'Undetectable',
    cd4Count: 520
  },
  {
    id: '004',
    name: 'Phạm Thị D',
    age: 31,
    gender: 'Nữ',
    phone: '0909876543',
    status: 'inactive',
    lastVisit: '2024-05-10',
    nextAppointment: 'Chưa đặt',
    viralLoad: 'Chưa có kết quả',
    cd4Count: 200
  }
];

const DoctorPatients = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [patients] = useState(mockPatients);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.id.includes(searchTerm)
  );

  const handleAction = (action, patientName) => {
    toast({
      title: `${action} bệnh nhân`,
      description: `Đang thực hiện ${action.toLowerCase()} cho bệnh nhân ${patientName}`,
    });
  };

  const handleAddPatient = () => {
    toast({
      title: "Thêm bệnh nhân mới",
      description: "Đang mở form thêm bệnh nhân mới...",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700">Đang điều trị</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-700">Cần theo dõi</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-700">Ngưng điều trị</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Quản lý bệnh nhân
          </h1>
          <p className="text-gray-600 mt-2">Quản lý thông tin và theo dõi điều trị bệnh nhân HIV</p>
        </div>
        <Button onClick={handleAddPatient} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Thêm bệnh nhân mới
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tổng bệnh nhân</p>
                <p className="text-3xl font-bold">{patients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Đang điều trị</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.status === 'active').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Cần theo dõi</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.status === 'warning').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100">Ngưng điều trị</p>
                <p className="text-3xl font-bold">{patients.filter(p => p.status === 'inactive').length}</p>
              </div>
              <Activity className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm bệnh nhân</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã bệnh nhân..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">Lọc</Button>
          </div>
        </CardContent>
      </Card>

      {/* Patient List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách bệnh nhân ({filteredPatients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                      <p className="text-sm text-gray-500">ID: {patient.id}</p>
                      <p className="text-sm text-gray-500">{patient.age} tuổi, {patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Liên hệ</p>
                      <p className="text-sm text-gray-600">{patient.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                      {getStatusBadge(patient.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Viral Load</p>
                      <p className="text-sm text-gray-600">{patient.viralLoad}</p>
                      <p className="text-sm text-gray-600">CD4: {patient.cd4Count}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Hẹn khám</p>
                      <p className="text-sm text-gray-600">{patient.nextAppointment}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('Xem chi tiết', patient.name)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('Chỉnh sửa', patient.name)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('Xem hồ sơ', patient.name)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction('Đặt lịch hẹn', patient.name)}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
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

export default DoctorPatients; 