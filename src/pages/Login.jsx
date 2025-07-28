import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (error) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-8 py-44 gap-10 bg-gray-50 min-h-screen">
      {/* Left Side: Title and Image */}
      <div className="md:w-1/2">
        <h2 className="text-2xl md:text-3xl font-semibold mb-2">
          Students Testimonials
        </h2>
        <p className="text-gray-600 mb-6">
          Lorem ipsum dolor sit amet consectetur. Tempus tincidunt etiam eget
          elit id imperdiet et. Cras eu sit dignissim lorem nibh et. Ac cum eget
          habitasse in velit fringilla feugiat senectus in.
        </p>

        {/* 👉 Image instead of testimonial */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <img
            src="src/assets/bg.jpg"
            alt="Student testimonial"
            className="w-full h-60 object-cover"
          />
        </div>

        {/* Arrows below image */}
        <div className="flex gap-2 mt-4">
          <button className="bg-white border rounded p-2 hover:bg-gray-100">
            ←
          </button>
          <button className="bg-white border rounded p-2 hover:bg-gray-100">
            →
          </button>
        </div>
      </div>

      {/* Right Side: Login Box */}
      <div className="w-full md:w-[400px] bg-white shadow-md rounded-xl p-8 ">
        <h2 className="text-2xl font-semibold mb-2">Login</h2>
        <p className="text-gray-500 mb-6">
          Welcome back! Please log in to access your account.
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your Email"
            className="mt-1 w-full border rounded px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your Password"
            className="mt-1 w-full border rounded px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
          />
          <div className="text-right text-sm text-blue-600 mt-1 cursor-pointer">
            Forgot Password?
          </div>
        </div>
        <div className="flex items-center mb-4">
          <input type="checkbox" className="mr-2" />
          <span className="text-sm text-gray-600">Remember Me</span>
        </div>
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded mb-4">
          Login
        </button>
        <div className="flex items-center justify-center text-sm text-gray-500 mb-4">
          OR
        </div>
        <button className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-100">
          <img
            src="https://img.icons8.com/color/16/000000/google-logo.png"
            alt="Google logo"
            className="mr-2"
          />
          Login with Google
        </button>
        <p className="text-center text-sm mt-4 text-gray-600">
          Don't have an account?{" "}
          <span className="text-blue-600 cursor-pointer">Sign Up ↗</span>
        </p>
      </div>
    </div>
  );
}

export default Login;
