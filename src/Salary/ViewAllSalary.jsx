import React, { useEffect, useState } from "react";
import axios from "axios";
import '../css/ViewAllsalary.css';
const ViewSalary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalaryData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/salary/getoverSalaries");
        setData(response.data);
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
        <th>BasicSalary</th>
            <th>Department</th>
            <th>Allowance</th>
            <th>Deduction</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              <td>{row.sno}</td>
              <td>{row.employeeId}</td>
              <td>{row.basicsalary}</td>
              <td>{row.department}</td>
              <td className="currency">₹ {row.allowance}</td>
              <td className="deduction">₹ {row.deduction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewSalary;
