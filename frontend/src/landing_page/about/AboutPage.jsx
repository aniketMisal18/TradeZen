import React from 'react';

import People from './People';
import SectionOne from './SectionOne';
import Navbar from '../Navbar';
import Footer from '../Footer';


function AboutPage() {
    return (

        <>
        <Navbar/>
            <SectionOne />
            
            <People />
            <Footer/>

        </>
    );
}

export default AboutPage;