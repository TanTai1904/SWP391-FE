import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from "../../lib/utils";
import {
  Users,
  Calendar,
  Shield,
  MessageSquare,
  BarChart3,
  Settings,
  Activity,
  FileText,
  Home
} from 'lucide-react';

const navigation = [
  { name: 'Trang chủ', href: '/doctor', icon: Home },
  { name: 'Quản lý bệnh nhân', href: '/doctor/patients', icon: Users },
  { name: 'Lịch làm việc', href: '/doctor/schedule', icon: Calendar },
  { name: 'Phác đồ ARV', href: '/doctor/arv-regimen', icon: Shield },
  { name: 'Tư vấn & Hẹn khám', href: '/doctor/consultation', icon: MessageSquare },
  { name: 'Báo cáo', href: '/doctor/reports', icon: BarChart3 },
  { name: 'Thông tin bác sĩ', href: '/doctor/profile', icon: Settings },
];

const DoctorSidebar = () => {
  const location = useLocation();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-2 mr-3">
            <Activity className="h-6 w-6" />
          </div>
          <span className="text-lg font-semibold text-gray-900">Menu</span>
        </div>
        <div className="mt-8 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-r-4 border-blue-600 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-l-lg transition-all duration-200'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-5 w-5'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default DoctorSidebar; 