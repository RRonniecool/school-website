import React, { useEffect, useState } from 'react';
import './dash.css';
import { FaHome, FaBook, FaMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';  

const DashboardTabContent = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const docRef = doc(db, 'users', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                } else {
                    console.log('No such document!');
                }
            }
        };

        // fetchUserData();
    }, []);

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h3>Student Info</h3>
            <p>Full Name: {`${userData.firstName} ${userData.middleName} ${userData.lastName}`}</p>
            <p>Date of Birth: {userData.dob}</p>
            <p>Nationality: {userData.nationality}</p>
            <p>State of Origin: {userData.stateOfOrigin}</p>
            <h3>Parents/Guardian Details</h3>
            <p>Name: {userData.parentName}</p>
            <p>Email: {userData.parentEmail}</p>
            <p>Phone Number: {userData.parentPhone}</p>
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
                        <td>{studentData?.fullName}</td>
                    </tr>
                    {[
                        { subject: "Mathematics", score: studentData?.mathematics },
                        { subject: "English", score: studentData?.english },
                        { subject: "PHE", score: studentData?.phe },
                        { subject: "Basic Science", score: studentData?.basicScience }
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

export const Widget = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [term, setTerm] = useState(1);
    const [userData, setUserData] = useState(null); // Fetch this via a hook, as shown before
    const navigate = useNavigate();  

    // Fetch the userData in the useEffect of this component or pass it down from parent if available
    useEffect(() => {
        const fetchUserData = async () => {
            const userId = auth.currentUser?.uid;
            if (userId) {
                const docRef = doc(db, 'users', userId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setUserData(docSnap.data());
                }
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
            content: <DashboardTabContent />
        },
        {
            title: "Results",
            icon: <FaBook />,
            content: <ResultTabContent term={term} setTerm={setTerm} studentData={userData} />
        },
        {
            title: "School Fees",
            icon: <FaMoneyBillAlt />,
            content: "School Fees Content"
        },
        {
            title: "Sign Out",
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
                <div className="wrapper">
                    <div className="content">
                        <div className="block">
                            <h2>{tabList[activeTab].title}</h2>
                            {tabList[activeTab].content}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default Widget;
