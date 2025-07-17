import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { FcDepartment, FcLeave } from "react-icons/fc";
import { MdSurfing } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import "../css/AdminSidebar.css";

const AdminSidebar = ({ isSidebarOpen }) => {
  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <div className={`admin-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
      <div className="sidebar-header">
        <h3>Employee Savtech</h3>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/AdminDashbord" className={getLinkClass}>
          <FaTachometerAlt className="nav-icon" />
          <span>Admin Dashboard</span>
        </NavLink>
        <NavLink to="/admindashbord/employees" className={getLinkClass}>
          <FaUsers className="nav-icon" />
          <span>Employee</span>
        </NavLink>
        <NavLink to="/AdminDashbord/AdminDepartment" className={getLinkClass}>
          <FcDepartment className="nav-icon" />
          <span>Department</span>
        </NavLink>
        <NavLink to="/adminDashbord/leaves" className={getLinkClass}>
          <FcLeave className="nav-icon" />
          <span>Leave</span>
        </NavLink>
        <NavLink to="/AdminDashbord/salary/Add" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>Salary</span>
        </NavLink>
        <NavLink to="/AdminDashbord/salary/AddEmployeeSalary" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>Add Employee Salary</span>
        </NavLink>
        <NavLink to="/AdminDashbord/salary/GetallSalary" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>Add the complete salary </span>
        </NavLink>
        <NavLink to="/AdminDashbord/salary/ViewAllSalary" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>View All Salary</span>
        </NavLink>
        <NavLink to="/AdminDashbord/getallpunching" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>Get All Punch</span>
        </NavLink>
        <NavLink to="/adminDashbord/salary/AttendanceSheet" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>AttendanceSheet</span>
        </NavLink>
        <NavLink to="/adminDashbord/salary/WageRegisterTable" className={getLinkClass}>
          <MdSurfing className="nav-icon" />
          <span>WAGE REGISTER</span>
        </NavLink>
        <NavLink to="/adminDashbord/setting" className={getLinkClass}>
          <IoIosSettings className="nav-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
