"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUser,
  FaLock,
  FaExchangeAlt,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaUserTag,
  FaCheck,
  FaSpinner,
  FaHeart,
  FaStar,
  FaRocket,
  FaUsers,
} from "react-icons/fa";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function SignUp() {
  const router = useRouter();
  const { isAuthenticated, login } = useAuth();

  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/profile");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await api.post(`${BASE_URL}/api/signup`, {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 201) {
        const userData = { userName, firstName, lastName, email };
        login(userData);
        setShowPopup(true);

        setTimeout(() => {
          setShowPopup(false);
          router.push("/profile");
        }, 3000);
      }
    } catch (error) {
      const data = error.response?.data;
      if (data && typeof data === "object" && "message" in data) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements - Matching homepage */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Floating Geometric Shapes - Matching homepage */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
          <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
          <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-600 rounded-full animate-bounce delay-1000"></div>
        </div>

        <div className="relative w-full max-w-lg z-10">
          {/* Logo/Brand Section */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 bg-white/20 rounded-3xl animate-pulse"></div>
              <FaExchangeAlt className="text-white text-3xl relative z-10 animate-bounce" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 mb-4">
              <FaHeart className="text-green-600 w-4 h-4" />
              Join the Community
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Journey
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Create your account and join thousands of skill swappers worldwide
            </p>
          </div>

          {/* Sign Up Form */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUserTag className="text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    placeholder="Choose a unique username"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                  />
                </div>
                {errorMessages.userName && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errorMessages.userName}
                  </p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-emerald-500" />
                    </div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="Enter first name"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-emerald-500" />
                    </div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="Enter last name"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-emerald-500" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                  />
                </div>
                {errorMessages.email && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errorMessages.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaLock className="text-emerald-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Create a strong password"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errorMessages.password && (
                  <p className="text-red-500 text-sm mt-2 font-medium">
                    {errorMessages.password}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 rounded-2xl shadow-lg">
                  <p className="text-red-700 font-medium text-center">
                    {errorMessage}
                  </p>
                </div>
              )}

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-2xl transition-all duration-300 transform ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-green-300/50 hover:scale-105 active:scale-95"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-3">
                    <FaSpinner className="animate-spin text-xl" />
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <FaRocket />
                    Create My Account
                  </div>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600 text-lg">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
                >
                  Sign In Here
                </Link>
              </p>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-gray-200">
              <div className="flex -space-x-2">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                  alt="User"
                  className="w-10 h-10 rounded-full border-3 border-white shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                  alt="User"
                  className="w-10 h-10 rounded-full border-3 border-white shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                  alt="User"
                  className="w-10 h-10 rounded-full border-3 border-white shadow-lg"
                />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-sm" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">
                Join 15K+ happy users
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500">
              By creating an account, you agree to our{" "}
              <Link
                href="/terms"
                className="text-green-600 hover:underline font-semibold"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-green-600 hover:underline font-semibold"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/50 relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-16 h-16 bg-green-400 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-12 h-12 bg-emerald-400 rounded-full blur-xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <FaCheck className="text-white text-3xl animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome to SkillSwap!
              </h3>
              <p className="text-gray-600 text-lg mb-4">
                Your account has been created successfully. Redirecting to your
                profile...
              </p>
              <div className="flex items-center justify-center gap-2 text-green-600">
                <FaSpinner className="animate-spin" />
                <span className="font-medium">Setting up your profile...</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
