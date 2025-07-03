import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import '../css/Login.css';
import {useAuth} from '../Context/AuthContext '
import FrontNavbar from '../component/FrontNabar';
  const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const {login} = useAuth ();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
   
    try {
      const response = await axios.post(
        "http://localhost:5000/v1/auth/login",
        {  email, password },
        
      );

      if (response.data.success ) {
        login(response.data.user)
        localStorage.setItem("token", response.data.token)
        if(response.data.user.role === "admin"){
         navigate("/admindashbord ")
        }else{
          navigate("/Employeedashbord")
        }

      }
        
    } catch (error) {
    if(error.response && !error.response.data.success ){
setError(error.response.data.error)
    }
    else{
      setError("server error")
    }
  } 
  };
  return (
    <div>
        <FrontNavbar />
      <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">
          Let's Grow <br />{" "}
          <span style={{ color: "rgb(22 63 129 / 94%)" }}>With Savtech</span>
        </h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div>
            {/* <label className="login-label">Email</label> */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="login-input  "
            />
          </div>
          <div>
            <label className="login-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="login-input"
            />
          </div>
          <button type="submit" className="login-button" >
     Login
          </button>
        </form>
        <div className="login-links">
          <Link to="/ForgetPasswordPage" className="login-link">
            Forgot Password?
          </Link>
          <span> | </span>
          <Link to="/RegisterPage" className="login-link">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
    </div>
  )
};
export default Login
