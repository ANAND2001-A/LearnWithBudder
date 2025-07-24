import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FirebaseProvider } from './context/FirebaseContext';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Blogs from './pages/Blogs';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CoursesAdmin from './pages/CoursesAdmin';
import BlogsAdmin from './pages/BlogsAdmin';

function App() {
  return (
    <AuthProvider>
      <FirebaseProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin/courses" element={<CoursesAdmin />} />
            <Route path="/admin/blogs" element={<BlogsAdmin />} />
          </Route>
        </Routes>
      </FirebaseProvider>
    </AuthProvider>
  );
}

export default App;