// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics,  } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcN3XolyPkn6U-rj1e5H1XW1A5TzVIJPk",
  authDomain: "drawing-pad-cc051.firebaseapp.com",
  projectId: "drawing-pad-cc051",
  storageBucket: "drawing-pad-cc051.appspot.com",
  messagingSenderId: "619240206060",
  appId: "1:619240206060:web:3e0930d8838548be0ebfc9",
  measurementId: "G-01VRXRJ8YW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
