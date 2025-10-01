"use client";
import {
  FaUserCircle,
  FaCamera,
  FaPlus,
  FaTimes,
  FaRobot,
  FaMagic,
  FaStar,
  FaUsers,
  FaMapMarkerAlt,
  FaPhone,
  FaEdit,
  FaSpinner,
  FaHeart,
  FaArrowRight,
  FaLightbulb,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRef } from "react";
import api from "../../utils/api"; // Adjust the path if necessary
api.defaults.withCredentials = true;
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import ErrorPopup from "../../components/errorPopup";
import SuccessPopup from "../../components/successPopup";
import throttle from "lodash/throttle";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnmhfubvn/image/upload";
const UPLOAD_PRESET = "displaypicture";

export default function ProfileForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: "",
  });
  const [suggestion, setSuggestion] = useState("");
  const debounceTimeout = useRef(null);
  const maxWords = 100;
  const [bioWordCount, setBioWordCount] = useState(0);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    // Wait for AuthContext to resolve
    if (user === undefined) return; // still loading
    if (!user) {
      router.push("/signup");
    } else {
      setCheckingAuth(false);
    }
  }, [user, router]);

  if (checkingAuth) {
    // Show SkillSwap activity indicator
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-green-600 text-4xl" />
          <p className="text-gray-600 font-semibold">Sign up to continue...</p>
        </div>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    city: "",
    country: "Pakistan",
    contactNumber: "",
    bio: "",
    skills: [""],
    profileImage: "",
  });

  const generateBioFromPrompt = async () => {
    if (!aiPrompt.trim()) {
      showError("Please enter a prompt for AI bio generation.");
      return;
    }

    try {
      setLoadingAI(true);
      const res = await api.post(`${BASE_URL}/api/suggest-bio`, {
        prompt: aiPrompt,
      });

      if (res.data.suggestion) {
        setFormData((prev) => ({
          ...prev,
          bio: res.data.suggestion,
        }));
        setBioWordCount(countWords(res.data.suggestion));
        setSuggestion(""); // Clear suggestions if new bio comes from AI
        setShowAIPrompt(false); // Hide AI prompt after generation
        setAIPrompt(""); // Clear the prompt
      } else {
        showError("No bio generated. Try a different prompt.");
      }
    } catch (err) {
      showError("Failed to generate bio from AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleBioChange = (e) => {
    const inputText = e.target.value;
    const wordCount = countWords(inputText);

    if (wordCount <= maxWords) {
      setFormData((prev) => ({ ...prev, bio: inputText }));
      setBioWordCount(wordCount);

      if (wordCount >= 5) {
        throttledFetchSuggestion(inputText);
      } else {
        setSuggestion(""); // Clear any existing suggestion if below threshold
      }
    }
  };

  const throttledFetchSuggestion = useRef(
    throttle(async (text) => {
      if (!text.trim()) {
        setSuggestion("");
        return;
      }
      try {
        const res = await api.post(`${BASE_URL}/api/suggest-bio`, {
          text,
        });
        setSuggestion(res.data.suggestion || "");
      } catch (error) {
        setSuggestion("");
      }
    }, 2000) // throttle limit: 2 seconds
  ).current;

  const acceptSuggestion = () => {
    const currentBio = formData.bio;
    if (suggestion.startsWith(currentBio)) {
      const acceptedPart = suggestion.slice(currentBio.length);
      setFormData((prev) => ({ ...prev, bio: currentBio + acceptedPart }));
      setSuggestion(""); // clear after accept
    }
  };

  const showError = (msg) => {
    setErrorPopup({ show: true, message: msg });
  };

  const closeError = () => {
    setErrorPopup({ show: false, message: "" });
  };

  const closeSuccess = () => {
    setSuccessPopup({ show: false, message: "" });
    router.push("/allservices"); // Navigate after success popup closes
  };

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          username: parsedUser.userName || "",
        }));
      }
    }
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = async () => {
    if (!image) return showError("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploadingImage(true);
      const response = await api.post(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      setImageUrl(uploadedImageUrl);
      setFormData((prev) => ({ ...prev, profileImage: uploadedImageUrl }));
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const addSkill = () => {
    setFormData({ ...formData, skills: [...formData.skills, ""] });
  };

  const removeSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSubmit = async () => {
    const filteredSkills = formData.skills.filter(
      (skill) => skill.trim() !== ""
    );
    const rawContact = formData.contactNumber.trim();

    const fullContact = `+92${rawContact}`;
    const updatedData = {
      ...formData,
      skills: filteredSkills,
      country: "Pakistan",
      contactNumber: fullContact,
    };

    if (
      !updatedData.name ||
      !updatedData.city ||
      !updatedData.country ||
      !updatedData.contactNumber ||
      !updatedData.bio ||
      filteredSkills.length === 0
    ) {
      showError(
        "All fields are required, and at least one skill must be provided"
      );
      return;
    }

    if (!/^\+923\d{9}$/.test(fullContact)) {
      showError("Contact number must be in format +92XXXXXXXXXX");
      return;
    }
    if (countWords(formData.bio) > maxWords) {
      showError(`Bio must not exceed ${maxWords} words`);
      return;
    }

    try {
      setSubmitting(true);
      const response = await api.post(
        `${BASE_URL}/api/submit-profile`,
        updatedData
      );
      setSuccessPopup({ show: true, message: response.data.message });
    } catch (error) {
      showError(error.response?.data?.message || "Error submitting profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4 relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 mb-6">
            <FaHeart className="text-green-600 w-4 h-4" />
            Complete Your Profile
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Tell Us About{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Yourself
            </span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Create a compelling profile to attract the perfect skill-swapping
            partners and showcase your expertise.
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
          {/* Profile Picture Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-10 border-b border-green-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl group-hover:scale-105 transition-transform duration-300">
                      <FaUserCircle className="text-white text-4xl" />
                    </div>
                  )}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
                    <FaCamera className="text-white text-sm" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Profile Picture
                  </h3>
                  <p className="text-gray-600">
                    Upload a clear photo of yourself to help others recognize
                    you
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 cursor-pointer text-center shadow-lg hover:scale-105">
                  <FaPlus className="inline mr-2" />
                  Choose File
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>

                <button
                  type="button"
                  disabled={!image || uploadingImage}
                  onClick={uploadImage}
                  className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    image && !uploadingImage
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {uploadingImage ? (
                    <>
                      <FaSpinner className="animate-spin inline mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <FaCamera className="inline mr-2" />
                      Upload Picture
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 md:p-10">
            {/* Username Field (Read-only) */}
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-600 font-semibold cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            {/* Personal Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <FaEdit className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                    onChange={handleChange}
                    value={formData.name}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  City
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500" />
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter your city"
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                    onChange={handleChange}
                    value={formData.city}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Country
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="country"
                    value="Pakistan"
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-600 font-semibold cursor-not-allowed"
                    readOnly
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                  Contact Number
                </label>
                <div className="flex">
                  <div className="flex items-center px-4 py-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-2xl">
                    <FaPhone className="text-gray-400 mr-2" />
                    <span className="font-semibold text-gray-600">+92</span>
                  </div>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="3001234567"
                    maxLength={10}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-r-2xl focus:border-green-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, contactNumber: digitsOnly });
                    }}
                    value={formData.contactNumber}
                  />
                </div>
              </div>
            </div>

            {/* Bio Section with AI */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Bio
                </label>
                <button
                  type="button"
                  onClick={() => setShowAIPrompt(!showAIPrompt)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full hover:bg-blue-100 transition-all duration-300"
                >
                  <FaRobot className="animate-pulse" />
                  Ask AI
                </button>
              </div>

              {/* AI Prompt Section */}
              {showAIPrompt && (
                <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMagic className="text-purple-500 animate-pulse" />
                    <h3 className="font-bold text-purple-700">
                      AI Bio Generator
                    </h3>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Describe yourself or the tone you want... (e.g., 'professional web developer who loves teaching')"
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    />
                    <button
                      onClick={generateBioFromPrompt}
                      disabled={loadingAI || !aiPrompt.trim()}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:scale-105 disabled:transform-none"
                    >
                      {loadingAI ? (
                        <>
                          <FaSpinner className="animate-spin inline mr-2" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FaLightbulb className="inline mr-2" />
                          Generate Bio
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Bio Textarea */}
              <div className="relative">
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself, your experience, and what makes you unique..."
                  className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 hover:border-gray-300 bg-transparent relative z-10 resize-none"
                  onChange={handleBioChange}
                  onKeyDown={(e) => {
                    if (e.key === "Tab" && suggestion) {
                      e.preventDefault();
                      acceptSuggestion();
                    }
                  }}
                  value={formData.bio}
                  rows={6}
                  style={{ background: "transparent" }}
                />

                {/* Ghost suggestion text */}
                {suggestion && (
                  <div
                    className="pointer-events-none absolute top-4 left-4 text-gray-400 whitespace-pre-wrap"
                    style={{
                      fontFamily: "inherit",
                      fontSize: "1rem",
                      lineHeight: "1.5rem",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "break-word",
                      zIndex: 0,
                    }}
                  >
                    {formData.bio + suggestion.slice(formData.bio.length)}
                  </div>
                )}

                {/* Word count and suggestion hint */}
                <div className="flex justify-between items-center mt-2">
                  <p
                    className={`text-sm font-medium ${
                      bioWordCount > maxWords ? "text-red-500" : "text-gray-500"
                    }`}
                  >
                    {bioWordCount}/{maxWords} words
                  </p>
                  {suggestion && (
                    <p className="text-sm text-blue-600 font-medium">
                      Press Tab to accept AI suggestion
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <FaStar className="text-yellow-500" />
                <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Your Skills
                </label>
              </div>
              <p className="text-gray-600 mb-6">
                Add the skills you can offer through skill swapping
              </p>

              <div className="space-y-4">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={skill}
                        placeholder={`Skill ${
                          index + 1
                        } (e.g., Web Development, Graphic Design)`}
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                        onChange={(e) =>
                          handleSkillChange(index, e.target.value)
                        }
                      />
                    </div>
                    {formData.skills.length > 1 && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="w-12 h-12 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 shadow-lg hover:scale-105 flex items-center justify-center"
                        title="Remove skill"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addSkill}
                className="mt-4 flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold bg-green-50 hover:bg-green-100 px-4 py-3 rounded-2xl transition-all duration-300"
              >
                <FaPlus />
                Add Another Skill
              </button>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-2xl hover:shadow-green-300/50 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin text-xl" />
                    Creating Profile...
                  </>
                ) : (
                  <>
                    Complete Profile
                    <FaArrowRight className="text-xl" />
                  </>
                )}
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-200">
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
                Join 15K+ verified skill swappers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error and Success Popups */}
      {errorPopup.show && (
        <ErrorPopup message={errorPopup.message} onClose={closeError} />
      )}

      {successPopup.show && (
        <SuccessPopup message={successPopup.message} onClose={closeSuccess} />
      )}
    </div>
  );
}
