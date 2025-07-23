import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

function CoursesAdmin() {
  const { currentUser } = useAuth();
  const { addCourse } = useFirebase();
  const [courseForm, setCourseForm] = useState({ title: '', description: '', image: '', topics: [] });
  const [topic, setTopic] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentUser) return <Navigate to="/login" />;

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await addCourse({
        ...courseForm,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.email
      });
      setCourseForm({ title: '', description: '', image: '', topics: [] });
      setSuccess('Course added successfully!');
    } catch (err) {
      setError('Failed to add course: ' + err.message);
    }
  };

  const addTopic = () => {
    if (topic.trim()) {
      setCourseForm({ ...courseForm, topics: [...courseForm.topics, topic.trim()] });
      setTopic('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Course</h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={courseForm.image || 'https://via.placeholder.com/400x250'}
                alt="Course Preview"
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250'; }}
              />
            </div>
            <div className="p-6">
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
              <form onSubmit={handleCourseSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg text-sm"
                    value={courseForm.title}
                    onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Description</label>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm"
                    value={courseForm.description}
                    onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Image URL</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg text-sm"
                    value={courseForm.image}
                    onChange={(e) => setCourseForm({ ...courseForm, image: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Add Topic</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="w-full p-3 border rounded-lg text-sm"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={addTopic}
                      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                      Add
                    </button>
                  </div>
                  <ul className="mt-2 text-sm text-gray-700">
                    {courseForm.topics.map((t, index) => (
                      <li key={index}>{t}</li>
                    ))}
                  </ul>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Course
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default CoursesAdmin;