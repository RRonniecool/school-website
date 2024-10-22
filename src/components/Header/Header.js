import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './header.css';
import logo from '../../images/logo.png';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaExternalLinkAlt, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);

 
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      {/* School Info Section */}
      <div className="school-info">
        <p><span><FaPhoneAlt /></span>+2349056819035</p>
        <p><span><FaEnvelope /></span>info.jesuschildrenschool@gmail.com</p>
        <p><span><FaClock /></span>School Time: 08:00am - 2:00pm</p>
      </div>

      {/* School Logo and Navigation */}
      <div className="school-personal-info">
        <div className="logo-container">
          <img src={logo} alt="School Logo" className="header-logo" />
          <p>JSc OWERRI</p>

          <div className="info-container">
            <div className="info">
              <span><FaPhoneAlt /></span>
              <div>
                <p>Call Now</p>
                <small>+2349056819035</small>
              </div>
            </div>
            <div className="info">
              <span><FaEnvelope /></span>
              <div>
                <p>Send an Email</p>
                <small>info.jesuschildrenschool@gmail.com</small>
              </div>
            </div>
            <div className="info">
              <span><FaMapMarkerAlt /></span>
              <div>
                <p>Our Location</p>
                <small>Umuchima Ihiagwa, Owerri West. Imo State.</small>
              </div>
            </div>
          </div>
        </div>

        {/* Hamburger Menu and Navigation Links */}
        {isMenuOpen ? (
            <FaTimes className="hamburger-icon" onClick={toggleMenu} style={{ color: 'red' }} />
          ) : (
            <FaBars className="hamburger-icon" onClick={toggleMenu} />
          )}

          <nav className={`school-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><a href="#our-gallery">Our Gallery</a></li>
              <li><Link to="/login">Student Portal</Link></li>
              <li><a href="#footer">Contact Us</a></li>
              <li><a href="#about-us">About Us</a></li>
              <li><a href="#contact-us">Book an Appointment</a></li>
              <li><Link to="/signup" id='school-portal'>School portal <span><FaExternalLinkAlt /></span></Link></li>
            </ul>
          </nav>
      </div>
    </header>
  );
};

export default Header;
