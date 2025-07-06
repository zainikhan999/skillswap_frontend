"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthContext"; // Adjust the import path as necessary
import { FaUser } from "react-icons/fa"; // Importing default user icon
import SuccessPopup from "../../components/successPopup"; // Adjust the import path as necessary

const MyGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [swapCounts, setSwapCounts] = useState({});

  const { user } = useAuth();
  console.log("User:", user);

  useEffect(() => {
    const fetchUserGigsAndProfile = async () => {
      if (!user || !user.userName) {
        console.warn("User is not available yet.");
        return;
      }

      try {
        setCurrentUser(user.userName);

        const { data: gigData } = await axios.get(
          `https://backend-skillswap.vercel.app/api/get-my-gigs/${user.userName}`
        );
        setGigs(gigData);

        const { data: profileData } = await axios.get(
          `https://backend-skillswap.vercel.app/api/get-latest-profile?username=${user.userName}`
        );
        setProfiles((prevProfiles) => ({
          ...prevProfiles,
          [user.userName]: profileData,
        }));

        const { data: swapData } = await axios.get(
          `https://backend-skillswap.vercel.app/api/get-swap-count/${user.userName}`
        );
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
      await axios.delete(
        `https://backend-skillswap.vercel.app/api/delete-gig/${gigId}`
      );
      const updatedGigs = gigs.filter((gig) => gig._id !== gigId);
      setGigs(updatedGigs);
      setShowSuccess(true); // Show success modal
    } catch (err) {
      console.error("Error deleting gig:", err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-semibold mb-6">My Services</h2>

      {gigs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div
              key={gig._id}
              className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-transform transform hover:scale-105"
            >
              {/* Profile */}
              <div className="flex items-center gap-4 mb-4">
                {/* Show profile image or fallback icon */}
                {profiles[currentUser]?.profileImage ? (
                  <img
                    src={profiles[currentUser]?.profileImage}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <FaUser className="w-16 h-16 text-gray-500" />
                )}
                <p className="text-sm text-gray-600">
                  {profiles[currentUser]?.name} (@{gig.username})
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

              <button
                onClick={() => handleDelete(gig._id)}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1.5rem",
                  backgroundColor: "#dc2626", // equivalent to Tailwind's bg-red-600
                  color: "white",
                  borderRadius: "9999px",
                  transition: "background-color 0.3s ease",
                  cursor: "pointer",
                  border: "none",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = "#b91c1c")
                } // Tailwind's bg-red-700
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = "#dc2626")
                }
              >
                Remove Service
              </button>
            </div>
          ))}
          {showSuccess && (
            <SuccessPopup
              message="Gig removed successfully!"
              onClose={() => setShowSuccess(false)}
            />
          )}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">
          You haven’t uploaded any services yet.
        </p>
      )}
    </div>
  );
};

export default MyGigsPage;
