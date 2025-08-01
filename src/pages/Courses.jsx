import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { collection, doc, getFirestore, onSnapshot } from 'firebase/firestore';


function Courses() {
  const { courses } = useFirebase();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [authors, setAuthors] = useState({});
const db = getFirestore(); // Firebase DB instance


  // Categories derived from courses or predefined
  const categories = ['All', ...new Set(courses.map(course => course.category || 'General'))];

  // Sort options
  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  useEffect(() => {
    if (courses.length > 0 || courses.error) {
      setLoading(false);
    }
  }, [courses]);

  // Filter and sort courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return (a.discountPrice || 0) - (b.discountPrice || 0);
    if (sortBy === 'price-high') return (b.discountPrice || 0) - (a.discountPrice || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0; // relevance (default, no sorting)
  });

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
  const paginatedCourses = filteredCourses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = {};
      snapshot.forEach(doc => {
        users[doc.id] = doc.data();
      });
      setAuthors(users);
    });
  
    return () => unsubscribe();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-50 p-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Sefghction */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Courses</h1>
              <p className="text-gray-600">Discover your next learning adventure</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                >
                  <i className="fas fa-th text-sm"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}
                >
                  <i className="fas fa-list text-sm"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search for courses, instructors, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <i className="fas fa-search absolute left-4 top-3.5 text-gray-400 text-sm"></i>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort and Results Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="text-sm text-gray-600 mb-2 sm:mb-0">
              Showing {filteredCourses.length} courses
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        {loading ? (
          <div className="text-center text-gray-600">Loading courses...</div>
        ) : paginatedCourses.length === 0 ? (
          <div className="text-center text-gray-600">No courses found.</div>
        ) : (
          <div
            className={`grid gap-6 mb-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
          >
            {paginatedCourses.map(course => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img
                    src={course.image || 'https://via.placeholder.com/300'}
                    alt={course.title}
                    className="w-full h-48 object-cover object-top"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                  />
                  {course.tag && (
                    <span
                      className={`absolute top-3 left-3 px-2 py-1 text-xs font-medium rounded-full ${course.tag === 'Bestseller'
                        ? 'bg-orange-100 text-orange-800'
                        : course.tag === 'New'
                          ? 'bg-green-100 text-green-800'
                          : course.tag === 'Popular'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                    >
                      {course.tag}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {course.category || 'General'}
                    </span>
                    <span className="text-xs text-gray-500">{course.level || 'All Levels'}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <div className="flex items-center mb-3">
                    {authors[course.instructorId]?.photoURL ? (
                      <img
                        src={authors[course.instructorId].photoURL}
                        alt="Instructor"
                        className="w-6 h-6 rounded-full mr-2 object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/24'; }}
                      />
                    ) : (
                      <FaUserCircle className="w-6 h-6 text-gray-400 mr-2" />
                    )}


                    <span className="text-sm text-gray-600">
                      Written by {authors[course.instructorId]?.fullName || 'Unknown Instructor'}
                    </span>


                  </div>
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-xs ${i < Math.floor(course.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        ></i>
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{(course.rating || 0).toFixed(1)}</span>
                    <span className="text-sm text-gray-500 ml-1">({(course.reviews || 0).toLocaleString()})</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        <i className="far fa-clock mr-1"></i>
                        {course.duration || 'N/A'}
                      </span>
                      <span>
                        <i className="fas fa-play-circle mr-1"></i>
                        {course.lessons || 'N/A'} lessons
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">
                        ${(course.discountPrice || 0).toFixed(2)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${(course.originalPrice || 0).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/course/${course.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredCourses.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={36}>36</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="fas fa-chevron-left mr-1"></i>
                Previous
              </button>
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <i className="fas fa-chevron-right ml-1"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;