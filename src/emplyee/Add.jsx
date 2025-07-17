import React, { useEffect, useState } from "react";
import "../css/EmployeeForm.css";
import { fetchDepartments } from "../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    employeeId: "",
    dob: "",
    doj: "", // ✅ Correct key for DOJ
    gender: "",
    maritalStatus: "",
    designation: "",
    department: "",
    password: "",
    PAN: "",
    Aadhar: "",
    address: "",
    uan: "",
    pfno: "",
    bankAccount: "",
    bankName: "",
    role: "",
    profileImage: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/create",
        formDataObj,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        alert("Employee added successfully.");
        navigate("/adminDashbord/employees");
      } else {
        alert("Failed to add employee.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      } else {
        alert("An error occurred while submitting the form.");
      }
    }
  };

  return (
    <div className="employee-form-card">
      <div className="employee-form-content">
        <h2 className="employee-form-title">Add an Employee</h2>
        <form
          onSubmit={handleSubmit}
          className="employee-form"
          encType="multipart/form-data"
        >
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="text" name="employeeId" placeholder="Employee ID" onChange={handleChange} required />
          
          <label>
            DOB:
            <input type="date" name="dob" onChange={handleChange} required />
          </label>

          <label>
            DOJ:
            <input type="date" name="doj" onChange={handleChange} required />
          </label>

          <select name="gender" onChange={handleChange} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select name="maritalStatus" onChange={handleChange} required>
            <option value="">Marital Status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
          </select>

          <select name="department" onChange={handleChange} required>
            <option value="">Select Department</option>
            {departments.map((dep) => (
              <option key={dep._id} value={dep._id}>
                {dep.dep_name}
              </option>
            ))}
          </select>

          <input type="text" name="designation" placeholder="Designation" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
          <input type="number" name="Aadhar" placeholder="Aadhar" onChange={handleChange} required />
          <input type="number" name="uan" placeholder="UAN" onChange={handleChange} required />
          <input type="number" name="pfno" placeholder="PF Number" onChange={handleChange} required />
          <input type="text" name="PAN" placeholder="PAN" onChange={handleChange} required />
          <input type="number" name="bankAccount" placeholder="Bank Account" onChange={handleChange} required />
          <input type="text" name="bankName" placeholder="Bank Name" onChange={handleChange} required />

          <select name="role" onChange={handleChange} required>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>

          <input type="file" name="profileImage" onChange={handleChange} accept="image/*" />

          <div className="button-group">
            <button type="submit" className="employee-submit-button">
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
