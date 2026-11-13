import React from 'react';
import "./home.css"




function FirstSection() {


   const handleRedirect = () => {
    window.location.replace("http://localhost:3000/signup");
  }
    return ( 
        <div className='container p-5'>
            <div className='row text-center'>
                    <img src="media/images/home1.svg" alt='home1' className='mb-3  firstM' />
                    <h1 className='mt-1'>Invest in everything</h1>
                    <p>Online platform to invest in stocks and more.</p>
                    <button className='p-2 btn btn-primary' style={{width:"15%", margin:"0 auto", fontSize:"100%"}} onClick={handleRedirect}>Sign Up For Free</button>
            </div>
        </div>
     );
}

export default FirstSection;