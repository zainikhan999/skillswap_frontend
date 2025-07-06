"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Import useRouter
import { useAuth } from "../../contexts/AuthContext"; // Adjust path if needed
import Link from "next/link";
export default function Login() {
  const [userName, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); // Initialize useRouter
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage(""); // Clear any previous error messages

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        userName,
        password,
      });

      const { message, userType } = response.data;
      console.log("Login Response:", response.data);

      const userData = { userName };
      login(userData); // Pass userData to context

      if (userType === "user") {
        router.push("/allservices");
      }
    } catch (error) {
      console.log("Error response:", error.response?.data);

      const data = error.response?.data;

      if (data && typeof data === "object" && "message" in data) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage("Login Failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-background">
      <div className="max-w-md w-full p-8  border border-gray-300 border-iconsAndBorders rounded-lg shadow-lg bg-white">
        <h1 className="text-3xl font-bold text-headings text-center mb-8">
          Welcome Back!
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-black mb-2">Username:</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryButton"
            />
          </div>
          <div>
            <label className="block text-black mb-2">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-primaryButton"
            />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="w-full p-3 bg-black text-white font-semibold rounded-lg hover:border-x-gray-950 transition-colors"
          >
            Log In
          </button>
        </form>
        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <p className="text-center">
            Don't have an account?{" "}
            <Link href="/signup">
              <span className="text-blue-500 cursor-pointer">Signup</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
