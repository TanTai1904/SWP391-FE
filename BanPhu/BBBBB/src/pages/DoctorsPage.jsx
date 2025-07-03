import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { UserCheck } from "lucide-react";

const doctors = [
  {
    image: "/images/doctor1.jpg",
    name: "Dr. Nguyễn Văn A",
    specialty: "Chuyên khoa HIV/AIDS",
    bio: "Bác sĩ giàu kinh nghiệm, tận tâm với bệnh nhân.",
  },
  {
    image: "/images/doctor2.jpg",
    name: "Dr. Trần Thị B",
    specialty: "Chuyên khoa Nội",
    bio: "Chuyên gia điều trị các bệnh nội khoa.",
  },
  {
    image: "/images/doctor3.jpg",
    name: "Dr. Lê Văn C",
    specialty: "Chuyên khoa HIV/AIDS",
    bio: "Luôn cập nhật các phương pháp điều trị mới.",
  },
];

const DoctorsPage = () => (
  <>
    <Header />
    <main className="bg-slate-50 min-h-[80vh] py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-10">
          Đội ngũ bác sĩ
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {doctors.map((doctor, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-lg transition border border-slate-100"
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
              <p className="text-slate-500 text-xs mb-2">{doctor.bio}</p>
              <button className="mt-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center gap-2">
                <UserCheck className="h-4 w-4" /> Đặt lịch khám
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default DoctorsPage;
