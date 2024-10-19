import React, { useEffect, useState  } from 'react';
import './dash.css';
import { FaHome, FaBook, FaMoneyBillAlt, FaSignOutAlt } from 'react-icons/fa'; 


const menuHeight = getComputedStyle(document.body)
  .getPropertyValue('--widget-2-menu-height');

const DashboardTabContent = () => (
    <div>
    <h3>Student Info</h3>
    <p>Full Name:</p>
    <p>Date of Birth</p>
    <p>Class:</p>
    <p>Nationality:</p>
    <p>State of Birth:</p>
    <h3>Parents/Guardian Details</h3>
    <p>Name:</p>
    <p>Address:</p>
    <p>Email:</p>
    <p>Phone Number</p>
    </div> 
)

const ResultTabContent =(term, setTerm, studentData) => (
    <div className='result-content'>
    {[...Array(3)].map((_,i) => <button key={i} onClick={() => setTerm(i)} className={${i === term}}>
      {['First', 'Second', 'Third'][i]} Term
    </button>)}
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
)


export const Widget = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [term, setTerm] = useState(1);
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    const fetchStudentdata = async() => {
      try {
const result = await console.log('fetch result')
setStudentData(result);
    } catch(error) {
      console.log(error)
    }
    }

    fetchStudentdata();
  }, [term])

  const handleLogOut = () => { alert('logging out....') }

const tabList = [
    {
        title: "Dashboard",
        icon: <FaHome/>,
        content: DashboardTabContent()
    },
    {
        title: "Results",
        icon: <FaBook/>,
        content: ResultTabContent(term, setTerm, studentData)
    },
    {
        title: "School Fees",
        icon: <FaMoneyBillAlt/>,
        content: "This is the Dashboard"
    },
    {
        title: "Sign Out",
        icon: <FaSignOutAlt/>,
        onClick: () => handleLogOut()
    }
]
  return (
    <section className="page">
        <div className="tab-container">
            <div className="buttons">
            {tabList.map((item, index) => (
                <button
                disabled={studentData}
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
            {studentData ? <p>loading...</p> : <div className="content" style={{ 
                transform: translate(0 calc(0px - ${menuHeight} * ${activeTab})),
            }}>

                <div className="block">
                    <h2>{ tabList[activeTab].title}</h2>
                    {tabList[activeTab].content}
                </div>
            
            </div>
            }
            </div>
        </div>
    </section>
);
};



export default Widget;