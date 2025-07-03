import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const LeaveDeatil = () => {
  const { id } = useParams();
  const [leave, setLeave] = useState(null);
  const lnavigate = useNavigate();

  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/v1/leave/detail/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          setLeave(response.data.leave);
        }
      } catch (error) {
        const message = error.response?.data?.error || "Error fetching employee.";
        alert(message);
      }
    };

    fetchLeave();
  }, [id]);

  const changeStatus = async (id, status) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/v1/leave/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        lnavigate("/admindashbord/leaves");
      }
    } catch (error) {
      const message = error.response?.data?.error || "Error updating status.";
      alert(message);
    }
  };

  return (
    <>
      {leave ? (
        <div className="employee-container">
          <h2 className="employee-title">Leave Details</h2>
          <div className="employee-grid">
            <div>
              <img
                src={`http://localhost:5000/${leave.employeeId?.userId?.profileImage}`}
                alt="Profile"
                className="employee-image"
              />
            </div>
            <div>
              <div className="employee-row">
                <p className="label">Name:</p>
                <p className="value">{leave.employeeId?.userId?.name}</p>
              </div>
              <div className="employee-row">
                <p className="label">Employee ID:</p>
                <p className="value">{leave.employeeId?.employeeId}</p>
              </div>
              <div className="employee-row">
                <p className="label">Leave Type:</p>
                <p className="value">{leave.leaveType}</p>
              </div>
              <div className="employee-row">
                <p className="label">Reason:</p>
                <p className="value">{leave.reason}</p>
              </div>
              <div className="employee-row">
                <p className="label">Department:</p>
                <p className="value">{leave.employeeId?.department?.dep_name}</p>
              </div>
              <div className="employee-row">
                <p className="label">Start Date:</p>
                <p className="value">{new Date(leave.startDate).toLocaleDateString()}</p>
              </div>
              <div className="employee-row">
                <p className="label">End Date:</p>
                <p className="value">{new Date(leave.endDate).toLocaleDateString()}</p>
              </div>

              
              <div className="employee-row">
                <p className="label">
                  {leave.status?.toLowerCase() === "pending" ? "Action:" : "Status:"}
                </p>
                {leave.status?.toLowerCase() === "pending" ? (
                  <div className="action-buttons">
                    <button className="btn approve" onClick={() => changeStatus(leave._id, "Approved")}>Approved</button>
                    <button className="btn reject" onClick={() => changeStatus(leave._id, "Rejected")}>Reject</button>
                  </div>
                ) : (
                  <p className="value">{leave.status}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}

      {/* ✅ Internal CSS Styling */}
      <style>{`
        .action-buttons {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          font-weight: bold;
          cursor: pointer;
          color: white;
        }

        .approve {
          background-color: #4caf50;
        }

        .approve:hover {
          background-color: #388e3c;
        }

        .reject {
          background-color: #f44336;
        }

        .reject:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </>
  );
};

export default LeaveDeatil;
