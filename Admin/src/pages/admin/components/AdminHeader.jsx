import React from "react";

const AdminHeader = ({ adminData, onLogout }) => {
  return (
    <header className="admin-header">
      <div className="admin-header-title">
        Hệ thống Quản trị Red Ribbon Life
      </div>
      <div className="admin-header-actions">
        {adminData && (
          <div className="admin-user-info">
            <span>{adminData.fullName || adminData.username}</span>
          </div>
        )}
        <button 
          className="admin-button-secondary" 
          onClick={onLogout}
        >
          Đăng xuất
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
