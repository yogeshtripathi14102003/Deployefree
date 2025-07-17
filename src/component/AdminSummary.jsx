import React, { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import { PiHandDeposit } from "react-icons/pi";
import { FcApprove } from "react-icons/fc";
import { GiThreeLeaves } from "react-icons/gi";
import {
  FaBuilding,
  FaHourglass,
  FaTimesCircle,
  FaUsers,
} from "react-icons/fa";
import "../css/AdminSummary.css";
import axios from "axios";

const AdminSummary = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/v1/dashbord/summary",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            withCredentials: false,
          }
        );

        const responseData = response.data;
        console.log("SUMMARY RESPONSE:", responseData); // Debug log
        setSummary(responseData);
      } catch (err) {
        const msg = err.response?.data?.error || err.message || "Fetch failed";
        setError(msg);
        console.error("Error fetching summary:", err);
      }
    };

    fetchSummary();
  }, []);

  if (error)
    return (
      <div className="admin-summary">
        <h3 className="admin-summary-heading">Dashboard</h3>
        <div style={{ color: "red" }}>Error: {error}</div>
      </div>
    );

  if (!summary) return <div>Loading...</div>;

  return (
    <div className="admin-summary">
      <h3 className="admin-summary-heading">Dashboard</h3>
      <div className="summary-grid">
        <SummaryCard
          icon={<FaUsers />}
          text="Total Employees"
          number={summary.totalEmployeesCount || 0}
        />
        <SummaryCard
          icon={<FaBuilding />}
          text="Total Departments"
          number={summary.totalDepartmentsCount || 0}
        />
        <SummaryCard
          icon={<PiHandDeposit />}
          text="Monthly Pay"
          number={summary.totalSalaryAmount || 0}
        />
      </div>

      <div className="leave-detail-wrapper">
        <h4 className="leave-detail-title">Leave Details</h4>
        <div className="leave-detail-grid">
          <SummaryCard
            icon={<GiThreeLeaves />}
            text="Leave Applied"
            number={summary.totalLeaveRequests || 0}
          />
          <SummaryCard
            icon={<FcApprove />}
            text="Leave Approved"
            number={summary.totalApprovedLeaves || 0}
          />
          <SummaryCard
            icon={<FaHourglass />}
            text="Leave Pending"
            number={summary.totalPendingLeaves || 0}
          />
          <SummaryCard
            icon={<FaTimesCircle />}
            text="Leave Rejected"
            number={summary.totalRejectedLeaves || 0}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminSummary;
