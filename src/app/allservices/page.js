"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext"; // Import the AuthContext
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

const AllGigs = () => {
  const router = useRouter();
  const [gigs, setGigs] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [swapCounts, setSwapCounts] = useState({});

  const { user } = useAuth(); // Access the user from AuthContext
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  useEffect(() => {
    const fetchGigsAndProfiles = async () => {
      try {
        const { data: gigList } = await axios.get(
          "http://localhost:5000/api/get-all-gigs"
        );

        // Derive categories from skillName
        const uniqueSkillNames = [
          "All",
          ...new Set(gigList.map((gig) => gig.category)),
        ];
        setCategories(uniqueSkillNames);

        // For each gig, get the profile
        const profilesData = {};
        await Promise.all(
          gigList.map(async (gig) => {
            if (!profilesData[gig.username]) {
              const res = await axios.get(
                `http://localhost:5000/api/get-latest-profile?username=${gig.username}`
              );
              profilesData[gig.username] = res.data;
            }
          })
        );

        setProfiles(profilesData);
        setGigs(gigList);
        setFilteredGigs(gigList); // Initially show all gigs
        const swapCountsData = {};

        await Promise.all(
          gigList.map(async (gig) => {
            if (!profilesData[gig.username]) {
              const res = await axios.get(
                `http://localhost:5000/api/get-latest-profile?username=${gig.username.tolowerCase()}`
              );
              profilesData[gig.username] = res.data;
            }

            if (!swapCountsData[gig.username]) {
              try {
                const res = await axios.get(
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
      } catch (err) {
        console.error(err);
      }
    };

    fetchGigsAndProfiles();
  }, []);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredGigs(gigs); // Show all gigs if 'All' is selected
    } else {
      const filteredGigsList = gigs.filter((gig) => gig.category === category);
      setFilteredGigs(filteredGigsList); // Show gigs of the selected category
    }
  };

  // Handle redirect to messages
  const handleSwapRequest = (recipientUsername) => {
    router.push(`/messages?recipient=${recipientUsername}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6">All Services</h2>

      {/* Category Navigation Bar */}
      <div className="mb-6">
        <div className="flex overflow-x-auto gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategory === category
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 border-gray-300"
              } transition`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Display the filtered gigs */}
      {filteredGigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGigs.map((gig) => {
            const profile = profiles[gig.username];
            return (
              <div
                key={gig._id}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
              >
                {/* Display User Profile First */}
                <div className="flex items-center gap-4 mb-4">
                  {profile?.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <FaUserCircle className="w-16 h-16 text-gray-400" />
                  )}
                  <p className="text-sm text-gray-600">
                    {profile?.name} (
                    <Link
                      href={`/userpublicprofile/${gig.username}`}
                      className="text-green-600 hover:underline"
                    >
                      @{gig.username}
                    </Link>
                    )
                  </p>
                </div>

                <h3 className="text-xl font-bold text-green-600 mb-4">
                  {gig.skillName}
                </h3>
                <p className="text-gray-700 mb-4">{gig.skillDescription}</p>
                <p className="text-sm text-gray-500 mb-2">
                  <strong>Exchange For:</strong> {gig.exchangeService}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Swaps:</strong>{" "}
                  {swapCounts[gig.username] ?? "Loading..."}
                </p>

                {/* Request Swap Button */}
                <button
                  onClick={() => handleSwapRequest(gig.username)}
                  className="mt-4 px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
                >
                  Request Swap
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          No services found for this category.
        </p>
      )}
    </div>
  );
};

export default AllGigs;
