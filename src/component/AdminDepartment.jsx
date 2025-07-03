import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/AdminDepartment.css';
import DataTable from 'react-data-table-component';
import { columns, DepartmentButtons } from '../utils/DepartmentHelper';
import axios from 'axios';

const AdminDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // ✅ State for search
  const [depLoading, setDepLoading] = useState(false);

  const onDepartmentDelete = async (id) => {
    const data = departments.filter(dep => dep.id !== id);
    setDepartments(data);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      setDepLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/v1/department/get", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          let sno = 1;
          const data = response.data.departments.map((dep) => ({
            id: dep._id,
            sno: sno++,
            dep_name: dep.dep_name,
            description: dep.description,
            action: (
              <DepartmentButtons id={dep._id} onDepartmentDelete={onDepartmentDelete} />
            ),
          }));

          setDepartments(data);
        }
      } catch (error) {
        if (error.response && error.response.data.error) {
          alert(error.response.data.error);
        } else {
          alert("Error fetching departments.");
        }
      } finally {
        setDepLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  // ✅ Filter based on searchTerm
  const filteredDepartments = departments.filter((dep) =>
    dep.dep_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {depLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="admin-department-wrapper">
          <div className="admin-department-header">
            <h3 className="admin-department-title">Manage Department</h3>
          </div>

          <div className="admin-department-toolbar">
            <input
              type="text"
              placeholder="Search By Department Name"
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // ✅ Update search term
            />
            <Link to="/AdminDashbord/AddDepartment" className="add-button">
              Add a New Department
            </Link>
          </div>

          <div>
            <DataTable
              columns={columns}
              data={filteredDepartments} // ✅ Use filtered data
              pagination
              highlightOnHover
              striped
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDepartment;
