// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSAEdEaKByYGaN14BlVaBvkdR7HUUprVE",
  authDomain: "school-website-8a567.firebaseapp.com",
  projectId: "school-website-8a567",
  storageBucket: "school-website-8a567.appspot.com",
  messagingSenderId: "106363470107",
  appId: "1:106363470107:web:a3f6902127ef6be23f53be",
  measurementId: "G-8HGJD2R3V7",
  databaseURL: "https://school-website-8a567-default-rtdb.firebaseio.com/", // Correct root URL
};




// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Initialize Firebase services (auth and firestore)
const auth = getAuth(app);
const db = getFirestore(app);

// Export the Firebase services to be used elsewhere in the app
export { auth, db };
