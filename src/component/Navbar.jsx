import React from "react";
import {useAuth} from "../Context/AuthContext ";
import "../css/Navbar.css";
import { FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="menu-toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>
      <div className="navbar-logo">Savtech Admin Panel</div>
      <nav className="navbar-links">
        <div className="navbtn">
          <button onClick={logout}>Logout</button>
        </div>
        <div className="welcome-text">Welcome, {user && user.name}</div>
      </nav>
    </header>
  );
};

export default Navbar;
