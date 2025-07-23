import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/oricon.png'; // Adjust the path as necessary

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  return (
    // bg-transparent backdrop-blur-sm use in this tag to blur
    <div className="text-white p-4 fixed top-0 w-full z-50 "> 
      <div className="container mx-auto flex justify-center items-center bg-[#FF9500] rounded-lg p-2 text-white text-[11px]">
        Free Courses 🌟 Sale Ends Soon, Get It Now
      </div>
      <nav className="text-black p-4 sticky top-0 z-50 ">

        <div className="container mx-auto flex justify-between items-center">
          <Link to="/">
            <img src={logo} className="h-6 w-auto" alt="Logo" />
          </Link>          
          <div className="hidden md:flex space-x-6 text-sm bg-white/30 backdrop-blur-md h-12 px-6 items-center rounded-2xl shadow-sm">
            <Link to="/" className="hover:text-[#262626]">Home</Link>
            <Link to="/courses" className="hover:text-[#262626]">Courses</Link>
            <Link to="/blogs" className="hover:text-[#262626]">Blogs</Link>
            <Link to="/contact" className="hover:text-[#262626]">Contact</Link>
            {currentUser ? (
              <>
                <Link to="/admin" className="hover:text-[#262626]">Admin</Link>
                <button onClick={logout} className="hover:text-[#262626]">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-[#262626]">Login</Link>
                <Link to="/signup" className="hover:text-[#262626]">Signup</Link>
              </>
            )}
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
        {isOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            className="md:hidden bg-blue-700 p-4"
          >
            <Link to="/" className="block py-2 hover:text-blue-200">Home</Link>
            <Link to="/courses" className="block py-2 hover:text-blue-200">Courses</Link>
            <Link to="/blogs" className="block py-2 hover:text-blue-200">Blogs</Link>
            <Link to="/contact" className="block py-2 hover:text-blue-200">Contact</Link>
            {currentUser ? (
              <>
                <Link to="/admin" className="block py-2 hover:text-blue-200">Admin</Link>
                <button onClick={logout} className="block py-2 hover:text-blue-200">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="block py-2 hover:text-blue-200">Login</Link>
                <Link to="/signup" className="block py-2 hover:text-blue-200">Signup</Link>
              </>
            )}
          </motion.div>
        )}
      </nav>
    </div>
  );
}

export default Navbar;