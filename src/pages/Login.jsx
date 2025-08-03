import { useState, useEffect } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import userIcon from "../assets/icon/acc.svg";
import passwordIcon from "../assets/icon/pass.svg";
import bot from "../assets/rocket2.gif"; // updated image

function Login() {
  const { auth, signIn, signupWithPhone } = useFirebase();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [loginMethod, setLoginMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (loginMethod === "phone" && window.recaptchaVerifier == null) {
      window.recaptchaVerifier = new window.firebase.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {},
        }
      );
    }
  }, [loginMethod]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      alert("Login successful!");
      navigate("/admin");
    } catch (error) {
      alert("Login failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const confirmationResult = await signupWithPhone(
        phone,
        "recaptcha-container"
      );
      setConfirmation(confirmationResult);
      alert("OTP sent!");
    } catch (error) {
      alert("Failed to send OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!confirmation) {
      alert("No OTP confirmation found.");
      return;
    }
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      alert("Phone number verified and logged in!");
      navigate("/admin");
    } catch (error) {
      alert("Invalid OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e0c3fc] to-[#FF7F50] px-4">
      <div className="max-w-5xl w-full bg-gradient-to-br from-[#e0c3fc] to-[#FF7F50] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side - Bot and Text */}
        <div className="w-full md:w-1/2 text-center md:text-left px-8 py-12 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
            Be <br /> limitless
          </h1>
          <img src={bot} alt="Bot" className="w-64 h-64 object-contain" />
        </div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 p-8 md:p-12"
        >
          {/* Login Toggle */}
          <div className="flex justify-center gap-2 mb-6">
            <button
              onClick={() => {
                setLoginMethod("email");
                setConfirmation(null);
              }}
              className={`px-4 py-2 text-sm rounded border ${
                loginMethod === "email"
                  ? "bg-[#FF7F50] text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
              disabled={loading}
            >
              Email
            </button>
            <button
              onClick={() => {
                setLoginMethod("phone");
                setConfirmation(null);
              }}
              className={`px-4 py-2 text-sm rounded border ${
                loginMethod === "phone"
                  ? "bg-[#FF7F50] text-white"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
              disabled={loading}
            > 
              Phone
            </button>
          </div>

          {/* Email Login */}
          {loginMethod === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email ID"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-[#FF7F50]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-[#FF7F50]"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FF7F50] text-white py-2 rounded hover:bg-[#FF7F50]"
                disabled={loading}
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </form>
          ) : !confirmation ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <input
                type="tel"
                placeholder="+91XXXXXXXXXX"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-[#FF7F50]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
              <div id="recaptcha-container" className="mb-2" />
              <button
                type="submit"
                className="w-full bg-[#FF7F50] text-white py-2 rounded hover:bg-[#FF7F50]"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-[#FF7F50]"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-[#FF7F50] text-white py-2 rounded hover:bg-[#FF7F50]"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          <p className="mt-4 text-center text-sm text-[#FFFFFF]">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#FFFFFF] hover:underline">
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default Login;
