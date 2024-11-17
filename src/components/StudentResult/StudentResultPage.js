import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, update, off } from "firebase/database";
import "./studentresult.css";

const StudentResultPage = () => {
  const { studentName } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTerm, setCurrentTerm] = useState("firstTerm");
  const navigate = useNavigate();

  const subjects = [
    "mathematics",
    "english",
    "phe",
    "basic science",
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

  // Fetch student data from Firebase
  useEffect(() => {
    const db = getDatabase();
    const studentRef = ref(db, "users");

    const handleValueChange = (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setError("No data available.");
        setLoading(false);
        return;
      }

      // Use Object.entries to get both key and value
      const studentEntry = Object.entries(data).find(
        ([key, s]) =>
          `${s.firstName}-${s.lastName}`.toLowerCase() ===
          studentName.toLowerCase()
      );

      if (studentEntry) {
        const [id, studentData] = studentEntry;

        // Initialize subjects with default values if missing
        const initializedSubjects = subjects.reduce((acc, subject) => {
          acc[subject] = {
            firstTerm: studentData.subjects?.[subject]?.firstTerm || {
              assignment: 0,
              test: 0,
              exam: 0,
            },
            secondTerm: studentData.subjects?.[subject]?.secondTerm || {
              assignment: 0,
              test: 0,
              exam: 0,
            },
            thirdTerm: studentData.subjects?.[subject]?.thirdTerm || {
              assignment: 0,
              test: 0,
              exam: 0,
            },
          };
          return acc;
        }, {});

        setStudent({ id, ...studentData, subjects: initializedSubjects });
      } else {
        setError("Student not found.");
      }
      setLoading(false);
    };

    const handleError = (error) => {
      console.error("Firebase read failed: ", error);
      setError("Failed to load student data.");
      setLoading(false);
    };

    onValue(studentRef, handleValueChange, handleError);

    // Cleanup listener on unmount
    return () => {
      off(studentRef, "value", handleValueChange);
    };
  }, [studentName]);

  // Update student's result in Firebase
  const handleUpdateResult = async () => {
    if (!student) return;

    const db = getDatabase();
    const studentRef = ref(db, `users/${student.id}`);

    // Normalize subject names to avoid Firebase key errors
    const normalizedSubjects = Object.keys(student.subjects).reduce(
      (acc, subject) => {
        const normalizedSubjectName = subject.replace(/[\/\[\]\.#$]/g, "_");
        acc[normalizedSubjectName] = student.subjects[subject];
        return acc;
      },
      {}
    );
    console.log("Normalized Subjects:", normalizedSubjects);
    try {
      await update(studentRef, {
        subjects: normalizedSubjects, // Use normalized keys
        remarks: student.remarks || {}, // Ensure remarks are saved
      });
      alert("Student result updated successfully.");
      navigate(-1); // Go back to the previous page
    } catch (error) {
      alert("Failed to update student result.");
      console.error("Error updating result:", error);
    }
  };

  if (loading) return <p>Loading student data...</p>;
  if (error) return <p>{error}</p>;
  if (!student) return <p>No student data available.</p>;

  return (
    <div className="student-resultpage">
      <h3>
        Edit{" "}
        {student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1)}
        's{" "}
        {
          ["First", "Second", "Third"][
            ["firstTerm", "secondTerm", "thirdTerm"].indexOf(currentTerm)
          ]
        }{" "}
        Term Result
      </h3>

      <div className="term-buttons">
        {["firstTerm", "secondTerm", "thirdTerm"].map((term, i) => (
          <button
            key={i}
            onClick={() => setCurrentTerm(term)}
            className={term === currentTerm ? "active" : ""}
          >
            {["First", "Second", "Third"][i]} Term
          </button>
        ))}
      </div>

      <table className="Result-table">
        <thead>
          <tr>
            <th>Subject</th>
            <th className="assignment-header">Assignment</th>
            <th className="test-header">Test</th>
            <th className="exam-header">Exam</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject, index) => (
            <tr key={index}>
              <td>{subject.charAt(0).toUpperCase() + subject.slice(1)}</td>
              <td className="assignment-cell">
                <input
                  type="number"
                  value={
                    student.subjects?.[subject]?.[currentTerm]?.assignment || ""
                  }
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setStudent((prevStudent) => ({
                      ...prevStudent,
                      subjects: {
                        ...prevStudent.subjects,
                        [subject]: {
                          ...prevStudent.subjects[subject],
                          [currentTerm]: {
                            ...prevStudent.subjects[subject][currentTerm],
                            assignment: value,
                          },
                        },
                      },
                    }));
                  }}
                  className="assignment-input"
                />
              </td>
              <td className="test-cell">
                <input
                  type="number"
                  value={student.subjects?.[subject]?.[currentTerm]?.test || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setStudent((prevStudent) => ({
                      ...prevStudent,
                      subjects: {
                        ...prevStudent.subjects,
                        [subject]: {
                          ...prevStudent.subjects[subject],
                          [currentTerm]: {
                            ...prevStudent.subjects[subject][currentTerm],
                            test: value,
                          },
                        },
                      },
                    }));
                  }}
                  className="test-input"
                />
              </td>
              <td className="exam-cell">
                <input
                  type="number"
                  value={student.subjects?.[subject]?.[currentTerm]?.exam || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setStudent((prevStudent) => ({
                      ...prevStudent,
                      subjects: {
                        ...prevStudent.subjects,
                        [subject]: {
                          ...prevStudent.subjects[subject],
                          [currentTerm]: {
                            ...prevStudent.subjects[subject][currentTerm],
                            exam: value,
                          },
                        },
                      },
                    }));
                  }}
                  className="exam-input"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="teacher-remark">
        <h4>Teacher's Remark:</h4>
        <textarea
          value={student.remarks?.[currentTerm] || ""}
          onChange={(e) => {
            const remark = e.target.value;
            setStudent((prevStudent) => ({
              ...prevStudent,
              remarks: {
                ...prevStudent.remarks,
                [currentTerm]: remark,
              },
            }));
          }}
          placeholder={`Enter remark for ${
            ["First", "Second", "Third"][
              ["firstTerm", "secondTerm", "thirdTerm"].indexOf(currentTerm)
            ]
          } Term`}
        />
      </div>
      <button onClick={handleUpdateResult} className="changes">
        Save Changes
      </button>
    </div>
  );
};

export default StudentResultPage;
