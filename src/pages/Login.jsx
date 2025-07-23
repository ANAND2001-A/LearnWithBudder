import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/admin');
    } catch (error) {
      alert('Login failed: ' + error.message);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            className="w-full p-3 border rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;