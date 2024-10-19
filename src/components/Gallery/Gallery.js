import React, { useState, useEffect } from 'react';
import './gallery.css';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

import image1 from '../../images/image1.jpg';
import image2 from '../../images/image2.jpg';
import image3 from '../../images/image3.jpg';
import image4 from '../../images/slide1.jpg';
import image5 from '../../images/slide2.jpg'; 
import image6 from '../../images/slide3.jpg'; 
import image7 from '../../images/about11.jpg';
import image8 from '../../images/about1.jpg';  
import image9 from '../../images/about3.jpg';  
import image10 from '../../images/primary.jpg';
import image11 from '../../images/nursery.jpg';
import image12 from '../../images/primary4.jpg';
import image13 from '../../images/primary5.jpg';
import image14 from '../../images/primary6.jpg';

const Gallery = () => {
  const images = [image1, image2, image3, image4, image5, image6, image7, image8, image9, image10, image11, image12, image13, image14];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="gallery-container" id='our-gallery'>
      <h2>Our <span>Gallery</span> </h2>
      <div className="gallery-slider">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active' : ''}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <FaArrowLeft className="gallery-left-arrow" onClick={prevSlide} />
      <FaArrowRight className="gallery-right-arrow" onClick={nextSlide} />
    </div>
  );
};

export default Gallery;
