import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

// ✅ ADDED: Import Firestore dependencies
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

const AuthContext = createContext();

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBI6JiCNmwFMLBlKJBZyecTWCnf0IdrX-0",
  authDomain: "codewithbuder.firebaseapp.com",
  projectId: "codewithbuder",
  storageBucket: "codewithbuder.firebasestorage.app",
  messagingSenderId: "309293227925",
  appId: "1:309293227925:web:4d55543ce9df21d83ce09c",
  measurementId: "G-Q3Q4G922TV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ ADDED: Initialize Firestore
const db = getFirestore(app);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    // ✅ REPLACED: Firebase Auth state listener with Firestore user profile binding
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setCurrentUser({ uid: user.uid, email: user.email, ...docSnap.data() });
          } else {
            // fallback to plain auth user object
            setCurrentUser({ uid: user.uid, email: user.email, fullName: user.fullName });
          }
          setLoading(false);
        });

        return () => unsubscribeDoc(); // Cleanup Firestore listener
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe(); // Cleanup auth listener
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
