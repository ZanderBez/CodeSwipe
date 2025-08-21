// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCa5veh-9Mk34rPVzJpYUCtuBtFqxfwS6k",
  authDomain: "codeswipe-7c5e1.firebaseapp.com",
  projectId: "codeswipe-7c5e1",
  storageBucket: "codeswipe-7c5e1.firebasestorage.app",
  messagingSenderId: "152169237437",
  appId: "1:152169237437:web:bf7ae067581b304049a0d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);