import React from 'react';
import FirstSection from './FirstSection';
import TrustSection from './TrustSection';
import OpenAccount from '../OpenAccount';
import Navbar from '../Navbar';
import Footer from '../Footer';

function HomePage() {
    return ( 
        <>
        <Navbar/>
        <FirstSection/>
        <TrustSection/>
        <OpenAccount />
        <Footer/>

        </>
     );
}

export default HomePage;