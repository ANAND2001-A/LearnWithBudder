import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { validateContactForm, clearcontactFieldError } from '../components/validation';

function Contact() {
  const { addContactMessage } = useFirebase();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsLoading(true);
      try {
        await addContactMessage(formData);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });
        setErrors({ name: '', email: '', message: '' });
        setTimeout(() => setIsSubmitted(false), 3000);
      } catch (error) {
        alert('Error sending message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setErrors(clearcontactFieldError(errors, field));
  };

  const inputVariants = {
    focus: { 
      scale: 1.03, 
      borderColor: '#60A5FA', 
      boxShadow: '0 0 8px rgba(96, 165, 250, 0.5)',
      transition: { duration: 0.3 } 
    },
    blur: { 
      scale: 1, 
      borderColor: 'rgba(255, 255, 255, 0.2)', 
      boxShadow: 'none',
      transition: { duration: 0.3 } 
    },
    error: {
      borderColor: '#EF4444',
      boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)',
      transition: { duration: 0.3 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05, 
      boxShadow: '0 8px 20px rgba(96, 165, 250, 0.5)', 
      transition: { duration: 0.3 } 
    },
    tap: { scale: 0.95 },
  };

  const backgroundVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 100%'],
      transition: { duration: 20, repeat: Infinity, repeatType: 'reverse' },
    },
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 360, transition: { duration: 0.5 } },
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-100 to-pink-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 pt-32"
      variants={backgroundVariants}
      animate="animate"
      style={{ backgroundSize: '200% 200%' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 100, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-lg w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20"
      >
        <div className="text-center ">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Let's Connect
          </motion.h1>
          <motion.p 
            className="mt-2 text-sm text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Drop us a message, and we'll get back to you soon!
          </motion.p>
        </div>

        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-500/20 text-green-900 p-3 rounded-lg text-center border border-green-500/30"
            >
              Message sent successfully!
            </motion.div>
          )}
        </AnimatePresence>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                Name
              </label>
              <motion.input
                id="name"
                type="text"
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500 backdrop-blur-sm"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
                variants={inputVariants}
                whileFocus="focus"
                animate={errors.name ? "error" : "blur"}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p 
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Email
              </label>
              <motion.input
                id="email"
                type="email"
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500 backdrop-blur-sm"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                variants={inputVariants}
                whileFocus="focus"
                animate={errors.email ? "error" : "blur"}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p 
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-800">
                Message
              </label>
              <motion.textarea
                id="message"
                className="mt-1 w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg focus:outline-none text-gray-900 placeholder-gray-500 backdrop-blur-sm"
                rows="5"
                placeholder="Your message here..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                required
                variants={inputVariants}
                whileFocus="focus"
                animate={errors.message ? "error" : "blur"}
              />
              <AnimatePresence>
                {errors.message && (
                  <motion.p 
                    className="mt-1 text-sm text-red-500"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {errors.message}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {isLoading ? 'Sending...' : 'Send Message'}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default Contact;