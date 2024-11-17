import React, { useEffect, useState } from "react";
import "./teacherdashboard.css";
import { FaHome, FaUsers, FaBook, FaSignOutAlt } from "react-icons/fa";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  updatePassword,
} from "firebase/auth";
import { getDatabase, ref, onValue, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

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
        {greeting}, {userData?.address}{" "}
        {capitalizeFirstLetter(userData?.firstName)}!👋🧑‍🏫
      </h2>
    </div>
  );
};

const DashboardTabContent = ({ userData, role }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState(""); // Add newPassword state

  useEffect(() => {
    if (userData) {
      setFormData(userData);
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const db = getDatabase();
    const userRef = ref(db, `teachers/${userData.id}`);

    try {
      await update(userRef, formData);
      alert("Information updated successfully.");

      const updatedSnapshot = await get(userRef);
      if (updatedSnapshot.exists()) {
        setFormData(updatedSnapshot.val());
      }
    } catch (error) {
      console.error("Error updating information:", error);
      alert("Failed to update information.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && newPassword) {
      try {
        await updatePassword(user, newPassword);
        alert("Password updated successfully.");
        setNewPassword(""); // Clear the password field after successful update
      } catch (error) {
        alert("Error updating password: " + error.message);
      }
    } else {
      alert("Please enter a new password.");
    }
  };

  if (!userData) {
    return (
      <p style={{ color: "blue", fontWeight: "bold", fontSize: "18px" }}>
        Info Loading...
      </p>
    );
  }

  return (
    <form
      className={role === "teacher" ? "teacher-info" : "principal-info"}
      onSubmit={handleSubmit}
    >
      <h3>
        {role === "teacher" ? "Teacher Information" : "Principal Information"}
      </h3>
      <label>
        Full Name:
        <input
          type="text"
          name="fullName"
          value={`${formData.firstName || ""} ${formData.lastName || ""}`}
          readOnly
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange} // Use handleChange for email
        />
      </label>
      <label>
        Phone Number:
        <input
          type="text"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange} // Use handleChange for phone
        />
      </label>
      {role === "teacher" && (
        <label>
          Class Taught:
          <input
            type="text"
            name="classTaught"
            value={formData.classTaught || ""}
            disabled
          />
        </label>
      )}
      <label>
        New Password:
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </label>
      <button
        className="handle-click"
        type="button"
        onClick={handlePasswordChange}
      >
        Change Password
      </button>
      <button type="submit" disabled={loading} className="handle-click">
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </form>
  );
};
const TeacherPrincipalDashboardContent = ({ role, userData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      const db = getDatabase();
      const studentRef = ref(db, "users");

      try {
        const snapshot = await get(studentRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const studentList = Object.entries(data)
            .map(([key, student]) => ({
              ...student,
              id: key,
            }))
            .filter((student) => student.class); // Filter only students with a class

          const filteredStudents =
            role === "principal"
              ? studentList
              : studentList.filter(
                  (student) => student.class === userData.classTaught
                );

          setStudents(
            filteredStudents.sort((a, b) => {
              if (role === "principal") {
                const classComparison = (a.class || "").localeCompare(
                  b.class || ""
                );
                if (classComparison !== 0) return classComparison;
              }
              const firstNameComparison = (a.firstName || "").localeCompare(
                b.firstName || ""
              );
              if (firstNameComparison !== 0) return firstNameComparison;
              return (a.lastName || "").localeCompare(b.lastName || "");
            })
          );
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Error loading students:", err);
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [role, userData.classTaught]);

  if (loading) return <p>Loading students...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="student-list">
      <h3>All Students</h3>
      <table className="student-result">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr
              key={student.id}
              className="student-row"
              onClick={() => navigate(`/info/${student.id}`)}
            >
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.class}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
const TeacherResultDashboardContent = ({ userData }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch students assigned to the teacher's class
  useEffect(() => {
    const fetchStudents = () => {
      setLoading(true);
      setError(null);
      const db = getDatabase();
      const studentRef = ref(db, "users");

      onValue(
        studentRef,
        (snapshot) => {
          const data = snapshot.val();
          const studentList = Object.values(data || {}).filter(
            (student) => student.class === userData.classTaught
          );

          // Sort by first name, then by last name
          studentList.sort((a, b) => {
            const firstNameComparison = (a.firstName || "").localeCompare(
              b.firstName || ""
            );
            if (firstNameComparison !== 0) return firstNameComparison;
            return (a.lastName || "").localeCompare(b.lastName || "");
          });

          setStudents(studentList);
          setLoading(false);
        },
        (error) => {
          setError("Failed to load students.");
          setLoading(false);
        }
      );
    };

    fetchStudents();
  }, [userData.classTaught]);

  if (loading) return <div class="spinner"></div>;
  if (error) return <p>{error}</p>;

  return (
    <div className="result-list">
      <h3>All Students Results</h3>
      <table className="student-result">
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/result/${student.firstName}-${student.lastName}`)
              }
            >
              <td>{`${student.firstName} ${student.lastName}`}</td>
              <td>{student.class}</td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents row click
                    navigate(
                      `/result/${student.firstName}-${student.lastName}`
                    );
                  }}
                >
                  View Result
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeacherResultDashboardContent;

export const TeacherDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userData, setUserData] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const db = getDatabase();
        const userRef = ref(db, `teachers/${userId}`);

        get(userRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              setUserData(data);
              setRole(data.role?.toLowerCase());
            } else {
              console.log("No user data available.");
            }
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out: ", error);
      alert("Failed to log out. Please try again.");
    }
  };

  const PrincipalTeacherDashboardContent = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
      const fetchTeachers = async () => {
        setLoading(true);
        setError(null);
        const db = getDatabase();
        const teacherRef = ref(db, "teachers");

        try {
          const snapshot = await get(teacherRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            const teacherList = Object.entries(data)
              .map(([key, teacher]) => ({
                ...teacher,
                id: key, // Store the Firebase UID as 'id'
              }))
              .filter((teacher) => teacher.classTaught); // Filter only teachers with classTaught
            setTeachers(teacherList);
          } else {
            setTeachers([]);
          }
        } catch (err) {
          setError("Failed to load teachers.");
        } finally {
          setLoading(false);
        }
      };

      fetchTeachers();
    }, []);

    const handleViewTeacher = (teacher) => {
      setSelectedTeacher(teacher);
      setIsModalOpen(true);
    };

    const handleUpdateTeacher = async () => {
      if (!selectedTeacher || !selectedTeacher.id) {
        alert("Teacher ID is missing. Cannot update.");
        return;
      }

      const db = getDatabase();
      const teacherRef = ref(db, `teachers/${selectedTeacher.id}`);

      try {
        await update(teacherRef, {
          classTaught: selectedTeacher.classTaught.toLowerCase(),
        });
        alert("Teacher's class updated successfully.");
        setIsModalOpen(false);
      } catch (error) {
        alert("Failed to update teacher information.");
      }
    };
    console.log("Role:", role);
    console.log("User Data:", userData);
    console.log("Teachers:", teachers);
    console.log("Selected Teacher:", selectedTeacher);
    console.log("Error:", error);
    console.log("Loading:", loading);

    if (loading) return <div class="spinner"></div>;
    if (error) return <p>{error}</p>;

    return (
      <div className="teacher-list">
        <h3>All Teachers</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Class Taught</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td>{`${teacher.firstName} ${teacher.lastName}`}</td>
                <td>{teacher.classTaught}</td>
                <td>
                  <button onClick={() => handleViewTeacher(teacher)}>
                    Edit Class Taught
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="modal">
            <h3>Edit Class Taught</h3>
            <form>
              <label>
                Class Taught:
                <select
                  value={selectedTeacher.classTaught || ""}
                  onChange={(e) =>
                    setSelectedTeacher({
                      ...selectedTeacher,
                      classTaught: e.target.value,
                    })
                  }
                >
                  <option value="">Select Class</option>
                  <option value="jss1">JSS1</option>
                  <option value="jss2">JSS2</option>
                  <option value="jss3">JSS3</option>
                  <option value="ss1">SS1</option>
                  <option value="ss2">SS2</option>
                  <option value="ss3">SS3</option>
                </select>
              </label>
              <button type="button" onClick={handleUpdateTeacher}>
                Save Changes
              </button>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        )}
      </div>
    );
  };

  const tabList = [
    {
      title: "Dashboard",
      icon: <FaHome />,
      content: (
        <>
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
          <DashboardTabContent userData={userData} role={role} />
        </>
      ),
    },
    role === "teacher" && {
      title: "Students",
      icon: <FaUsers />,
      content: (
        <TeacherPrincipalDashboardContent role={role} userData={userData} />
      ),
    },
    role === "teacher" && {
      title: "Results",
      icon: <FaBook />,
      content: (
        <TeacherResultDashboardContent
          role={role}
          userData={userData}
          view="results"
        />
      ),
    },
    role === "principal" && {
      title: "All Students",
      icon: <FaUsers />,
      content: (
        <TeacherPrincipalDashboardContent role={role} userData={userData} />
      ),
    },
    role === "principal" && {
      title: "Teachers",
      icon: <FaUsers />,
      content: (
        <PrincipalTeacherDashboardContent role={role} userData={userData} />
      ),
    },
    {
      title: "Log Out",
      icon: <FaSignOutAlt />,
      onClick: handleLogOut,
    },
  ].filter(Boolean);

  if (loading) {
    return <div class="spinner"></div>;
  }

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

        <div className="content">
          <h2>{tabList[activeTab].title}</h2>
          {tabList[activeTab].content}
        </div>
      </div>
    </section>
  );
};
