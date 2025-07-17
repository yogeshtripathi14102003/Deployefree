import React, { useState } from "react";
import EmployeeSidebar from "../EmployeeDashbord/EmployeeSidebar";
import UserNAvbar from "../component/UserNAvbar";
import '../css/AdminLayout.css';
import { Outlet } from "react-router-dom";

const EmployeeDashbord = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`admin-layout ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <UserNAvbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="admin-body">
        <EmployeeSidebar isSidebarOpen={isSidebarOpen} />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeDashbord;
