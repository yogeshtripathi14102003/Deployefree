import React, { useEffect, useState } from "react";
import "../css/EmployeeForm.css";
import "../css/allowance-form.css";
import { fetchDepartments, getEmployees } from "../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GetallSalary() {
  const [employee, setEmployee] = useState({
    employeeId: "",
    department: "",
    basicSalary: "",
    allowanceDetails: [],
    deductionDetails: [],
    totalDays: "",
    totalOvertime: "",
    totalSiteDays: "", // ✅ NEW FIELD
  });

  const [allowances, setAllowances] = useState([{ name: "", amount: "" }]);
  const [deductions, setDeductions] = useState([{ name: "", amount: "" }]);
  const [departments, setDepartments] = useState(null);
  const [salary, setSalary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };
    getDepartments();
  }, []);

  const handleDepartment = async (e) => {
    const deptId = e.target.value;
    setEmployee((prev) => ({ ...prev, department: deptId }));
    const emps = await getEmployees(deptId);
    setSalary(emps);
  };

  const handleEmployeeSelect = async (e) => {
    const employeeId = e.target.value;
    setEmployee((prev) => ({ ...prev, employeeId }));

    // 👉 Fetch punch data
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/punch?employeeId=${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { totalDays, totalOvertime, totalSiteDays } = response.data;

      setEmployee((prev) => ({
        ...prev,
        totalDays: totalDays || 0,
        totalOvertime: totalOvertime || 0,
        totalSiteDays: totalSiteDays || 0, // ✅ NEW DATA
      }));
    } catch (error) {
      console.error("Error fetching punch data:", error);
      alert("Failed to load punch data.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllowanceChange = (index, field, value) => {
    const updated = [...allowances];
    updated[index][field] = value;
    setAllowances(updated);
    setEmployee((prev) => ({
      ...prev,
      allowanceDetails: updated,
    }));
  };

  const handleDeductionChange = (index, field, value) => {
    const updated = [...deductions];
    updated[index][field] = value;
    setDeductions(updated);
    setEmployee((prev) => ({
      ...prev,
      deductionDetails: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalAllowances = allowances.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalDeductions = deductions.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const payload = {
      ...employee,
      allowances: totalAllowances,
      deductions: totalDeductions,
      payDate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/salary/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        alert("Salary added successfully.");
        navigate("/adminDashbord/employees");
      } else {
        alert("Failed to add salary.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      const message =
        error.response?.data?.error ||
        "An error occurred while submitting the form.";
      alert(message);
    }
  };

  return (
    <>
      {departments ? (
        <div className="employee-form-card">
          <div className="employee-form-content">
            <h2 className="employee-form-title">Add Salary</h2>
            <form onSubmit={handleSubmit} className="employee-form">
              <label>
                Department
                <select
                  name="department"
                  value={employee.department || ""}
                  onChange={handleDepartment}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dep) => (
                    <option key={dep._id} value={dep._id}>
                      {dep.dep_name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Employee
                <select
                  name="employeeId"
                  value={employee.employeeId}
                  onChange={handleEmployeeSelect}
                  required
                >
                  <option value="">Select Employee</option>
                  {salary.map((emp) => (
                    <option key={emp._id} value={emp._id}>
                      {emp.employeeId}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Basic Salary
                <input
                  type="number"
                  name="basicSalary"
                  value={employee.basicSalary}
                  placeholder="Enter basic salary amount"
                  onChange={handleChange}
                  required
                />
              </label>

              {/* ✅ Total Days */}
              <label>
                Total Days
                <input
                  type="number"
                  name="totalDays"
                  value={employee.totalDays}
                  readOnly
                />
              </label>

              {/* ✅ Total Overtime */}
              <label>
                Total Overtime (Hours)
                <input
                  type="number"
                  name="totalOvertime"
                  value={employee.totalOvertime}
                  readOnly
                />
              </label>

              {/* ✅ Total Site Days */}
              <label>
                Total Site Days
                <input
                  type="number"
                  name="totalSiteDays"
                  value={employee.totalSiteDays}
                  readOnly
                />
              </label>

              {/* ------ Allowance Section ------ */}
              <div className="allowance-form">
                <h3>EARNINGS & ALLOWANCES</h3>
                {allowances.map((item, index) => (
                  <div key={index} className="allowance-field">
                    <label>
                      Allowance Name
                      <input
                        type="text"
                        placeholder="Allowance"
                        value={item.name}
                        onChange={(e) =>
                          handleAllowanceChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </label>

                    <label>
                      Amount
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={item.amount}
                        onChange={(e) =>
                          handleAllowanceChange(index, "amount", e.target.value)
                        }
                        required
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* ------ Deduction Section ------ */}
              <div className="allowance-form">
                <h3>DEDUCTIONS</h3>
                {deductions.map((item, index) => (
                  <div key={index} className="allowance-field">
                    <label>
                      Deduction Name
                      <input
                        type="text"
                        placeholder="Deduction"
                        value={item.name}
                        onChange={(e) =>
                          handleDeductionChange(index, "name", e.target.value)
                        }
                        required
                      />
                    </label>

                    <label>
                      Amount
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={item.amount}
                        onChange={(e) =>
                          handleDeductionChange(index, "amount", e.target.value)
                        }
                        required
                      />
                    </label>
                  </div>
                ))}
              </div>

              <div className="button-group">
                <button type="submit" className="employee-submit-button">
                  Add Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}
