// components/Listleave.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../css/ViewSalary.css';
// import { useAuth } from '../Context/AuthContext';

import { useAuth} from '../Context/AuthContext ';

const Listleave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please login.');
        return;
      }

      const userId = user?._id;
      if (!userId) {
        alert('User not logged in properly.');
        return;
      }

      const response = await axios.get(`http://localhost:5000/v1/leave/by/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Leave API response:', response);

      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.leaves)
      ) {
        setLeaves(response.data.leaves);
        setFilteredLeaves(response.data.leaves);
      } else {
        alert('Invalid response from server');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      alert('Failed to fetch leaves');
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchLeaves();
    }
  }, [user]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = leaves.filter((leave) =>
      [leave.reason, leave.leaveType, leave.status].some((field) =>
        field?.toLowerCase().includes(term)
      )
    );
    setFilteredLeaves(filtered);
  };

  return (
    <div>
      <div className="admin-department-header">
        <h3 className="admin-department-title">Manage Leaves</h3>
      </div>

      <div className="admin-department-toolbar">
        <input
          type="text"
          placeholder="Search by Reason / Type / Status"
          className="search-input"
          value={searchTerm}
          onChange={handleSearch}
        />
        {user?.role === 'employee' && (
          <Link to="/Employeedashbord/Add-leaves" className="add-button">
            Add a New Leave
          </Link>
        )}
      </div>

      <div className="view-salary-container">
        <h2 className="title">Leave History</h2>

        {filteredLeaves.length > 0 ? (
          <table className="salary-table">
            <thead>
              <tr>
                <th>SNO</th>
                <th>Leave Type</th>
                <th>From</th>
                <th>To</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map((leave, index) => (
                <tr key={leave._id}>
                  <td>{index + 1}</td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div>No Records Found</div>
        )}
      </div>
    </div>
  );
};

export default Listleave;
