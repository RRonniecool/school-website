import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import "./additionalteacherinfo.css";

const TeacherAdditionalInfoForm = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    classTaught: "",
    role: "teacher",
    address: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      const db = getDatabase();
      const userRef = ref(db, `teachers/${userId}`);

      if (profileImage) {
        const storage = getStorage();
        const imageRef = storageRef(
          storage,
          `teachers/${userId}/profileImage.jpg`
        );
        await uploadBytes(imageRef, profileImage);
        const profileImageUrl = await getDownloadURL(imageRef);
        formData.profileImage = profileImageUrl;
      }

      // Ensure classTaught is saved in lowercase
      const formDataToSave = {
        ...formData,
        classTaught: formData.classTaught.toLowerCase(),
      };

      await set(userRef, formDataToSave);
      navigate("/teacher-dashboard");
    } catch (error) {
      console.error("Error saving information:", error);
    }
  };

  return (
    <div className="container">
      <h1>Supplementary Information</h1>
      <form onSubmit={handleSubmit} className="additional-info-form">
        <label>First Name:</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
        />

        <label>Last Name:</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Phone:</label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        {formData.role === "teacher" && (
          <>
            <label>Class Taught:</label>
            <select
              name="classTaught"
              value={formData.classTaught}
              onChange={handleChange}
              required
            >
              <option value="">Select Class</option>
              <option value="jss1">JSS1</option>
              <option value="jss2">JSS2</option>
              <option value="jss3">JSS3</option>
              <option value="ss1">SS1</option>
              <option value="ss2">SS2</option>
              <option value="ss3">SS3</option>
            </select>
          </>
        )}

        <label>Role:</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
        </select>

        <label>Address:</label>
        <select
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option value="Mr.">Mr.</option>
          <option value="Miss">Miss</option>
          <option value="Mrs.">Mrs.</option>
        </select>

        <label>Profile Image:</label>
        <input type="file" onChange={handleFileChange} accept="image/*" />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default TeacherAdditionalInfoForm;
