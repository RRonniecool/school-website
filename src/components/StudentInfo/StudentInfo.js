import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDatabase, ref, get, update } from "firebase/database";
import "./studentinfo.css";
const StudentInfoPage = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [isSaveEnabled, setIsSaveEnabled] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      const db = getDatabase();
      const studentRef = ref(db, `users/${studentId}`);
      const snapshot = await get(studentRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setStudent(data);
        setOriginalData(data); // Store the original data for comparison
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleChange = (field, value) => {
    setStudent((prevStudent) => ({ ...prevStudent, [field]: value }));
    setIsSaveEnabled(true); // Enable save button when a change is detected
  };

  const handleSave = async () => {
    if (!isSaveEnabled) return; // Disable save if no changes

    const db = getDatabase();
    const studentRef = ref(db, `users/${studentId}`);
    try {
      await update(studentRef, student);
      alert("Student information updated successfully.");
      setOriginalData(student); // Update original data to the latest saved state
      setIsSaveEnabled(false); // Disable save button again
    } catch (error) {
      alert("Failed to update student information.");
    }
  };

  if (!student) return <p>Loading student data...</p>;

  return (
    <div className="student-page">
      <h3>Edit Student Information</h3>
      <form>
        <label>
          First Name:
          <input
            type="text"
            value={student.firstName || ""}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />
        </label>
        <label>
          Middle Name:
          <input
            type="text"
            value={student.middleName || ""}
            onChange={(e) => handleChange("middleName", e.target.value)}
          />
        </label>
        <label>
          Last Name:
          <input
            type="text"
            value={student.lastName || ""}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />
        </label>
        <label>
          Class:
          <input
            type="text"
            value={student.class || ""}
            onChange={(e) => handleChange("class", e.target.value)}
          />
        </label>
        <label>
          Date of Birth:
          <input
            type="date"
            value={student.dob || ""}
            onChange={(e) => handleChange("dob", e.target.value)}
          />
        </label>
        <label>
          Local Government:
          <input
            type="text"
            value={student.lga || ""}
            onChange={(e) => handleChange("lga", e.target.value)}
          />
        </label>
        <button type="button" onClick={handleSave} disabled={!isSaveEnabled}>
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default StudentInfoPage;
