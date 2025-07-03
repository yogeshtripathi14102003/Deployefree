import React, { useEffect, useState } from "react";
import "../css/EmployeeForm.css";
import { fetchDepartments } from "../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function Edit() {
  const [employee, setEmployee] = useState({
    name: "",
    maritalStatus: "",
    designation: "",
    salary: "",
    department: "",
  });
  const [departments, setDepartments] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch departments on mount
  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  // Fetch employee details on mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          const emp = response.data.employee;
          setEmployee({
            name: emp.userId?.name || "",
            maritalStatus: emp.maritalStatus || "",
            designation: emp.designation || "",
            salary: emp.salary || "",
            department: emp.department?._id || "",
          });
        }
      } catch (error) {
        const message = error.response?.data?.error || "Error fetching employee.";
        alert(message);
      }
    };

    fetchEmployee();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        `http://localhost:5000/v1/up/${id}`,
        employee,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Employee updated successfully.");
        navigate("/adminDashbord/employees");
      } else {
        alert("Failed to update employee.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      const message = error.response?.data?.error || "An error occurred while submitting the form.";
      alert(message);
    }
  };
   
  return (
    <>
      {departments ? (
        <div className="employee-form-card">
          <div className="employee-form-content">
            <h2 className="employee-form-title">Edit Employee</h2>
            <form onSubmit={handleSubmit} className="employee-form">
              <input
                type="text"
                name="name"
                value={employee.name}
                placeholder="Name"
                onChange={handleChange}
                required
              />

              <select
                name="maritalStatus"
                onChange={handleChange}
                value={employee.maritalStatus}
                required
              >
                <option value="">Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
              </select>

              <input
                type="text"
                name="designation"
                value={employee.designation}
                placeholder="Designation"
                onChange={handleChange}
                required
              />
              <input
                type="number"
                name="salary"
                value={employee.salary}
                placeholder="Salary"
                onChange={handleChange}
                required
              />

              <select
                name="department"
                value={employee.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dep) => (
                  <option key={dep._id} value={dep._id}>
                    {dep.dep_name}
                  </option>
                ))}
              </select>

              <div className="button-group">
                <button type="submit" className="employee-submit-button">
                  Edit Employee
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </>
  );
}
