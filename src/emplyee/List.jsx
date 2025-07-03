import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { columns, EmployeesButtons } from "../utils/EmployeeHelper";
import DataTable from "react-data-table-component";
const List = () => {
  const [employees, setEmployees] = useState([]);
  const [empLoading, setEmpLoading] = useState(false);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchText, setSearchText] = useState(""); // New state for input value

  useEffect(() => {
    const fetchEmployees = async () => {
      setEmpLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/v1/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.data.success) {
          let sno = 1;
          const data = response.data.employees.map((emp) => ({
            id: emp._id,
            sno: sno++,
            dep_name: emp.department?.dep_name || "N/A",
            name: emp.userId?.name || "N/A",
            dob: new Date(emp.dob).toDateString(),
            profileImage: (
              <img
                width={40}
                alt="Profile"
                src={`http://localhost:5000/${emp.userId?.profileImage}`}
              />
            ),
            action: <EmployeesButtons id={emp._id} />,
          }));
          setEmployees(data);
          setFilteredEmployees(data);
        }
      } catch (error) {
        console.error("Fetch Employees Error:", error);
        alert(error.response?.data?.error || "Error fetching employees.");
      } finally {
        setEmpLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // ✅ Handle search filter
  const handleFilter = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    const filtered = employees.filter((emp) =>
      emp.name.toLowerCase().includes(value)
    );
    setFilteredEmployees(filtered);
  };

  return (
    <>
      <div className="admin-department-header">
        <h3 className="admin-department-title">Manage Employees</h3>
      </div>

      <div className="admin-department-toolbar">
        <input
          type="text"
          placeholder="Search By Employee Name"
          className="search-input"
          value={searchText}
          onChange={handleFilter}
        />
        <Link to="/AdminDashbord/add-employees" className="add-button">
          Add a New Employee
        </Link>
      </div>

      <div>
        <DataTable
          columns={columns}
          data={filteredEmployees}
          progressPending={empLoading}
          pagination
          highlightOnHover
        />
      </div>
    </>
  );
};

export default List;
