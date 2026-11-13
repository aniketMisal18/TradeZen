import React from 'react';
import "../css/nav.css"
import { Link } from 'react-router-dom';

function Navbar() {
    return (
        <>

            <nav className="navbar">
                <div className="container">
                    <img src="/logo.svg" alt="Logo" className="logo" />

                    <div className="nav-links">
                        <Link to={"/signup"}>Signup</Link>
                        <Link to={"/login"}>Login</Link>
                    </div>
                </div>
            </nav>

        </>
    );
}

export default Navbar;