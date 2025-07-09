import React from 'react';
import NewDoctorLayout from './NewDoctorLayout';
import Consultation from './Consultation';

const ConsultationPage = () => {
  return (
    <NewDoctorLayout breadcrumbs={<span>Lịch hẹn tư vấn</span>}>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
        <Consultation />
      </div>
    </NewDoctorLayout>
  );
};

export default ConsultationPage;
