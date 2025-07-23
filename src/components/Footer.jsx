import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logo from '../assets/oricon.png'; // Adjust the path as necessary

function Footer() {
  return (
    <footer className="bg-white text-black py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
        <Link to="/">
            <img src={logo} className="h-6 w-auto" alt="Logo" />
          </Link>     
          <p className="text-gray-400">Empowering students with top-tier coding tutorials and resources.</p>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="/courses" className="hover:text-blue-400">Courses</a></li>
            <li><a href="/blogs" className="hover:text-blue-400">Blogs</a></li>
            <li><a href="/contact" className="hover:text-blue-400">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <motion.a
              href="https://twitter.com"
              whileHover={{ scale: 1.2 }}
              className="text-2xl hover:text-blue-400"
            >
              <FaTwitter />
            </motion.a>
            <motion.a
              href="https://github.com"
              whileHover={{ scale: 1.2 }}
              className="text-2xl hover:text-blue-400"
            >
              <FaGithub />
            </motion.a>
            <motion.a
              href="https://linkedin.com"
              whileHover={{ scale: 1.2 }}
              className="text-2xl hover:text-blue-400"
            >
              <FaLinkedin />
            </motion.a>
            <motion.a
              href="https://instagram.com"
              whileHover={{ scale: 1.2 }}
              className="text-2xl hover:text-blue-400"
            >
              <FaInstagram />
            </motion.a>
          </div>
        </div>
      </div>
      <div className="text-center mt-8">
        <p>&copy; 2025 LearnSphere. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;