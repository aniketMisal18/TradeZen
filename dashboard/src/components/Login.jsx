import React, { useState } from "react";
import Navbar from "./nav";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import { handleError, handleSucess } from "../utils/utils";

import { useUser } from "../context/UserContext";



function Login() {

    const [logIninfo, setlogIninfo] = useState({
        
        email: "",
        
        password: "",
    })
const { setUser } = useUser();
const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        let copyloginInInfo = { ...logIninfo };
        copyloginInInfo[name] = value;
        setlogIninfo(copyloginInInfo);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {  password, email } = logIninfo;
        if ( !password || !email) {
            return handleError("Plese fill all detales");
        }
        try {
            const url = "http://localhost:3010/auth/login";
            const response = await fetch(url, {
                method: 'POST', 
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logIninfo)
            });
            const result = await response.json();
            const {success,error, userid, message} = result;
            if(success){
                handleSucess(message);
                setTimeout(()=>{
                    navigate("/console");

                }, 1000)
            }else if(error){
                 const msg = error?.details[0].message;
                 handleError(msg);
            }else if(!success){
                 
                 handleError(message);
            }
            console.log(result);
        } catch (error) {
               handleError(error);
        }
    }






  return (
    <>
      <Navbar />

      <div className="login-container">
        <div className="login-card">
          <h1>Login</h1>
          <p>Welcome back! Sign in to continue.</p>

          <form className="login-form">
            <input
              type="email"
              placeholder="Email Address"
              name="email"
              onChange={handleChange}
              value={logIninfo.email}
            />

            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange} 
              value={logIninfo.password}
            />

            <button type="submit" onClick={handleSubmit}>Login</button>
          </form>

          <p className="signup-text">
            Don't have an account?
            
            <Link to={"/signup"}>Signup</Link>
          </p>
        </div>
        <ToastContainer/>
      </div>
    </>
  );
}

export default Login;