import React from "react";

import {useAuth} from '../Context/AuthContext ';
import "../css/Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="menu-toggle" onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </div>
      <div className="navbar-logo">Savtech Admin Panel</div>
      <nav className="navbar-links">
        <div className="welcome-text">
          Welcome{user?.name ? `, ${user.name}` : ""}
        </div>
        <button onClick={logout}>Logout</button>
      </nav>
    </header>
  );
};

export default Navbar;
