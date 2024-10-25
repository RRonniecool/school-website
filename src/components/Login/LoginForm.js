import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'; 
import './loginform.css';
import logo from '../../images/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const LoginForm = () => {
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); 
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>} 
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email</label> 
                        <input
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div className='password-input-container'>
                        <label>Password</label>
                        <input
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            required
                        />
                        <span onClick={togglePasswordVisibility} className="password-toggle-icon">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
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
