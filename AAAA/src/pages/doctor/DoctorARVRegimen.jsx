import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import { 
  Shield, 
  Search,
  Plus,
  FileText,
  AlertCircle,
  CheckCircle,
  Activity,
  Users
} from 'lucide-react';

const mockRegimens = [
  {
    id: '1',
    name: 'Dolutegravir + Tenofovir + Emtricitabine',
    drugs: ['Dolutegravir 50mg', 'Tenofovir 300mg', 'Emtricitabine 200mg'],
    indication: 'Điều trị khởi đầu cho bệnh nhân HIV mới chẩn đoán',
    contraindications: ['Suy thận nặng', 'Dị ứng với thành phần thuốc'],
    sideEffects: ['Buồn nôn', 'Đau đầu', 'Mệt mỏi'],
    dosage: '1 viên/ngày',
    frequency: 'Hàng ngày',
    patientCount: 45,
    effectiveness: 95,
    status: 'recommended'
  },
  {
    id: '2',
    name: 'Efavirenz + Tenofovir + Emtricitabine',
    drugs: ['Efavirenz 600mg', 'Tenofovir 300mg', 'Emtricitabine 200mg'],
    indication: 'Điều trị duy trì cho bệnh nhân đã ổn định',
    contraindications: ['Bệnh tâm thần', 'Thai kỳ trimester 1'],
    sideEffects: ['Rối loạn giấc ngủ', 'Chóng mặt', 'Phát ban'],
    dosage: '1 viên/ngày (tối)',
    frequency: 'Hàng ngày',
    patientCount: 32,
    effectiveness: 92,
    status: 'alternative'
  },
  {
    id: '3',
    name: 'Darunavir + Ritonavir + Tenofovir + Emtricitabine',
    drugs: ['Darunavir 800mg', 'Ritonavir 100mg', 'Tenofovir 300mg', 'Emtricitabine 200mg'],
    indication: 'Điều trị cho bệnh nhân kháng thuốc',
    contraindications: ['Suy gan nặng', 'Tương tác thuốc nghiêm trọng'],
    sideEffects: ['Tiêu chảy', 'Buồn nôn', 'Tăng cholesterol'],
    dosage: '2 viên sáng, 2 viên tối',
    frequency: '2 lần/ngày',
    patientCount: 18,
    effectiveness: 88,
    status: 'alternative'
  }
];

const DoctorARVRegimen = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegimen, setSelectedRegimen] = useState(null);
  const regimens = mockRegimens;

  const filteredRegimens = regimens.filter(regimen =>
    regimen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    regimen.drugs.some(drug => drug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelectRegimen = (regimen) => {
    setSelectedRegimen(regimen);
    toast({
      title: "Đã chọn phác đồ",
      description: `Phác đồ ${regimen.name} đã được chọn`,
    });
  };

  const handleCreateRegimen = () => {
    toast({
      title: "Tạo phác đồ mới",
      description: "Đang mở form tạo phác đồ ARV mới...",
    });
  };

  const handleAssignToPatient = (regimenId) => {
    toast({
      title: "Chỉ định phác đồ",
      description: "Đang mở danh sách bệnh nhân để chỉ định phác đồ...",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'recommended':
        return <Badge className="bg-green-100 text-green-700">Khuyến cáo</Badge>;
      case 'alternative':
        return <Badge className="bg-blue-100 text-blue-700">Lựa chọn khác</Badge>;
      case 'discontinued':
        return <Badge className="bg-red-100 text-red-700">Ngưng sử dụng</Badge>;
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
            <Shield className="h-8 w-8 mr-3 text-purple-600" />
            Phác đồ ARV
          </h1>
          <p className="text-gray-600 mt-2">Quản lý và lựa chọn phác đồ điều trị HIV</p>
        </div>
        <Button onClick={handleCreateRegimen} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo phác đồ mới
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Tổng phác đồ</p>
                <p className="text-3xl font-bold">{regimens.length}</p>
              </div>
              <Shield className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Khuyến cáo</p>
                <p className="text-3xl font-bold">{regimens.filter(r => r.status === 'recommended').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Lựa chọn khác</p>
                <p className="text-3xl font-bold">{regimens.filter(r => r.status === 'alternative').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Bệnh nhân sử dụng</p>
                <p className="text-3xl font-bold">{regimens.reduce((sum, r) => sum + r.patientCount, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm phác đồ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm theo tên phác đồ hoặc thuốc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Regimen List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Danh sách phác đồ ({filteredRegimens.length})</h2>
          {filteredRegimens.map((regimen) => (
            <Card 
              key={regimen.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedRegimen?.id === regimen.id ? 'ring-2 ring-purple-500 shadow-lg' : ''
              }`}
              onClick={() => handleSelectRegimen(regimen)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{regimen.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(regimen.status)}
                      <Badge variant="outline">
                        Hiệu quả: {regimen.effectiveness}%
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Thành phần:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {regimen.drugs.map((drug, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {drug}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Liều dùng:</p>
                    <p className="text-sm text-gray-600">{regimen.dosage} - {regimen.frequency}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700">Chỉ định:</p>
                    <p className="text-sm text-gray-600">{regimen.indication}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-sm text-gray-500">
                      {regimen.patientCount} bệnh nhân đang sử dụng
                    </span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignToPatient(regimen.id);
                      }}
                    >
                      Chỉ định
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Regimen Details */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết phác đồ</h2>
          {selectedRegimen ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-purple-600" />
                  {selectedRegimen.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Thông tin cơ bản</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Trạng thái:</span>
                      {getStatusBadge(selectedRegimen.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hiệu quả:</span>
                      <span className="font-medium">{selectedRegimen.effectiveness}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bệnh nhân sử dụng:</span>
                      <span className="font-medium">{selectedRegimen.patientCount}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chống chỉ định</h4>
                  <div className="space-y-2">
                    {selectedRegimen.contraindications.map((contraindication, index) => (
                      <div key={index} className="flex items-center text-sm text-red-700 bg-red-50 p-2 rounded">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {contraindication}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tác dụng phụ</h4>
                  <div className="space-y-2">
                    {selectedRegimen.sideEffects.map((sideEffect, index) => (
                      <div key={index} className="flex items-center text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        {sideEffect}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    onClick={() => handleAssignToPatient(selectedRegimen.id)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Chỉ định cho bệnh nhân
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chọn một phác đồ để xem chi tiết</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorARVRegimen; 