import React, { useState } from "react";
import axios from "axios";
import '../css/setting.css';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext ";

const Setting = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [setting, setSetting] = useState({
    userId: user._id,
    oldpassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setSetting({ ...setting, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!setting.oldpassword || !setting.newPassword || !setting.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (setting.newPassword !== setting.confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:5000/v1/setting/change-password",
        {
          oldpassword: setting.oldpassword,
          newPassword: setting.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        navigate("/admindashbord/employee");
        setMessage("Password changed successfully.");
        setError("");
        setSetting({
          oldpassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setError(response.data.message || "Failed to change password.");
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.error || "Server error.");
    }
  };

  return (
    <div className="setting-container">
      <h2>Change Password</h2>

      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      <form onSubmit={handleSubmit} className="setting-setting">
        <div className="setting-group">
          <label>Old Password</label>
          <input
            type="password"
            name="oldpassword"
            value={setting.oldpassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="setting-group">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={setting.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="setting-group">
          <label>Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={setting.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="button-wrapper">
          <button type="submit" className="submit-btn">
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default Setting;
