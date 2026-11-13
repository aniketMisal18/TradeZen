import React from 'react';


function People() {
    return ( 
        <div className="container">
            <div className="row p-5 mt-5 border-top  ">
                <h1 className='text-center fs-3 mt-4'>People</h1>
                <div className="row mt-5 ">
                    <div className="col ml-5 text-center " >
                        <img src="media\images\nithinKamath.jpg" style={{ borderRadius: "100%", width:"50%", marginLeft:"20%" }} />
                        <p className='mt-4' style={{ marginLeft:"20%" }}><b>Aniket Misal</b> </p>
                        <p style={{ marginLeft:"20%" }}>CEO</p>
                    </div>
                    <div className="col fs-5">
                        <p>
                            Nithin bootstrapped and founded Zerodha in 2010 to overcome the hurdles he faced during his decade long stint as a trader. Today, Zerodha has changed the landscape of the Indian broking industry.
                        </p>
                        <p>
                            He is a member of the SEBI Secondary Market Advisory Committee (SMAC) and the Market Data Advisory Committee (MDAC).
                        </p>
                        <p>
                            Playing basketball is his zen.
                        </p>

                    </div>
                </div>
            </div>
        </div>
     );
}

export default People;