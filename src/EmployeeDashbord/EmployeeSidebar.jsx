import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers } from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { MdSurfing } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import {useAuth} from '../Context/AuthContext ';
import "../css/AdminSidebar.css"; // ✅ Reuse admin sidebar styles

const EmployeeSidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <>
      {/* Toggle Button (for mobile only) */}
      <button className="menu-button" onClick={toggleSidebar}>
        <FaUsers />
      </button>

      <div className={`admin-sidebar ${isSidebarOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          <h3>Employee Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/Employeedashbord" className={getLinkClass}>
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to={`/Employeedashbord/profile/${user?._id}`} className={getLinkClass}>
            <FaUsers className="nav-icon" />
            <span>Profile</span>
          </NavLink>

          <NavLink to={`/Employeedashbord/leaves/${user._id}`} className={getLinkClass}>
            <FcLeave className="nav-icon" />
            <span>Leave</span>
          </NavLink>

          <NavLink to={`/Employeedashbord/salary/${user?._id}`} className={getLinkClass}>
            <MdSurfing className="nav-icon" />
            <span>Salary</span>
          </NavLink>

          <NavLink to="/Employeedashbord/setting" className={getLinkClass}>
            <IoIosSettings className="nav-icon" />
            <span>Settings</span>
          </NavLink>

          <NavLink to="/Employeedashbord/Punching" className={getLinkClass}>
            <IoIosSettings className="nav-icon" />
            <span>Punching</span>
          </NavLink>
        </nav>
      </div>
    </>
  );
};

export default EmployeeSidebar;
