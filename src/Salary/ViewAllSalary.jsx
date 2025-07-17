import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/ViewAllsalary.css";

const ViewSalary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For routing

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/master/getoverSalaries");
        setData(response.data.data); // ✅ Access actual data array
      } catch (error) {
        console.error("Failed to fetch salary table:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalaryData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container">
      <h2 className="title">Employee Salary Table</h2>
      <table className="salary-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Employee ID</th>
            <th>Basic Salary</th>
            <th>Department</th>
            <th>Allowance</th>
            <th>Deduction</th>
            <th>Action</th> {/* ✅ Added Action column */}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.sno}</td>
              <td>{row.employeeId}</td>
              <td>₹ {row.basicSalary}</td>
              <td>{row.department}</td>
              <td className="currency">₹ {row.allowances}</td>
              <td className="deduction">₹ {row.deductions}</td>
              <td>
                <button
                  style={{
                    padding: "6px 12px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/AdminDashbord/salary/GetallSalary")}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSalary;
