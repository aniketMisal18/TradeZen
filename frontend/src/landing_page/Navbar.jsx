import React from 'react';
import "./nav.css"
import { Link } from 'react-router-dom';

function Navbar() {

    const handleRedirect = () => {
    window.location.replace("http://localhost:3000/signup");
  };

    return (
        <>

            <nav class="navbar navbar-expand-lg border-bottom bg-w">
                <div class="container p-1">
                    <Link to={"/"}>
                    <img src="media\images\logo.svg" alt="abc" class="navbar-brand" />
                    </Link>
                    
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">

                        <form class="d-flex" role="search">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                
                                <li class="nav-item">
                                    <Link class="nav-link active" onClick={handleRedirect}>SignUp</Link>
                                </li>
                                
                                <li class="nav-item">
                                    <Link class="nav-link active " to={"/products"}>Products</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link active " to={"/support"}>Support</Link>
                                </li>
                                <li class="nav-item">
                                    <Link class="nav-link active " to={"/about"}>about</Link>
                                </li>
                            </ul>
                        </form>
                    </div>
                </div>
            </nav>

        </>
    );
}

export default Navbar;