// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import '../css/ViewSalary.css';

// const ViewSalary = () => {
//   const [salaries, setSalaries] = useState([]);
//   const [filteredSalaries, setFilteredSalaries] = useState([]);
//   const { id } = useParams();

//   const fetchSalaries = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("No token found. Please login.");
//         return;
//       }

//       const response = await axios.get(`http://localhost:5000/api/salary/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.data.success) {
//         setSalaries(response.data.data || []);
//         setFilteredSalaries(response.data.data || []);
//       } else {
//         alert("Failed to fetch salary data");
//       }
//     } catch (error) {
//       console.error("Fetch error:", error);
//       alert(error.response?.data?.error || "Something went wrong");
//     }
//   };

//   useEffect(() => {
//     fetchSalaries();
//   }, []);

//   const handleSearch = (e) => {
//     const query = e.target.value.trim().toLowerCase();
//     if (!query) return setFilteredSalaries(salaries);

//     const filtered = salaries.filter(salary =>
//       salary.employeeId?.employeeId?.toLowerCase().includes(query)
//     );
//     setFilteredSalaries(filtered);
//   };

//   return (
//     <div className="view-salary-container">
//       <h2 className="title">Salary History</h2>
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search by Employee ID"
//           onChange={handleSearch}
//           className="search-input"
//         />
//       </div>

//       {filteredSalaries.length > 0 ? (
//         <table className="salary-table">
//           <thead>
//             <tr>
//               <th>SNO</th>
//               <th>Emp ID</th>
//               <th>Basic Salary</th>
//               <th>Total Allowance</th>
//               <th>Allowance Details</th>
//               <th>Total Deduction</th>
//               <th>Deduction Details</th>
//               <th>pay Salary</th>
//               <th>Pay Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredSalaries.map((salary, index) => (
//               <tr key={salary._id}>
//                 <td>{index + 1}</td>
//                 <td>{salary.employeeId?.employeeId || "N/A"}</td>
//                 <td>{salary.basicSalary}</td>
//                 <td>{salary.allowances}</td>
//                 <td>
//                   {salary.allowanceDetails?.length > 0 ? (
//                     <ul>
//                       {salary.allowanceDetails.map((item, idx) => (
//                         <li key={idx}>
//                           {item.name}: ₹{item.amount}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>{salary.deductions}</td>
//                 <td>
//                   {salary.deductionDetails?.length > 0 ? (
//                     <ul>
//                       {salary.deductionDetails.map((item, idx) => (
//                         <li key={idx}>
//                           {item.name}: ₹{item.amount}
//                         </li>
//                       ))}
//                     </ul>
//                   ) : (
//                     "N/A"
//                   )}
//                 </td>
//                 <td>{salary.netSalary}</td>
//                 <td>{new Date(salary.payDate).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <div>No Records Found</div>
//       )}
//     </div>
//   );
// };

// export default ViewSalary;


import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import "../css/ViewSalary.css";
import dxcLogo from "../assets/wal.jpg";

