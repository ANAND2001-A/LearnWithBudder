import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';

function Contact() {
  const { addContactMessage } = useFirebase();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addContactMessage(formData);
    setFormData({ name: '', email: '', message: '' });
    alert('Message sent successfully!');
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <motion.form
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            className="w “‘full p-3 border rounded-lg"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Message</label>
          <textarea
            className="w-full p-3 border rounded-lg"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
          Send Message
        </button>
      </motion.form>
    </div>
  );
}

export default Contact;