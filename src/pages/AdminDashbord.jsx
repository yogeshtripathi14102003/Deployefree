import React, { useState } from "react";
import AdminSidebar from "../component/AdminSidebar";
import Navbar from "../component/Navbar";
import '../css/AdminLayout.css';
import { Outlet } from "react-router-dom";

const AdminDashbord = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="admin-body">
        <AdminSidebar isSidebarOpen={isSidebarOpen} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashbord;
