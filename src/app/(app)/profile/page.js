"use client";
import { FaUserCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import ErrorPopup from "../../components/errorPopup";
import SuccessPopup from "../../components/successPopup"; // <-- Import SuccessPopup
import throttle from "lodash/throttle";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnmhfubvn/image/upload";
const UPLOAD_PRESET = "displaypicture";

export default function ProfileForm() {
  const router = useRouter();

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

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const { user } = useAuth();
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: "",
  }); // <-- Success popup state
  const [suggestion, setSuggestion] = useState("");
  const debounceTimeout = useRef(null);
  const maxWords = 100;
  const [bioWordCount, setBioWordCount] = useState(0);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);

  const generateBioFromPrompt = async () => {
    if (!aiPrompt.trim()) {
      showError("Please enter a prompt for AI bio generation.");
      return;
    }

    try {
      setLoadingAI(true);
      const res = await axios.post(
        "https://backend-skillswap.vercel.app/api/suggest-bio",
        {
          prompt: aiPrompt,
        }
      );

      if (res.data.suggestion) {
        setFormData((prev) => ({
          ...prev,
          bio: res.data.suggestion,
        }));
        setBioWordCount(countWords(res.data.suggestion));
        setSuggestion(""); // Clear suggestions if new bio comes from AI
      } else {
        showError("No bio generated. Try a different prompt.");
      }
    } catch (err) {
      showError("Failed to generate bio from AI.");
    } finally {
      setLoadingAI(false);
    }
  };

  // Debounced fetch suggestion from backend API

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
        const res = await axios.post(
          "https://backend-skillswap.vercel.app/api/suggest-bio",
          {
            text,
          }
        );
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
      const response = await axios.post(CLOUDINARY_URL, formData);
      const uploadedImageUrl = response.data.secure_url;

      setImageUrl(uploadedImageUrl);
      setFormData((prev) => ({ ...prev, profileImage: uploadedImageUrl }));
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Failed to upload image");
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
      const response = await axios.post(
        "https://backend-skillswap.vercel.app/api/submit-profile",
        updatedData
      );
      setSuccessPopup({ show: true, message: response.data.message }); // <-- Success popup on submit
      // router.push("/allservices"); // <-- moved navigation into closeSuccess for UX
    } catch (error) {
      showError(error.response?.data?.message || "Error submitting profile");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 md:p-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          Profile Information
        </h2>
        {/* Profile Picture Upload Section */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="text-gray-400 w-24 h-24" />
            )}
          </div>

          <div className="flex flex-col items-end">
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
              type="button"
              disabled={!image}
              onClick={uploadImage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Upload Picture
            </button>
          </div>
        </div>
        <input
          type="text"
          name="username"
          value={formData.username}
          className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200 mb-7"
          readOnly
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.name}
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            className="w-full p-3 border border-gray-300 rounded-lg"
            onChange={handleChange}
            value={formData.city}
          />
          <input
            type="text"
            name="country"
            value="Pakistan"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-200"
            readOnly
          />
          <div className="flex items-center">
            <span className="px-3 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg select-none">
              +92
            </span>
            <input
              type="text"
              name="contactNumber"
              placeholder="3001234567"
              maxLength={10}
              className="w-full p-3 border border-gray-300 rounded-r-lg"
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, "");
                setFormData({ ...formData, contactNumber: digitsOnly });
              }}
              value={formData.contactNumber}
            />
          </div>
        </div>
        <div className="relative mt-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 font-semibold">Bio</label>
            <button
              type="button"
              onClick={() => setShowAIPrompt(!showAIPrompt)}
              className="text-sm text-blue-600 hover:underline"
            >
              Ask with AI
            </button>
          </div>

          {showAIPrompt && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Describe yourself or the tone you want..."
                value={aiPrompt}
                onChange={(e) => setAIPrompt(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg mb-2"
              />
              <button
                onClick={generateBioFromPrompt}
                className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={loadingAI}
              >
                {loadingAI ? "Generating..." : "Generate Bio"}
              </button>
            </div>
          )}

          <textarea
            name="bio"
            placeholder="Tell us about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg bg-transparent relative z-10"
            onChange={handleBioChange}
            onKeyDown={(e) => {
              if (e.key === "Tab" && suggestion) {
                e.preventDefault();
                acceptSuggestion(); // fill in suggestion
              }
            }}
            value={formData.bio}
            rows={5}
            style={{ background: "transparent" }}
          />

          {/* Ghost suggestion text */}
          {suggestion && (
            <div
              className="pointer-events-none absolute top-[4.7rem] left-[1rem] text-gray-400 whitespace-pre-wrap"
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

          <p
            className={`text-sm mt-1 ${
              bioWordCount > maxWords ? "text-red-500" : "text-gray-500"
            }`}
          >
            {bioWordCount}/{maxWords} words
          </p>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Skills
          </label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                placeholder="Enter a skill"
                className="w-full p-3 border border-gray-300 rounded-lg"
                onChange={(e) => handleSkillChange(index, e.target.value)}
              />
              <button
                onClick={() => removeSkill(index)}
                style={{ backgroundColor: "#f56565", color: "white" }}
                className="px-3 py-1 rounded-full text-sm"
              >
                ✕
              </button>
            </div>
          ))}
          <button onClick={addSkill}>+ Add Skill</button>
        </div>

        <div className="flex justify-items-end gap-6 mt-8">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            Submit ➝
          </button>
        </div>
      </div>

      {errorPopup.show && (
        <ErrorPopup message={errorPopup.message} onClose={closeError} />
      )}

      {successPopup.show && (
        <SuccessPopup message={successPopup.message} onClose={closeSuccess} />
      )}
    </div>
  );
}
