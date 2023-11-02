// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA8WM4p_HCyjuI_luFVGMUAr_dcpYqHE_M",
  authDomain: "sharewithjd-a958a.firebaseapp.com",
  projectId: "sharewithjd-a958a",
  storageBucket: "sharewithjd-a958a.appspot.com",
  messagingSenderId: "81466773448",
  appId: "1:81466773448:web:cd2ec2e47e30fced9b3afd",
  measurementId: "G-BY7D84LT4X"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Storage
export const storage = getStorage(app);