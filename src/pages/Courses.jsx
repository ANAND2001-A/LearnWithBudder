import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Courses() {
  const { courses } = useFirebase();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate initial loading state (remove if FirebaseContext handles loading)
  useEffect(() => {
    if (courses.length > 0 || courses.error) {
      setLoading(false);
    }
  }, [courses]);

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Courses</h1>
        <input
          type="text"
          placeholder="Search courses..."
          className="w-full p-3 mb-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {loading ? (
          <div className="text-center text-gray-600">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center text-gray-600">No courses found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={course.image || 'https://via.placeholder.com/300'}
                    alt={course.title}
                    className="w-full h-48 object-cover object-top"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                  />
                  {course.tag && (
                    <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-medium ${course.tagColor || 'bg-blue-500'}`}>
                      {course.tag}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{course.instructor || 'Unknown Instructor'}</p>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center mr-3">
                      {Array.from({ length: 5 }, (_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(course.rating || 0) ? 'text-yellow-400' : i < Math.ceil(course.rating || 0) && (course.rating % 1) > 0 ? 'text-yellow-400 opacity-50' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({course.reviews || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${(course.discountPrice || 0).toFixed(2)}</span>
                      <span className="text-sm text-gray-500 line-through">${(course.originalPrice || course.discountPrice || 0).toFixed(2)}</span>
                    </div>
                    <Link to={`/course/${course.id}`} className="text-blue-600 hover:underline text-sm">
                      Read More
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;