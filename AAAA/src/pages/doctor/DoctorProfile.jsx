import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useToast } from "../../hooks/use-toast";
import { 
  Settings, 
  User,
  FileText,
  Award,
  Clock,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  Camera
} from 'lucide-react';

const initialDoctorInfo = {
  id: 'DOC001',
  name: 'Nguyễn Văn A',
  title: 'Bác sĩ chuyên khoa',
  specialization: ['HIV/AIDS', 'Bệnh nhiễm trùng', 'Y học gia đình'],
  email: 'dr.nguyenvana@hospital.com',
  phone: '0901234567',
  address: '123 Đường ABC, Quận 1, TP.HCM',
  licenseNumber: 'BS-12345-2020',
  experience: 8,
  education: [
    'Bác sĩ Y khoa - Đại học Y Dược TP.HCM (2016)',
    'Thạc sĩ Y học - Đại học Y Dược TP.HCM (2018)',
    'Chuyên khoa cấp I - Bệnh nhiễm trùng (2020)'
  ],
  certifications: [
    'Chứng chỉ điều trị HIV/AIDS',
    'Chứng chỉ tư vấn tâm lý',
    'Chứng chỉ cấp cứu tim mạch',
    'Chứng chỉ tiếng Anh y khoa'
  ],
  workingHours: 'Thứ 2 - Thứ 7: 8:00 - 17:00',
  languages: ['Tiếng Việt', 'Tiếng Anh'],
  bio: 'Bác sĩ Nguyễn Văn A có 8 năm kinh nghiệm trong lĩnh vực điều trị HIV/AIDS và các bệnh nhiễm trùng. Tốt nghiệp xuất sắc từ Đại học Y Dược TP.HCM và có nhiều năm làm việc tại các bệnh viện tuyến đầu.',
  joinDate: '2020-03-15'
};

const DoctorProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [doctorInfo, setDoctorInfo] = useState(initialDoctorInfo);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin bác sĩ đã được cập nhật",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    toast({
      title: "Đã hủy",
      description: "Các thay đổi đã được hủy bỏ",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Đổi mật khẩu",
      description: "Đang mở form đổi mật khẩu...",
    });
  };

  const handleUpdateAvatar = () => {
    toast({
      title: "Cập nhật ảnh đại diện",
      description: "Đang mở chức năng chọn ảnh...",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-8 w-8 mr-3 text-gray-600" />
            Quản lý thông tin bác sĩ
          </h1>
          <p className="text-gray-600 mt-2">Quản lý hồ sơ cá nhân và thông tin chuyên môn</p>
        </div>
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleCancel} variant="outline">
                Hủy
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1 space-y-6">
          {/* Basic Info Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-white" />
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 rounded-full p-2 h-8 w-8"
                  onClick={handleUpdateAvatar}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{doctorInfo.name}</h2>
              <p className="text-gray-600">{doctorInfo.title}</p>
              <div className="flex justify-center mt-2">
                <Badge className="bg-blue-100 text-blue-700">
                  {doctorInfo.experience} năm kinh nghiệm
                </Badge>
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {doctorInfo.email}
                </div>
                <div className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {doctorInfo.phone}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thống kê nhanh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Bệnh nhân đang theo dõi</span>
                <span className="font-bold text-blue-600">247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Cuộc hẹn tháng này</span>
                <span className="font-bold text-green-600">156</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tỷ lệ hài lòng</span>
                <span className="font-bold text-purple-600">4.8/5.0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ngày tham gia</span>
                <span className="font-medium text-gray-900">
                  {new Date(doctorInfo.joinDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thao tác</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleChangePassword}
              >
                <Settings className="h-4 w-4 mr-2" />
                Đổi mật khẩu
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Cài đặt thông báo",
                  description: "Đang mở cài đặt thông báo...",
                })}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Cài đặt thông báo
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => toast({
                  title: "Lịch sử hoạt động",
                  description: "Đang tải lịch sử hoạt động...",
                })}
              >
                <Clock className="h-4 w-4 mr-2" />
                Lịch sử hoạt động
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  {isEditing ? (
                    <Input
                      value={doctorInfo.name}
                      onChange={(e) => setDoctorInfo({...doctorInfo, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{doctorInfo.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chức danh
                  </label>
                  {isEditing ? (
                    <Input
                      value={doctorInfo.title}
                      onChange={(e) => setDoctorInfo({...doctorInfo, title: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{doctorInfo.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={doctorInfo.email}
                      onChange={(e) => setDoctorInfo({...doctorInfo, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{doctorInfo.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại
                  </label>
                  {isEditing ? (
                    <Input
                      value={doctorInfo.phone}
                      onChange={(e) => setDoctorInfo({...doctorInfo, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900">{doctorInfo.phone}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Địa chỉ
                </label>
                {isEditing ? (
                  <Input
                    value={doctorInfo.address}
                    onChange={(e) => setDoctorInfo({...doctorInfo, address: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900">{doctorInfo.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tiểu sử
                </label>
                {isEditing ? (
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    value={doctorInfo.bio}
                    onChange={(e) => setDoctorInfo({...doctorInfo, bio: e.target.value})}
                  />
                ) : (
                  <p className="text-gray-900">{doctorInfo.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-purple-600" />
                Thông tin chuyên môn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số giấy phép hành nghề
                  </label>
                  <p className="text-gray-900">{doctorInfo.licenseNumber}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kinh nghiệm
                  </label>
                  <p className="text-gray-900">{doctorInfo.experience} năm</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chuyên khoa
                </label>
                <div className="flex flex-wrap gap-2">
                  {doctorInfo.specialization.map((spec, index) => (
                    <Badge key={index} className="bg-purple-100 text-purple-700">
                      {spec}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngôn ngữ
                </label>
                <div className="flex flex-wrap gap-2">
                  {doctorInfo.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Giờ làm việc
                </label>
                <p className="text-gray-900">{doctorInfo.workingHours}</p>
              </div>
            </CardContent>
          </Card>

          {/* Education & Certifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-green-600" />
                  Học vấn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctorInfo.education.map((edu, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">{edu}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-orange-600" />
                  Chứng chỉ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {doctorInfo.certifications.map((cert, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-sm text-orange-800">{cert}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 