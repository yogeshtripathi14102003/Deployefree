import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import '../css/Empview.css'; // Import the external CSS

const Profile = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setEmployee(response.data.employee);
        }
      } catch (error) {
        const message = error.response?.data?.error || "Error fetching employee.";
        alert(message);
      }
    };

    fetchEmployee();
  }, [id]);

  return (
    <>
      {employee ? (
        <div className="employee-container">
          <h2 className="employee-title">Employee Details</h2>
          <div className="employee-grid">
            <div>
              <img
                src={`http://localhost:5000/${employee.userId.profileImage}`}
                alt="Profile"
                className="employee-image"
              />
            </div>
            <div>
              <div className="employee-row">
                <p className="label">Name:</p>
                <p className="value">{employee.userId.name}</p>
              </div>
              <div className="employee-row">
                <p className="label">Employee ID:</p>
                <p className="value">{employee.employeeId}</p>
              </div>
              <div className="employee-row">
                <p className="label">Date of Birth:</p>
                <p className="value">
                  {new Date(employee.dob).toLocaleDateString()}
                </p>
              </div>
              <div className="employee-row">
                <p className="label">Gender:</p>
                <p className="value">{employee.gender}</p>
              </div>
              <div className="employee-row">
                <p className="label">Department:</p>
                <p className="value">{employee.department?.dep_name}</p>
              </div>
              <div className="employee-row">
                <p className="label">Marital Status:</p>
                <p className="value">{employee.maritalStatus}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Profile;
