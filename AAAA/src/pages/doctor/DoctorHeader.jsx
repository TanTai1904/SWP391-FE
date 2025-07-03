import React, { useEffect, useState } from 'react';
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Bell,
  Activity,
  Settings,
  UserCheck
} from 'lucide-react';
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../contexts/AuthContext";
import doctorService from "../../services/doctorService";

const DoctorHeader = ({ onNotificationClick, notificationCount }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    if (user?.doctorId) {
      doctorService.getDoctorById(user.doctorId).then(setDoctor).catch(console.error);
    }
  }, [user]);

  const handleProfileClick = () => {
    toast({
      title: "Thông tin bác sĩ",
      description: "Đang chuyển đến trang quản lý thông tin cá nhân...",
    });
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">HIV Care System</span>
              <p className="text-xs text-gray-500">Hệ thống điều trị HIV</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative hover:bg-blue-50"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center p-0">
                  {notificationCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleProfileClick}>
              <Settings className="h-4 w-4 mr-2" />
              Cài đặt
            </Button>
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <UserCheck className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">{doctor?.fullName ? `Dr. ${doctor.fullName}` : "Bác sĩ"}</span>
                <p className="text-xs text-gray-500">Bác sĩ chuyên khoa</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DoctorHeader; 