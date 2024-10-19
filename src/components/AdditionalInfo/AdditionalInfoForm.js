import React, { useState } from 'react';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import './additionalinfoform.css';

const AdditionalInfoForm = () => {
    const [error, setError] = useState('');
    const [{firstName, lastName, nationality, parentEmail, parentPhone, parentName, dob, middleName, stateOfOrigin}, setFormData] = useState({
        firstName: '', lastName: '', nationality: '', parentEmail: '', parentPhone: '', parentName: '', dob: '', middleName: '', stateOfOrigin: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = auth.currentUser?.uid;

        if (!userId) {
            setError('No authenticated user found!');
            return;
        }

        try {
            await setDoc(doc(db, 'users', userId), {
                firstName,
                middleName,
                lastName,
                dob,
                stateOfOrigin,
                nationality,
                parentName,
                parentPhone,
                parentEmail,
            });

            console.log('Info saved successfully!');

            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleInputChange = ({ target }) => {
        const { name, value } = target;
        setFormData((s) => ({
            ...s,
            [name]: value,
        }));
    };

    return (
        <div className='container'>
            <div>
                <h2>Additional Information</h2>
                {error && <p>{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={firstName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Middle Name</label>
                        <input
                            type="text"
                            name="middleName"
                            value={middleName}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={lastName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={dob}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>State of Origin</label>
                        <input
                            type="text"
                            name="stateOfOrigin"
                            value={stateOfOrigin}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Nationality</label>
                        <input
                            type="text"
                            name="nationality"
                            value={nationality}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Name of Parent/Guardian</label>
                        <input
                            type="text"
                            name="parentName"
                            value={parentName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone Number of Parent/Guardian</label>
                        <input
                            type="tel"
                            name="parentPhone"
                            value={parentPhone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <label>Email of Parent/Guardian</label>
                        <input
                            type="email"
                            name="parentEmail"
                            value={parentEmail}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <button type="submit">Save</button>
                </form>
            </div>
        </div>
    );
};

export default AdditionalInfoForm;
