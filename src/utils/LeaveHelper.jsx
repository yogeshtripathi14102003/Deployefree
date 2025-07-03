import { useNavigate } from "react-router-dom";
import React from "react";
export const columns = [
  {
    name: "S No",
    selector: (row) => row.sno,
    width: "70px",
  },
  {
    name: "Emp ID",
    selector: (row) => row.employeeId,
    width: "120px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    width: "120px",
  },
  {
    name: "Leave Type",
    selector: (row) => row.leaveType,
    width: "140px",
  },
  {
    name: "Department",
    selector: (row) => row.department,
    width: "170px",
  },
  {
    name: "Days",
    selector: (row) => row.days,
    width: "70px",
  },
  {
    name: "Status",
    selector: (row) => row.status,
    width: "120px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    // center: true,
  },
];


export const Leavebuttons = ({ Id }) => {
  const navigate = useNavigate();
  const handleView = () => {
    navigate(`/admindashbord/leaves/${Id}`);
  };

  return (
   <button
  style={{
    backgroundColor: "#4caf50",  // Green background
    color: "white",              // White text
    border: "none",
    padding: "8px 16px",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
  onClick={handleView}
>
  View
</button>

    
  );
  
};

