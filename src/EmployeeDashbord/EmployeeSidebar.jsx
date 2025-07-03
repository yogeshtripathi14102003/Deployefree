import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBars } from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { MdSurfing } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

// import { useAuth } from "../Context/AuthContext";
import { useAuth} from "../Context/AuthContext ";
const EmployeeSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const { user } = useAuth();
  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";
  return (
    <>
      {/* Mobile menu button */}
      <button className="menu-button" onClick={toggleSidebar}>
        <FaBars />
      </button>
      <div className={`employee-sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>Employee Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/Employeedashbord" className={getLinkClass}>
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to={`/Employeedashbord/profile/${user?._id}`}
            className={getLinkClass}
          >
            <FaUsers className="nav-icon" />
            <span>Profile</span>
          </NavLink>
          <NavLink to={`/Employeedashbord/leaveses/${user._id}`} className={getLinkClass}>
            <FcLeave className="nav-icon" />
            <span> User Leave</span>
          </NavLink>
          <NavLink
            to={`/Employeedashbord/salary/${user?._id}`}
            className={getLinkClass}
          >
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
