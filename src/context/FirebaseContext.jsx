import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  setDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from 'firebase/auth';
import { auth, db } from '../firebase';

const FirebaseContext = createContext();

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
// const db = getFirestore(app);
// const auth = getAuth(app);

export function FirebaseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);

  const signup = async (email, password, firstName, lastName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: firstName || '',
        lastName: lastName || '',
        fullName: `${firstName} ${lastName}`,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Email signup error:', error);
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signupWithPhone = async (phone, recaptchaContainerId) => {
    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
          size: 'invisible',
          callback: (response) => {},
        });
      }
      const confirmationResult = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      return confirmationResult;
    } catch (error) {
      console.error('Phone authentication error:', error);
      throw error;
    }
  };

  const addCourse = async (course) => {
    try {
      const user = auth.currentUser;

      let instructorName = 'Unknown Instructor';
      let instructorImage = null;

      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          instructorName = data.fullName || 'Unknown Instructor';
          instructorImage = data.photoURL || null;
        }
      }

      const courseData = {
        ...course,
        createdAt: new Date().toISOString(),
        createdBy: user ? user.uid : 'unknown',
        instructorId: user ? user.uid : null, // ✅ Save instructor ID
        instructor: instructorName,
        instructorImage,
        curriculum: course.curriculum || [],
        requirements: course.requirements || '',
        learningOutcomes: course.learningOutcomes || '',
      };

      await addDoc(collection(db, 'courses'), courseData);
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const addBlog = async (blog) => {
    try {
      const blogData = {
        ...blog,
        createdAt: blog.createdAt || new Date().toISOString(),
        createdBy: blog.createdBy || 'unknown',
        tags: blog.tags || [],
        status: blog.status || 'draft',
        publishDate: blog.publishDate || '',
        isFeatured: blog.isFeatured || false,
        author: blog.author || '',
        metaTitle: blog.metaTitle || '',
        metaDescription: blog.metaDescription || '',
        slug: blog.slug || '',
        imagePreview: blog.imagePreview || '',
      };
      await addDoc(collection(db, 'blogs'), blogData);
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  };

  const addContactMessage = async (message) => {
    try {
      await addDoc(collection(db, 'contacts'), message);
    } catch (error) {
      console.error('Error adding contact message:', error);
      throw error;
    }
  };

  const fetchCourses = () => {
    return onSnapshot(collection(db, 'courses'), (querySnapshot) => {
      const courseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
    });
  };

  const fetchBlogs = () => {
    return onSnapshot(collection(db, 'blogs'), (querySnapshot) => {
      const blogList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogList);
    });
  };

  const fetchContacts = () => {
    return onSnapshot(collection(db, 'contacts'), (querySnapshot) => {
      const contactList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(contactList);
    });
  };

  useEffect(() => {
    const unsubCourses = fetchCourses();
    const unsubBlogs = fetchBlogs();
    const unsubContacts = fetchContacts();
    return () => {
      unsubCourses();
      unsubBlogs();
      unsubContacts();
    };
  }, []);

  const value = {
    courses,
    blogs,
    contacts,
    addCourse,
    addBlog,
    addContactMessage,
    auth,
    signup,
    signIn,
    signupWithPhone,
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  return useContext(FirebaseContext);
}
