
import React, { useState } from "react";
import Navbar from "./nav";
import "../css/signup.css";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify"
import { handleError, handleSucess } from "../utils/utils";


function Signup() {

    const [signUpinfo, setSignUpinfo] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    })

const navigate = useNavigate();

    const handleChange = (e) => {
        let { name, value } = e.target;
        let copySignupInfo = { ...signUpinfo };
        copySignupInfo[name] = value;
        setSignUpinfo(copySignupInfo);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { fullName, phone, password, email } = signUpinfo;
        if (!fullName || !phone || !password || !email) {
            return handleError("Plese fill all detales");
        }
        try {
            const url = "http://localhost:3010/auth/signup";
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(signUpinfo)
            });
            const result = await response.json();
            const {success,error, message} = result;
            if(success){
                handleSucess(message);
                setTimeout(()=>{
                    navigate("/login");

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

            <div className="signup-container">
                <div className="signup-card">
                    <h1>Open a free account</h1>
                    <p>Start investing and trading with ease.</p>

                    <form className="signup-form">
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="fullName"
                            onChange={handleChange}
                            value={signUpinfo.fullName}
                        />

                        <input
                            type="tel"
                            placeholder="Phone Number"
                            name="phone"
                            onChange={handleChange}
                            value={signUpinfo.phone}
                        />

                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            onChange={handleChange}
                            value={signUpinfo.email}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={handleChange}
                            value={signUpinfo.password}
                        />

                        <button type="submit" onClick={handleSubmit}>Sign up</button>
                    </form>

                    <p className="login-text">
                        Already have an account?
                        <Link to={"/login"}>Login</Link>
                    </p>
                </div>
                <ToastContainer />
            </div>
        </>
    );
}

export default Signup;