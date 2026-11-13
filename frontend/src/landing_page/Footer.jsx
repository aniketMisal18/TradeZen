import React from 'react';
import "./footer.css"
import { Link } from 'react-router-dom';


function Footer() {
     const handleRedirect = () => {
    window.location.replace("http://localhost:3000/signup");
  };
    return ( 
        
            <div className="row f-con border-top ">
                <div className="col">
                    <img src="media\images\logo.png" alt="" className='logo-w m-4' />
                </div>
                <div className="col">
                    <p>Account</p>
                    <Link onClick={handleRedirect}>open account</Link>
                </div>
                <div className="col">
                    <p>Company</p>
                    
                    <Link to={"/about"}>About</Link>

                </div>
                <div className="col">
                    <p>Support</p>
                    <a href="">Contact</a>
                    <Link to={"/support"}>Contact</Link>
                </div>
            </div>
       
     );
}

export default Footer;