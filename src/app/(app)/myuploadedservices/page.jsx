"use client";
import { useEffect, useState, useRef } from "react";
import api from "../../utils/api"; // Adjust the path if necessary"
api.defaults.withCredentials = true;
import { useAuth } from "../../contexts/AuthContext"; // Adjust the import path as necessary
import {
  FaUserCircle,
  FaExchangeAlt,
  FaStar,
  FaTrash,
  FaCheck,
  FaPlus,
  FaEdit,
} from "react-icons/fa"; // Importing icons
import SuccessPopup from "../../components/successPopup"; // Adjust the import path as necessary
import Link from "next/link";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const MyGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [swapCounts, setSwapCounts] = useState({});
  const [loading, setLoading] = useState(true);

  const { user, loading: authLoading } = useAuth();
  const isRedirecting = useRef(false);
  const router = useRouter();
  useEffect(() => {
    if (authLoading || isRedirecting.current) return;

    if (!user) {
      isRedirecting.current = true;
      router.replace("/login");
      return;
    }
    if (!user.emailVerified) {
      isRedirecting.current = true;
      router.replace("/signup");
      return;
    }
    if (!user.profileCompleted) {
      isRedirecting.current = true;
      router.replace("/profile");
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchUserGigsAndProfile = async () => {
      if (!user || !user.userName) {
        console.warn("User is not available yet.");
        return;
      }

      try {
        setCurrentUser(user.userName);

        const { data: gigData } = await api.get(
          `${BASE_URL}/api/get-my-gigs/${user.userName}`
        );
        setGigs(gigData);

        const { data: profileData } = await api.get(
          `${BASE_URL}/api/get-latest-profile`
        );
        setProfiles((prevProfiles) => ({
          ...prevProfiles,
          [user.userName]: profileData,
        }));

        const { data: swapData } = await api.get(`${BASE_URL}/api/swaps`);
        setSwapCounts((prev) => ({
          ...prev,
          [user.userName]: swapData.swapCount || 0,
        }));
      } catch (err) {
        console.error("Error fetching user gigs or profile:", err);
        setSwapCounts((prev) => ({
          ...prev,
          [user.userName]: 0,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserGigsAndProfile();
  }, [user]); // only depend on `user`, not `user.userName`

  const handleDelete = async (gigId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`${BASE_URL}/api/delete-gig/${gigId}`);
      const updatedGigs = gigs.filter((gig) => gig._id !== gigId);
      setGigs(updatedGigs);
      setShowSuccess(true); // Show success modal
    } catch (err) {
      console.error("Error deleting gig:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaExchangeAlt className="text-white text-2xl" />
          </div>
          <p className="text-gray-600 font-medium">Loading your services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              My <span className="text-green-200">Services</span>
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Manage and track your skill offerings
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex justify-center md:justify-start items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {gigs.length}
                </div>
                <div className="text-sm text-gray-600">Active Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {swapCounts[currentUser] || 0}
                </div>
                <div className="text-sm text-gray-600">Total Swaps</div>
              </div>
            </div>

            {/* Add New Service Button */}
            <Link
              href="/services"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 w-fit mx-auto md:mx-0"
            >
              <FaPlus className="text-sm" />
              Add New Service
            </Link>
          </div>
        </div>

        {/* Services Grid */}
        {gigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {gigs.map((gig) => (
              <div
                key={gig._id}
                className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200"
              >
                {/* User Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    {profiles[currentUser]?.profileImage ? (
                      <img
                        src={profiles[currentUser]?.profileImage}
                        alt="Profile"
                        className="w-14 h-14 rounded-full object-cover border-3 border-green-100"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                        <FaUserCircle className="text-white text-xl" />
                      </div>
                    )}

                    {/* Success Badge */}
                    {swapCounts[currentUser] > 0 && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                        <FaCheck className="text-white text-xs" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {profiles[currentUser]?.name || currentUser}
                    </h4>
                    <p className="text-green-600 text-sm font-medium">
                      @{currentUser}
                    </p>
                  </div>

                  {/* Rating/Swaps */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <FaStar className="text-xs" />
                      <span className="text-sm font-medium">
                        {swapCounts[currentUser] || 0}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">swaps</div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                    {gig.skillName}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {gig.skillDescription}
                  </p>

                  {/* Exchange Details */}
                  <div className="bg-green-50 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FaExchangeAlt className="text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Looking for:
                      </span>
                    </div>
                    <span className="text-green-700 font-medium text-sm">
                      {gig.exchangeService}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
                    <FaEdit className="text-sm" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(gig._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FaTrash className="text-sm" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExchangeAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Services Yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven&apos;t created any services yet. Start by adding your
              first skill to share with the community!
            </p>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FaPlus className="text-sm" />
              Add Your First Service
            </Link>
          </div>
        )}

        {/* Success Popup */}
        {showSuccess && (
          <SuccessPopup
            message="Service removed successfully!"
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MyGigsPage;
