import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
  CalendarCheck,
  UserCheck,
  Bell,
  MessageSquare,
  Stethoscope,
} from "lucide-react";

const services = [
  {
    icon: <CalendarCheck className="h-8 w-8 text-blue-600" />,
    title: "Đặt lịch khám",
    description: "Đặt lịch khám và điều trị HIV với bác sĩ chuyên môn",
  },
  {
    icon: <Stethoscope className="h-8 w-8 text-green-600" />,
    title: "Theo dõi điều trị",
    description: "Tra cứu thông tin xét nghiệm và lịch sử điều trị",
  },
  {
    icon: <Bell className="h-8 w-8 text-orange-500" />,
    title: "Nhắc nhở",
    description: "Hệ thống nhắc nhở lịch tái khám và uống thuốc",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-purple-600" />,
    title: "Tư vấn trực tuyến",
    description: "Đặt lịch tư vấn trực tuyến với bác sĩ",
  },
];

const doctors = [
  {
    image: "/images/doctor1.jpg",
    name: "Dr. Nguyễn Văn A",
    specialty: "Chuyên khoa HIV/AIDS",
    schedule: "Lịch khám: Thứ 2, Thứ 3, Thứ 4",
  },
  {
    image: "/images/doctor2.jpg",
    name: "Dr. Trần Thị B",
    specialty: "Chuyên khoa Nội",
    schedule: "Lịch khám: Thứ 3, Thứ 5, Thứ 6",
  },
  {
    image: "/images/doctor3.jpg",
    name: "Dr. Lê Văn C",
    specialty: "Chuyên khoa HIV/AIDS",
    schedule: "Lịch khám: Thứ 4, Thứ 6, Thứ 7",
  },
];

const HomePage = () => {
  return (
    <>
      <Header />
      <main className="bg-slate-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-400 text-white py-20 px-4 flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-center z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
              Chăm sóc sức khỏe toàn diện
            </h1>
            <p className="text-lg md:text-xl mb-8 font-medium drop-shadow">
              Hệ thống chăm sóc và điều trị HIV chuyên nghiệp, bảo mật và tận
              tâm
            </p>
            <Link
              to="/appointment"
              className="inline-block px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold text-lg shadow hover:bg-blue-50 transition"
            >
              Đặt lịch ngay
            </Link>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
        </section>

        {/* Services Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
              Dịch vụ của chúng tôi
            </h2>
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
                  <p className="text-slate-600 text-sm">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Doctors Section */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
              Đội ngũ bác sĩ chuyên môn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {doctors.map((doctor, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition border border-slate-100"
                >
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 mb-4 shadow"
                  />
                  <h3 className="font-semibold text-lg text-slate-900 mb-1">
                    {doctor.name}
                  </h3>
                  <p className="text-blue-700 font-medium mb-1 text-sm">
                    {doctor.specialty}
                  </p>
                  <p className="text-slate-500 text-xs">{doctor.schedule}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
