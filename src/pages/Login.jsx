import { useState } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import userIcon from "../assets/icon/acc.svg";
import passwordIcon from "../assets/icon/pass.svg";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 to-green-700">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl p-8 pt-16 w-[350px]"
      >
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="bg-green-900 w-20 h-20 rounded-full flex items-center justify-center">
            <div className="bg-green-900 w-20 h-20 rounded-full flex items-center justify-center">
              <img src={userIcon} alt="User Icon" className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setLoginMethod("email")}
            className={`px-4 py-2 text-sm rounded ${
              loginMethod === "email"
                ? "bg-green-800 text-white"
                : "bg-white/20 text-white"
            }`}
            disabled={loading}
          >
            Email
          </button>
          <button
            onClick={() => setLoginMethod("phone")}
            className={`px-4 py-2 text-sm rounded ${
              loginMethod === "phone"
                ? "bg-green-800 text-white"
                : "bg-white/20 text-white"
            }`}
            disabled={loading}
          >
            Phone
          </button>
        </div>

        {loginMethod === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="flex items-center bg-white/20 px-3 py-2 rounded">
            <div className=" w-5 h-5 mr-2 pb-1">
              <img src={userIcon} alt="User Icon" className="" />
            </div>
              <input
                type="email"
                className="bg-transparent w-full text-white placeholder-gray-300 focus:outline-none"
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center bg-white/20 px-3 py-2 rounded">
            <div className=" w-4 h-4 mr-2 pb-1">
              <img src={passwordIcon} alt="User Icon" className="" />
            </div>
              <input
                type="password"
                className="bg-transparent w-full text-white placeholder-gray-300 focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between text-sm text-white">
              <label className="flex items-center space-x-1">
                <input type="checkbox" className="accent-green-700" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-gray-300 italic hover:underline">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full mt-2 bg-green-900 text-white py-2 rounded hover:bg-green-800"
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
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <div id="recaptcha-container" className="mb-2" />
            <button
              type="submit"
              className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800"
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
              className="w-full px-4 py-2 rounded bg-white/20 text-white placeholder-gray-300 focus:outline-none"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-white text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-green-200 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
