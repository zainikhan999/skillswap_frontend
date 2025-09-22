"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api.js";
api.defaults.withCredentials = true;
import SuccessPopup from "../../components/successPopup";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import {
  FaExchangeAlt,
  FaLightbulb,
  FaFileAlt,
  FaHandshake,
  FaArrowLeft,
  FaUpload,
  FaSpinner,
} from "react-icons/fa";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function GigUpload() {
  const router = useRouter();
  const [localStr, setLocalStr] = useState(null);
  const [formData, setFormData] = useState({
    skillName: "",
    skillDescription: "",
    exchangeService: "",
    username: "",
    category: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, loading } = useAuth();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setLocalStr(parsed);
      setFormData((prev) => ({
        ...prev,
        username: parsed.userName,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data } = await api.post(`${BASE_URL}api/classify`, {
        text: formData.skillDescription,
      });

      const gigData = {
        ...formData,
        category: data.category,
      };

      await api.post(`${BASE_URL}/api/upload-service`, gigData);

      setShowSuccess(true);
      setFormData({
        skillName: "",
        skillDescription: "",
        exchangeService: "",
        username: localStr?.userName || "",
        category: "",
      });
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload service.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaExchangeAlt className="text-white text-2xl" />
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!localStr) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">
            Please log in to continue.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/allservices"
              className="flex items-center gap-2 text-green-100 hover:text-white transition-colors"
            >
              <FaArrowLeft />
              Back to My Services
            </Link>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUpload className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Share Your <span className="text-green-200">Skills</span>
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Create a new service offering and connect with others who need
              your expertise
            </p>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-green-200 rounded-full opacity-10 blur-2xl"></div>
        <div className="absolute bottom-1/3 left-10 w-40 h-40 bg-emerald-200 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-12 relative">
        <div className="max-w-2xl mx-auto">
          {/* Form Container */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Skill Name Field */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <FaLightbulb className="text-green-600" />
                  What skill do you want to share?
                </label>
                <input
                  type="text"
                  name="skillName"
                  value={formData.skillName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Web Development, Guitar Lessons, Photography"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all bg-white/90 placeholder-gray-500 text-gray-900"
                />
              </div>

              {/* Skill Description Field */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <FaFileAlt className="text-green-600" />
                  Describe your expertise
                </label>
                <textarea
                  name="skillDescription"
                  value={formData.skillDescription}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell others about your experience, what you can teach, and what makes you qualified to help..."
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all bg-white/90 placeholder-gray-500 text-gray-900 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be specific about your skills and experience. This helps
                  others understand what you offer.
                </p>
              </div>

              {/* Exchange Service Field */}
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-3">
                  <FaHandshake className="text-green-600" />
                  What are you looking for in return?
                </label>
                <input
                  type="text"
                  name="exchangeService"
                  value={formData.exchangeService}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Cooking lessons, Marketing advice, Language tutoring"
                  className="w-full px-6 py-4 rounded-2xl border-2 border-gray-200 focus:border-green-500 focus:outline-none transition-all bg-white/90 placeholder-gray-500 text-gray-900"
                />
                <p className="text-sm text-gray-500 mt-2">
                  What skills or services would you like to receive in exchange?
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <FaExchangeAlt className="text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-green-800 mb-2">
                      How Skill Swapping Works
                    </h3>
                    <p className="text-green-700 text-sm leading-relaxed">
                      Your service will be automatically categorized and made
                      visible to other users. When someone is interested, they
                      can request a swap and you'll be notified to arrange the
                      exchange.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-2xl font-semibold text-white shadow-lg transition-all transform ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <FaSpinner className="animate-spin" />
                    Creating Service...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <FaUpload />
                    Create Service
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="text-gray-600 text-sm">
              By creating a service, you agree to our{" "}
              <Link href="/terms" className="text-green-600 hover:underline">
                community guidelines
              </Link>{" "}
              and commit to respectful skill exchanges.
            </p>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccess && (
        <SuccessPopup
          message="Service uploaded successfully!"
          onClose={() => setShowSuccess(false)}
        />
      )}
    </div>
  );
}
