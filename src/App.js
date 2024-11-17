import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./components/Login/LoginForm";
import SignUpPage from "./components/StudentSignUp/SignupPage";
import AdditionalInfoForm from "./components/AdditionalInfo/AdditionalInfoForm";
import Gallery from "./components/Gallery/Gallery";
import AboutUs from "./components/AboutUs/AboutUs";
import ContactUs from "./components/Appointment/Appointment";
import { Widget as Dashboard } from "./components/StudentDashboard/Dash";
import ProtectedRoute from "./components/ProtectedRoute";
import AdditionalInfoFormTeacherAdmin from "./components/AdditionalTeacherInfo/AdditionalTeacherinfo";
import TeacherSignup from "./components/TeacherSignUp/TeacherSignUp";
import { TeacherDashboard } from "./components/TeacherDashboard/TeacherDashboard";
import StudentInfoPage from "./components/StudentInfo/StudentInfo";
import StudentResultPage from "./components/StudentResult/StudentResultPage";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/teacher-signup" element={<TeacherSignup />} />
          <Route
            path="/additional-info"
            element={
              <ProtectedRoute>
                <AdditionalInfoForm />
              </ProtectedRoute>
            }
          />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="*" element={<HomePage />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/additional-info-teacher-admin"
            element={
              <ProtectedRoute>
                <AdditionalInfoFormTeacherAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/info/:studentId" element={<StudentInfoPage />} />
          <Route path="/result/:studentName" element={<StudentResultPage />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
