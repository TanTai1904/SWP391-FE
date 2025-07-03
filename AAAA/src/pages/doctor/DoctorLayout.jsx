import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DoctorHeader from './DoctorHeader';
import DoctorSidebar from './DoctorSidebar';
import { useToast } from "../../hooks/use-toast";

const DoctorLayout = () => {
  const [notificationCount, setNotificationCount] = useState(3);
  const { toast } = useToast();

  const handleNotificationClick = () => {
    toast({
      title: "Thông báo",
      description: `Bạn có ${notificationCount} thông báo mới`,
    });
    setNotificationCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DoctorHeader 
        onNotificationClick={handleNotificationClick}
        notificationCount={notificationCount}
      />
      <div className="flex">
        <DoctorSidebar />
        <main className="flex-1 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorLayout; 