import React from "react";
import { Settings } from "lucide-react";

const DoctorProfilePage = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
    <div className="w-full max-w-3xl">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-6 shadow">
        <div className="bg-slate-600 rounded-full p-3 flex items-center justify-center shadow">
          <Settings className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-1">Quản lý thông tin bác sĩ</h1>
          <p className="text-slate-600 text-lg">
            Quản lý hồ sơ cá nhân, bằng cấp, chuyên môn của bác sĩ.
          </p>
        </div>
      </div>
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-slate-400 border border-slate-100">
        <span className="text-lg">Chức năng quản lý thông tin bác sĩ sẽ được phát triển tại đây.</span>
      </div>
    </div>
  </div>
);

export default DoctorProfilePage; 