import React from 'react';
import "./home.css"


function TrustSection() {
   return(
    <>
    <div className="container">
      <div className="row">
         <div className="col-6 trust-col ">
            <img src="media\images\largestBroker.svg" alt="" className='t-img'/>
         </div>
         <div className="col-6 trust-col">
            <h1 className='w-hundred pl=2'>Trust with confidence</h1>
            <p className='w-hundred pr=2'>Customer-first always
That's why 1.6+ crore customers trust Zerodha with ~ ₹6 lakh crores of equity investments, making us India’s largest broker; contributing to 15% of daily retail exchange volumes in India.</p>
             <h1>No spam or gimmicks</h1>
             <p  className='w-hundred pr=2'>
               No spam or gimmicks
No gimmicks, spam, "gamification", or annoying push notifications. High quality apps that you use at your pace, the way you like. Our philosophies.
             </p>

         </div>
      </div>
    </div>
    </>
   )
}

export default TrustSection;