import React from "react";
import { MessageSquare } from "lucide-react";

const ConsultationPage = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center py-10 px-2">
    <div className="w-full max-w-3xl">
      {/* Section Header */}
      <div className="flex items-center gap-4 mb-8 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-6 shadow">
        <div className="bg-orange-600 rounded-full p-3 flex items-center justify-center shadow">
          <MessageSquare className="h-8 w-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-orange-900 mb-1">Tư vấn & đặt lịch hẹn</h1>
          <p className="text-slate-600 text-lg">
            Xem các lịch hẹn tư vấn, chat hoặc video call với bệnh nhân.
          </p>
        </div>
      </div>
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center text-slate-400 border border-slate-100">
        <span className="text-lg">Chức năng tư vấn & đặt lịch hẹn sẽ được phát triển tại đây.</span>
      </div>
    </div>
  </div>
);

export default ConsultationPage; 