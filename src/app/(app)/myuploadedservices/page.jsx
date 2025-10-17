// "use client";
// import { useEffect, useState, useRef } from "react";
// import api from "../../utils/api";
// api.defaults.withCredentials = true;
// import { useAuth } from "../../contexts/AuthContext";
// import {
//   FaUserCircle,
//   FaExchangeAlt,
//   FaStar,
//   FaTrash,
//   FaCheck,
//   FaPlus,
//   FaEdit,
//   FaTimes,
// } from "react-icons/fa";
// import SuccessPopup from "../../components/successPopup";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// // Edit Modal Component
// const EditServiceModal = ({ gig, onClose, onUpdate }) => {
//   const [formData, setFormData] = useState({
//     skillName: gig.skillName,
//     skillDescription: gig.skillDescription,
//     exchangeService: gig.exchangeService,
//     category: gig.category || "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       await onUpdate(gig._id, formData);
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to update service");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
//           <h2 className="text-2xl font-bold">Edit Service</h2>
//           <button
//             onClick={onClose}
//             className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
//           >
//             <FaTimes className="text-xl" />
//           </button>
//         </div>

//         {/* Form */}
//         <div className="p-6 space-y-6">
//           {error && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//               {error}
//             </div>
//           )}

//           {/* Skill Name */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Service Name <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="skillName"
//               value={formData.skillName}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//               placeholder="e.g., Web Development, Graphic Design"
//             />
//           </div>

//           {/* Skill Description */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Description <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               name="skillDescription"
//               value={formData.skillDescription}
//               onChange={handleChange}
//               required
//               rows={4}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
//               placeholder="Describe your service in detail..."
//             />
//           </div>

//           {/* Exchange Service */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Looking For <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               name="exchangeService"
//               value={formData.exchangeService}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//               placeholder="What service do you want in exchange?"
//             />
//           </div>

//           {/* Category */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Category
//             </label>
//             <input
//               type="text"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//               placeholder="e.g., IT, Business, Marketing"
//             />
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 pt-4">
//             <button
//               type="button"
//               onClick={onClose}
//               className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
//             >
//               Cancel
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               disabled={loading}
//               className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? "Updating..." : "Update Service"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const MyGigsPage = () => {
//   const [gigs, setGigs] = useState([]);
//   const [profiles, setProfiles] = useState({});
//   const [currentUser, setCurrentUser] = useState("");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [swapCounts, setSwapCounts] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [editingGig, setEditingGig] = useState(null);

//   const { user, loading: authLoading } = useAuth();
//   const isRedirecting = useRef(false);
//   const router = useRouter();

//   useEffect(() => {
//     if (authLoading || isRedirecting.current) return;

//     if (!user) {
//       isRedirecting.current = true;
//       router.replace("/login");
//       return;
//     }
//     if (!user.emailVerified) {
//       isRedirecting.current = true;
//       router.replace("/signup");
//       return;
//     }
//     if (!user.profileCompleted) {
//       isRedirecting.current = true;
//       router.replace("/profile");
//       return;
//     }
//   }, [user, authLoading, router]);

//   useEffect(() => {
//     const fetchUserGigsAndProfile = async () => {
//       if (!user || !user.userName) {
//         console.warn("User is not available yet.");
//         return;
//       }

//       try {
//         setCurrentUser(user.userName);

//         const { data: gigData } = await api.get(
//           `${BASE_URL}/api/get-my-gigs/${user.userName}`
//         );
//         setGigs(gigData);

//         const { data: profileData } = await api.get(
//           `${BASE_URL}/api/get-latest-profile`
//         );
//         setProfiles((prevProfiles) => ({
//           ...prevProfiles,
//           [user.userName]: profileData,
//         }));

//         const { data: swapData } = await api.get(`${BASE_URL}/api/swaps`);
//         setSwapCounts((prev) => ({
//           ...prev,
//           [user.userName]: swapData.swapCount || 0,
//         }));
//       } catch (err) {
//         console.error("Error fetching user gigs or profile:", err);
//         setSwapCounts((prev) => ({
//           ...prev,
//           [user.userName]: 0,
//         }));
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserGigsAndProfile();
//   }, [user]);

//   const handleDelete = async (gigId) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this service?"
//     );
//     if (!confirmDelete) return;

//     try {
//       await api.delete(`${BASE_URL}/api/delete-gig/${gigId}`);
//       const updatedGigs = gigs.filter((gig) => gig._id !== gigId);
//       setGigs(updatedGigs);
//       setSuccessMessage("Service removed successfully!");
//       setShowSuccess(true);
//     } catch (err) {
//       console.error("Error deleting gig:", err);
//     }
//   };

