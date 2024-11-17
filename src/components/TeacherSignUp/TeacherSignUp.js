import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import "./teachersignup.css";
import logo from "../../images/logo.png";

const TeacherSignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("teacher"); // Default role is 'teacher'
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();

    let valid = true;
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number."
      );
      valid = false;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      valid = false;
    }

    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!valid) return;

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);

        // Save the user role in 'users' node
        set(userRef, {
          email: email,
          role: role,
        })
          .then(() => {
            console.log("Role saved to Firebase:", role);

            // Save the user data in either the 'teachers' or 'principal' node
            const roleRef = ref(db, `${role}s/${user.uid}`);
            set(roleRef, { email: email }).then(() => {
              console.log(`${role} data saved to Firebase.`);
              console.log("Navigating to additional info page...");
              navigate("/additional-info-teacher-admin"); // Redirect after sign-up
            });
          })
          .catch((error) => {
            console.error("Error saving role to Firebase:", error);
          });
      })
      .catch((err) => {
        setEmailError(err.message);
      });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="signup-container">
      <div>
        <div>
          <img src={logo} alt="School Logo" className="logo" />
          <p>Jesus Children School</p>
        </div>
        <h1>Jesus Children School, Imo State</h1>
        <p>School Information Management System</p>
        <p>Managing all school records in one place!</p>
      </div>

      <div>
        <form onSubmit={handleSignUp}>
          <div>
            <div className="mobile-logo">
              <Link to="/">
                <img src={logo} alt="School Logo" className="school-logo" />
              </Link>
              <p>Teachers Information Management System</p>
            </div>
            <h2>
              Sign <span>Up</span>{" "}
            </h2>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {emailError && (
              <p style={{ color: "red", fontSize: "12px" }}>{emailError}</p>
            )}
          </div>
          <div>
            <label>Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                onClick={togglePasswordVisibility}
                className="password-toggle-icon"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {passwordError && (
              <p style={{ color: "red", fontSize: "12px" }}>{passwordError}</p>
            )}
          </div>
          <div>
            <label>Confirm Password</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span
                onClick={toggleConfirmPasswordVisibility}
                className="password-toggle-icon"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {confirmPasswordError && (
              <p style={{ color: "red", fontSize: "12px" }}>
                {confirmPasswordError}
              </p>
            )}
          </div>
          <div>
            <label>Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="teacher">Teacher</option>
              <option value="principal">Principal</option>
            </select>
          </div>
          <div className="form-button">
            <button type="submit">Sign Up</button>
          </div>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default TeacherSignUpPage;
