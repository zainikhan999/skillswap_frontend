"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCamera,
  FaSave,
  FaTimes,
  FaTrash,
  FaPlus,
  FaEdit,
} from "react-icons/fa";
import api from "../../utils/api";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function UpdateProfile({
  isOpen,
  onClose,
  currentProfile,
  onUpdateSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "Pakistan",
    contactNumber: "",
    bio: "",
    skills: [],
    profileImage: "",
  });
  const [newSkill, setNewSkill] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentProfile && isOpen) {
      setFormData({
        name: currentProfile.name || "",
        city: currentProfile.city || "",
        country: currentProfile.country || "Pakistan",
        contactNumber: currentProfile.contactNumber || "",
        bio: currentProfile.bio || "",
        skills: currentProfile.skills || [],
        profileImage: currentProfile.profileImage || "",
      });
      setImagePreview(currentProfile.profileImage || "");
      setError("");
    }
  }, [currentProfile, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Input validation
    if (name === "name" && value.length > 100) return;
    if (name === "city" && value.length > 50) return;
    if (name === "bio" && value.length > 1000) return;
    if (name === "contactNumber" && value.length > 20) return;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Compress and resize image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Set maximum dimensions
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;

        let { width, height } = img;

        // Calculate new dimensions
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }
        }

        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to base64 with compression (0.7 = 70% quality)
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);

        setImagePreview(compressedDataUrl);
        setFormData((prev) => ({
          ...prev,
          profileImage: compressedDataUrl,
        }));
        setError("");

        // Clean up
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        setError("Error processing image file");
        URL.revokeObjectURL(img.src);
      };

      // Create object URL and load image
      img.src = URL.createObjectURL(file);
    }
  };

  const removeProfileImage = () => {
    setImagePreview("");
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
    }));
  };

  const addSkill = () => {
    if (formData.skills.length >= 20) {
      setError("Maximum 20 skills allowed");
      return;
    }

    if (
      newSkill.trim() &&
      newSkill.length <= 50 &&
      !formData.skills.includes(newSkill.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
      setError("");
    } else if (newSkill.length > 50) {
      setError("Skill name must be 50 characters or less");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const validateForm = () => {
    if (
      !formData.name ||
      !formData.city ||
      !formData.contactNumber ||
      !formData.bio
    ) {
      setError("Please fill in all required fields");
      return false;
    }

    if (formData.name.length > 100) {
      setError("Name must be 100 characters or less");
      return false;
    }

    if (formData.city.length > 50) {
      setError("City must be 50 characters or less");
      return false;
    }

    if (formData.bio.length > 1000) {
      setError("Bio must be 1000 characters or less");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Using api instead of direct fetch
      const response = await api.put(
        `${BASE_URL}/api/update-profile`,
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        onUpdateSuccess(response.data.profile);
        onClose();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProfile = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setLoading(true);
    try {
      // Using api instead of direct fetch
      const response = await api.delete(`${BASE_URL}/api/delete-profile`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        onUpdateSuccess(null); // Profile deleted
        onClose();
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete profile. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleClose = () => {
    setDeleteConfirm(false);
    setNewSkill("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaEdit className="text-white text-xl" />
                Update Profile
              </h2>
              <p className="text-white/80">Modify your profile information</p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              disabled={loading}
            >
              <span className="text-white text-lg">×</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <div className="p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Profile Image Section */}
            <div className="text-center">
              <div className="relative inline-block">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-200 shadow-lg"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-green-200 shadow-lg">
                    <FaUserCircle className="w-20 h-20 text-gray-400" />
                  </div>
                )}

                {/* Camera Icon for Upload */}
                <label
                  htmlFor="profileImage"
                  className="absolute bottom-2 right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors shadow-lg"
                >
                  <FaCamera className="text-white text-sm" />
                  <input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={loading}
                  />
                </label>
              </div>

              {/* Remove Image Button Below */}
              {imagePreview && (
                <button
                  onClick={removeProfileImage}
                  disabled={loading}
                  className="mt-3 px-4 py-2 bg-red-500 text-white text-sm rounded-lg shadow hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <FaTrash className="inline mr-2" />
                  Remove Profile Image
                </button>
              )}

              <p className="text-gray-500 text-sm mt-2">
                Click the camera icon to upload a new image (Max 5MB)
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Full Name * ({formData.name.length}/100)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                  disabled={loading}
                  maxLength={100}
                />
              </div>

              {/* Username (Read-only) */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={currentProfile?.username || ""}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                  disabled
                />
                <p className="text-xs text-gray-500 mt-1">
                  Username cannot be changed for security
                </p>
              </div>

              {/* City */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  City * ({formData.city.length}/50)
                </label>
                <div className="relative">
                  <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                    maxLength={50}
                  />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Country *
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  disabled={loading}
                >
                  <option value="Pakistan">Pakistan</option>
                  <option value="India">India</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Contact Number */}
              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">
                  Contact Number *
                </label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                    disabled={loading}
                    maxLength={20}
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Bio * ({formData.bio.length}/1000)
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell us about yourself and your expertise..."
                required
                disabled={loading}
                maxLength={1000}
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Skills & Expertise ({formData.skills.length}/20)
              </label>

              {/* Add New Skill */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  maxLength={50}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  disabled={loading || formData.skills.length >= 20}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>

              {/* Skills List */}
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      disabled={loading}
                      className="text-green-600 hover:text-red-500 ml-1 disabled:opacity-50"
                    >
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="text-sm" />
                {loading ? "Updating..." : "Update Profile"}
              </button>

              <button
                onClick={handleClose}
                disabled={loading}
                className="flex-1 sm:flex-initial px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProfile}
                disabled={loading}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  deleteConfirm
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "border border-red-300 text-red-600 hover:bg-red-50"
                }`}
              >
                <FaTrash className="inline mr-2 text-sm" />
                {loading
                  ? "Deleting..."
                  : deleteConfirm
                  ? "Confirm Delete"
                  : "Delete Profile"}
              </button>
            </div>

            {deleteConfirm && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">
                  <strong>Warning:</strong> This will permanently delete your
                  profile and all associated data including your profile image
                  from Cloudinary. This action cannot be undone.
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    disabled={loading}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-sm hover:bg-gray-400 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
