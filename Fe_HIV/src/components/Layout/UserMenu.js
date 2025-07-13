import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DEFAULT_AVATAR = 'https://cdn.sforum.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg';

const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }; 

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-red-600 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center">
          <img
            src={user?.avatar || DEFAULT_AVATAR}
            alt={user?.fullName || user?.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_AVATAR;
            }}
          />
        </div>
        <span className="text-sm font-medium">
          {user?.fullName || user?.username}
        </span>
        <svg
          className={`h-5 w-5 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
            onClick={() => setIsOpen(false)}
          >
            Thông tin cá nhân
          </Link>
          {/* Chỉ hiển thị link đặt lịch cho patient */}
          {user?.userRole === 'Patient' && (
            <Link
              to="/appointments/create"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Tạo lịch hẹn
            </Link>
          )}
          {user?.userRole === 'Patient' && (
            <Link
              to="/appointments/list"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Danh sách lịch hẹn
            </Link>
          )}
          {user?.userRole === 'Doctor' && (
            <Link
              to="/appointments/management"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Danh sách lịch hẹn
            </Link>
          )}
          {user?.userRole === 'Admin' && (
            <Link
              to="/appointments/management"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Danh sách lịch hẹn
            </Link>
          )}
          {user?.userRole === 'Staff' && (
            <Link
              to="/appointments/management"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
              onClick={() => setIsOpen(false)}
            >
              Danh sách lịch hẹn
            </Link>
          )}
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu; 