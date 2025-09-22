"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
api.defaults.withCredentials = true;
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Link from "next/link";
import {
  FaUserCircle,
  FaExchangeAlt,
  FaSearch,
  FaFilter,
  FaStar,
  FaMapMarkerAlt,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import SwapFormModal from "../components/swapformModel";

const AllGigs = () => {
  const router = useRouter();
  const [gigs, setGigs] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [swapCounts, setSwapCounts] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedGig, setSelectedGig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryScrollPosition, setCategoryScrollPosition] = useState(0);
  const [showCategoryArrows, setShowCategoryArrows] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  useEffect(() => {
    const fetchGigsAndProfiles = async () => {
      try {
        const { data: gigList } = await api.get(
          "http://localhost:5000/api/get-all-gigs",
          { withCredentials: true }
        );

        const uniqueSkillNames = [
          "All",
          ...new Set(gigList.map((gig) => gig.category)),
        ];
        setCategories(uniqueSkillNames);

        const profilesData = {};
        const swapCountsData = {};

        await Promise.all(
          gigList.map(async (gig) => {
            if (!profilesData[gig.username]) {
              try {
                const res = await api.get(
                  `http://localhost:5000/api/get-all-services?username=${gig.username}`
                );
                profilesData[gig.username] = res.data;
              } catch (err) {
                console.error(`Profile error for ${gig.username}:`, err);
              }
            }

            if (!swapCountsData[gig.username]) {
              try {
                const res = await api.get(
                  `http://localhost:5000/api/get-swap-count/${gig.username}`
                );
                swapCountsData[gig.username] = res.data.swapCount || 0;
              } catch (err) {
                console.error(`Swap count error for ${gig.username}:`, err);
                swapCountsData[gig.username] = 0;
              }
            }
          })
        );

        setProfiles(profilesData);
        setSwapCounts(swapCountsData);
        setGigs(gigList);
        setFilteredGigs(gigList);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchGigsAndProfiles();
  }, []);

  // Handle category and search filtering
  useEffect(() => {
    let filtered = gigs;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((gig) => gig.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (gig) =>
          gig.skillName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gig.skillDescription
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          gig.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredGigs(filtered);
  }, [selectedCategory, searchTerm, gigs]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const openSwapModal = (gig) => {
    setSelectedGig(gig);
    setShowModal(true);
  };

  // Category slider functions
  const checkScrollNeeded = () => {
    const container = document.getElementById("category-slider");
    if (container) {
      const isScrollable = container.scrollWidth > container.clientWidth;
      setShowCategoryArrows(isScrollable);
    }
  };

  useEffect(() => {
    // Check if scroll is needed when categories change
    const timer = setTimeout(() => {
      checkScrollNeeded();
    }, 100);
    return () => clearTimeout(timer);
  }, [categories]);

  useEffect(() => {
    // Check scroll on window resize
    const handleResize = () => checkScrollNeeded();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollCategories = (direction) => {
    const container = document.getElementById("category-slider");
    const scrollAmount = 200;
    const newPosition =
      direction === "left"
        ? Math.max(0, categoryScrollPosition - scrollAmount)
        : categoryScrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: "smooth",
    });
    setCategoryScrollPosition(newPosition);
  };

  const canScrollLeft = categoryScrollPosition > 0;
  const canScrollRight = true; // We'll keep this simple for now

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <FaExchangeAlt className="text-white text-2xl" />
          </div>
          <p className="text-gray-600 font-medium">Loading services...</p>
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
              Discover <span className="text-green-200">Skills</span>
            </h1>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Connect with talented individuals and exchange skills to grow
              together
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search skills, services, or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 font-medium placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-white/30 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats and Filter Section - Better Layout */}
        {/* Stats and Filter Section - Categories inline with stats */}
        <div className="mb-8">
          {/* Single row with stats and categories */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Stats Section */}
            <div className="flex justify-center lg:justify-start items-center gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {filteredGigs.length}
                </div>
                <div className="text-sm text-gray-600">Available Services</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-gray-600">Categories</div>
              </div>
            </div>

            {/* Categories Filter Section */}
            <div className="flex-1 max-w-3xl">
              {/* Mobile: Dropdown for categories */}
              <div className="block md:hidden">
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white text-gray-800 font-medium focus:border-green-500 focus:outline-none transition-all"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Desktop: Horizontal slider */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* Left Arrow - Always visible */}
                  <div
                    onClick={() => scrollCategories("left")}
                    className={`absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center cursor-pointer transition-all ${
                      canScrollLeft
                        ? "text-gray-600 hover:text-green-600 hover:border-green-400 hover:shadow-md opacity-90"
                        : "text-gray-300 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <FaChevronLeft className="text-xs" />
                  </div>

                  {/* Categories Container - Always with padding for arrows */}
                  <div
                    id="category-slider"
                    className="flex gap-2 overflow-x-auto scroll-smooth px-9"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                    onScroll={(e) =>
                      setCategoryScrollPosition(e.target.scrollLeft)
                    }
                  >
                    <style jsx>{`
                      #category-slider::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                          selectedCategory === category
                            ? "bg-green-500 text-white shadow-sm"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-600"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {/* Right Arrow - Always visible */}
                  <div
                    onClick={() => scrollCategories("right")}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center cursor-pointer text-gray-600 hover:text-green-600 hover:border-green-400 hover:shadow-md transition-all opacity-90"
                  >
                    <FaChevronRight className="text-xs" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {filteredGigs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredGigs.map((gig) => {
              const profile = profiles[gig.username];
              const swapCount = swapCounts[gig.username] ?? 0;

              return (
                <div
                  key={gig._id}
                  className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200"
                >
                  {/* User Profile Header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt="Profile"
                          className="w-14 h-14 rounded-full object-cover border-3 border-green-100"
                        />
                      ) : (
                        <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <FaUserCircle className="text-white text-xl" />
                        </div>
                      )}

                      {/* Success Badge */}
                      {swapCount > 0 && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {profile?.name || gig.username}
                      </h4>
                      <Link
                        href={`/userpublicprofile/${gig.username}`}
                        className="text-green-600 hover:text-green-700 hover:underline text-sm font-medium transition-colors"
                      >
                        @{gig.username}
                      </Link>
                    </div>

                    {/* Rating/Swaps */}
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-green-600">
                        <FaStar className="text-xs" />
                        <span className="text-sm font-medium">{swapCount}</span>
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

                    {/* Location (if available) */}
                    {profile?.city && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <FaMapMarkerAlt className="text-xs" />
                        <span>
                          {profile.city}, {profile.country}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => openSwapModal(gig)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    Request Swap
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExchangeAlt className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              No Services Found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== "All"
                ? "Try adjusting your search or filter to find more services."
                : "Be the first to offer your skills to the community!"}
            </p>
            {searchTerm || selectedCategory !== "All" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all"
              >
                Clear Filters
              </button>
            ) : null}
          </div>
        )}
      </div>

      {showModal && selectedGig && (
        <SwapFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          recipient={selectedGig.username}
          gig={selectedGig}
          onSubmit={() => {
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AllGigs;
