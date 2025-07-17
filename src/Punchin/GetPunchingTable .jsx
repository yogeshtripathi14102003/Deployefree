import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Punchingcss/GetPunching.css";

const SHIFT_HOURS = 8.5;

function msToTime(duration) {
  const minutes = Math.floor((duration / (1000 * 60)) % 60);
  const hours = Math.floor(duration / (1000 * 60 * 60));
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

const GetPunchingTable = () => {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [lookupId, setLookupId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [approvedIds, setApprovedIds] = useState([]);

  const enhance = (records = []) =>
    records.map((r) => {
      const inT = r.punchIn ? new Date(r.punchIn) : null;
      const outT = r.punchOut ? new Date(r.punchOut) : null;
      const durationMs = outT && inT ? outT - inT : 0;
      const totalHrs = durationMs / 3600000;
      const shiftEnd = inT
        ? new Date(inT.getTime() + SHIFT_HOURS * 3600000)
        : null;
      const overtimeMs = outT && shiftEnd && outT > shiftEnd ? outT - shiftEnd : 0;
      const dateStr = inT ? inT.toISOString().split("T")[0] : null;
      const isMissPunch = inT && !outT;

      return {
        ...r,
        mode: r.mode?.trim().toLowerCase(),
        locationIn: r.locationIn || "-",
        locationOut: r.locationOut || "-",
        durationMs,
        formattedDuration: outT ? msToTime(durationMs) : "Miss Punch",
        totalHours: totalHrs,
        halfDay: totalHrs >= 4 && totalHrs < 8,
        overTime: overtimeMs / 3600000,
        dateStr,
        isMissPunch,
        status: inT && outT ? "P" : "A",
      };
    });

  useEffect(() => {
    axios
      .get("http://localhost:5000/v1/punch")
      .then((res) => {
        const enhanced = enhance(res.data);
        setData(enhanced);
        setFiltered(enhanced);
      })
      .catch(() => setError("Failed to load punch data."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(
      data.filter((r) => {
        const matchesId = r.employeeId
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesMode = modeFilter
          ? r.mode === modeFilter.toLowerCase()
          : true;
        const matchesMonth = monthFilter
          ? r.dateStr?.startsWith(monthFilter)
          : true;
        return matchesId && matchesMode && matchesMonth;
      })
    );
  }, [searchTerm, data, modeFilter, monthFilter]);

  const handleApproveAll = async () => {
    try {
      const idsToApprove = filtered
        .filter((r) => !approvedIds.includes(r._id))
        .map((r) => r._id);

      await axios.post("http://localhost:5000/v1/punch/approve", {
        ids: idsToApprove,
      });

      setApprovedIds((prev) => [...prev, ...idsToApprove]);
      alert("All filtered records approved successfully.");
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Failed to approve all records.");
    }
  };
  const handleApproveById = async (id) => {
    try {
      await axios.post(`http://localhost:5000/v1/approve/${id}`);
      setApprovedIds((prev) => [...prev, id]);
      alert(`Record ${id} approved successfully.`);
    } catch (err) {
      console.error("Approval failed:", err);
      alert(`Failed to approve record ${id}.`);
    }
  };

  const payableDaysMap = filtered.reduce((map, r) => {
    if (r.employeeId && r.punchIn && r.punchOut && r.dateStr) {
      if (!map[r.employeeId]) map[r.employeeId] = new Set();
      map[r.employeeId].add(r.dateStr);
    }
    return map;
  }, {});

  const totalPayableDays = Object.values(payableDaysMap).reduce(
    (sum, set) => sum + set.size,
    0
  );

  const totalHalfDays = filtered.filter((r) => r.halfDay).length;
  const totalOverTime = filtered.reduce((sum, r) => sum + r.overTime, 0);
  const totalOutsideDays = filtered.filter((r) => r.mode === "onsite").length;
  const totalMissPunches = filtered.filter((r) => r.isMissPunch).length;

  const halfDaysForId = lookupId
    ? data.filter((r) => r.employeeId === lookupId && r.halfDay).length
    : 0;

  return (
    <div className="punching-table-wrapper">
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search Employee ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="month"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
        <select
          value={modeFilter}
          onChange={(e) => setModeFilter(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option value="">All Modes</option>
          <option value="in office">In Office</option>
          <option value="onsite">Onsite</option>
        </select>
      </div>

      <div style={{ margin: "1rem 0" }}>
        <input
          type="text"
          placeholder="Lookup ID for half-day count"
          value={lookupId}
          onChange={(e) => setLookupId(e.target.value)}
        />
        {lookupId && (
          <p>
            Total half-day entries for <strong>{lookupId}:</strong> {halfDaysForId}
          </p>
        )}
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <>
          <table className="punching-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Punch In</th>
                <th>In Loc</th>
                <th>Punch Out</th>
                <th>Out Loc</th>
                <th>Worked (HH:MM)</th>
                <th>Half-Day?</th>
                <th>Overtime (hrs)</th>
                <th>Status</th>
                <th>Mode</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, idx) => (
                <tr key={r._id || idx} className={r.isMissPunch ? "miss-punch-row" : ""}>
                  <td>{r.employeeId}</td>
                  <td>{r.dateStr}</td>
                  <td>{r.punchIn ? new Date(r.punchIn).toLocaleTimeString() : "-"}</td>
                  <td>{r.locationIn}</td>
                  <td>{r.punchOut ? new Date(r.punchOut).toLocaleTimeString() : "-"}</td>
                  <td>{r.locationOut}</td>
                  <td style={r.isMissPunch ? { color: "red", fontWeight: "bold" } : {}}>
                    {r.formattedDuration}
                  </td>
                  <td>{r.halfDay ? "✅" : "—"}</td>
                  <td>{r.overTime.toFixed(2)}</td>
                  <td style={{ fontWeight: "bold", color: r.status === "A" ? "red" : "green" }}>
                    {r.status}
                  </td>
                  <td>{r.mode || "-"}</td>
                  <td>
                    <button
                      onClick={() => handleApproveById(r._id)}
                      disabled={approvedIds.includes(r._id)}
                      style={{
                        padding: "4px 8px",
                        backgroundColor: approvedIds.includes(r._id) ? "#aaa" : "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: approvedIds.includes(r._id) ? "not-allowed" : "pointer",
                      }}
                    >
                      {approvedIds.includes(r._id) ? "Approved" : "Approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button
              onClick={handleApproveAll}
              style={{
                padding: "8px 16px",
                background: "#009999",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Approve All Filtered Records
            </button>
          </div>

          <div className="totals-summary" style={{ marginTop: "1rem" }}>
            <p>Total payable days: <strong>{totalPayableDays}</strong></p>
            <p>Total half-day entries: {totalHalfDays}</p>
            <p>Total overtime hours: {totalOverTime.toFixed(2)}</p>
            <p>Total onsite days: {totalOutsideDays}</p>
            <p style={{ color: "red" }}>
              Total missed punches: <strong>{totalMissPunches}</strong>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default GetPunchingTable;
