import React, { useState } from "react";
import '../css/LeaveRequestForm.css'; // ✅ External CSS
import { useAuth } from "../Context/AuthContext ";
import { useNavigate } from "react-router-dom"; // ✅ Added missing import
import axios from "axios";

const AddLeave = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [leave, setLeave] = useState({
    userId: user._id, // ✅ Corrected key name if your backend expects this
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLeave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/v1/leave/add`,
        leave,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        
        alert ("Leave submitted successfully ")
        navigate('/Employeedashbord');
      }
    } catch (error) {
      
      const message = error.response?.data?.error || "Error submitting leave request.";
      alert(message);
    }
  };

  return (
    <div className="leave-form-container">
      <h2>Request Leave</h2>
      <form onSubmit={handleSubmit}>
        <div className="leave-form-group">
          <label>Leave Type:</label>
          <select
            name="leaveType"
            value={leave.leaveType}
            onChange={handleChange}
          >
              <option value="Sick"> Leave</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Casual Leave">casual Leave</option>
            <option value="Annual Leave">Annual Leave</option>
          </select>
        </div>

        <div className="leave-form-group">
          <label>From Date:</label>
          <input
            type="date"
            name="startDate"
            value={leave.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="leave-form-group">
          <label>To Date:</label>
          <input
            type="date"
            name="endDate"
            value={leave.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="leave-form-group">
          <label>Description:</label>
          <textarea
            name="reason"
            value={leave.reason}
            onChange={handleChange}
            rows="4"
            placeholder="Enter reason for leave"
            required
          />
        </div>

        <button type="submit">Submit Request</button>
      </form>
    </div>
  );
};

export default AddLeave;
