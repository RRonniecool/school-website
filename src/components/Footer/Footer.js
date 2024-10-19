import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import './footer.css';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://formspree.io/f/xbljjeeo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });

        if (response.ok) {
            alert('Thank you for subscribing to our newsletter!');
            setEmail('');  // Clear the input field after successful submission
        } else {
            alert('There was an issue with the subscription. Please try again.');
        }
    };

    return (
        <div className='footer' id='footer'>
            <div className='footer-container'>
                <div className='footer-section'>
                    <h3>Get In Touch</h3>
                    <p><FaMapMarkerAlt /> Umuchima Ihiagwa, Owerri West, Imo State</p>
                    <p><FaPhoneAlt /> +234 534 2342 344</p>
                    <p><FaEnvelope /> info.jesussecsch@gmail.com</p>
                </div>

                <div className='footer-section'>
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/gallery">Our Gallery</Link></li>
                        <li><Link to="/login">Student Portal</Link></li>
                        <li><Link to="/contact-us">Contact Us</Link></li>
                        <li><Link to="/about-us">About Us</Link></li>
                    </ul>
                </div>

                <div className='footer-section newsletter-section'>
                    <h3>Newsletter</h3>
                    <p>Stay updated with our latest news and events.</p>
                    <form className="newsletter-form" onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            placeholder="Your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                        <button type="submit">Sign Up</button>
                    </form>
                </div>
            </div>

            <div className='footer-bottom'>
                <p>&copy; 2024 Jesus Children Academy. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Footer;
