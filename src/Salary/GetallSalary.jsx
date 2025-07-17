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
    totalSiteDays: "",
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

    try {
      const punchResponse = await axios.get(
        `http://localhost:5000/v1/punch/getalldetailbyemp/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const { summary } = punchResponse.data || {};
      const punchData = {
        totalDays: summary?.totalDaysPresent || 0,
        totalOvertime: parseFloat(summary?.overtimeHours || "0"),
        totalSiteDays: summary?.totalOutsideDays || 0,
      };

      setEmployee((prev) => ({
        ...prev,
        ...punchData,
      }));

      const salaryResponse = await axios.get(
        `http://localhost:5000/api/v1/master/getovrby/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const salaryData = salaryResponse.data.data || salaryResponse.data;

      const transformedAllowances = (salaryData.allowanceDetails || []).map((a) => ({
        name: a.name,
        amount: a.amount.toString(),
      }));

      const transformedDeductions = (salaryData.deductionDetails || []).map((d) => ({
        name: d.name,
        amount: d.amount.toString(),
      }));

      setEmployee((prev) => ({
        ...prev,
        basicSalary: salaryData.basicSalary?.toString() || "",
        allowanceDetails: transformedAllowances,
        deductionDetails: transformedDeductions,
      }));

      setAllowances(transformedAllowances.length ? transformedAllowances : [{ name: "", amount: "" }]);
      setDeductions(transformedDeductions.length ? transformedDeductions : [{ name: "", amount: "" }]);

    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 404) {
        setEmployee((prev) => ({
          ...prev,
          basicSalary: "",
          allowanceDetails: [],
          deductionDetails: [],
        }));
        setAllowances([{ name: "", amount: "" }]);
        setDeductions([{ name: "", amount: "" }]);
        alert("No salary record found. You can now enter salary details.");
      } else {
        alert("Data fetch error: " + (error.response?.data?.error || error.message));
      }
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

  const addAllowance = () => {
    setAllowances([...allowances, { name: "", amount: "" }]);
  };

  const removeAllowance = (index) => {
    const updated = [...allowances];
    updated.splice(index, 1);
    setAllowances(updated);
    setEmployee((prev) => ({
      ...prev,
      allowanceDetails: updated,
    }));
  };

  const addDeduction = () => {
    setDeductions([...deductions, { name: "", amount: "" }]);
  };

  const removeDeduction = (index) => {
    const updated = [...deductions];
    updated.splice(index, 1);
    setDeductions(updated);
    setEmployee((prev) => ({
      ...prev,
      deductionDetails: updated,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const WORKING_DAYS_IN_MONTH = 30;
    const payableBasicSalary =
      (Number(employee.basicSalary || 0) / WORKING_DAYS_IN_MONTH) *
      Number(employee.totalDays || 0);

    const updatedAllowances = [...allowances];

    const totalAllowances = updatedAllowances.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const totalDeductions = deductions.reduce(
      (sum, item) => sum + Number(item.amount || 0),
      0
    );

    const grossSalary = payableBasicSalary + totalAllowances;
    const netSalary = grossSalary - totalDeductions;

    const payload = {
      ...employee,
      basicSalary: payableBasicSalary.toFixed(2),
      allowanceDetails: updatedAllowances,
      deductionDetails: deductions,
      allowances: totalAllowances,
      deductions: totalDeductions,
      netSalary: netSalary.toFixed(2),
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
            <h2 className="employee-form-title">Add Final Salary</h2>
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
                Monthly Basic Salary
                <input
                  type="number"
                  name="basicSalary"
                  value={employee.basicSalary}
                  onChange={handleChange}
                  placeholder="Enter basic salary"
                  required
                />
              </label>

              <label>
                Payable Basic Salary (auto)
                <input
                  type="number"
                  readOnly
                  value={
                    employee.totalDays
                      ? (
                          (Number(employee.basicSalary || 0) / 30) *
                          Number(employee.totalDays)
                        ).toFixed(2)
                      : "0"
                  }
                />
              </label>

              <label>
                Total Present Days
                <input
                  type="number"
                  name="totalDays"
                  value={employee.totalDays}
                  readOnly
                />
              </label>

              <label>
                Total Site Days
                <input
                  type="number"
                  name="totalSiteDays"
                  value={employee.totalSiteDays}
                  readOnly
                />
              </label>

              <label>
                Total Overtime (Hours)
                <input
                  type="number"
                  name="totalOvertime"
                  value={employee.totalOvertime}
                  readOnly
                />
              </label>

              <label>
                Net Payable Salary (after all)
                <input
                  type="number"
                  readOnly
                  value={(
                    ((Number(employee.basicSalary || 0) / 30) * Number(employee.totalDays)) +
                    allowances.reduce((sum, a) => sum + Number(a.amount || 0), 0) -
                    deductions.reduce((sum, d) => sum + Number(d.amount || 0), 0)
                  ).toFixed(2)}
                />
              </label>

              {/* ALLOWANCES */}
              <div className="allowance-form">
                <h3>EARNINGS & ALLOWANCES</h3>
                {allowances.map((item, index) => (
                  <div key={index} className="allowance-field">
                    <label>
                      Allowance Name
                      <input
                        type="text"
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
                        value={item.amount}
                        onChange={(e) =>
                          handleAllowanceChange(index, "amount", e.target.value)
                        }
                        required
                      />
                    </label>
                    {allowances.length > 1 && (
                      <button type="button" onClick={() => removeAllowance(index)}>❌</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addAllowance}>➕ Add Allowance</button>
              </div>

              {/* DEDUCTIONS */}
              <div className="allowance-form">
                <h3>DEDUCTIONS</h3>
                {deductions.map((item, index) => (
                  <div key={index} className="allowance-field">
                    <label>
                      Deduction Name
                      <input
                        type="text"
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
                        value={item.amount}
                        onChange={(e) =>
                          handleDeductionChange(index, "amount", e.target.value)
                        }
                        required
                      />
                    </label>
                    {deductions.length > 1 && (
                      <button type="button" onClick={() => removeDeduction(index)}>❌</button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={addDeduction}>➕ Add Deduction</button>
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
