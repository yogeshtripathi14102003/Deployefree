import React, { useEffect, useState } from "react";
import "../css/EmployeeForm.css";
import "../css/allowance-form.css";
import { fetchDepartments, getEmployees } from "../utils/EmployeeHelper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Add() {
  const [employee, setEmployee] = useState({
    employeeId: "",
    department: "",
    basicSalary: "",
    payDate: "",
    allowances: 0,
    deductions: 0,
    allowanceDetails: [],
    deductionDetails: [],
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

  const handleEmployeeSelect = (e) => {
    setEmployee((prev) => ({ ...prev, employeeId: e.target.value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // ------ Allowance Logic ------
  const handleAllowanceChange = (index, field, value) => {
    const updated = [...allowances];
    updated[index][field] = value;
    setAllowances(updated);

    const total = updated.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setEmployee((prev) => ({
      ...prev,
      allowances: total,
      allowanceDetails: updated,
    }));
  };

  const handleAddAllowance = () => {
    setAllowances([...allowances, { name: "", amount: "" }]);
  };

  // ------ Deduction Logic ------
  const handleDeductionChange = (index, field, value) => {
    const updated = [...deductions];
    updated[index][field] = value;
    setDeductions(updated);

    const total = updated.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setEmployee((prev) => ({
      ...prev,
      deductions: total,
      deductionDetails: updated,
    }));
  };

  const handleAddDeduction = () => {
    setDeductions([...deductions, { name: "", amount: "" }]);
  };

  // -----------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/salary/add",
        employee,
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
                    <label>
                Pay Date
                <input
                  type="date"
                  name="payDate"
                  value={employee.payDate}
                  onChange={handleChange}
                  required
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

                <button
                  type="button"
                  onClick={handleAddAllowance}
                  className="add-btn"
                >
                  + Add Allowance
                </button>

                <label>
                  Total Allowances
                  <input
                    type="number"
                    value={employee.allowances}
                    readOnly
                    className="readonly-salary-field"
                  />
                </label>
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

                <button
                  type="button"
                  onClick={handleAddDeduction}
                  className="add-btn"
                >
                  + Add Deduction
                </button>

                <label>
                  Total Deductions
                  <input
                    type="number"
                    value={employee.deductions}
                    readOnly
                    className="readonly-salary-field"
                  />
                </label>
              </div>

              {/* -------------------------------- */}

        
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
