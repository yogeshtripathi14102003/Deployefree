import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import "../Punchin/punching.css";
import { fetchDepartments, getEmployees } from "../utils/EmployeeHelper";

const PunchCard = () => {
  const [formData, setFormData] = useState({
    employeeId: "",
    department: "",
    mode: "In Office", // ✅ Added work mode
  });
  const [departments, setDepartments] = useState([]);
  const [employeeList, setEmployeeList] = useState([]);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [pendingPunch, setPendingPunch] = useState(null);
  const [punchData, setPunchData] = useState([]);

  // Load departments on mount
  useEffect(() => {
    const loadDepartments = async () => {
      const deps = await fetchDepartments();
      setDepartments(deps);
    };
    loadDepartments();

    const savedId = localStorage.getItem("employeeId");
    if (savedId) setFormData((prev) => ({ ...prev, employeeId: savedId }));
  }, []);

  useEffect(() => {
    if (!formData.department) return;
    const loadEmployees = async () => {
      const emps = await getEmployees(formData.department);
      setEmployeeList(emps);
    };
    loadEmployees();
  }, [formData.department]);

  useEffect(() => {
    if (!formData.employeeId) return;
    const fetchPunches = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/v1/punch/${formData.employeeId}`);
        const data = res.data || [];
        setPunchData(data);

        const today = new Date().toISOString().split("T")[0];
        const todayPunch = data.find(p => p.punchIn?.startsWith(today) && !p.punchOut);
        if (todayPunch?._id) {
          localStorage.setItem("todayPunchId", todayPunch._id);
        } else {
          localStorage.removeItem("todayPunchId");
        }
      } catch (err) {
        console.error("Failed to fetch punch data", err);
      }
    };
    fetchPunches();
  }, [formData.employeeId]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Location not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocation(`Lat: ${latitude.toFixed(6)}, Lng: ${longitude.toFixed(6)}`);
      },
      (err) => {
        console.warn("Geolocation error:", err.message);
        setLocation("Location access denied");
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "employeeId") {
        localStorage.setItem("employeeId", value);
      }
      return updated;
    });
  };

  const handlePunchClick = (type) => {
    if (!formData.employeeId) {
      alert("Please select an employee before punching.");
      return;
    }
    setPendingPunch(type);
    setShowModal(true);
    getCurrentLocation();
  };

  const confirmPunch = () => {
    setShowModal(false);
    if (pendingPunch === "in") punchIn();
    if (pendingPunch === "out") punchOut();
    setPendingPunch(null);
  };

  const punchIn = async () => {
    const punchTime = new Date().toISOString();
    try {
      const res = await axios.post("http://localhost:5000/v1/punch-in", {
        employeeId: formData.employeeId,
        punchIn: punchTime,
        locationIn: location,
        mode: formData.mode, // ✅ Send mode
      });

      if (res.data?._id) {
        localStorage.setItem("todayPunchId", res.data._id);
      }

      setMessage("✅ Punch In recorded.");
    } catch (error) {
      console.error("Punch-In error", error);
      setMessage("❌ Failed to punch in.");
    }
  };

  const punchOut = async () => {
    const punchTime = new Date().toISOString();

    try {
      const employeeId = formData.employeeId;
      if (!employeeId) {
        setMessage("❌ No employee selected.");
        return;
      }

      await axios.post("http://localhost:5000/v1/punch-out", {
        employeeId,
        punchOut: punchTime,
        locationOut: location,
        mode: formData.mode, // ✅ Send mode
      });

      localStorage.removeItem("todayPunchId");
      setMessage("✅ Punch Out recorded.");
    } catch (error) {
      console.error("Punch-Out error", error);
      setMessage("❌ Failed to punch out.");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Select Employee</h2>
        <form>
          <label>
            Department:
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep._id} value={dep._id}>{dep.dep_name}</option>
              ))}
            </select>
          </label>

          <label>
            Employee:
            <select name="employeeId" value={formData.employeeId} onChange={handleChange} required>
              <option value="">Select Employee</option>
              {employeeList.map((emp) => (
                <option key={emp._id} value={emp._id}>{emp.employeeId}</option>
              ))}
            </select>
          </label>

          <label>
            Work Mode:
            <select name="mode" value={formData.mode} onChange={handleChange} required>
              <option value="In Office">In Office</option>
              <option value="Onsite">Onsite</option>
            </select>
          </label>

          <div style={styles.buttonGroup}>
            <button type="button" style={styles.punchIn} onClick={() => handlePunchClick("in")}>🟢 Punch In</button>
            <button type="button" style={styles.punchOut} onClick={() => handlePunchClick("out")}>🔴 Punch Out</button>
          </div>
          {message && <p>{message}</p>}
        </form>
      </div>

      <div style={styles.calendarCard}>
        <h3>📅 Punch Calendar</h3>
        <Calendar
          tileContent={({ date }) => {
            const day = date.toISOString().split("T")[0];
            const punch = punchData.find(p => p.punchIn?.split("T")[0] === day);
            if (punch) {
              return (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: punch.punchOut ? "blue" : "black",
                    margin: "0 auto",
                    marginTop: 2,
                  }}
                />
              );
            }
            return null;
          }}
        />
      </div>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3>📍 Confirm Your Location</h3>
            <p>{location || "Fetching location..."}</p>
            <button style={styles.modalBtn} onClick={confirmPunch}>Confirm</button>
            <button style={{ ...styles.modalBtn, backgroundColor: "#ccc" }} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    alignItems: "center",
  },
  card: {
    background: "#fff",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
  },
  buttonGroup: {
    display: "flex",
    gap: "1rem",
    marginTop: "1rem",
  },
  punchIn: {
    padding: "0.5rem 1rem",
    backgroundColor: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  punchOut: {
    padding: "0.5rem 1rem",
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  calendarCard: {
    background: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
  },
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "blue",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    textAlign: "center",
    width: "90%",
    maxWidth: "400px",
  },
  modalBtn: {
    padding: "0.75rem 1.5rem",
    margin: "0.5rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default PunchCard;
