import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import { 
  MessageSquare, 
  Calendar,
  Clock,
  Plus,
  Users,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';

const mockConsultations = [
  {
    id: '1',
    patientName: 'Nguyễn Văn A',
    patientId: 'P001',
    appointmentDate: '2024-06-26',
    appointmentTime: '09:00',
    type: 'video',
    status: 'scheduled',
    reason: 'Tư vấn tác dụng phụ thuốc',
    priority: 'medium',
    duration: 30,
    notes: 'Bệnh nhân báo cáo buồn nôn sau khi uống thuốc'
  },
  {
    id: '2',
    patientName: 'Trần Thị B',
    patientId: 'P002',
    appointmentDate: '2024-06-26',
    appointmentTime: '10:30',
    type: 'chat',
    status: 'in-progress',
    reason: 'Theo dõi tuân thủ điều trị',
    priority: 'low',
    duration: 15,
  },
  {
    id: '3',
    patientName: 'Lê Minh C',
    patientId: 'P003',
    appointmentDate: '2024-06-26',
    appointmentTime: '14:00',
    type: 'in-person',
    status: 'scheduled',
    reason: 'Tư vấn thay đổi phác đồ',
    priority: 'high',
    duration: 45,
    notes: 'Cần đánh giá kết quả xét nghiệm mới'
  },
  {
    id: '4',
    patientName: 'Phạm Thị D',
    patientId: 'P004',
    appointmentDate: '2024-06-25',
    appointmentTime: '16:00',
    type: 'phone',
    status: 'completed',
    reason: 'Tư vấn dinh dưỡng',
    priority: 'low',
    duration: 20,
    notes: 'Đã tư vấn chế độ ăn uống phù hợp'
  }
];

const DoctorConsultation = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const consultations = mockConsultations;

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         consultation.reason.toLowerCase().includes(searchTerm.toLowerCase());
    
    const today = new Date().toDateString();
    const consultationDate = new Date(consultation.appointmentDate).toDateString();
    
    switch (activeTab) {
      case 'today':
        return matchesSearch && consultationDate === today;
      case 'upcoming':
        return matchesSearch && new Date(consultation.appointmentDate) > new Date() && consultationDate !== today;
      case 'completed':
        return matchesSearch && consultation.status === 'completed';
      default:
        return matchesSearch;
    }
  });

  const handleNewConsultation = () => {
    toast({
      title: "Tạo cuộc tư vấn mới",
      description: "Đang mở form đặt lịch tư vấn...",
    });
  };

  const handleStartConsultation = (consultationId, type) => {
    toast({
      title: "Bắt đầu tư vấn",
      description: `Đang khởi động ${type === 'video' ? 'video call' : type === 'chat' ? 'chat' : type === 'phone' ? 'cuộc gọi' : 'cuộc hẹn trực tiếp'}...`,
    });
  };

  const handleCompleteConsultation = (consultationId) => {
    toast({
      title: "Hoàn thành tư vấn",
      description: "Tư vấn đã được đánh dấu hoàn thành",
    });
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'video':
        return <Badge className="bg-blue-100 text-blue-700">Video Call</Badge>;
      case 'chat':
        return <Badge className="bg-green-100 text-green-700">Chat</Badge>;
      case 'phone':
        return <Badge className="bg-yellow-100 text-yellow-700">Điện thoại</Badge>;
      case 'in-person':
        return <Badge className="bg-purple-100 text-purple-700">Trực tiếp</Badge>;
      default:
        return <Badge variant="secondary">Khác</Badge>;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700">Đã đặt lịch</Badge>;
      case 'in-progress':
        return <Badge className="bg-orange-100 text-orange-700">Đang tiến hành</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'urgent':
        return <Badge className="bg-red-100 text-red-700">Khẩn cấp</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-700">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-700">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-gray-100 text-gray-700">Thấp</Badge>;
      default:
        return <Badge variant="secondary">Không xác định</Badge>;
    }
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayConsultations = consultations.filter(c => 
      new Date(c.appointmentDate).toDateString() === today
    );
    
    return {
      total: todayConsultations.length,
      completed: todayConsultations.filter(c => c.status === 'completed').length,
      inProgress: todayConsultations.filter(c => c.status === 'in-progress').length,
      scheduled: todayConsultations.filter(c => c.status === 'scheduled').length
    };
  };

  const stats = getTodayStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-orange-600" />
            Tư vấn & Đặt lịch hẹn
          </h1>
          <p className="text-gray-600 mt-2">Quản lý các cuộc tư vấn và hẹn khám với bệnh nhân</p>
        </div>
        <Button onClick={handleNewConsultation} className="bg-orange-600 hover:bg-orange-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo cuộc tư vấn mới
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Hôm nay</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Hoàn thành</p>
                <p className="text-3xl font-bold">{stats.completed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Đang tiến hành</p>
                <p className="text-3xl font-bold">{stats.inProgress}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Đã đặt lịch</p>
                <p className="text-3xl font-bold">{stats.scheduled}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-1">
              {[
                { key: 'today', label: 'Hôm nay' },
                { key: 'upcoming', label: 'Sắp tới' },
                { key: 'completed', label: 'Đã hoàn thành' }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeTab === tab.key ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Tìm kiếm bệnh nhân hoặc lý do tư vấn..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Consultation List */}
      <Card>
        <CardHeader>
          <CardTitle>
            Danh sách tư vấn ({filteredConsultations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">{consultation.patientName}</p>
                      <p className="text-sm text-gray-500">ID: {consultation.patientId}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Thời gian</p>
                      <p className="text-sm text-gray-600">
                        {new Date(consultation.appointmentDate).toLocaleDateString('vi-VN', { 
                          day: '2-digit', 
                          month: '2-digit' 
                        })} - {consultation.appointmentTime}
                      </p>
                      <p className="text-xs text-gray-500">{consultation.duration} phút</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Loại</p>
                      {getTypeBadge(consultation.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Trạng thái</p>
                      {getStatusBadge(consultation.status)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Ưu tiên</p>
                      {getPriorityBadge(consultation.priority)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Lý do</p>
                      <p className="text-sm text-gray-600">{consultation.reason}</p>
                      {consultation.notes && (
                        <p className="text-xs text-gray-500 mt-1">{consultation.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    {consultation.status === 'scheduled' && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStartConsultation(consultation.id, consultation.type)}
                      >
                        Bắt đầu
                      </Button>
                    )}
                    {consultation.status === 'in-progress' && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleCompleteConsultation(consultation.id)}
                      >
                        Hoàn thành
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast({
                        title: "Chi tiết tư vấn",
                        description: `Xem chi tiết tư vấn với ${consultation.patientName}`,
                      })}
                    >
                      Chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredConsultations.length === 0 && (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Không có cuộc tư vấn nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorConsultation; 