import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [signupMethod, setSignupMethod] = useState('email'); // 'email' or 'phone'
  const [loading, setLoading] = useState(false);
  const { signup, signupWithPhone } = useFirebase();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password);
      alert('Signup successful!');
      navigate('/admin');
    } catch (error) {
      alert('Signup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const confirmationResult = await signupWithPhone(phone, 'recaptcha-container');
      setConfirmation(confirmationResult);
      alert('OTP sent!');
    } catch (error) {
      alert('Failed to send OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      alert('Phone number verified and signed up!');
      navigate('/admin');
    } catch (error) {
      alert('Invalid OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Sign Up</h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setSignupMethod('email')}
            className={`px-4 py-2 mr-2 rounded-lg ${signupMethod === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            disabled={loading}
          >
            Email Signup
          </button>
          <button
            onClick={() => setSignupMethod('phone')}
            className={`px-4 py-2 rounded-lg ${signupMethod === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            disabled={loading}
          >
            Phone Signup
          </button>
        </div>

        {signupMethod === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-3 border rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
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
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:bg-blue-400"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up with Email'}
            </button>
          </form>
        ) : (
          <>
            {!confirmation ? (
              <form onSubmit={handlePhoneSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-lg"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div id="recaptcha-container"></div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={loading}
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP}>
                <div className="mb-4">
                  <label className="block text-gray-700">Enter OTP</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-lg"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-full hover:bg-green-700 disabled:bg-green-400"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            )}
          </>
        )}

        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;