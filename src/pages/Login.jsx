import { useState } from 'react';
import { useFirebase } from '../context/FirebaseContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Login() {
  const { auth, signIn, signupWithPhone } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [loginMethod, setLoginMethod] = useState('email'); // 'emdfdfail' or 'phone'
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      alert('Login successful!');
      navigate('/admin');
    } catch (error) {
      alert('Login failed: ' + error.message);
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
      alert('Phone number verified and logged in!');
      navigate('/admin');
    } catch (error) {
      alert('Invalid OTP: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Login</h1>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
        <div className="flex justify-center mb-4">
          <button
            onClick={() => setLoginMethod('email')}
            className={`px-4 py-2 mr-2 rounded-lg ${loginMethod === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            disabled={loading}
          >
            Email Login
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`px-4 py-2 rounded-lg ${loginMethod === 'phone' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            disabled={loading}
          >
            Phone Login
          </button>
        </div>

        {loginMethod === 'email' ? (
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
              {loading ? 'Logging In...' : 'Login with Email'}
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
          Don't have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;