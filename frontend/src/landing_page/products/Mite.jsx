import React from 'react';

function Mite() {
    return (
        <div className="container">
            <div className="row p-5 mt-5 border-top">
                <div className="col-4 ">
                    <img src="media\images\kite.png" alt=""  />
                </div>
                <div className="col-4 ">
                    
                </div>

                <div className="col-4  mt-5 p-3 ml-5">
                    <h2 className='mt-5 mb-3'>Mite</h2>
                    <p className='fs-5'>Our ultra-fast flagship trading platform with streaming market data, advanced charts, an elegant UI, and more. Enjoy the Kite experience seamlessly on your Android and iOS devices.</p>
                     <button className='p-2 btn ' style={{width:"40%", margin:"0 auto", fontSize:"110%", color:"blue" }}>try now &rarr;</button>
                </div>
            </div>
        </div>
    );
}

export default Mite;