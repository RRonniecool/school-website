import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './components/Login/LoginForm';
import SignUpPage from './components/SignUp/SignupPage';
import AdditionalInfoForm from './components/AdditionalInfo/AdditionalInfoForm';
import Gallery from './components/Gallery/Gallery'
import AboutUs from './components/AboutUs/AboutUs'
import ContactUs from './components/Appointment/Appointment'
import { Widget as Dashboard } from './components/Dashboard/Dash'
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/additional-info" element={
          <ProtectedRoute>
            <AdditionalInfoForm />
          </ProtectedRoute>
        } />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<HomePage />} /> 
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/dashboard" element={<Dashboard/>} />
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
