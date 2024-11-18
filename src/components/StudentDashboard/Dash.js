import React, { useEffect, useState } from "react";
import "./dash.css";
import { FaHome, FaBook, FaMoneyBillAlt, FaSignOutAlt } from "react-icons/fa";
import { auth } from "../../firebaseConfig";
import { getDatabase, ref, onValue } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import SchoolFees from "../SchoolFees/SchoolFees";
import { onAuthStateChanged } from "firebase/auth";
import DownloadPDF from "../DownloadResultToPdf/DownloadPDF";
import schoolLogo from "../../images/logo.png";
// Component to display the greeting
const DashboardGreeting = ({ userData }) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good Morning"
      : currentHour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const capitalizeFirstLetter = (string) => {
    return string
      ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
      : "User";
  };

  return (
    <div className="greeting">
      <h2>
        {greeting}, {capitalizeFirstLetter(userData?.firstName) || "User"}! 👋
      </h2>
    </div>
  );
};

// Component to display user data
const DashboardTabContent = ({ userData }) => {
  if (!userData) {
    return (
      <p
        style={{
          color: "blue",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        Info Loading...
      </p>
    );
  }

  return (
    <div className="student-info">
      <div>
        <h3>Student Information</h3>
        <p>
          Full Name:{" "}
          {`${userData.firstName || ""} ${userData.middleName || ""} ${
            userData.lastName || ""
          }`}
        </p>
        <p>Date of Birth: {userData.dob || "N/A"}</p>
        <p>Nationality: {userData.nationality || "N/A"}</p>
        <p>State of Origin: {userData.stateOfOrigin || "N/A"}</p>
        <p>Local Government Area: {userData.lga || "N/A"}</p>
        <p>Class: {userData.class || "N/A"}</p>
      </div>
      <div>
        <h3>Parents/Guardian Details</h3>
        <p>Full Name: {userData.parentName || "N/A"}</p>
        <p style={{ textTransform: "none" }}>
          Email: {userData.parentEmail || "N/A"}
        </p>
        <p>Phone Number: {userData.parentPhone || "N/A"}</p>
      </div>
    </div>
  );
};

const ResultTabContent = ({ term, setTerm, studentData, allStudents = [] }) => {
  const [showCumulative, setShowCumulative] = useState(false);

  const subjects = [
    "mathematics",
    "english",
    "phe",
    "basic Science",
    "igbo/Hausa/Yoruba",
    "social studies",
    "basic technology",
    "home economics",
    "cultural & creative art",
    "business studies",
    "agric science",
    "civic education",
    "computer studies",
    "christian religious studies",
    "history",
    "french",
    "music",
  ];

  const calculateCumulativeResults = () => {
    const cumulativeResults = {};

    subjects.forEach((subject) => {
      const firstTermTotal =
        studentData?.subjects?.[subject]?.firstTerm?.total || 0;
      const secondTermTotal =
        studentData?.subjects?.[subject]?.secondTerm?.total || 0;
      const thirdTermTotal =
        studentData?.subjects?.[subject]?.thirdTerm?.total || 0;

      cumulativeResults[subject] = (
        (firstTermTotal + secondTermTotal + thirdTermTotal) /
        3
      ).toFixed(2);
    });

    return cumulativeResults;
  };

  const calculateOverallCumulativeResult = () => {
    const totalCumulative = subjects.reduce((total, subject) => {
      const firstTermTotal =
        studentData?.subjects?.[subject]?.firstTerm?.total || 0;
      const secondTermTotal =
        studentData?.subjects?.[subject]?.secondTerm?.total || 0;
      const thirdTermTotal =
        studentData?.subjects?.[subject]?.thirdTerm?.total || 0;

      return total + firstTermTotal + secondTermTotal + thirdTermTotal;
    }, 0);

    return (totalCumulative / (subjects.length * 3)).toFixed(2);
  };

  const calculateTermAverage = () => {
    const termKey = ["firstTerm", "secondTerm", "thirdTerm"][term];
    const termTotal = subjects.reduce((total, subject) => {
      const assignment =
        studentData?.subjects?.[subject]?.[termKey]?.assignment || 0;
      const test = studentData?.subjects?.[subject]?.[termKey]?.test || 0;
      const exam = studentData?.subjects?.[subject]?.[termKey]?.exam || 0;

      return total + assignment + test + exam;
    }, 0);

    return (termTotal / subjects.length).toFixed(2);
  };

  const calculatePosition = () => {
    if (!allStudents || allStudents.length === 0) return "N/A";

    const termKey = ["firstTerm", "secondTerm", "thirdTerm"][term];
    const studentsWithAverages = allStudents.map((student) => ({
      ...student,
      termAverage:
        subjects.reduce(
          (total, subject) =>
            total + (student.subjects?.[subject]?.[termKey]?.total || 0),
          0
        ) / subjects.length,
    }));

    studentsWithAverages.sort((a, b) => b.termAverage - a.termAverage);

    const position =
      studentsWithAverages.findIndex(
        (student) =>
          student.firstName === studentData.firstName &&
          student.lastName === studentData.lastName
      ) + 1;

    return position;
  };

  const cumulativeResults = calculateCumulativeResults();
  const overallCumulativeResult = calculateOverallCumulativeResult();
  const termAverage = calculateTermAverage();
  const position = calculatePosition();

  return (
    <div className="result-content">
      <div className="term-buttons">
        {[...Array(3)].map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setTerm(i);
              setShowCumulative(false);
            }}
            className={i === term ? "active" : ""}
          >
            {["First", "Second", "Third"][i]} Term
          </button>
        ))}
        <button onClick={() => setShowCumulative(true)}>
          Cumulative Result
        </button>
      </div>

      <h2>
        {showCumulative
          ? `Cumulative Result: ${overallCumulativeResult}`
          : `Your ${["First", "Second", "Third"][term]} Term Result`}
      </h2>
      <div id="result-to-download">
        <table>
          <tbody>
            <tr>
              <th>Full Name</th>
              <td>
                {studentData?.firstName || "N/A"}{" "}
                {studentData?.lastName || "N/A"}
              </td>
            </tr>
            <tr>
              <th>Class</th>
              <td>{studentData?.class || "N/A"}</td>
            </tr>
            <tr>
              <th>Term Average</th>
              <td>{termAverage}</td>
            </tr>
            <tr>
              <th>Position</th>
              <td>{position}</td>
            </tr>
            <tr>
              <th rowSpan="2">Subject</th>
              <th colSpan="2" className="centered-th">
                CA
              </th>
              <th rowSpan="2">Exam</th>
              <th rowSpan="2">Total</th>
            </tr>
            <tr>
              <th>Assignment</th>
              <th>Test</th>
            </tr>

            {subjects.map((subject, index) => (
              <tr key={index}>
                {/* Display subject with slashes instead of underscores */}
                <td>{subject.replace(/_/g, "/")}</td>
                {showCumulative ? (
                  <>
                    <td colSpan="3">Cumulative Average</td>
                    <td>{cumulativeResults[subject] || "N/A"}</td>
                  </>
                ) : (
                  <>
                    {/* Replace slashes with underscores when accessing the data */}
                    <td>
                      {studentData?.subjects?.[subject.replace(/\//g, "_")]?.[
                        ["firstTerm", "secondTerm", "thirdTerm"][term]
                      ]?.assignment || "N/A"}
                    </td>
                    <td>
                      {studentData?.subjects?.[subject.replace(/\//g, "_")]?.[
                        ["firstTerm", "secondTerm", "thirdTerm"][term]
                      ]?.test || "N/A"}
                    </td>
                    <td>
                      {studentData?.subjects?.[subject.replace(/\//g, "_")]?.[
                        ["firstTerm", "secondTerm", "thirdTerm"][term]
                      ]?.exam || "N/A"}
                    </td>
                    <td>
                      {(studentData?.subjects?.[subject.replace(/\//g, "_")]?.[
                        ["firstTerm", "secondTerm", "thirdTerm"][term]
                      ]?.assignment || 0) +
                        (studentData?.subjects?.[subject.replace(/\//g, "_")]?.[
                          ["firstTerm", "secondTerm", "thirdTerm"][term]
                        ]?.test || 0) +
                        (studentData?.subjects?.[subject.replace(/\//g, "_")]?.[
                          ["firstTerm", "secondTerm", "thirdTerm"][term]
                        ]?.exam || 0) || "N/A"}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="teacher-remarktext">
          <h4>Teacher's Remark:</h4>
          <p>
            {studentData?.remarks?.[
              ["firstTerm", "secondTerm", "thirdTerm"][term]
            ] || "No remark available."}
          </p>
        </div>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <DownloadPDF
          elementId="result-to-download"
          studentData={studentData}
          logo={schoolLogo}
        />
      </div>
    </div>
  );
};

// Main Dashboard widget component
export const Widget = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [term, setTerm] = useState(0);
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );
  const [allStudents, setAllStudents] = useState([]); // State to store all students
  const [loading, setLoading] = useState(!userData);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch all students when the component mounts
    const fetchAllStudents = () => {
      const db = getDatabase();
      const studentsRef = ref(db, "students/");

      onValue(
        studentsRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const studentsArray = Object.keys(data).map((key) => ({
              ...data[key],
              id: key, // Add the Firebase key as an ID
            }));
            setAllStudents(studentsArray); // Set all students to state
          } else {
            console.log("No students data found");
          }
        },
        (error) => {
          console.error("Error fetching all students: ", error);
        }
      );
    };

    fetchAllStudents();
  }, []); // Only runs on mount

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        const userRef = ref(db, `users/${userId}`);

        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUserData(data);
            localStorage.setItem("userData", JSON.stringify(data));
          } else {
            navigate("/login");
          }
          setLoading(false);
        });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("userData");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Failed to log out. Please try again.");
    }
  };

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  const tabList = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      content: <DashboardTabContent userData={userData} loading={loading} />,
    },
    {
      title: "Results",
      icon: <FaBook />,
      content: (
        <ResultTabContent
          term={term}
          setTerm={setTerm}
          studentData={userData}
          allStudents={allStudents} // Pass allStudents to ResultTabContent
        />
      ),
    },
    {
      title: "School Fees",
      icon: <FaMoneyBillAlt />,
      content: <SchoolFees userData={userData} />,
    },
    {
      title: "Log Out",
      icon: <FaSignOutAlt />,
      onClick: () => handleLogOut(),
    },
  ];

  return (
    <section className="page">
      <div className="tab-container">
        <div className="buttons">
          {tabList.map((item, index) => (
            <button
              key={item.title}
              className={index === activeTab ? "active" : ""}
              onClick={() =>
                item.onClick ? item.onClick() : setActiveTab(index)
              }
            >
              <span className="material-symbols-outlined">
                {item.icon || item.title}
              </span>
              <span className="tab-title">{item.title}</span>
            </button>
          ))}
        </div>

        <div>
          <div className="top-section">
            <div className="profile-image">
              {userData?.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="profile-pic"
                />
              ) : (
                <img
                  src={`https://ui-avatars.com/api/?name=${
                    userData?.firstName || "User"
                  }+${userData?.lastName || "Name"}`}
                  alt="Default Avatar"
                  className="profile-pic"
                />
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