//   const handleUpdate = async (gigId, updatedData) => {
//     try {
//       await api.put(`${BASE_URL}/api/update-gig/${gigId}`, updatedData);

//       // Update local state
//       const updatedGigs = gigs.map((gig) =>
//         gig._id === gigId ? { ...gig, ...updatedData } : gig
//       );
//       setGigs(updatedGigs);
//       setSuccessMessage("Service updated successfully!");
//       setShowSuccess(true);
//     } catch (err) {
//       console.error("Error updating gig:", err);
//       throw err;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
//             <FaExchangeAlt className="text-white text-2xl" />
//           </div>
//           <p className="text-gray-600 font-medium">Loading your services...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
//       {/* Header Section */}
//       <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-8">
//             <h1 className="text-4xl md:text-5xl font-bold mb-4">
//               My <span className="text-green-200">Services</span>
//             </h1>
//             <p className="text-green-100 text-lg max-w-2xl mx-auto">
//               Manage and track your skill offerings
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="container mx-auto px-4 py-8">
//         {/* Stats Section */}
//         <div className="mb-8">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//             <div className="flex justify-center md:justify-start items-center gap-8">
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-gray-900">
//                   {gigs.length}
//                 </div>
//                 <div className="text-sm text-gray-600">Active Services</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-3xl font-bold text-green-600">
//                   {swapCounts[currentUser] || 0}
//                 </div>
//                 <div className="text-sm text-gray-600">Total Swaps</div>
//               </div>
//             </div>

//             {/* Add New Service Button */}
//             <Link
//               href="/services"
//               className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 w-fit mx-auto md:mx-0"
//             >
//               <FaPlus className="text-sm" />
//               Add New Service
//             </Link>
//           </div>
//         </div>

//         {/* Services Grid */}
//         {gigs.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {gigs.map((gig) => (
//               <div
//                 key={gig._id}
//                 className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200"
//               >
//                 {/* User Profile Header */}
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="relative">
//                     {profiles[currentUser]?.profileImage ? (
//                       <img
//                         src={profiles[currentUser]?.profileImage}
//                         alt="Profile"
//                         className="w-14 h-14 rounded-full object-cover border-3 border-green-100"
//                       />
//                     ) : (
//                       <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
//                         <FaUserCircle className="text-white text-xl" />
//                       </div>
//                     )}

//                     {/* Success Badge */}
//                     {swapCounts[currentUser] > 0 && (
//                       <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
//                         <FaCheck className="text-white text-xs" />
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex-1 min-w-0">
//                     <h4 className="font-semibold text-gray-900 truncate">
//                       {profiles[currentUser]?.name || currentUser}
//                     </h4>
//                     <p className="text-green-600 text-sm font-medium">
//                       @{currentUser}
//                     </p>
//                   </div>

//                   {/* Rating/Swaps */}
//                   <div className="text-right">
//                     <div className="flex items-center gap-1 text-green-600">
//                       <FaStar className="text-xs" />
//                       <span className="text-sm font-medium">
//                         {swapCounts[currentUser] || 0}
//                       </span>
//                     </div>
//                     <div className="text-xs text-gray-500">swaps</div>
//                   </div>
//                 </div>

//                 {/* Service Details */}
//                 <div className="mb-6">
//                   <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
//                     {gig.skillName}
//                   </h3>
//                   <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
//                     {gig.skillDescription}
//                   </p>

//                   {/* Exchange Details */}
//                   <div className="bg-green-50 rounded-xl p-4 mb-4">
//                     <div className="flex items-center gap-2 mb-2">
//                       <FaExchangeAlt className="text-green-600" />
//                       <span className="text-sm font-medium text-gray-700">
//                         Looking for:
//                       </span>
//                     </div>
//                     <span className="text-green-700 font-medium text-sm">
//                       {gig.exchangeService}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-3">
//                   <button
//                     onClick={() => setEditingGig(gig)}
//                     className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
//                   >
//                     <FaEdit className="text-sm" />
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(gig._id)}
//                     className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
//                   >
//                     <FaTrash className="text-sm" />
//                     Remove
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           /* Empty State */
//           <div className="text-center py-16">
//             <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FaExchangeAlt className="text-gray-400 text-3xl" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-4">
//               No Services Yet
//             </h3>
//             <p className="text-gray-600 mb-8 max-w-md mx-auto">
//               You haven&apos;t created any services yet. Start by adding your
//               first skill to share with the community!
//             </p>
//             <Link
//               href="/services"
//               className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               <FaPlus className="text-sm" />
//               Add Your First Service
//             </Link>
//           </div>
//         )}

