import React from "react";
import { Calendar } from "lucide-react";

const SchedulePage = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
    <div className="w-full max-w-3xl">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 shadow">
        <div className="bg-green-600 rounded-full p-3 flex items-center justify-center shadow">
          <Calendar className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-green-900 mb-1">Lịch làm việc</h1>
          <p className="text-slate-600 text-lg">
            Xem và cập nhật lịch làm việc của các bác sĩ.
          </p>
        </div>
      </div>
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-slate-400 border border-slate-100">
        <span className="text-lg">Chức năng lịch làm việc sẽ được phát triển tại đây.</span>
      </div>
    </div>
  </div>
);

export default SchedulePage; 