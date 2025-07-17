import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const AttendanceSheet = () => {
  const [monthYear, setMonthYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [employees, setEmployees] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/v1/punch');
        const data = res.data;

        const empMap = new Map();
        const attendance = {};

        data.forEach(item => {
          const empId = item.employeeId || item.empId;
          if (!empId) return;

          const punchDate = new Date(item.date || item.punchTime || item.timestamp);
          const day = punchDate.getDate();
          const month = punchDate.getMonth() + 1;
          const year = punchDate.getFullYear();

          if (month === selectedMonth && year === selectedYear) {
            attendance[empId] = attendance[empId] || {};
            attendance[empId][day] = item.status || 'P'; // assuming default to 'P'
          }
          empMap.set(empId, empId);
        });

        const formatted = Array.from(empMap.values()).map((empId, i) => ({
          id: i + 1,
          empId
        }));

        setEmployees(formatted);
        setStatuses(attendance);
      } catch (err) {
        console.error('Error fetching punch data:', err);
      }
    };

    if (selectedMonth && selectedYear) fetchData();
  }, [selectedMonth, selectedYear]);

  const daysInMonth = selectedMonth
    ? Array.from({ length: new Date(selectedYear, selectedMonth, 0).getDate() }, (_, i) => i + 1)
    : [];

  const handleMonthChange = e => {
    const [month, year] = e.target.value.split('-');
    setSelectedMonth(parseInt(month));
    setSelectedYear(parseInt(year));
    setMonthYear(e.target.value);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'Present': return 'green';
      case 'Partial': return 'orange';
      case 'Absent': return 'red';
      default: return 'gray';
    }
  };

  const getPunchDetail = async empId => {
    if (!empId) return alert('Invalid employee ID');
    try {
      setLoadingDetail(empId);
      const res = await axios.get(`http://localhost:5000/v1/punch/${empId}`);
      alert(`Punch details for ${empId}:\n\n` + JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error(err);
      alert(`Error fetching detail for ${empId}`);
    } finally {
      setLoadingDetail(null);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.empId && emp.empId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadExcel = () => {
    const headers = ['No.', 'Employee ID', ...daysInMonth.map(d => `Day ${d}`), 'Status'];
    const today = new Date();

    const rows = filteredEmployees.map((emp, idx) => {
      const row = [idx + 1, emp.empId];
      const arr = daysInMonth.map(day => {
        const future = selectedYear > today.getFullYear()
          || (selectedYear === today.getFullYear() && selectedMonth > today.getMonth() + 1)
          || (selectedYear === today.getFullYear()
              && selectedMonth === today.getMonth() + 1
              && day > today.getDate());
        if (future) return '';
        const status = statuses[emp.empId]?.[day];
        return status === 'P' ? 'Present' : status === 'A' ? 'Absent' : '–';
      });

      const presentCount = arr.filter(s => s === 'Present').length;
      const recorded = arr.filter(s => s !== '' && s !== '–').length;

      let monthlyStatus = 'No Record';
      if (presentCount === recorded && recorded > 0) monthlyStatus = 'Present';
      else if (presentCount > 0) monthlyStatus = 'Partial';
      else if (recorded > 0) monthlyStatus = 'Absent';
      return [...row, ...arr, monthlyStatus];
    });

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf]), `Attendance-${monthYear}.xlsx`);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#009999', fontSize: 32 }}>Monthly Attendance</h1>

      <div style={{ textAlign: 'center', marginBottom: 10 }}>
        <input type="month" value={monthYear} onChange={handleMonthChange}
          style={{ borderBottom: '1px solid #000', width: 200 }} />
      </div>

      {selectedMonth && (
        <>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>Selected: {monthYear}</div>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <input type="text" placeholder="Search Employee ID..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: 6, width: 250, border: '1px solid #ccc', borderRadius: 4 }} />
          </div>

          <div style={{ textAlign: 'right', marginBottom: 10 }}>
            <button onClick={downloadExcel}
              style={{ padding: '8px 12px', background: '#009999', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Download Excel
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr>
                  <th style={thStyle}>No.</th>
                  <th style={thStyle}>Employee ID</th>
                  {daysInMonth.map(d => <th key={d} style={thStyle}>{d}</th>)}
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp, idx) => {
                  const today = new Date();
                  const arr = daysInMonth.map(day => {
                    const future = selectedYear > today.getFullYear()
                      || (selectedYear === today.getFullYear() && selectedMonth > today.getMonth() + 1)
                      || (selectedYear === today.getFullYear()
                          && selectedMonth === today.getMonth() + 1
                          && day > today.getDate());
                    if (future) return '';
                    const status = statuses[emp.empId]?.[day];
                    return status === 'P' ? 'Present' : status === 'A' ? 'Absent' : '–';
                  });

                  const presentCount = arr.filter(s => s === 'Present').length;
                  const recorded = arr.filter(s => s !== '' && s !== '–').length;

                  let monthlyStatus = 'No Record';
                  if (presentCount === recorded && recorded > 0) monthlyStatus = 'Present';
                  else if (presentCount > 0) monthlyStatus = 'Partial';
                  else if (recorded > 0) monthlyStatus = 'Absent';

                  return (
                    <tr key={emp.id}>
                      <td style={tdStyle}>{idx + 1}</td>
                      <td style={{ ...tdStyle, textAlign: 'left', paddingLeft: 8 }}>{emp.empId}</td>
                      {arr.map((s, i) => <td key={i} style={tdStyle}>{s}</td>)}
                      <td style={{ ...tdStyle, fontWeight: 'bold', color: getStatusColor(monthlyStatus) }}>{monthlyStatus}</td>
                      <td style={tdStyle}>
                        <button onClick={() => getPunchDetail(emp.empId)}
                          disabled={loadingDetail === emp.empId}
                          style={{ padding: '4px 8px', fontSize: 12, background: '#00b3b3', color: '#fff', border: 'none', borderRadius: 3 }}>
                          {loadingDetail === emp.empId ? 'Loading...' : 'View'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ marginTop: 20, fontSize: 14 }}>
        <strong>Legend:</strong>
        <p>
          <span style={legendStyle}>Present = Employee was present</span>
          <span style={legendStyle}>Absent = Employee was absent</span>
          <span style={legendStyle}>– = No record</span>
        </p>
      </div>
    </div>
  );
};

const thStyle = { border: '1px solid #99cccc', padding: 4, backgroundColor: '#f0fafa' };
const tdStyle = { border: '1px solid #99cccc', padding: 4, textAlign: 'center' };
const legendStyle = { marginRight: 15 };

export default AttendanceSheet;
