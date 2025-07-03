import React from "react";
// import '../css/MAincontant.css'
//  import AdminSummary from '../component/AdminSummary';
import { Outlet } from "react-router-dom";

// import Normal from "../EmployeeDashbord/Normal";
import UserNAvbar from "../component/UserNAvbar";
// import EmployeeSidebar from "../EmployeeDashbord/EmployeeSidebar";

const EmployeeDashbord = () => {
  return (
    <>
      <UserNAvbar />

      {/* <EmployeeSidebar /> */}
      {/* <div className="main-content">
  <Normal />
</div> */}

      {/* <AdminSummary />  */}
      <Outlet />
    </>
  );
};

export default EmployeeDashbord;
