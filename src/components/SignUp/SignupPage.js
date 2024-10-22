import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // For redirecting
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'; // Import Firebase Auth
import './signuppage.css';
import logo from '../../images/logo.png';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();  // Initialize useNavigate for redirection

    const handleSignUp = (e) => {
        e.preventDefault();

        let valid = true;
        setEmailError('');
        setPasswordError('');
        setConfirmPasswordError('');

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

        if (!passwordRegex.test(password)) {
            setPasswordError("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.");
            valid = false;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            valid = false;
        }

        if (!email.includes('@')) {
            setEmailError("Please enter a valid email address.");
            valid = false;
        }

        if (!valid) return;  // If validation fails, do not proceed

        const auth = getAuth();  // Initialize Firebase Auth
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                console.log("User signed up:", userCredential.user);
                navigate('/additional-info');  // Redirect to additional information page
            })
            .catch((err) => {
                // Handle errors
                setEmailError(err.message);  // Display Firebase-specific error if signup fails
            });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className='signup-container'>
            <div>
                <div>
                    <img src={logo} alt="" className='logo' />
                    <p>Jesus Children School</p>
                </div>
                <h1>Jesus Children School, Imo State</h1>
                <p>School Information Management System</p>
                <p>Managing all school records in one place!</p>
            </div>

            <div>
                <form onSubmit={handleSignUp}>
                    <div>
                        <div className='mobile-logo'>
                            <img src={logo} alt="School Logo" className='school-logo' />
                            <p>School Information Management System</p>
                        </div>
                        <h2>Sign <span>Up</span> </h2>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p style={{ color: 'red', fontSize: '12px' }}>{emailError}</p>} 
                    </div>
                    <div>
                        <label>Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {passwordError && <p style={{ color: 'red', fontSize: '12px' }}>{passwordError}</p>} {/* Password error displayed here */}
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <span onClick={toggleConfirmPasswordVisibility} className="password-toggle-icon">
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {confirmPasswordError && <p style={{ color: 'red', fontSize: '12px' }}>{confirmPasswordError}</p>} {/* Confirm password error displayed here */}
                    </div>
                    <div className='form-button'>
                        <button type="submit">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

localStorage.setItem('isSignupComplete', true);

export default SignUpPage;
