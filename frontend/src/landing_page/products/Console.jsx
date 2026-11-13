import React from 'react';


function Console() {
    const handleRedirect = () => {
    window.location.replace("http://localhost:3000/signup");
  }
    return ( 
        <div className="container">
            <div className="row p-5 mt-1 border-top">
                <div className="col-4  mt-5 p-3 ">
                    <h2 className='mt-5 mb-3'>Concole</h2>
                    <p className='fs-5'>Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.</p>
                     <button className='p-2 btn ' style={{width:"40%", margin:"0 auto", fontSize:"110%", color:"blue" }} onClick={handleRedirect}>try now &rarr;</button>
                </div>
                

                
                <div className="col-4 " style={{marginLeft:"15%"  }}>
                    <img src="media\images\console.png" alt=""  />
                </div>
            </div>
        </div>
     );
}

export default Console;