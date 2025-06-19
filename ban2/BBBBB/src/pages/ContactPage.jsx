import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, User } from "lucide-react";

const ContactPage = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <>
      <Header />
      <main className="min-h-[80vh] flex items-center justify-center bg-slate-50">
        <form
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg space-y-6"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
            Liên hệ với chúng tôi
          </h2>
          {success && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-2 text-sm">
              Gửi liên hệ thành công!
            </div>
          )}
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Họ và tên
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="text"
                name="name"
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
              <input
                type="email"
                name="email"
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Nội dung
            </label>
            <textarea
              name="message"
              className="pr-4 py-2 rounded-lg border border-slate-200 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              value={form.message}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Gửi liên hệ
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
};

export default ContactPage;
