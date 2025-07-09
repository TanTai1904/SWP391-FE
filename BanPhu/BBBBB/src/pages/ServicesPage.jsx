import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { CalendarCheck, Stethoscope, Bell, MessageSquare } from "lucide-react";

const services = [
  {
    icon: <CalendarCheck className="h-8 w-8 text-blue-600" />,
    title: "Đặt lịch khám",
    description: "Đặt lịch khám và điều trị HIV với bác sĩ chuyên môn.",
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-green-600" />,
    title: "Theo dõi điều trị",
    description: "Tra cứu thông tin xét nghiệm và lịch sử điều trị.",
  },
  {
    icon: <Bell className="h-8 w-8 text-orange-500" />,
    title: "Nhắc nhở",
    description: "Hệ thống nhắc nhở lịch tái khám và uống thuốc.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
    title: "Tư vấn trực tuyến",
    description: "Đặt lịch tư vấn trực tuyến với bác sĩ.",
  },
];

const ServicesPage = () => (
  <>
    <Header />
    <main className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
          Dịch vụ
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center hover:shadow-xl transition group border border-slate-100"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform">
                {service.icon}
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">
                {service.title}
              </h3>
              <p className="text-slate-600 text-sm">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default ServicesPage;
