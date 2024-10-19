import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import './carousel.css';
import slide1 from '../../images/slide1.jpg';
import slide2 from '../../images/slide2.jpg';
import slide3 from '../../images/slide3.jpg';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: slide1,
      title: 'Welcome to Our School',
      description: 'Empowering the next generation with knowledge and skills.',
      link: '/portal',
    },
    {
      image: slide2,
      title: 'Education is our Business',
      description: 'We offer a wide range of educational programs for all ages.',
      link: '/portal',
    },
    {
      image: slide3,
      title: 'Join Our Community',
      description: 'Become part of our vibrant learning environment.',
      link: '/portal',
    },
  ];

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === slides.length - 1 ? 0 : prevSlide + 1));
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? slides.length - 1 : prevSlide - 1));
  };

  useEffect(() => {
    const slideInterval = setInterval(() => {
      nextSlide();
    }, 5000); 

    return () => clearInterval(slideInterval);
  }, [nextSlide]);

  return (
    <div className="carousel-container">
      <FaArrowLeft className="left-arrow" onClick={prevSlide} />

      <div
        className={`carousel-slide fade-in`} 
        style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
      >
        <div className="carousel-overlay"></div> {}
        <div className="carousel-text slide-in"> {}
          <h2>{slides[currentSlide].title}</h2>
          <p>{slides[currentSlide].description}</p>
          <Link to={slides[currentSlide].link} className="carousel-link">
            Go to Student Portal <span>< FaArrowRight/></span>
          </Link>
        </div>
      </div>

      <FaArrowRight className="right-arrow" onClick={nextSlide} />
    </div>
  );
};

export default Carousel;