//         {/* Edit Modal */}
//         {editingGig && (
//           <EditServiceModal
//             gig={editingGig}
//             onClose={() => setEditingGig(null)}
//             onUpdate={handleUpdate}
//           />
//         )}

//         {/* Success Popup */}
//         {showSuccess && (
//           <SuccessPopup
//             message={successMessage}
//             onClose={() => setShowSuccess(false)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default MyGigsPage;
"use client";
import { useEffect, useState, useRef } from "react";
import api from "../../utils/api";
api.defaults.withCredentials = true;
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUserCircle,
  FaExchangeAlt,
  FaStar,
  FaTrash,
  FaCheck,
  FaPlus,
  FaEdit,
  FaTimes,
} from "react-icons/fa";
import SuccessPopup from "../../components/successPopup";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// Edit Modal Component
const EditServiceModal = ({ gig, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    skillName: gig.skillName,
    skillDescription: gig.skillDescription,
    exchangeService: gig.exchangeService,
    category: gig.category || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await onUpdate(gig._id, formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Edit Service</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Skill Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Service Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="skillName"
              value={formData.skillName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="e.g., Web Development, Graphic Design"
            />
          </div>

          {/* Skill Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="skillDescription"
              value={formData.skillDescription}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all resize-none"
              placeholder="Describe your service in detail..."
            />
          </div>

          {/* Exchange Service */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Looking For <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="exchangeService"
              value={formData.exchangeService}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="What service do you want in exchange?"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              placeholder="e.g., IT, Business, Marketing"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MyGigsPage = () => {
  const [gigs, setGigs] = useState([]);
  const [profiles, setProfiles] = useState({});
  const [currentUser, setCurrentUser] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [completedSwapCounts, setCompletedSwapCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingGig, setEditingGig] = useState(null);

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

  // Function to get completed swaps for a specific user
  const getCompletedSwapsForUser = async (username) => {
    try {
      const response = await api.get(
        `${BASE_URL}/api/get-swap-count/${username}`,
        {
          withCredentials: true,
        }
      );
      return response.data.swapCount || 0;
    } catch (error) {
      console.error(`Error fetching swap count for ${username}:`, error);
      return 0;
    }
  };

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

        // Fetch completed swap count using the endpoint
        const completedCount = await getCompletedSwapsForUser(user.userName);
        setCompletedSwapCounts((prev) => ({
          ...prev,
          [user.userName]: completedCount,
        }));
      } catch (err) {
        console.error("Error fetching user gigs or profile:", err);
        setCompletedSwapCounts((prev) => ({
          ...prev,
          [user.userName]: 0,
        }));
      } finally {
        setLoading(false);
      }
    };

    fetchUserGigsAndProfile();
  }, [user]);

  const handleDelete = async (gigId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this service?"
    );
    if (!confirmDelete) return;

    try {
      await api.delete(`${BASE_URL}/api/delete-gig/${gigId}`);
      const updatedGigs = gigs.filter((gig) => gig._id !== gigId);
      setGigs(updatedGigs);
      setSuccessMessage("Service removed successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error("Error deleting gig:", err);
    }
  };

  const handleUpdate = async (gigId, updatedData) => {
    try {
      await api.put(`${BASE_URL}/api/update-gig/${gigId}`, updatedData);

      // Update local state
      const updatedGigs = gigs.map((gig) =>
        gig._id === gigId ? { ...gig, ...updatedData } : gig
      );
      setGigs(updatedGigs);
      setSuccessMessage("Service updated successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error("Error updating gig:", err);
      throw err;
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

  const completedSwapCount = completedSwapCounts[currentUser] || 0;

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
                  {completedSwapCount}
                </div>
                <div className="text-sm text-gray-600">Completed Swaps</div>
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
                    {completedSwapCount > 0 && (
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

                  {/* Completed Swaps Display */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <FaStar className="text-xs" />
                      <span className="text-sm font-medium">
                        {completedSwapCount}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">completed</div>
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

                  {/* Category Badge */}
                  {gig.category && (
                    <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                      {gig.category}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingGig(gig)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  >
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

        {/* Edit Modal */}
        {editingGig && (
          <EditServiceModal
            gig={editingGig}
            onClose={() => setEditingGig(null)}
            onUpdate={handleUpdate}
          />
        )}

        {/* Success Popup */}
        {showSuccess && (
          <SuccessPopup
            message={successMessage}
            onClose={() => setShowSuccess(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MyGigsPage;
