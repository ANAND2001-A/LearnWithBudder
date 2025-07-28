import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFirebase } from '../context/FirebaseContext';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';

function CoursesAdmin() {
  const { currentUser } = useAuth();
  const { addCourse } = useFirebase();
  const [courseForm, setCourseForm] = useState({ title: '', description: '', image: '', topics: [], category: '', difficulty: 'Beginner', duration: '', price: '', currency: 'USD' });
  const [topic, setTopic] = useState('');
  const [curriculum, setCurriculum] = useState([{ id: 1, title: '', lessons: [] }]);
  const [requirements, setRequirements] = useState('');
  const [learningOutcomes, setLearningOutcomes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formErrors, setFormErrors] = useState({});

  if (!currentUser) return <Navigate to="/login" />;

  // Validation functions
  const validateCourseForm = (formData, curriculum, requirements, learningOutcomes) => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Course Title is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.description.trim()) errors.description = 'Course Description is required';
    return errors;
  };

  const clearFieldError = (errors, field) => ({
    ...errors,
    [field]: ''
  });

  const handleInputChange = (field, value) => {
    setCourseForm(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => clearFieldError(prev, field));
  };

  const addTopic = () => {
    if (topic.trim()) {
      setCourseForm(prev => ({ ...prev, topics: [...prev.topics, topic.trim()] }));
      setTopic('');
    }
  };

  const addSection = () => setCurriculum(prev => [...prev, { id: Date.now(), title: '', lessons: [] }]);
  const updateSectionTitle = (id, title) => setCurriculum(prev => prev.map(s => s.id === id ? { ...s, title } : s));
  const addLesson = (sectionId) => setCurriculum(prev => prev.map(s => s.id === sectionId ? { ...s, lessons: [...s.lessons, { id: Date.now(), title: '' }] } : s));

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          handleInputChange('image', event.target.result.toString());
        }
      };
      reader.onerror = () => {
        setError('Failed to read the image file.');
        handleInputChange('image', '');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCourseSubmit = async (e) => {
    e.preventDefault();
    const errors = validateCourseForm(courseForm, curriculum, requirements, learningOutcomes);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setError('');
    setSuccess('');
    try {
      await addCourse({
        ...courseForm,
        createdAt: '2025-07-24T11:32:00Z', // 05:02 PM IST converted to UTC
        createdBy: currentUser.email,
        curriculum,
        requirements,
        learningOutcomes,
      });
      setCourseForm({ title: '', description: '', image: '', topics: [], category: '', difficulty: 'Beginner', duration: '', price: '', currency: 'USD' });
      setCurriculum([{ id: 1, title: '', lessons: [] }]);
      setRequirements('');
      setLearningOutcomes('');
      setSuccess('Course added successfully!');
    } catch (err) {
      setError('Failed to add course: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Course Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
                  <input
                    type="text"
                    value={courseForm.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter course title"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${formErrors.title ? 'border-red-500' : 'border-gray-300'}`}
                    required
                  />
                  {formErrors.title && <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={courseForm.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${formErrors.category ? 'border-red-500' : 'border-gray-300'} appearance-none cursor-pointer`}
                    >
                      <option value="">Select Category</option>
                      <option value="programming">Programming</option>
                      <option value="design">Design</option>
                      <option value="business">Business</option>
                      <option value="marketing">Marketing</option>
                    </select>
                    {formErrors.category && <p className="text-red-600 text-xs mt-1">{formErrors.category}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                    <div className="flex space-x-3">
                      {["Beginner", "Intermediate", "Advanced"].map(level => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => handleInputChange('difficulty', level)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium cursor-pointer ${courseForm.difficulty === level ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label><input type="number" value={courseForm.duration} onChange={(e) => handleInputChange('duration', e.target.value)} placeholder="e.g., 10" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>
                  <div><label className="block text-sm font-medium text-gray-700 mb-2">Price</label><div className="flex"><select value={courseForm.currency} onChange={(e) => handleInputChange('currency', e.target.value)} className="px-3 py-3 border border-gray-300 border-r-0 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-gray-50"><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option></select><input type="number" value={courseForm.price} onChange={(e) => handleInputChange('price', e.target.value)} placeholder="0.00" className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div></div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Description *</label>
                  <div className="border border-gray-300 rounded-lg">
                    <div className="flex items-center space-x-1 p-3 border-b border-gray-200 bg-gray-50">
                      <button type="button" className="p-2 hover:bg-gray-200 rounded cursor-pointer"><i className="fas fa-bold text-gray-600"></i></button>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded cursor-pointer"><i className="fas fa-italic text-gray-600"></i></button>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded cursor-pointer"><i className="fas fa-underline text-gray-600"></i></button>
                      <div className="w-px h-6 bg-gray-300 mx-2"></div>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded cursor-pointer"><i className="fas fa-list-ul text-gray-600"></i></button>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded cursor-pointer"><i className="fas fa-list-ol text-gray-600"></i></button>
                      <button type="button" className="p-2 hover:bg-gray-200 rounded cursor-pointer"><i className="fas fa-link text-gray-600"></i></button>
                    </div>
                    <textarea
                      value={courseForm.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your course in detail..."
                      rows={8}
                      className={`w-full px-4 py-3 border-none focus:ring-0 resize-none text-sm ${formErrors.description ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {formErrors.description && <p className="text-red-600 text-xs mt-1">{formErrors.description}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Topic</label>
                  <div className="flex space-x-2"><input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Enter topic" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /><button type="button" onClick={addTopic} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">Add</button></div>
                  <ul className="mt-2 text-sm text-gray-700 list-disc pl-5">{courseForm.topics.map((t, index) => <li key={index}>{t}</li>)}</ul>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2><button type="button" onClick={addSection} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"><i className="fas fa-plus text-sm"></i><span>Add Section</span></button></div>
              <div className="space-y-4">{curriculum.map((section, index) => (<div key={section.id} className="border border-gray-200 rounded-lg p-4"><div className="flex items-center space-x-3 mb-3"><div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">{index + 1}</div><input type="text" value={section.title} onChange={(e) => updateSectionTitle(section.id, e.target.value)} placeholder="Section title" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /><button type="button" onClick={() => addLesson(section.id)} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer"><i className="fas fa-plus text-sm mr-1"></i>Add Lesson</button></div>{section.lessons.length > 0 && <div className="ml-11 space-y-2">{section.lessons.map((lesson, lessonIndex) => (<div key={lesson.id} className="flex items-center space-x-3"><div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-600">{lessonIndex + 1}</div><input type="text" placeholder="Lesson title" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm" /></div>))}</div>}</div>))}</div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Thumbnail</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                {courseForm.image ? (
                  <div className="relative">
                    <img
                      src={courseForm.image}
                      alt="Course thumbnail"
                      className="w-full h-48 object-cover rounded-lg"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x250'; }}
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange('image', '')}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 cursor-pointer"
                    >
                      <i className="fas fa-times text-sm"></i>
                    </button>
                  </div>
                ) : (
                  <div
                    className="cursor-pointer"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
                    <p className="text-lg font-medium text-gray-700 mb-2">Drop your image here</p>
                    <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Recommended size: 1200x800px</p>
                <p>Supported formats: JPG, PNG, GIF</p>
                <p>Max file size: 5MB</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="What are the requirements or prerequisites for taking your course?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              />
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Outcomes</h3>
              <textarea
                value={learningOutcomes}
                onChange={(e) => setLearningOutcomes(e.target.value)}
                placeholder="What will students learn from this course?"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button type="button" className="px-6 py-3 text-gray-700 hover:text-gray-900 cursor-pointer">Cancel</button>
          <button type="button" className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 cursor-pointer">Save as Draft</button>
          <button type="submit" onClick={handleCourseSubmit} className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">Create Course</button>
        </div>
      </div>
    </div>
  );
}

export default CoursesAdmin;