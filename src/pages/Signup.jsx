import { useState } from "react";
import { useFirebase } from "../context/FirebaseContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import img from "../assets/rocket.gif";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";



function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [signupMethod, setSignupMethod] = useState("email");
  const [loading, setLoading] = useState(false);
  const { signup, signupWithPhone } = useFirebase();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(email, password, firstName, lastName);
      alert("Signup successful!");
      navigate("/admin");
    } catch (error) {
      alert("Signup failed: " + error.message);
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
      alert("Phone number verified and signed up!");
      navigate("/admin");
    } catch (error) {
      alert("Invalid OTP: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-300 via-purple-300 to-[#FF9500] px-4 py-10">
      <div className="w-full max-w-6xl bg-white bg-opacity-30 backdrop-blur-lg rounded-3xl shadow-2xl p-8 flex flex-col md:flex-row items-center justify-between">
        
        {/* Left - Rocket & Text */}
        <div className="w-full md:w-1/2 text-center md:text-left mb-10 md:mb-0 px-4">
  <h1 className="text-5xl font-bold text-gray-800 mb-6 leading-tight">
    Be <br /> limitless
  </h1>
  <img
    src={img} // replace this with your image path
    alt="Rocket"
    className="w-64 h-64 mx-auto md:mx-0" // previously w-48 h-52
  />
</div>


        {/* Right - Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-700">Sign up</h2>
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-[#FF9500] hover:underline">
                Log in
              </Link>
            </p>
          </div>

          <div className="flex justify-center mb-4">
            <button
              onClick={() => setSignupMethod("email")}
              className={`px-4 py-2 mr-2 rounded-lg ${
                signupMethod === "email"
                  ? "bg-[#FF9500] text-white"
                  : "bg-gray-200"
              }`}
              disabled={loading}
            >
              Email Signup
            </button>
            <button
              onClick={() => setSignupMethod("phone")}
              className={`px-4 py-2 rounded-lg ${
                signupMethod === "phone"
                  ? "bg-[#FF9500] text-white"
                  : "bg-gray-200"
              }`}
              disabled={loading}
            >
              Phone Signup
            </button>
          </div>

          {signupMethod === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
                value={firstName}
                onChange={(e) => setFirstname(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
                value={lastName}
                onChange={(e) => setLastname(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                <span className="text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-[#FF9500] hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-[#FF9500] hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </div>
              <button
                type="submit"
                className="w-full bg-[#FF9500] text-white py-3 rounded-full hover:bg-[#FF9200]"
                disabled={loading}
              >
                {loading ? "Signing Up..." : "Create account"}
              </button>
            </form>
          ) : (
            <>
              {!confirmation ? (
                <form onSubmit={handlePhoneSubmit} className="space-y-4">
                  <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <div id="recaptcha-container"></div>
                  <button
                    type="submit"
                    className="w-full bg-[#FF9500] text-white py-3 rounded-full hover:bg-[#FF9100]"
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
                    className="w-full px-4 py-3 rounded-xl border border-gray-300"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </form>
              )}
            </>
          )}

          {/* Social login icons */}
          <div className="text-center mt-6 text-gray-600">or sign up with</div>
          <div className="flex justify-center mt-3 space-x-4">
            <button className="bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
            <FcGoogle className="w-6 h-6" />

            </button>
            <button className="bg-white p-3 rounded-full shadow-md hover:scale-105 transition">
              <FaFacebookF className="w-6 h-6 text-blue-900" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Signup;
