import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import '../Punchin/Punchingcss/WageRegister.css';

const WageRegister = () => {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [employeesData, setEmployeesData] = useState([]);
  const [dateTimeData, setDateTimeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedMonth) return;
      setLoading(true);
      setError(null);

      try {
        const [mainRes, timeRes] = await Promise.all([
          axios.get('http://localhost:5000/v1/punch', {
            params: { month: selectedMonth, ...(employeeId && { employeeId }) }
          }),
          axios.get('http://localhost:5000/v1/punch/date/time', {
            params: { month: selectedMonth, ...(employeeId && { employeeId }) }
          })
        ]);

        setEmployeesData(mainRes.data);
        setDateTimeData(timeRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to fetch wage register data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth, employeeId]);

  const handleDownloadExcel = () => {
    const headers = [
      'S. No.', 'Name', 'Employee ID No.', 'No. of Days worked', 'Rate of Wage',
      'Overtime Days worked', 'Basic', 'Special Basic', 'DA', 'Payments Overtime',
      'HRA', '*Others', 'Total', '@12%', '500.00', 'ESIC', 'Society', 'Income Tax',
      'Insurance', 'Deduction Total', 'Net Payment', 'Employer Share PF',
      'Employer Share ESIC', 'Bank/Receipt', 'Date of Payment', 'Remarks'
    ];

    const [year, month] = selectedMonth.split('-');
    const reportTitle = [`WAGE REGISTER REPORT FOR: ${month}/${year}`];

    const data = employeesData.map((emp, index) => [
      index + 1,
      emp.name || emp.employeeId?.name || '',
      emp.employeeId?.employeeCode || emp.employeeId || '',
      emp.totalDays || 0,
      emp.wageRate || 0,
      emp.totalOvertime || 0,
      ...Array(20).fill('')
    ]);

    const sheetData = [reportTitle, [], headers, ...data];
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Wage Register');

    const fileName = `WageRegister_${year}_${month}${employeeId ? `_${employeeId}` : ''}.xlsx`;
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const file = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(file, fileName);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3 style={{ textAlign: 'center' }}>FORM B</h3>
      <h4 style={{ textAlign: 'center' }}>WAGE REGISTER</h4>
      <p style={{ textAlign: 'center' }}>
        Rate of Minimum Wages since 01/04/2023 — "C" REGION
      </p>

      <div style={{ margin: '15px 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <label><strong>Select Month:</strong></label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />

        <label><strong>Employee ID (optional):</strong></label>
        <input
          type="text"
          placeholder="Enter Employee ID"
          value={employeeId}
          onChange={(e) => setEmployeeId(e.target.value)}
        />

        <button onClick={handleDownloadExcel} disabled={loading}>
          ⬇️ Download Excel
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      <p>
        <strong>Name of the Establishment:</strong> M/s SAVTECH SOLUTIONS, FARIDABAD &nbsp;&nbsp;
        <strong>Name of Owner:</strong> SURENDRA KUMAR &nbsp;&nbsp;
        <strong>LIN:</strong> 1502742320
      </p>

      {selectedMonth && (
        <p>
          <strong>Wage period From:</strong> 01/{selectedMonth.split('-')[1]}/2025 &nbsp;
          <strong>To:</strong> 31/{selectedMonth.split('-')[1]}/2025 &nbsp;
          (Monthly/Fortnightly/Weekly/Daily/Piece Rated)
        </p>
      )}

      <table border="1" cellPadding="4" style={{ width: '100%', fontSize: '12px' }}>
        <thead style={{ backgroundColor: '#f0fafa' }}>
          <tr>
            <th rowSpan="2">S. No.</th>
            <th rowSpan="2">Name</th>
            <th rowSpan="2">Employee ID No.</th>
            <th rowSpan="2">No. of Days worked</th>
            <th rowSpan="2">Rate of Wage</th>
            <th rowSpan="2">Overtime Days worked</th>
            <th rowSpan="2">Basic</th>
            <th rowSpan="2">Special Basic</th>
            <th rowSpan="2">DA</th>
            <th rowSpan="2">Payments Overtime</th>
            <th rowSpan="2">HRA</th>
            <th rowSpan="2">*Others</th>
            <th rowSpan="2">Total</th>
            <th colSpan="6">Deduction</th>
            <th rowSpan="2">Total</th>
            <th rowSpan="2" style={{ backgroundColor: 'yellow' }}>Net Payment</th>
            <th rowSpan="2">Employer Share PF</th>
            <th rowSpan="2">Employer Share ESIC</th>
            <th rowSpan="2">Bank/Receipt</th>
            <th rowSpan="2">Date of Payment</th>
            <th rowSpan="2">Remarks</th>
          </tr>
          <tr>
            <th>@12%</th>
            <th>500.00</th>
            <th>ESIC</th>
            <th>Society</th>
            <th>Income Tax</th>
            <th>Insurance</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="26" style={{ textAlign: 'center' }}>Loading...</td>
            </tr>
          ) : employeesData.length === 0 ? (
            <tr>
              <td colSpan="26" style={{ textAlign: 'center' }}>No data</td>
            </tr>
          ) : (
            employeesData.map((emp, i) => (
              <tr key={emp._id || i}>
                <td>{i + 1}</td>
                <td>{emp.name || emp.employeeId?.name || '—'}</td>
                <td>{emp.employeeId?.employeeCode || emp.employeeId || ''}</td>
                <td>{emp.totalDays || 0}</td>
                <td>{emp.wageRate || 0}</td>
                <td>{emp.totalOvertime || 0}</td>
                {Array.from({ length: 20 }, (_, j) => (
                  <td key={`cell-${i}-${j}`}></td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {dateTimeData.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h4>Punch Date/Time Details</h4>
          <ul>
            {dateTimeData.map((entry, index) => (
              <li key={index}>
                Employee: {entry.employeeId?.name || entry.employeeId} — 
                In: {new Date(entry.punchIn).toLocaleString()} — 
                Out: {entry.punchOut ? new Date(entry.punchOut).toLocaleString() : 'Still Working'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WageRegister;
