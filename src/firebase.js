// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOW_sD8mGDLYZFQVkj2HteIh8B64oIBHA",
  authDomain: "jd-share.firebaseapp.com",
  projectId: "jd-share",
  storageBucket: "jd-share.appspot.com",
  messagingSenderId: "853173567232",
  appId: "1:853173567232:web:8477ee6aa0ec6f4162bde5",
  measurementId: "G-6MKCSCL3NR"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);