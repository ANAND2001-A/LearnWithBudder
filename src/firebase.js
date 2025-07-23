// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBI6JiCNmwFMLBlKJBZyecTWCnf0IdrX-0",
  authDomain: "codewithbuder.firebaseapp.com",
  projectId: "codewithbuder",
  storageBucket: "codewithbuder.firebasestorage.app",
  messagingSenderId: "309293227925",
  appId: "1:309293227925:web:4d55543ce9df21d83ce09c",
  measurementId: "G-Q3Q4G922TV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };