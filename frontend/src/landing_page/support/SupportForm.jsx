// import React from 'react';

// function SupportForm() {
//     return (  
//         <>
//         i<h1>supportform</h1>
//         </>
//     );
// }

// export default SupportForm;





import axios from "axios";
import "./support.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SupportForm = () => {
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({
        type: "",
        text: ""
    });
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");


    const navigate = useNavigate();

    useEffect(() => {
        setName(name || "");
        setEmail(email || "");
        setPhone(phone || "");
    }, []);

    const categories = [
        "Account & Profile",
        "Funds & Payments",
        "Trading & Orders",
        "Holdings & Positions",
        "Technical Issues",
        "Other"
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (!category || !subject.trim() || !description.trim()) {
            setMessage({
                type: "error",
                text: "Please fill in all fields."
            });
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:3010/support/create",
                {
                    name,
                    email,
                    phone,
                    category,
                    subject,
                    description
                },
                {
                    withCredentials: true
                }
            );

            setMessage({
                type: "success",
                text: response.data.message || "Support request submitted successfully."
            });

            setTimeout(() => {
                navigate("/");
            }, 1000);

            setCategory("");
            setSubject("");
            setDescription("");

        } catch (error) {
            console.log("SUPPORT API ERROR:", error);
            console.log("SERVER RESPONSE:", error.response?.data);
            console.log("STATUS:", error.response?.status);

            setMessage({
                type: "error",
                text: error.response?.data?.message || error.message
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="support-container">

            <div className="support-header">
                <h2>Support</h2>
                <p>
                    How can we help you today? Select a category
                    and describe your issue.
                </p>
            </div>

            <div className="support-card">
                <form onSubmit={handleSubmit}>

                    <div className="support-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="support-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="support-group">
                        <label>Phone Number</label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                        />
                    </div>

                    <div className="support-group">
                        <label>Select a category</label>

                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">Select an issue category</option>

                            {categories.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="support-group">
                        <label>Subject</label>

                        <input
                            type="text"
                            placeholder="Enter your issue subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>

                    <div className="support-group">
                        <label>Describe your issue</label>

                        <textarea
                            rows="6"
                            placeholder="Describe your issue in detail..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {message.text && (
                        <div className={`support-message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="support-submit"
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </button>

                </form>
            </div>
        </div>
    );
};



export default SupportForm;
