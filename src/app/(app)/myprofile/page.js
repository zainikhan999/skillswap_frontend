"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const username = parsedUser.userName;
      const fetchProfileAndGigs = async () => {
        try {
          const [profileRes, gigsRes, swapCountRes] = await Promise.all([
            axios.get(
              `https://backend-skillswap.vercel.app/api/get-latest-profile?username=${username}`
            ),
            axios.get(
              `https://backend-skillswap.vercel.app/api/get-my-gigs/${username}`
            ),
            axios.get(
              `https://backend-skillswap.vercel.app/api/get-swap-count/${username}`
            ),
          ]);

          setFormData(profileRes.data);
          setGigs(gigsRes.data);
          setTotalSwaps(swapCountRes.data.swapCount); // ✅ only set backend's correct count

          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchProfileAndGigs();
    }
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="h-screen bg-white p-4 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-xl max-w-6xl mx-auto h-full flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 flex flex-col items-center text-center border-b md:border-b-0 md:border-r border-gray-200 p-6 overflow-y-auto">
          {formData.profileImage ? (
            <img
              src={formData.profileImage}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover mb-4"
            />
          ) : (
            <FaUserCircle className="w-28 h-28 text-gray-400 mb-4" />
          )}
          <h2 className="text-2xl font-semibold">{formData.name}</h2>

          {/* Add username below full name */}
          <p className="text-sm text-gray-500 mb-2">
            @{formData.username.toLowerCase()}
          </p>

          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            {formData.city}, {formData.country}
          </p>
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
            <FaPhoneAlt className="text-gray-400" />
            {formData.contactNumber}
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <strong>Completed Swaps:</strong> {totalSwaps}
          </div>

          <div className="w-full text-left mt-4">
            <h3 className="text-gray-700 font-semibold mb-2 px-2">Skills</h3>
            <ul className="list-disc list-inside text-sm text-gray-600 px-2">
              {formData.skills.map((skill, idx) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-2">About Me</h2>
            <p className="text-gray-700 whitespace-pre-wrap text-justify">
              {formData.bio}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">My Services</h3>
            {gigs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {gigs.map((gig) => (
                  <div
                    key={gig._id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <h4 className="text-green-600 font-bold text-lg mb-2">
                      {gig.skillName}
                    </h4>
                    <p className="text-gray-700 mb-2">{gig.skillDescription}</p>
                    <p className="text-sm text-gray-500">
                      <strong>Exchange For:</strong> {gig.exchangeService}
                    </p>
                    <p className="text-sm text-gray-500">
                      <strong>Swaps:</strong> {totalSwaps}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No Services Available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
