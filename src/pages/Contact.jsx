import { motion } from 'framer-motion';
import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterest,
  FaDribbble,
} from 'react-icons/fa';

function Contact() {
  const { addContactMessage } = useFirebase();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addContactMessage(formData);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });
    alert('Message sent successfully!');
  };

  const iconVariants = {
    hover: { scale: 1.2, rotate: 360, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row p-12 md:p-15 py-44">
      {/* Contact Form */}
      <div className="md:w-2/3 w-full md:pr-12">
        <p className="text-sm text-gray-500 mb-2">Contact Us</p>
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Join Us in Creating Something Great
        </h2>

        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            placeholder="First Name *"
            className="p-3 border border-gray-200 rounded-md"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Last Name *"
            className="p-3 border border-gray-200 rounded-md"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Email *"
            className="p-3 border border-gray-200 rounded-md"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
          />
          <input
            type="tel"
            placeholder="Phone Number *"
            className="p-3 border border-gray-200 rounded-md"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
          />
          <input
            type="text"
            placeholder="Subject *"
            className="col-span-2 p-3 border border-gray-200 rounded-md"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Message *"
            className="col-span-2 p-3 border border-gray-200 rounded-md"
            rows="5"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            required
          />
          <div className="col-span-2 flex gap-3 mt-4">
            <button
              type="submit"
              className="bg-[#FF9500] text-white px-6 py-2 rounded-full hover:bg-[#f1a437] transition"
            >
              Send Message
            </button>
            <button
              type="button"
              className="w-8 h-8 rounded-full border border-black text-black text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </motion.form>
      </div>

      {/* Info Sidebar */}
      <div className="md:w-1/3 w-full mt-12 md:mt-0 bg-[#FF9500] text-white p-6 rounded-xl">
        <h3 className="text-xl font-bold mb-4">Address</h3>
        <p className="mb-4">
          4517 Washington Ave. Manchester, Kentucky 39495
        </p>

        <h3 className="text-xl font-bold mb-2">Contact</h3>
        <p>Phone: +0123-456-789</p>
        <p className="mb-4">Email: example@gmail.com</p>

        <h3 className="text-xl font-bold mb-2">Open Time</h3>
        <p className="mb-4">Monday – Friday: 10:00 – 20:00</p>

        <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
        <div className="flex gap-4 text-white mt-2">
          <motion.div variants={iconVariants} whileHover="hover">
            <FaFacebookF className="w-6 h-6 cursor-pointer" />
          </motion.div>
          <motion.div variants={iconVariants} whileHover="hover">
            <FaTwitter className="w-6 h-6 cursor-pointer" />
          </motion.div>
          <motion.div variants={iconVariants} whileHover="hover">
            <FaInstagram className="w-6 h-6 cursor-pointer" />
          </motion.div>
          <motion.div variants={iconVariants} whileHover="hover">
            <FaPinterest className="w-6 h-6 cursor-pointer" />
          </motion.div>
          <motion.div variants={iconVariants} whileHover="hover">
            <FaDribbble className="w-6 h-6 cursor-pointer" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Contact;