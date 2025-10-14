"use client";
import React, { useState } from "react";
import { loginUser } from "../../utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
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
  FaCheckCircle,
  FaShieldAlt,
} from "react-icons/fa";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

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
  const searchParams = useSearchParams();
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/services");
    }
  }, [user, router]);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const reset = searchParams.get("reset");

    if (verified === "true") {
      setSuccessMessage("Email verified successfully! You can now login.");
    }

    if (reset === "success") {
      setSuccessMessage(
        "Password reset successfully! Please login with your new password."
      );
    }
  }, [searchParams]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await loginUser({
        userName,
        password,
      });

      const {
        message,
        userType,
        _id,
        userName: backendUserName,
        emailVerified,
        profileCompleted,
        firstName,
        lastName,
      } = response.data;

      const userData = {
        userId: _id,
        userName: backendUserName,
        userType: userType || "user",
        emailVerified: emailVerified,
        profileCompleted: profileCompleted,
        firstName: firstName,
        lastName: lastName,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);

      if (!emailVerified) {
        router.push("/signup?verified=false");
      } else if (!profileCompleted) {
        router.push("/fillprofile");
      } else if (userType === "user") {
        router.push("/services");
      }
    } catch (error) {
      console.log("Login error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative w-full max-w-6xl z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-0">
          {/* LEFT PANE - Branding & Info (Hidden on mobile) */}
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-600 to-emerald-700 rounded-l-3xl p-12 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              {/* Logo */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                  <Image
                    src="/skill_swap.png"
                    alt="SkillSwap Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 object-contain"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold">SkillSwap</h1>
                  <p className="text-green-100 text-sm">
                    Exchange Skills, Grow Together
                  </p>
                </div>
              </div>

              {/* Main heading */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Welcome Back to Your Skill Journey
              </h2>
              <p className="text-green-50 text-lg mb-12 leading-relaxed">
                Connect with amazing people, exchange skills, and grow together
                in our vibrant community.
              </p>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaUsers className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      15K+ Active Users
                    </h3>
                    <p className="text-green-100 text-sm">
                      Join our growing community of skill sharers
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaExchangeAlt className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">
                      50K+ Skills Exchanged
                    </h3>
                    <p className="text-green-100 text-sm">
                      Learn anything from coding to cooking
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaShieldAlt className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Safe & Secure</h3>
                    <p className="text-green-100 text-sm">
                      Your data is protected with enterprise-grade security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Logo - Only visible on mobile */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-100">
                <Image
                  src="/skill_swap.png"
                  alt="SkillSwap Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                  priority
                />
              </div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Skill
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Swap
                </span>
              </h1>
            </div>
            <p className="text-gray-600 text-sm">
              Welcome back! Sign in to continue
            </p>
          </div>

          {/* RIGHT PANE - Login Form */}
          <div className="bg-white rounded-3xl lg:rounded-l-none lg:rounded-r-3xl p-8 lg:p-12 shadow-2xl flex flex-col justify-center">
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 mb-4">
                <FaHeart className="text-green-600 w-3 h-3" />
                Welcome Back
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Sign in to your account
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            {successMessage && (
              <div className="bg-green-50 border-2 border-green-200 p-4 rounded-2xl shadow-lg mb-6">
                <p className="text-green-700 font-medium text-center text-sm">
                  {successMessage}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              {/* Username Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
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
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white placeholder-gray-400 hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
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
                    className="w-full pl-12 pr-12 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white placeholder-gray-400 hover:border-gray-300"
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

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 rounded-xl shadow-lg">
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  href="/forgotpassword"
                  className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline transition-colors duration-300"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-green-300/50 hover:scale-[1.02] active:scale-95"
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
                    Sign In
                  </div>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link
                  href="/signup"
                  className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-3 mt-8 pt-6 border-t border-gray-200">
              <div className="flex -space-x-2">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                />
                <img
                  src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
                  alt="User"
                  className="w-8 h-8 rounded-full border-2 border-white shadow-lg"
                />
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 text-xs" />
                ))}
              </div>
              <span className="text-xs text-gray-600 font-medium">
                Trusted by 15K+ users
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
