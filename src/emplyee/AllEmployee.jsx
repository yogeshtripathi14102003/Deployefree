

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../css/Empview.css"; // Your styling file (optional)

const AllEmployee = () => {
  const { id } = useParams(); // grabs employee id from URL
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        if (!id) {
          throw new Error("Invalid employee ID");
        }

        const response = await axios.get(`http://localhost:5000/v1/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setEmployee(response.data.employee);
        } else {
          throw new Error(response.data.error || "Unknown error occurred");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        alert(error.response?.data?.error || error.message || "Failed to fetch employee");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!employee) return <div>No employee data found.</div>;

  return (
    <div className="employee-container">
      <h2 className="employee-title">Employee Details</h2>
      <div className="employee-grid">
        <div>
          <img
            src={`http://localhost:5000/${employee.userId?.profileImage}`}
            alt="Profile"
            className="employee-image"
          />
        </div>
        <div>
          <div className="employee-row"><p className="label">Name:</p><p className="value">{employee.userId?.name}</p></div>
          <div className="employee-row"><p className="label">Email:</p><p className="value">{employee.userId?.email}</p></div>
          <div className="employee-row"><p className="label">Role:</p><p className="value">{employee.userId?.role}</p></div>
          <div className="employee-row"><p className="label">Employee ID:</p><p className="value">{employee.employeeId}</p></div>
          <div className="employee-row"><p className="label">Date of Birth:</p><p className="value">{new Date(employee.dob).toLocaleDateString()}</p></div>
           <div className="employee-row"><p className="label">DOJ:</p><p className="value">{new Date(employee.doj).toLocaleDateString()}</p></div>
          <div className="employee-row"><p className="label">Gender:</p><p className="value">{employee.gender}</p></div>
          <div className="employee-row"><p className="label">Marital Status:</p><p className="value">{employee.maritalStatus}</p></div>
          <div className="employee-row"><p className="label">Department:</p><p className="value">{employee.department?.dep_name}</p></div>
          <div className="employee-row"><p className="label">Designation:</p><p className="value">{employee.designation}</p></div>

          <div className="employee-row"><p className="label">Address:</p><p className="value">{employee.address}</p></div>
          <div className="employee-row"><p className="label">PAN:</p><p className="value">{employee.PAN}</p></div>
          <div className="employee-row"><p className="label">Aadhar:</p><p className="value">{employee.Aadhar}</p></div>
          <div className="employee-row"><p className="label">UAN:</p><p className="value">{employee.uan}</p></div>
          <div className="employee-row"><p className="label">PF No:</p><p className="value">{employee.pfno}</p></div>
          <div className="employee-row"><p className="label">Bank Account:</p><p className="value">{employee.bankAccount}</p></div>
          <div className="employee-row"><p className="label">Bank Name:</p><p className="value">{employee.bankName}</p></div>
        </div>
      </div>
    </div>
  );
};

export default AllEmployee;
