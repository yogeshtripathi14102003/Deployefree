import React, { useEffect, useState } from "react";
import "../css/AdminLeave.css";
import axios from "axios";
import { columns, Leavebuttons } from "../utils/LeaveHelper";
import DataTable from "react-data-table-component";

const Table = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState(null);
  const fetchLeaves = async () => {
    try {
      const response = await axios.get("http://localhost:5000/v1/leave", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        let sno = 1;
        const data = response.data.leaves.map((leave) => ({
          _id: leave._id,
          sno: sno++,
          employeeId: leave.employeeId?.employeeId || "N/A",
          name: leave.employeeId?.userId.name || "N/A",
          leaveType: leave.leaveType || "N/A",
          department: leave.employeeId?.department?.dep_name || "N/A",
          days:
            (new Date(leave.endDate) - new Date(leave.startDate)) /
              (1000 * 60 * 60 * 24) +
            1,
          status: leave.status,
          action: <Leavebuttons Id={leave._id} />,
        }));
        setLeaves(data);
        setFilteredLeaves(data);
      }
    } catch (error) {
      console.error("Fetch Leaves Error:", error);
      alert(error.response?.data?.error || "Error fetching leaves.");
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const filterByInput = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = leaves.filter((leave) =>
      leave.employeeId.toLowerCase().includes(searchTerm)
    );
    setFilteredLeaves(filtered);
  };

    const filterByButton = (status) => {
   const data = leaves.filter((leave) =>
  leave.status.toLowerCase().includes(status.toLowerCase()));
    setFilteredLeaves(data);
  };

  return (
    <>
      {filteredLeaves ? (
        <div>
          <div className="admin-department-header">
            <h3 className="admin-department-title">Manage Leaves</h3>
          </div>

          <div className="admin-department-toolbar">
            <input
              type="text"
              placeholder="Search By emp id"
              className="search-input"
              onChange={filterByInput}
            />
            <div className="leavebutton">
              <button className="buttonapprove" onClick={() => filterByButton("Approved")}>Approved</button>
              <button className="buttonpending" onClick={() => filterByButton("Pending")}>Pending</button>
              <button className="buttonreject" onClick={() => filterByButton("Rejected")} >Rejected</button>
            </div>
          </div>
          <DataTable columns={columns} data={filteredLeaves} pagination />
        </div>
      ) : (
        <div>Loading...</div>
      )}
      
    </>
  );
};

export default Table;
