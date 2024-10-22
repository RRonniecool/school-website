import React, { useState } from 'react';
import class4 from '../../images/image2.jpg';
import './appointment.css';

const Appointment = () => {
    const [formData, setFormData] = useState({
        guardianName: '',
        guardianEmail: '',
        childName: '',
        childAge: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('https://formspree.io/f/myzyzjgg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Form submitted successfully!');
        } else {
            alert('Failed to submit form.');
        }
    };

    return (
        <div className="appointment-container" id="contact-us">
            <div className="form">
                <h1>Make Appointment</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="guardianName"
                        placeholder="Guardian Name"
                        value={formData.guardianName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="guardianEmail"
                        placeholder="Guardian Email"
                        value={formData.guardianEmail}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="childName"
                        placeholder="Child Name"
                        value={formData.childName}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="childAge"
                        placeholder="Child Age"
                        value={formData.childAge}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        className="styled-textarea"
                        placeholder="Message"
                        value={formData.message}
                        onChange={handleChange}
                    />
                    <div className="appoint-button">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
            <div>
                <img src={class4} alt="Classroom" className="image" />
            </div>
        </div>
    );
};

export default Appointment;
