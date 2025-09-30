"use client";
import React, { useState } from "react";
import { loginUser } from "../../utils/api"; // Use the new login function
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import {
  FaUser,
  FaLock,
  FaExchangeAlt,
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaHeart,
  FaStar,
  FaRocket,
  FaUsers,
  FaSignInAlt,
} from "react-icons/fa";
import { useEffect } from "react";
export default function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/allservices");
    }
  }, [user, router]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      console.log("Attempting login for:", userName);

      const response = await loginUser({
        userName,
        password,
      });

      const { message, userType } = response.data;
      console.log("Login Response:", response.data);

      const userData = { userName };
      login(userData);

      if (userType === "user") {
        router.push("/allservices");
      }
    } catch (error) {
      console.log("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Better error handling
      if (error.response?.status === 403) {
        if (error.response.data?.code === "CSRF_ERROR") {
          setErrorMessage("Security token expired. Please try again.");
        } else {
          setErrorMessage("Access forbidden. Please check your credentials.");
        }
      } else if (error.response?.status === 401) {
        setErrorMessage("Invalid username or password.");
      } else if (error.response?.status === 429) {
        setErrorMessage("Too many login attempts. Please try again later.");
      } else if (error.response?.data?.message) {
        setErrorMessage(error.response.data.message);
      } else if (
        error.code === "NETWORK_ERROR" ||
        error.message.includes("Network Error")
      ) {
        setErrorMessage(
          "Network error. Please check your connection and try again."
        );
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements remain the same */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

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
            Welcome Back
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Ready to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Continue?
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Sign in to access your skill swapping dashboard and connect with
            amazing people
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-emerald-500" />
                </div>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                />
              </div>
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
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white/90 placeholder-gray-500 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors duration-300"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Error Message - Enhanced */}
            {errorMessage && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 rounded-2xl shadow-lg">
                <p className="text-red-700 font-medium text-center text-sm">
                  {errorMessage}
                </p>
                {errorMessage.includes("Security token") && (
                  <p className="text-red-600 text-xs text-center mt-2">
                    This usually resolves itself. Please try logging in again.
                  </p>
                )}
              </div>
            )}

            {/* Login Button */}
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
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <FaSignInAlt />
                  Sign In to SkillSwap
                </div>
              )}
            </button>
          </form>

          {/* Rest of your component remains the same */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 text-lg">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/forgot-password"
              className="text-gray-500 hover:text-green-600 transition-colors duration-300 font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Trust indicators and other UI elements remain the same */}
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
              Trusted by 15K+ users
            </span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-10 px-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <FaUsers className="text-emerald-600 text-lg" />
            </div>
            <p className="text-xs font-semibold text-gray-700">Connect</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <FaExchangeAlt className="text-blue-600 text-lg" />
            </div>
            <p className="text-xs font-semibold text-gray-700">Exchange</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <FaRocket className="text-purple-600 text-lg" />
            </div>
            <p className="text-xs font-semibold text-gray-700">Grow</p>
          </div>
        </div>
      </div>
    </div>
  );
}
