import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import "./loginform.css";
import logo from "../../images/logo.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to fetch user role from Firebase Database
  const fetchUserRoleFromFirebase = async (uid) => {
    const db = getDatabase();
    const userRoleRef = ref(db, `users/${uid}/role`);
    const snapshot = await get(userRoleRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.error("User role not found in database for UID:", uid);
      throw new Error("User role not found.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      // Authenticate the user with Firebase
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      try {
        // Attempt to fetch the user role
        const userRole = await fetchUserRoleFromFirebase(user.uid);
        if (userRole === "teacher") {
          navigate("/teacher-dashboard");
        } else if (userRole === "principal") {
          navigate("/teacher-dashboard");
        } else {
          setError("User role is invalid.");
        }
      } catch (roleError) {
        // If no role is found, assume the user is a student and route to the student dashboard
        if (roleError.message === "User role not found.") {
          navigate("/dashboard");
        } else {
          setError("Failed to retrieve user role.");
          console.error("Role retrieval error:", roleError.message);
        }
      }
    } catch (authError) {
      // Handle Firebase authentication errors
      if (authError.code === "auth/user-not-found") {
        setError("No account found with this email.");
      } else if (authError.code === "auth/wrong-password") {
        setError("Incorrect password. Please try again.");
      } else {
        setError("Failed to log in. Please try again later.");
      }
      console.error("Login error:", authError.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="image-div">
          <Link to="/">
            <img src={logo} alt="School Logo" className="school-logo" />
          </Link>
        </div>
        <h2>
          Welcome <span>Back</span>
        </h2>
        <p>Login to access portal</p>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
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
          <div className="password-input-container">
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <span
              onClick={togglePasswordVisibility}
              className="password-toggle-icon"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <div className="page-button">
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
