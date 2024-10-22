import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isSignupComplete = localStorage.getItem('isSignupComplete');

    return isSignupComplete ? children : <Navigate to="/signup" />;
};

export default ProtectedRoute;
