import { createContext, useContext, useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

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
const db = getFirestore(app);

export function FirebaseProvider({ children }) {
  const [courses, setCourses] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [contacts, setContacts] = useState([]);

  const addCourse = async (course) => {
    try {
      const courseData = {
        ...course,
        createdAt: course.createdAt || new Date().toISOString(),
        createdBy: course.createdBy || 'unknown',
        curriculum: course.curriculum || [],
        requirements: course.requirements || '',
        learningOutcomes: course.learningOutcomes || '',
      };
      await addDoc(collection(db, 'courses'), courseData);
      console.log('Course added:', courseData);
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  };

  const addBlog = async (blog) => {
    try {
      const blogData = {
        ...blog,
        createdAt: blog.createdAt || '2025-07-24T11:18:00Z', // 04:48 PM IST converted to UTC
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
      console.log('Blog added:', blogData);
    } catch (error) {
      console.error('Error adding blog:', error);
      throw error;
    }
  };

  const addContactMessage = async (message) => {
    try {
      await addDoc(collection(db, 'contacts'), message);
      console.log('Contact message added:', message);
    } catch (error) {
      console.error('Error adding contact message:', error);
      throw error;
    }
  };

  const fetchCourses = () => {
    const unsubscribe = onSnapshot(collection(db, 'courses'), (querySnapshot) => {
      const courseList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCourses(courseList);
      console.log('Fetched courses:', courseList);
    }, (error) => {
      console.error('Error fetching courses:', error);
    });
    return unsubscribe;
  };

  const fetchBlogs = () => {
    const unsubscribe = onSnapshot(collection(db, 'blogs'), (querySnapshot) => {
      const blogList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBlogs(blogList);
      console.log('Fetched blogs:', blogList);
    }, (error) => {
      console.error('Error fetching blogs:', error);
    });
    return unsubscribe;
  };

  const fetchContacts = () => {
    const unsubscribe = onSnapshot(collection(db, 'contacts'), (querySnapshot) => {
      const contactList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setContacts(contactList);
      console.log('Fetched contacts:', contactList);
    }, (error) => {
      console.error('Error fetching contacts:', error);
    });
    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribeCourses = fetchCourses();
    const unsubscribeBlogs = fetchBlogs();
    const unsubscribeContacts = fetchContacts();
    return () => {
      unsubscribeCourses();
      unsubscribeBlogs();
      unsubscribeContacts();
    };
  }, []);

  const value = {
    courses,
    blogs,
    contacts,
    addCourse,
    addBlog,
    addContactMessage
  };

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>;
}

export function useFirebase() {
  return useContext(FirebaseContext);
}