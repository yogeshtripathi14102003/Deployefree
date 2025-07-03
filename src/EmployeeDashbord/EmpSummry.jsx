import React from "react";
// import { useAuth } from "../Context/AuthContext";
import {useAuth} from "../Context/AuthContext ";
import { Link } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import { FcLeave } from "react-icons/fc";
import { MdSurfing } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";
import '../css/EmpSummary.css';
const EmpSummary = () => {
  const { user } = useAuth();

  const summaryData = [
    {
      title: "Profile",
      color: "tile-blue",
      icon: <FaUsers className="nav-icon" />,
      link: `/Employeedashbord/profile/${user?._id}`,
    },
    {
      title: "Leave",
      color: "tile-green",
      icon: <FcLeave className="nav-icon" />,
      link: `/Employeedashbord/leaves/${user?._id}`,
    },
    {
      title: "Salary",
      color: "tile-purple",
      icon: <MdSurfing className="nav-icon" />,
      link: `/Employeedashbord/salary/${user?._id}`,
    },
    {
      title: "Settings",
      color: "tile-orange",
      icon: <IoIosSettings className="nav-icon" />,
      link: "/Employeedashbord/setting",
    },
    {
      title: "Punching",
      color: "tile-yellow",
      icon: <IoIosSettings className="nav-icon" />,
      link: "/Employeedashbord/Punching",
    },
  ];

  return (
    <div className="dashboard">
      <h2 className="welcome-text">Welcome, {user?.name}</h2>
      <div className="grid-container">
        {summaryData.map((item, idx) => (
          <Link to={item.link} key={idx} className={`tile ${item.color}`}>
            <div className="icon">{item.icon}</div>
            <div className="title">{item.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EmpSummary;
