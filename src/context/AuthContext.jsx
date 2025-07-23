import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? user.email : 'No user');
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
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