import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

function BlogsAdmin() {
  const { currentUser } = useAuth();
  const { addBlog } = useFirebase();
  const [blogForm, setBlogForm] = useState({ title: '', description: '', image: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!currentUser) return <Navigate to="/login" />;

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await addBlog({
        ...blogForm,
        createdAt: new Date().toISOString(),
        createdBy: currentUser.email
      });
      setBlogForm({ title: '', description: '', image: '' });
      setSuccess('Blog added successfully!');
    } catch (err) {
      setError('Failed to add blog: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex-1 p-8">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Blog</h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img
                src={blogForm.image || 'https://via.placeholder.com/400x250'}
                alt="Blog Preview"
                className="w-full h-full object-cover object-top"
                onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250'; }}
              />
            </div>
            <div className="p-6">
              {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
              <form onSubmit={handleBlogSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Title</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg text-sm"
                    value={blogForm.title}
                    onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Description</label>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm"
                    value={blogForm.description}
                    onChange={(e) => setBlogForm({ ...blogForm, description: e.target.value })}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm">Image URL</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg text-sm"
                    value={blogForm.image}
                    onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                >
                  Add Blog
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default BlogsAdmin;