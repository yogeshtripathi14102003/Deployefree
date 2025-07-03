import React, { useState } from "react";
import "../css/AddDepartment.css"; // External CSS
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDepartment = () => {
  const [department, setDepartment] = useState({
    dep_name: "",
    description: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartment({ ...department, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/v1/department/add", // ✅ Remove extra space after `/add`
        department,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Add space after 'Bearer'
          },
        }
      );

      if (response.data.success) {
        navigate("/AdminDashbord/AdminDepartment"); // ✅ Route name corrected
      }
    } catch (error) {
      // ✅ Fix typo: `responsse` → `response`, and check `error.message`
      if (error.response && error.response.data?.error) {
        alert(error.response.data.error);
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="add-department-container">
      <div className="add-department-form-wrapper">
        <h3 className="form-title">Add Department</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="dep_name" className="form-label">
              Department Name
            </label>
            <input
              type="text"
              name="dep_name"
              onChange={handleChange}
              placeholder="Enter Department Name"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Description"
              onChange={handleChange}
              className="form-textarea"
              rows="4"
            ></textarea>
          </div>

          <button type="submit" className="submit-button">
            Add Department
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
