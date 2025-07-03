import React from "react";

const Footer = () => (
  <footer className="bg-gray-800 text-gray-300 py-8 px-8 mt-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="footer-section">
        <h3 className="text-lg font-semibold text-white mb-4">Về chúng tôi</h3>
        <p className="text-sm">
          Hệ thống chăm sóc và điều trị HIV chuyên nghiệp.
        </p>
      </div>
      <div className="footer-section">
        <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
        <p className="text-sm">Email: contact@hivcare.com</p>
      </div>
      <div className="footer-section">
        <h3 className="text-lg font-semibold text-white mb-4">Theo dõi</h3>
        <div className="flex space-x-4">
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Instagram
          </a>
        </div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500">
      <p>&copy; 2024 HIV Care Center. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
