// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-3RfY9vssXp9IKITX3I2fVcdgUCgfGlM",
  authDomain: "practica9-di.firebaseapp.com",
  databaseURL: "https://practica9-di-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "practica9-di",
  storageBucket: "practica9-di.firebasestorage.app",
  messagingSenderId: "1088403517456",
  appId: "1:1088403517456:web:944887ebb544d2072d5a95"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export default database;
