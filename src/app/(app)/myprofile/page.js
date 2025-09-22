"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api";
api.defaults.withCredentials = true;
import {
  FaUserCircle,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaExchangeAlt,
  FaStar,
  FaCheck,
  FaEdit,
} from "react-icons/fa";
import UpdateProfile from "../updateProfile/page";
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export default function ProfileWithSidebar() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    city: "",
    country: "Pakistan",
    contactNumber: "",
    bio: "",
    skills: [],
    profileImage: "",
  });
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSwaps, setTotalSwaps] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [profileDeleted, setProfileDeleted] = useState(false);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) return;

      const { userName } = JSON.parse(storedUser);

      try {
        const [profileRes, gigsRes, swapCountRes] = await Promise.all([
          api.get(`${BASE_URL}/api/get-latest-profile`, {
            withCredentials: true,
          }),
          api.get(`${BASE_URL}/api/get-my-gigs/${userName}`, {
            withCredentials: true,
          }),
          api.get(`${BASE_URL}/api/get-swap-count/${userName}`, {
            withCredentials: true,
          }),
        ]);

        setFormData(profileRes.data);
        setGigs(gigsRes.data);
        setTotalSwaps(swapCountRes.data.swapCount);
        setLoading(false);
        setProfileDeleted(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 404) setProfileDeleted(true);
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [BASE_URL]); // You can even safely leave it as [] if BASE_URL never changes

  const handleUpdateSuccess = (updatedProfile) => {
    if (updatedProfile === null) {
      // Profile was deleted
      setProfileDeleted(true);
      setFormData({
        name: "",
        username: "",
        city: "",
        country: "Pakistan",
        contactNumber: "",
        bio: "",
        skills: [],
        profileImage: "",
      });
      setGigs([]);
      setTotalSwaps(0);
    } else {
      // Profile was updated
      setFormData(updatedProfile);
      setProfileDeleted(false);
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaUserCircle className="text-white text-2xl" />
          </div>
          <p className="text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (profileDeleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUserCircle className="text-gray-400 text-4xl" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Profile Deleted
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Your profile has been successfully deleted. You can create a new
            profile anytime.
          </p>
          <button
            onClick={() => (window.location.href = "/profile/create")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            Create New Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl mx-auto min-h-[calc(100vh-2rem)] flex flex-col md:flex-row overflow-hidden">
        {/* Enhanced Sidebar with Green Theme */}
        <div className="w-full md:w-1/3 flex flex-col">
          {/* Profile Header with Green Gradient */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full blur-2xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-white rounded-full blur-xl"></div>
            </div>

            <div className="relative text-center">
              <div className="relative inline-block mb-4">
                {formData.profileImage ? (
                  <img
                    src={formData.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                    <FaUserCircle className="w-20 h-20 text-white" />
                  </div>
                )}

                {/* Online Status Indicator */}
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 border-3 border-white rounded-full"></div>
              </div>

              <h2 className="text-2xl font-bold mb-1">{formData.name}</h2>
              <p className="text-white/80 text-base mb-4">
                @{formData.username.toLowerCase()}
              </p>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">{totalSwaps}</div>
                  <div className="text-white/80 text-xs">Swaps</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold">
                    {formData.skills.length}
                  </div>
                  <div className="text-white/80 text-xs">Skills</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-gray-800 font-semibold mb-4 text-lg">
              Contact Info
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaMapMarkerAlt className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {formData.city}, {formData.country}
                  </p>
                  <p className="text-sm text-gray-500">Location</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <FaPhoneAlt className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {formData.contactNumber}
                  </p>
                  <p className="text-sm text-gray-500">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="p-6 flex-1 overflow-y-auto">
            <h3 className="text-gray-800 font-semibold mb-4 text-lg flex items-center gap-2">
              <FaStar className="text-green-600" />
              Skills & Expertise
            </h3>
            <div className="space-y-2">
              {formData.skills.map((skill, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <FaCheck className="text-green-600 text-sm flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content with Enhanced Design */}
        <div className="flex-1 flex flex-col">
          {/* Header Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Profile Overview
                </h2>
                <p className="text-gray-600">
                  Manage your profile and services
                </p>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all shadow-lg hover:shadow-xl"
              >
                <FaEdit className="text-sm" />
                Edit Profile
              </button>
            </div>

            {/* About Me Section */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                About Me
              </h3>
              <p className="text-gray-700 leading-relaxed text-justify">
                {formData.bio ||
                  "No bio available yet. Add your bio to tell others about yourself and your expertise!"}
              </p>
            </div>
          </div>

          {/* Services Section */}
          <div className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                My Services
              </h3>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                {gigs.length} Active Services
              </span>
            </div>

            {gigs.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {gigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="group bg-white border-2 border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Service Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <FaExchangeAlt className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-green-600 font-bold text-xl group-hover:text-green-700 transition-colors">
                            {gig.skillName}
                          </h4>
                          <p className="text-gray-500 text-sm">
                            Service Offering
                          </p>
                        </div>
                      </div>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-medium">
                        Active
                      </span>
                    </div>

                    {/* Service Description */}
                    <p className="text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                      {gig.skillDescription}
                    </p>

                    {/* Service Details */}
                    <div className="space-y-3 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 font-medium text-sm">
                          Looking for:
                        </span>
                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
                          {gig.exchangeService}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <FaCheck className="text-green-600" />
                          <span>{totalSwaps} successful swaps</span>
                        </div>
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaExchangeAlt className="text-gray-400 text-3xl" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  No Services Yet
                </h4>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Start offering your skills to the community and connect with
                  other learners!
                </p>
                <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
                  Add Your First Service
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Update Profile Modal */}
      <UpdateProfile
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        currentProfile={formData}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
}
