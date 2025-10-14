"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import Image from "next/image";
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
  FaShieldAlt,
  FaCheckCircle,
  FaTimes,
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
  const [usernameError, setUsernameError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/allservices");
    }
  }, [isAuthenticated, router]);

  // Validate username
  // Validate username - must contain letters, numbers, AND underscore
  const validateUsername = (value) => {
    if (!value) {
      setUsernameError("");
      return true;
    }

    // First check: only letters, numbers, and underscores allowed
    const allowedCharsRegex = /^[a-zA-Z0-9_]+$/;
    if (!allowedCharsRegex.test(value)) {
      setUsernameError(
        "Username can only contain letters, numbers, and underscores (_)"
      );
      return false;
    }

    // Second check: must have at least one letter
    if (!/[a-zA-Z]/.test(value)) {
      setUsernameError("Username must contain at least one letter");
      return false;
    }

    // Third check: must have at least one number
    if (!/[0-9]/.test(value)) {
      setUsernameError("Username must contain at least one number");
      return false;
    }

    // Fourth check: must have at least one underscore
    if (!/_/.test(value)) {
      setUsernameError("Username must contain at least one underscore (_)");
      return false;
    }

    setUsernameError("");
    return true;
  };

  // Calculate password strength
  const calculatePasswordStrength = (pass) => {
    if (!pass) {
      setPasswordStrength("");
      return;
    }

    let strength = 0;
    if (pass.length >= 8) strength++;
    if (pass.length >= 12) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^a-zA-Z0-9]/.test(pass)) strength++;

    if (strength <= 2) setPasswordStrength("weak");
    else if (strength <= 4) setPasswordStrength("good");
    else setPasswordStrength("strong");
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUserName(value);
    validateUsername(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    calculatePasswordStrength(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    // Validate username before submission
    if (!validateUsername(userName)) {
      setErrorMessage("Please fix the username error before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post(`${BASE_URL}/api/signup`, {
        userName,
        firstName,
        lastName,
        email,
        password,
      });

      if (response.status === 200) {
        const tempData = encodeURIComponent(
          JSON.stringify({
            userName,
            firstName,
            lastName,
            email,
            password,
          })
        );

        router.push(
          `/verifyemail?email=${encodeURIComponent(email)}&tempData=${tempData}`
        );
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

  const getPasswordStrengthColor = () => {
    if (passwordStrength === "weak") return "text-red-600";
    if (passwordStrength === "good") return "text-yellow-600";
    if (passwordStrength === "strong") return "text-green-600";
    return "";
  };

  const getPasswordStrengthBg = () => {
    if (passwordStrength === "weak") return "bg-red-500";
    if (passwordStrength === "good") return "bg-yellow-500";
    if (passwordStrength === "strong") return "bg-green-500";
    return "bg-gray-300";
  };

  const getPasswordStrengthWidth = () => {
    if (passwordStrength === "weak") return "w-1/3";
    if (passwordStrength === "good") return "w-2/3";
    if (passwordStrength === "strong") return "w-full";
    return "w-0";
  };

  return (
    <>
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
                  Begin Your Swapping Adventure
                </h2>
                <p className="text-green-50 text-lg mb-12 leading-relaxed">
                  Join thousands of learners and share your expertise with our
                  vibrant community.
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
                Create your account to get started
              </p>
            </div>

            {/* RIGHT PANE - Sign Up Form */}
            <div className="bg-white rounded-3xl lg:rounded-l-none lg:rounded-r-3xl p-8 lg:p-12 shadow-2xl flex flex-col justify-center">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 mb-4">
                  <FaRocket className="text-green-600 w-3 h-3" />
                  Get Started
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create your account
                </h2>
                <p className="text-gray-600">
                  Join the community and start exchanging skills
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUserTag className="text-emerald-500" />
                    </div>
                    <input
                      type="text"
                      value={userName}
                      onChange={handleUsernameChange}
                      required
                      placeholder="must have letters, numbers & _"
                      className={`w-full pl-12 pr-4 py-3.5 rounded-xl border-2 ${
                        usernameError ? "border-red-400" : "border-gray-200"
                      } focus:border-green-400 focus:outline-none transition-all duration-300 bg-white placeholder-gray-400 hover:border-gray-300`}
                    />
                    {userName && !usernameError && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <FaCheckCircle className="text-green-500" />
                      </div>
                    )}
                    {usernameError && (
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                        <FaTimes className="text-red-500" />
                      </div>
                    )}
                  </div>
                  {usernameError && (
                    <p className="text-red-500 text-xs mt-2 font-medium">
                      {usernameError}
                    </p>
                  )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
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
                        placeholder="First name"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white placeholder-gray-400 hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-sm">
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
                        placeholder="Last name"
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:outline-none transition-all duration-300 bg-white placeholder-gray-400 hover:border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">
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
                      placeholder="Enter your email"
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
                      onChange={handlePasswordChange}
                      required
                      placeholder="Create a strong password"
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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600 font-medium">
                          Password Strength:
                        </span>
                        <span
                          className={`text-xs font-bold uppercase ${getPasswordStrengthColor()}`}
                        >
                          {passwordStrength}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getPasswordStrengthBg()} ${getPasswordStrengthWidth()} transition-all duration-300`}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {errorMessage && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 p-4 rounded-xl shadow-lg">
                    <p className="text-red-700 font-medium text-center text-sm">
                      {errorMessage}
                    </p>
                  </div>
                )}

                {/* Sign Up Button */}
                <button
                  type="submit"
                  disabled={isLoading || usernameError}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 transform ${
                    isLoading || usernameError
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-green-300/50 hover:scale-[1.02] active:scale-95"
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
                      Create Account
                    </div>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-green-600 hover:text-green-700 font-bold hover:underline transition-all duration-300"
                  >
                    Sign In
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
                  Join 15K+ users
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/50 relative overflow-hidden">
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
