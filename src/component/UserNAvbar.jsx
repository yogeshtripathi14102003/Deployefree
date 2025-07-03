import React, { useState, useRef, useEffect } from 'react';
// import { useAuth } from '../Context/AuthContext';
import { useAuth } from '../Context/AuthContext ';
import { NavLink } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaUsers } from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { MdSurfing } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import '../css/userNavbar.css';

const UserNavbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const { user, logout } = useAuth();

  const getLinkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-logo">Savtech User Panel</div>

      <nav className="navbar-links">
        <div className="navbtn">
          <button onClick={logout}>Logout</button>
        </div>
        <div className="welcome-text">Welcome, {user && user.name}</div>
      </nav>
{/* 
      <button className="menu-button" onClick={toggleDropdown}>
        <FaBars />
      </button> */}

      {isDropdownOpen && (
        <div className="dropdown-menu" ref={dropdownRef}>
          <NavLink to="/Employeedashbord" className={getLinkClass}>
            <FaTachometerAlt className="nav-icon" />
            <span>Dashboard</span>
          </NavLink>
{/* 
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
            */}
        </div>
      )}
    </header>
  );
};

export default UserNavbar;
