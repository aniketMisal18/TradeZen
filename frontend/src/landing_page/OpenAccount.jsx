import React from 'react';

function OpenAccount() {

    const handleRedirect = () => {
    window.location.replace("http://localhost:3000/signup");
  };


    return (
        
            <div className='container p-5 mt-5'>
            <div className='row text-center mt-5'>
                <h1 className='mt-1'>Open a account</h1>
                <p>Modern platforms and apps, ₹0 investments, and flat ₹20 intraday and F&O trades.</p>
                <button onClick={handleRedirect} className='p-2 btn btn-primary mt-2' style={{ width: "17%", margin: "0 auto" }}>Sign Up For Free</button>
            </div>
        </div>

        
    );
}

export default OpenAccount;