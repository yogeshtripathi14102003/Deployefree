import axios from "axios";
import { useNavigate } from "react-router-dom";


import '../css/employeHelper.css';
// ✅ DataTable Column Config
export const columns = [
  {
    name: "S. No",
    selector: (row) => row.sno,
    sortable: true,
    width: "50px",
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
    width: "120px",
  },
  {
    name: "Image",
    selector: (row) => row.profileImage,
    sortable: true,
    width: "100px",
  },
  {
    name: "Department",
    selector: (row) => row.dep_name,
    sortable: true,
    width: "130px",
  },
  {
    name: "DOB",
    selector: (row) => row.dob,
    sortable: true,
    width: "130px",
  },
  {
    name: "Action",
    selector: (row) => row.action,
    // center: true,
  },
];

// ✅ Fetch Departments
export const fetchDepartments = async () => {
  let departments = [];
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Authentication token missing. Please log in again.");
    return departments;
  }
  try {
    const response = await axios.get("http://localhost:5000/v1/department/get", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success && response.data.departments) {
      departments = response.data.departments;
    } else {
      alert("Failed to load departments.");
    }
  } catch (error) {
    console.error("Error fetching departments:", error);
    alert(error.response?.data?.error || "Server error fetching departments.");
  }

  return departments;
};


export const getEmployees = async (id) => {
  let employees ;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Authentication token missing. Please log in again.");
    return employees;
  }
  try {
    const response = await axios.get(`http://localhost:5000/v1/fetchEmployees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.success ) {
      employees = response.data.employees;
    } else {
      alert("Failed to load employee.");
    }
  } catch (error) {
    console.error("Error fetching employees:", error);
    alert(error.response?.data?.error || "Server error fetching employees.");
  }

  return employees;
};





// ✅ Employees Action Buttons (View, Edit, Salary, Leave)
export const EmployeesButtons = ({ id }) => {
  const navigate = useNavigate();

  return (
    <div className="button-group">
      <button
        className="action-button view"
        onClick={() => navigate(`/admindashbord/employees/${id}`)}
      >
        View
      </button>
      <button
        className="action-button edit"
        onClick={() => navigate(`/admindashbord/employees/edit/${id}`)}
      >
        Edit
      </button>
      <button
        className="action-button salary"
        onClick={() => navigate(`/admindashbord/employees/salary/${id}`)}
      >
        Salary
      </button>
      <button
        className="action-button leave"
        onClick={() => navigate(`/adminDashbord/employees/leaves/${id}`)}
      >
        Leave
      </button>
       <button
        className="action-button details"
        onClick={() => navigate(`/admindashbord/employees/getallempoyee/${id}`)}
      >
        complete details
      </button>
    </div>
  );
};
