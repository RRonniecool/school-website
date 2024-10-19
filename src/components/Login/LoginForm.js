import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; // Import Firebase auth
import './loginform.css';
import logo from '../../images/logo.png';

const LoginForm = () => {
    const [email, setEmail] = useState(''); // Changed from username to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Added state for error handling
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = getAuth();

        try {
            // Authenticate the user with Firebase
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to the dashboard on successful login
            navigate('/dashboard');
        } catch (err) {
            // Set error message if authentication fails
            setError('Invalid email or password.');
        }
    };

    return (
        <div className='login-container'>
            <div className="login-form">
                <div className='image-div'>
                    <Link to="/">
                        <img src={logo} alt="School Logo" className='school-logo' />
                    </Link>
                </div>
                <h2>Welcome <span>Back</span></h2>
                <p>Login to access portal</p>
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} {/* Display error if login fails */}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label> {/* Updated label to 'Email' */}
                        <input
                            type="email" // Updated input type to 'email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <div className='page-button'>
                        <button type="submit">Login</button>
                    </div>
                </form>

                <p className="signup-text">Don't have an account?</p>
                <Link to="/signup" className="signup-button">
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default LoginForm;
