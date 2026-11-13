import React from 'react';
import Mite from './Mite';
import Console from './Console';
import Navbar from '../Navbar';
import Footer from '../Footer';
import FirstSection from './FirstSection';

function ProductPage() {
    return ( 
        <>
        <Navbar/>
        <FirstSection/>
        <Mite/>
        <Console/>
        <Footer/>
        </>
     );
}

export default ProductPage;