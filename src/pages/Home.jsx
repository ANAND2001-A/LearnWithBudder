import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useFirebase } from '../context/FirebaseContext';
import { useEffect, useState } from 'react';
import img from '../assets/bg.jpg'; // Replace with your image path

function Home() {
  const { courses, blogs } = useFirebase();
  const [search, setSearch] = useState('');

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      {/* Hero Section with Background Image */}
      <div className="relative h-[80vh] flex items-center justify-center text-red-500 overflow-hidden">
        {/* Background Image */}
        <img
          src={img} // <-- Replace this with your image path
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Foreground Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center"
        >
          <h1 className="text-3xl font-medium mb-4 text-[#1A1A1A]"><span className='text-[#FF9500]'>Ignite</span>Your Web Development Journey</h1>
          <p className="text-xl mb-6">
          Learn HTML, CSS, JavaScript, and more — guided by industry experts!          </p>
          <Link
            to="/courses"
            className="bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-700"
          >
            Explore Courses
          </Link>
        </motion.div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto py-12 px-4">
        <input
          type="text"
          placeholder="Search courses or blogs..."
          className="w-full p-3 mb-8 border rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Featured Courses */}
        <h2 className="text-3xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredCourses.slice(0, 3).map(course => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600">
                {course.description.slice(0, 100)}...
              </p>
              <Link to="/courses" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Latest Blogs */}
        <h2 className="text-3xl font-bold mb-6 mt-12">Latest Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredBlogs.slice(0, 3).map(blog => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600">
                {blog.description.slice(0, 100)}...
              </p>
              <Link to="/blogs" className="text-blue-600 hover:underline">
                Read More
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
