import React, { useState, useEffect } from 'react';
import { FaHome, FaBook, FaDollarSign, FaSignOutAlt } from 'react-icons/fa'; 
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import './dashboard.css'; 

// Components for Dashboard, Results, and School Fees
const DashboardContent = ({ studentInfo }) => (
    <div>
        <h2>Dashboard Overview</h2>
        <p>Courses Registered: {studentInfo?.coursesRegistered || 0}</p>
        <p>Results Published: {studentInfo?.resultsPublished || 0}</p>
        <p>Fees Paid: {studentInfo?.feesPaid || '0 NGN'}</p>
    </div>
);

const Results = () => (
    <div>
        <h2>Your Results</h2>
        {/* Render your result details dynamically */}
    </div>
);

const SchoolFees = () => (
    <div>
        <h2>School Fees Information</h2>
        {/* Render your school fees details dynamically */}
    </div>
);

const Dashboard = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const navigate = useNavigate(); 
    const db = getFirestore();

    // Handle Sign Out
    const handleSignOut = () => {
        navigate('/portal'); 
    };

    // Fetch student information from Firestore
    useEffect(() => {
        const fetchStudentInfo = async () => {
            const userId = localStorage.getItem('userId'); 
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setStudentInfo(docSnap.data());
            } else {
                console.log('No such document!');
            }
        };
        fetchStudentInfo();
    }, [db]);

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <ul>
                    <li>
                        <Link to="/dashboard"><FaHome className="icon" /> Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/dashboard/results"><FaBook className="icon" /> Results</Link>
                    </li>
                    <li>
                        <Link to="/dashboard/schoolfees"><FaDollarSign className="icon" /> School Fees</Link>
                    </li>
                    <li onClick={handleSignOut}>
                        <FaSignOutAlt className="icon" /> Sign Out
                    </li>
                </ul>
            </aside>

            {/* Main Section */}
            <div className="main-section">
                {/* Top-bar */}
                <div className="top-bar">
                    <h1>Student Dashboard</h1>
                </div>

                {/* Main Content - Render Routes inside main-content */}
                <main className="main-content">
                    <Routes>
                        <Route path="/dashboard" element={<DashboardContent studentInfo={studentInfo} />} />
                        <Route path="/dashboard/results" element={<Results />} />
                        <Route path="/dashboard/schoolfees" element={<SchoolFees />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