const ViewSalary = () => {
  const [salaries, setSalaries] = useState([]);
  const [filteredSalaries, setFilteredSalaries] = useState([]);
  const { id } = useParams();

  const fetchSalaries = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No token found. Please login.");
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/salary/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setSalaries(response.data.data || []);
        setFilteredSalaries(response.data.data || []);
      } else {
        alert("Failed to fetch salary data");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) return setFilteredSalaries(salaries);

    const filtered = salaries.filter((salary) =>
      salary.employeeId?.employeeId?.toLowerCase().includes(query)
    );
    setFilteredSalaries(filtered);
  };

  const numberToWords = (num) => {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
      if (n === 0) return 'Zero';
      if (n < 20) return a[n];
      if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
      if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
      if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
      if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
      return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
    };

    return inWords(Math.floor(num)) + ' Rupees Only';
  };

  const downloadPDF = (salary) => {
    const doc = new jsPDF();
    const emp = salary.employeeId || {};
    const logo = new Image();
    logo.src = dxcLogo;

    logo.onload = () => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(10);

      doc.text("savtech solution Private Limited (formerly known as CSC Technologies India Private Limited)", 10, 15);
      doc.text("3th Floor, cisco , near foolmandi", 10, 21);
      doc.text("noida Industrial Estate, Gautambudhnagar Noida Uttar Pradesh - 201301", 10, 27);
      doc.addImage(logo, "PNG", 160, 10, 35, 15);
      doc.line(10, 30, 200, 30);

      const payDate = new Date(salary.payDate);
      const month = payDate.toLocaleString("default", { month: "long" });
      const year = payDate.getFullYear();

      doc.setFontSize(12);
      doc.setFont("Helvetica", "bold");
      doc.text(`Payslip for the month of ${month} ${year}`, 105, 38, { align: "center" });

      let y = 45;

      const drawField = (label, value, x, y, width = 90, height = 8) => {
        doc.setFont("Helvetica", "normal");
        doc.rect(x, y, width, height);
        doc.text(`${label}: ${value}`, x + 2, y + 5);
      };

      drawField("Employee ID", emp.employeeId || "N/A", 10, y);
      drawField("Name", emp.name || "N/A", 110, y);
      y += 10;
      drawField("Email", emp.email || "N/A", 10, y);
      drawField("Department", emp.department?.name || "N/A", 110, y);
      y += 10;
      drawField("Designation", emp.designation || "N/A", 10, y);
      drawField("Pay Date", payDate.toLocaleDateString(), 110, y);
      y += 15;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Earnings & Allowances", 15, y);
      doc.text("Deductions", 125, y);
      y += 5;

      doc.setFont("Helvetica", "bold");
      doc.setFontSize(10);
      doc.setFillColor(230);
      doc.rect(10, y, 90, 8);
      doc.text("Name", 12, y + 5);
      doc.text("Amount", 60, y + 5);
      doc.text("YTD", 75, y + 5);

      doc.rect(110, y, 90, 8);
      doc.text("Name", 112, y + 5);
      doc.text("Amount", 160, y + 5);
      doc.text("YTD", 175, y + 5);

      y += 9;

      const maxRows = Math.max(
        salary.allowanceDetails?.length || 0,
        salary.deductionDetails?.length || 0
      );

      doc.setFont("Helvetica", "normal");
      for (let i = 0; i < maxRows; i++) {
        const earn = salary.allowanceDetails?.[i];
        const ded = salary.deductionDetails?.[i];

        doc.rect(10, y, 90, 8);
        if (earn) {
          doc.text(`${earn.name}`, 12, y + 5);
          doc.text(`${earn.amount.toFixed(2)}`, 60, y + 5, { align: "right" });
          doc.text(`${(earn.ytdAmount || 0).toFixed(2)}`, 95, y + 5, { align: "right" });
        }

        doc.rect(110, y, 90, 8);
        if (ded) {
          doc.text(`${ded.name}`, 112, y + 5);
          doc.text(`${ded.amount.toFixed(2)}`, 160, y + 5, { align: "right" });
          doc.text(`${(ded.ytdAmount || 0).toFixed(2)}`, 195, y + 5, { align: "right" });
        }

        y += 9;
      }

      y += 5;

      const summary = [
        { label: "Basic Salary", value: `${salary.basicSalary}` },
        { label: "Total Allowances", value: `${salary.allowances}` },
        { label: "Total Deductions", value: `${salary.deductions}` },
        { label: "Net Salary", value: `${salary.netSalary}` },
      ];

      doc.setFont("Helvetica", "bold");
      summary.forEach((item) => {
        doc.rect(10, y, 190, 8);
        doc.text(`${item.label}:`, 12, y + 5);
        doc.text(`${item.value}`, 190, y + 5, { align: "right" });
        y += 8;
      });

      const netSalaryWords = numberToWords(salary.netSalary);
      doc.setFont("Helvetica", "normal");
      doc.rect(10, y, 190, 8);
      doc.text("Net Salary (in Words):", 12, y + 5);
      doc.text(netSalaryWords, 55, y + 5);
      y += 18;

      doc.setFont("Helvetica", "italic");
      doc.setFontSize(9);
      doc.text('"Reimb" - Denotes Reimbursement', 10, y);

      y += 6;
      const footerNote = `This is an auto generated payslip, therefore does not require a seal and signature. 
If you have any questions regarding the contents of this payslip, please contact HRConnect.`;
      const lines = doc.splitTextToSize(footerNote, 190);
      doc.text(lines, 10, y + 5);

      doc.save(`${emp.employeeId || "salary"}_slip.pdf`);
    };
  };

  return (
    <div className="view-salary-container">
      <h2 className="title">Salary History</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by Employee ID"
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      {filteredSalaries.length > 0 ? (
        <table className="salary-table">
          <thead>
            <tr>
              <th>SNO</th>
              <th>Emp ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Pay Date</th>
              <th>Download</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.map((salary, index) => (
              <tr key={salary._id}>
                <td>{index + 1}</td>
                <td>{salary.employeeId?.employeeId || "N/A"}</td>
                <td>{salary.employeeId?.name || "N/A"}</td>
                <td>{salary.employeeId?.email || "N/A"}</td>
                <td>{salary.employeeId?.department?.name || "N/A"}</td>
                <td>{salary.employeeId?.designation || "N/A"}</td>
                <td>{salary.basicSalary}</td>
                <td>{salary.allowances}</td>
                <td>{salary.deductions}</td>
                <td>{salary.netSalary}</td>
                <td>{new Date(salary.payDate).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => downloadPDF(salary)}>Download</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div>No Records Found</div>
      )}
    </div>
  );
};

export default ViewSalary;
