import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Navigate, Link } from 'react-router-dom';
// import AdminNavbar from '../components/AdminNavbar';

function AdminPanel() {
  const { currentUser, signOut } = useAuth();
  const { courses, blogs } = useFirebase();

  if (!currentUser) return <Navigate to="/login" />;

  // Calculate stats (placeholder until Firebase queries are implemented)
  const totalCourses = courses.length || 0;
  const totalBlogs = blogs.length || 0;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out failed:', error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AdminNavbar currentUser={currentUser} onSignOut={handleSignOut} /> */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
          <div className="p-6">
            <nav className="space-y-2">
              <Link
                to="/admin"
                className="flex items-center space-x-3 text-gray-900 bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
              >
                <i className="fas fa-home text-gray-600"></i>
                <span className="font-medium">Dashboard</span>
              </Link>
              <Link
                to="/admin/courses"
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
              >
                <i className="fas fa-book text-gray-600"></i>
                <span>Courses</span>
              </Link>
              <Link
                to="/admin/blogs"
                className="flex items-center space-x-3 text-gray-700 hover:bg-gray-100 rounded-lg px-3 py-2 cursor-pointer"
              >
                <i className="fas fa-blog text-gray-600"></i>
                <span>Blogs</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            {/* <div className="flex items-center space-x-4 mb-6">
              <img
                src="https://readdy.ai/api/search-image?query=professional%20person%20portrait%20headshot%20smiling%20friendly%20clean%20white%20background%20modern%20lighting&width=60&height=60&seq=user1&orientation=squarish"
                alt="User"
                className="w-15 h-15 rounded-full object-cover"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome Back {currentUser.email.split('@')[0]}
                </h1>
                <p className="text-gray-600">Manage your content here</p>
              </div>
            </div> */}

            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Courses</h3>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <i className="fas fa-book text-white text-sm"></i>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 font-medium">Total Blogs</h3>
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                    <i className="fas fa-blog text-white text-sm"></i>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">{totalBlogs}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;