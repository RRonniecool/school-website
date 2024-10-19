import React, { useState, useEffect } from 'react'; 
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Appointment from '../components/Appointment/Appointment';
import Carousel from '../components/Carousel/Carousel'
import Aboutus from '../components/AboutUs/AboutUs'
import Gallery from '../components/Gallery/Gallery'
import './homepage.css';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); 
    }, 1000);

    return () => clearTimeout(timer); 
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="loader">
          <img src={`${process.env.PUBLIC_URL}/book-loader.gif`} alt="Loading..." />
        </div>
      ) : (
        <div>
          <Header />
          <Carousel />
          <Aboutus />
          <Gallery />
          <Appointment />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default HomePage;
