import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Blogs() {
  const { blogs } = useFirebase();
  const [search, setSearch] = useState('');

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Blogs</h1>
      <input
        type="text"
        placeholder="Search blogs..."
        className="w-full p-3 mb-8 border rounded-lg"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredBlogs.map(blog => (
          <motion.div
            key={blog.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">{blog.title}</h3>
            <p className="text-gray-600">{blog.description.slice(0, 100)}...</p>
            <Link to="#" className="text-blue-600 hover:underline">Read More</Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Blogs;