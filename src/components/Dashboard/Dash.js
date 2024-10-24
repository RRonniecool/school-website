import React, { useEffect, useState } from 'react';
import './dash.css';
import { FaHome, FaBook, FaMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../../firebaseConfig';
import { getDatabase, ref, onValue } from "firebase/database"; 
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  

// Component to display the greeting
const DashboardGreeting = ({ userData }) => {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12
        ? 'Good Morning'
        : currentHour < 18
        ? 'Good Afternoon'
        : 'Good Evening';

    return (
        <div className="greeting">
            <h2>{greeting}, {userData?.firstName || 'User'}! 👋</h2>
        </div>
    );
};

// Component to display user data
const DashboardTabContent = ({ userData }) => {
    if (!userData) {
        return <p style={{ color: 'blue', fontWeight: 'bold', fontSize: '18px' }}>Info Loading...</p>;
    }

    return (
        <div className='student-info'>
            <div>
                <h3>Student Information</h3>
                <p>Full Name: {`${userData.firstName || ''} ${userData.middleName || ''} ${userData.lastName || ''}`}</p>
                <p>Date of Birth: {userData.dob || 'N/A'}</p>
                <p>Nationality: {userData.nationality || 'N/A'}</p>
                <p>State of Origin: {userData.stateOfOrigin || 'N/A'}</p>
                <p>Local Government Area: {userData.lga || 'N/A'}</p> 
                <p>Class: {userData.class || 'N/A'}</p>
            </div>
            <div>
                <h3>Parents/Guardian Details</h3>
                <p>Full Name: {userData.parentName || 'N/A'}</p>
                <p style={{ textTransform: 'none' }}>Email: {userData.parentEmail || 'N/A'}</p>
                <p>Phone Number: {userData.parentPhone || 'N/A'}</p>
            </div>
        </div>

    );
};

const ResultTabContent = ({ term, setTerm, studentData }) => {
    return (
        <div className='result-content'>
            {[...Array(3)].map((_, i) => (
                <button
                    key={i}
                    onClick={() => setTerm(i)}
                    className={i === term ? 'active' : ''}
                >
                    {['First', 'Second', 'Third'][i]} Term
                </button>
            ))}
            <h2>Your {term + 1} Term Result:</h2>
            <table>
                <tbody>
                    <tr>
                        <th>Full Name</th>
                        <td>{studentData?.firstName || 'N/A'} {studentData?.lastName || 'N/A'}</td>
                    </tr>
                    {[ 
                        { subject: "Mathematics", score: studentData?.mathematics || 'N/A' },
                        { subject: "English", score: studentData?.english || 'N/A' },
                        { subject: "PHE", score: studentData?.phe || 'N/A' },
                        { subject: "Basic Science", score: studentData?.basicScience || 'N/A' }
                    ].map((item, index) => (
                        <tr key={index}>
                            <th>{item.subject}</th>
                            <td>{item.score}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Dashboard widget component
export const Widget = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [term, setTerm] = useState(1);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (!auth.currentUser) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const db = getDatabase();
                const userRef = ref(db, 'users/' + userId);

                onValue(userRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        setUserData(data);  // Fetching all user data including the profile image URL
                    }
                });
            }
        };
        fetchUserData();
    }, []);

    const handleLogOut = async () => {
        try {
            await signOut(auth);  
            navigate('/login');  
        } catch (error) {
            console.error('Error logging out: ', error);
            alert('Failed to log out. Please try again.');
        }
    };

    const tabList = [
        {
            title: "Dashboard",
            icon: <FaHome />,
            content: (
                <>
                    <DashboardGreeting userData={userData} />
                    <DashboardTabContent userData={userData} />
                </>
            )
        },
        {
            title: "Results",
            icon: <FaBook />,
            content: <ResultTabContent term={term} setTerm={setTerm} studentData={userData} />
        },
        {
            title: "School Fees",
            icon: <FaMoneyBillAlt />,
            content: "This is still under development"
        },
        {
            title: "Log Out",
            icon: <FaSignOutAlt />,
            onClick: () => handleLogOut()
        }
    ];

    return (
        <section className="page">
            <div className="tab-container">
                <div className="buttons">
                    {tabList.map((item, index) => (
                                <button
                                    key={item.title}
                                    className={index === activeTab ? "active" : ""}
                                    onClick={() => item.onClick ? item.onClick() : setActiveTab(index)}
                                >
                                    <span className="material-symbols-outlined">
                                        {item.icon || item.title}
                                    </span>
                                    {item.title}
                                </button>
                            ))}
                </div>
               
                <div>
                    <div className="top-section">
                        <div className="profile-image">
                            {userData?.profileImage ? (
                                <img src={userData.profileImage} alt="Profile" className="profile-pic" />
                            ) : (
                                <img src={`https://ui-avatars.com/api/?name=${userData?.firstName || 'User'}+${userData?.lastName || 'Name'}`} alt="Default Avatar" className="profile-pic" />
                            )}
                        </div>
                        <DashboardGreeting userData={userData} />
                    </div>
                    <div className="wrapper">
                        <div className="content">
                            <div className="block">
                                <h2>My {tabList[activeTab].title}</h2>
                                {tabList[activeTab].content}
                            </div>
                        </div>
                    </div> 
                </div>

                
            </div>
        </section>
    );
};
