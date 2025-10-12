// "use client";
// import {
//   FaUserCircle,
//   FaCamera,
//   FaPlus,
//   FaTimes,
//   FaRobot,
//   FaMagic,
//   FaStar,
//   FaUsers,
//   FaMapMarkerAlt,
//   FaPhone,
//   FaEdit,
//   FaSpinner,
//   FaHeart,
//   FaArrowRight,
//   FaLightbulb,
// } from "react-icons/fa";
// import { useState, useEffect, useRef } from "react";
// import api from "../../utils/api";
// import { useRouter } from "next/navigation";
// import { useAuth } from "contexts/AuthContext";
// import ErrorPopup from "../../components/errorPopup";
// import SuccessPopup from "../../components/successPopup";
// import throttle from "lodash/throttle";

// api.defaults.withCredentials = true;

// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnmhfubvn/image/upload";
// const UPLOAD_PRESET = "displaypicture";

// export default function ProfileForm() {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [checkingAuth, setCheckingAuth] = useState(true);
//   const [image, setImage] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });
//   const [successPopup, setSuccessPopup] = useState({
//     show: false,
//     message: "",
//   });
//   const [suggestion, setSuggestion] = useState("");
//   const maxWords = 100;
//   const [bioWordCount, setBioWordCount] = useState(0);
//   const [showAIPrompt, setShowAIPrompt] = useState(false);
//   const [aiPrompt, setAIPrompt] = useState("");
//   const [loadingAI, setLoadingAI] = useState(false);
//   const [uploadingImage, setUploadingImage] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     city: "",
//     country: "Pakistan",
//     contactNumber: "",
//     bio: "",
//     skills: [""],
//     profileImage: "",
//   });

//   const throttledFetchSuggestion = useRef(
//     throttle(async (text) => {
//       if (!text.trim()) {
//         setSuggestion("");
//         return;
//       }
//       try {
//         const res = await api.post(`${BASE_URL}/api/suggest-bio`, { text });
//         setSuggestion(res.data.suggestion || "");
//       } catch (error) {
//         setSuggestion("");
//       }
//     }, 2000)
//   ).current;

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("user");

//       if (!storedUser) {
//         router.push("/signup");
//         return;
//       }

//       const parsedUser = JSON.parse(storedUser);

//       if (!parsedUser.emailVerified) {
//         router.push("/signup");
//         return;
//       }

//       if (parsedUser.profileCompleted) {
//         router.push("/allservices");
//         return;
//       }

//       setFormData((prev) => ({
//         ...prev,
//         username: parsedUser.userName || "",
//       }));

//       setCheckingAuth(false);
//     }
//   }, [router]);

//   if (checkingAuth) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
//         <div className="flex flex-col items-center gap-4">
//           <FaSpinner className="animate-spin text-green-600 text-4xl" />
//           <p className="text-gray-600 font-semibold">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   const showError = (msg) => {
//     setErrorPopup({ show: true, message: msg });
//   };

//   const closeError = () => {
//     setErrorPopup({ show: false, message: "" });
//   };

//   const closeSuccess = () => {
//     setSuccessPopup({ show: false, message: "" });

//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
//         parsedUser.profileCompleted = true;
//         localStorage.setItem("user", JSON.stringify(parsedUser));
//       }
//     }

//     router.push("/allservices");
//   };

//   const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

//   // ✅ UPDATED: File handling with validation
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const validTypes = [
//       "image/jpeg",
//       "image/jpg",
//       "image/png",
//       "image/gif",
//       "image/webp",
//     ];
//     if (!validTypes.includes(file.type)) {
//       showError("Invalid file type. Please upload JPEG, PNG, GIF, or WebP");
//       return;
//     }

//     const maxSize = 10 * 1024 * 1024;
//     if (file.size > maxSize) {
//       showError("File size too large. Maximum 10MB allowed");
//       return;
//     }

//     setImage(file);
//   };

//   // ✅ NEW: Remove image function
//   const removeImage = () => {
//     setImage(null);
//     setImageUrl("");
//     setFormData((prev) => ({ ...prev, profileImage: "" }));
//     const fileInput = document.querySelector('input[type="file"]');
//     if (fileInput) fileInput.value = "";
//   };

//   const uploadImage = async () => {
//     if (!image) return showError("Please select an image!");

//     const formData = new FormData();
//     formData.append("file", image);
//     formData.append("upload_preset", UPLOAD_PRESET);

//     try {
//       setUploadingImage(true);

//       const response = await fetch(CLOUDINARY_URL, {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error?.message || "Upload failed");
//       }

//       const data = await response.json();
//       const uploadedImageUrl = data.secure_url;

//       console.log("✅ Image uploaded successfully:", uploadedImageUrl);

//       setImageUrl(uploadedImageUrl);
//       setFormData((prev) => ({ ...prev, profileImage: uploadedImageUrl }));
//     } catch (error) {
//       console.error("Upload failed:", error);
//       showError(error.message || "Failed to upload image");
//     } finally {
//       setUploadingImage(false);
//     }
//   };

//   const generateBioFromPrompt = async () => {
//     if (!aiPrompt.trim()) {
//       showError("Please enter a prompt for AI bio generation.");
//       return;
//     }

//     try {
//       setLoadingAI(true);
//       const res = await api.post(`${BASE_URL}/api/suggest-bio`, {
//         prompt: aiPrompt,
//       });

//       if (res.data.suggestion) {
//         setFormData((prev) => ({ ...prev, bio: res.data.suggestion }));
//         setBioWordCount(countWords(res.data.suggestion));
//         setSuggestion("");
//         setShowAIPrompt(false);
//         setAIPrompt("");
//       } else {
//         showError("No bio generated. Try a different prompt.");
//       }
//     } catch (err) {
//       showError("Failed to generate bio from AI.");
//     } finally {
//       setLoadingAI(false);
//     }
//   };

//   const handleBioChange = (e) => {
//     const inputText = e.target.value;
//     const wordCount = countWords(inputText);

//     if (wordCount <= maxWords) {
//       setFormData((prev) => ({ ...prev, bio: inputText }));
//       setBioWordCount(wordCount);

//       if (wordCount >= 5) {
//         throttledFetchSuggestion(inputText);
//       } else {
//         setSuggestion("");
//       }
//     }
//   };

//   const acceptSuggestion = () => {
//     const currentBio = formData.bio;
//     if (suggestion.startsWith(currentBio)) {
//       const acceptedPart = suggestion.slice(currentBio.length);
//       setFormData((prev) => ({ ...prev, bio: currentBio + acceptedPart }));
//       setSuggestion("");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSkillChange = (index, value) => {
//     const updatedSkills = [...formData.skills];
//     updatedSkills[index] = value;
//     setFormData({ ...formData, skills: updatedSkills });
//   };

//   const addSkill = () => {
//     setFormData({ ...formData, skills: [...formData.skills, ""] });
//   };

//   const removeSkill = (index) => {
//     const updatedSkills = formData.skills.filter((_, i) => i !== index);
//     setFormData({ ...formData, skills: updatedSkills });
//   };

//   // Replace your handleSubmit function with this:

//   // ✅ UPDATED: Replace your handleSubmit function with this:

//   const handleSubmit = async () => {
//     const filteredSkills = formData.skills.filter(
//       (skill) => skill.trim() !== ""
//     );
//     const rawContact = formData.contactNumber.trim();
//     const fullContact = `+92${rawContact}`;

//     const updatedData = {
//       name: formData.name,
//       city: formData.city,
//       contactNumber: fullContact,
//       bio: formData.bio,
//       skills: filteredSkills,
//       profileImage: formData.profileImage, // This should already be set from Cloudinary
//     };

//     // Validation
//     if (
//       !updatedData.name ||
//       !updatedData.city ||
//       !updatedData.contactNumber ||
//       !updatedData.bio ||
//       filteredSkills.length === 0
//     ) {
//       showError(
//         "All fields are required, and at least one skill must be provided"
//       );
//       return;
//     }

//     if (!/^\+923\d{9}$/.test(fullContact)) {
//       showError("Contact number must be in format +92XXXXXXXXXX");
//       return;
//     }

//     if (countWords(formData.bio) > maxWords) {
//       showError(`Bio must not exceed ${maxWords} words`);
//       return;
//     }

//     try {
//       setSubmitting(true);

//       // ✅ FIXED: Call your actual backend endpoint
//       const response = await api.post(
//         `${BASE_URL}/api/submit-profile`, // ✅ Use your actual endpoint
//         updatedData
//       );

//       console.log("✅ Profile submission response:", response.data);

//       // ✅ FIXED: Properly update localStorage with complete user data
//       if (typeof window !== "undefined") {
//         const storedUser = localStorage.getItem("user");
//         if (storedUser) {
//           const parsedUser = JSON.parse(storedUser);

//           // ✅ Update with all fields
//           const updatedUser = {
//             ...parsedUser,
//             emailVerified: true,
//             profileCompleted: true, // ✅ Mark profile as completed
//           };

//           console.log(
//             "✅ Updating user after profile completion:",
//             updatedUser
//           );
//           localStorage.setItem("user", JSON.stringify(updatedUser));

//           // ✅ If using AuthContext, update it too
//           if (typeof updateUser === "function") {
//             updateUser(updatedUser);
//           }
//         }
//       }

//       setSuccessPopup({ show: true, message: response.data.message });
//     } catch (error) {
//       console.error("❌ Profile submission error:", error);
//       showError(error.response?.data?.message || "Error submitting profile");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4 relative overflow-hidden">
//       <div className="absolute inset-0 opacity-5 pointer-events-none">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
//       </div>

//       <div className="relative z-10 w-full max-w-4xl mx-auto">
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 mb-6">
//             <FaHeart className="text-green-600 w-4 h-4" />
//             Complete Your Profile
//           </div>
//           <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
//             Tell Us About{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
//               Yourself
//             </span>
//           </h1>
//           <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
//             Create a compelling profile to attract the perfect skill-swapping
//             partners
//           </p>
//         </div>

//         <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
//           {/* ✅ UPDATED: Profile Picture Section with file preview and remove button */}
//           <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-10 border-b border-green-100">
//             <div className="flex flex-col md:flex-row items-center justify-between gap-6">
//               <div className="flex items-center gap-6">
//                 <div className="relative group">
//                   {imageUrl ? (
//                     <img
//                       src={imageUrl}
//                       alt="Profile"
//                       className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-2xl"
//                     />
//                   ) : (
//                     <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl">
//                       <FaUserCircle className="text-white text-4xl" />
//                     </div>
//                   )}
//                   <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center border-3 border-white shadow-lg">
//                     <FaCamera className="text-white text-sm" />
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                     Profile Picture
//                   </h3>
//                   <p className="text-gray-600">
//                     Upload a clear photo of yourself
//                   </p>

//                   {/* ✅ Show selected file */}
//                   {image && !imageUrl && (
//                     <div className="mt-2 flex items-center gap-2">
//                       <p className="text-sm text-green-600 font-medium">
//                         Selected: {image.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         ({(image.size / 1024 / 1024).toFixed(2)} MB)
//                       </p>
//                     </div>
//                   )}

//                   {/* ✅ Show upload success */}
//                   {imageUrl && (
//                     <div className="mt-2">
//                       <p className="text-sm text-green-600 font-medium flex items-center gap-1">
//                         <svg
//                           className="w-4 h-4"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                             clipRule="evenodd"
//                           />
//                         </svg>
//                         Image uploaded successfully!
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex flex-col gap-3">
//                 {/* ✅ Remove button */}
//                 {(image || imageUrl) && (
//                   <button
//                     type="button"
//                     onClick={removeImage}
//                     className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
//                   >
//                     <FaTimes />
//                     Remove Image
//                   </button>
//                 )}

//                 {/* Choose file button */}
//                 <label className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer text-center shadow-lg hover:scale-105">
//                   <FaPlus className="inline mr-2" />
//                   {image || imageUrl ? "Change File" : "Choose File"}
//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     className="hidden"
//                     accept="image/*"
//                   />
//                 </label>

//                 {/* Upload button - only show if file selected but not uploaded */}
//                 {image && !imageUrl && (
//                   <button
//                     type="button"
//                     disabled={uploadingImage}
//                     onClick={uploadImage}
//                     className={`px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:scale-105 disabled:opacity-50 ${
//                       uploadingImage
//                         ? "bg-gray-400 text-white cursor-not-allowed"
//                         : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
//                     }`}
//                   >
//                     {uploadingImage ? (
//                       <>
//                         <FaSpinner className="animate-spin inline mr-2" />
//                         Uploading...
//                       </>
//                     ) : (
//                       <>
//                         <FaCamera className="inline mr-2" />
//                         Upload Picture
//                       </>
//                     )}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Rest of the form... (keeping all your existing code) */}
//           <div className="p-8 md:p-10">
//             {/* Username */}
//             <div className="mb-8">
//               <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
//                 Username
//               </label>
//               <div className="relative">
//                 <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                 <input
//                   type="text"
//                   value={formData.username}
//                   className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-600 font-semibold cursor-not-allowed"
//                   readOnly
//                 />
//               </div>
//             </div>

//             {/* Name, City, Contact - keeping your existing grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">
//                   Full Name
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Enter your full name"
//                   className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none"
//                   onChange={handleChange}
//                   value={formData.name}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   placeholder="Enter your city"
//                   className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none"
//                   onChange={handleChange}
//                   value={formData.city}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">
//                   Country
//                 </label>
//                 <input
//                   type="text"
//                   value="Pakistan"
//                   className="w-full px-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl cursor-not-allowed"
//                   readOnly
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-bold text-gray-700 mb-3">
//                   Contact Number
//                 </label>
//                 <div className="flex">
//                   <div className="flex items-center px-4 py-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-2xl">
//                     <span className="font-semibold text-gray-600">+92</span>
//                   </div>
//                   <input
//                     type="text"
//                     placeholder="3001234567"
//                     maxLength={10}
//                     className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-r-2xl focus:border-green-400 focus:outline-none"
//                     onChange={(e) => {
//                       const digitsOnly = e.target.value.replace(/\D/g, "");
//                       setFormData({ ...formData, contactNumber: digitsOnly });
//                     }}
//                     value={formData.contactNumber}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Bio with AI - keeping your existing code */}
//             <div className="mb-8">
//               <div className="flex justify-between items-center mb-4">
//                 <label className="block text-sm font-bold text-gray-700">
//                   Bio
//                 </label>
//                 <button
//                   type="button"
//                   onClick={() => setShowAIPrompt(!showAIPrompt)}
//                   className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full"
//                 >
//                   <FaRobot className="animate-pulse" />
//                   Ask AI
//                 </button>
//               </div>

//               {showAIPrompt && (
//                 <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-100 shadow-lg">
//                   <div className="flex items-center gap-2 mb-4">
//                     <FaMagic className="text-purple-500 animate-pulse" />
//                     <h3 className="font-bold text-purple-700">
//                       AI Bio Generator
//                     </h3>
//                   </div>
//                   <div className="flex flex-col sm:flex-row gap-3">
//                     <input
//                       type="text"
//                       placeholder="Describe yourself..."
//                       value={aiPrompt}
//                       onChange={(e) => setAIPrompt(e.target.value)}
//                       className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none"
//                     />
//                     <button
//                       onClick={generateBioFromPrompt}
//                       disabled={loadingAI || !aiPrompt.trim()}
//                       className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
//                     >
//                       {loadingAI ? (
//                         <>
//                           <FaSpinner className="animate-spin inline mr-2" />
//                           Generating...
//                         </>
//                       ) : (
//                         <>
//                           <FaLightbulb className="inline mr-2" />
//                           Generate Bio
//                         </>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}

//               <textarea
//                 placeholder="Tell us about yourself..."
//                 className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none resize-none"
//                 onChange={handleBioChange}
//                 onKeyDown={(e) => {
//                   if (e.key === "Tab" && suggestion) {
//                     e.preventDefault();
//                     acceptSuggestion();
//                   }
//                 }}
//                 value={formData.bio}
//                 rows={6}
//               />
//               <p className="text-sm text-gray-500 mt-2">
//                 {bioWordCount}/{maxWords} words
//               </p>
//             </div>

//             {/* Skills - keeping your existing code */}
//             <div className="mb-10">
//               <label className="block text-sm font-bold text-gray-700 mb-4">
//                 Your Skills
//               </label>
//               <div className="space-y-4">
//                 {formData.skills.map((skill, index) => (
//                   <div key={index} className="flex gap-3">
//                     <input
//                       type="text"
//                       value={skill}
//                       placeholder={`Skill ${index + 1}`}
//                       className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none"
//                       onChange={(e) => handleSkillChange(index, e.target.value)}
//                     />
//                     {formData.skills.length > 1 && (
//                       <button
//                         onClick={() => removeSkill(index)}
//                         className="w-12 h-12 bg-red-500 text-white rounded-2xl hover:bg-red-600"
//                       >
//                         <FaTimes />
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={addSkill}
//                 className="mt-4 flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-3 rounded-2xl hover:bg-green-100"
//               >
//                 <FaPlus /> Add Another Skill
//               </button>
//             </div>

//             {/* Submit */}
//             <button
//               onClick={handleSubmit}
//               disabled={submitting}
//               className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
//             >
//               {submitting ? (
//                 <>
//                   <FaSpinner className="animate-spin text-xl" />
//                   Creating Profile...
//                 </>
//               ) : (
//                 <>
//                   Complete Profile
//                   <FaArrowRight className="text-xl" />
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {errorPopup.show && (
//         <ErrorPopup message={errorPopup.message} onClose={closeError} />
//       )}

//       {successPopup.show && (
//         <SuccessPopup message={successPopup.message} onClose={closeSuccess} />
//       )}
//     </div>
//   );
// }
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
import { useState, useEffect, useRef } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "contexts/AuthContext";
import ErrorPopup from "../../components/errorPopup";
import SuccessPopup from "../../components/successPopup";
import throttle from "lodash/throttle";

api.defaults.withCredentials = true;

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dnmhfubvn/image/upload";
const UPLOAD_PRESET = "displaypicture";

export default function ProfileForm() {
  const router = useRouter();
  const { user, updateUser } = useAuth(); // ✅ Get updateUser from AuthContext

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [errorPopup, setErrorPopup] = useState({ show: false, message: "" });
  const [successPopup, setSuccessPopup] = useState({
    show: false,
    message: "",
  });
  const [suggestion, setSuggestion] = useState("");
  const maxWords = 100;
  const [bioWordCount, setBioWordCount] = useState(0);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const throttledFetchSuggestion = useRef(
    throttle(async (text) => {
      if (!text.trim()) {
        setSuggestion("");
        return;
      }
      try {
        const res = await api.post(`${BASE_URL}/api/suggest-bio`, { text });
        setSuggestion(res.data.suggestion || "");
      } catch (error) {
        setSuggestion("");
      }
    }, 2000)
  ).current;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        router.push("/signup");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (!parsedUser.emailVerified) {
        router.push("/signup");
        return;
      }

      if (parsedUser.profileCompleted) {
        router.push("/allservices");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        username: parsedUser.userName || "",
      }));

      setCheckingAuth(false);
    }
  }, [router]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
        <div className="flex flex-col items-center gap-4">
          <FaSpinner className="animate-spin text-green-600 text-4xl" />
          <p className="text-gray-600 font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  const showError = (msg) => {
    setErrorPopup({ show: true, message: msg });
  };

  const closeError = () => {
    setErrorPopup({ show: false, message: "" });
  };

  // ✅ FIXED: Update both localStorage AND AuthContext before redirecting
  const closeSuccess = () => {
    setSuccessPopup({ show: false, message: "" });

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const updatedUser = {
          ...parsedUser,
          profileCompleted: true,
        };

        console.log("✅ Updating user in closeSuccess:", updatedUser);

        // ✅ Update localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // ✅ Update AuthContext
        updateUser(updatedUser);
      }
    }

    // ✅ Small delay to ensure state updates
    setTimeout(() => {
      router.push("/allservices");
    }, 100);
  };

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      showError("Invalid file type. Please upload JPEG, PNG, GIF, or WebP");
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      showError("File size too large. Maximum 10MB allowed");
      return;
    }

    setImage(file);
  };

  const removeImage = () => {
    setImage(null);
    setImageUrl("");
    setFormData((prev) => ({ ...prev, profileImage: "" }));
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  };

  const uploadImage = async () => {
    if (!image) return showError("Please select an image!");

    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      setUploadingImage(true);

      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }

      const data = await response.json();
      const uploadedImageUrl = data.secure_url;

      console.log("✅ Image uploaded successfully:", uploadedImageUrl);

      setImageUrl(uploadedImageUrl);
      setFormData((prev) => ({ ...prev, profileImage: uploadedImageUrl }));
    } catch (error) {
      console.error("Upload failed:", error);
      showError(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

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
        setFormData((prev) => ({ ...prev, bio: res.data.suggestion }));
        setBioWordCount(countWords(res.data.suggestion));
        setSuggestion("");
        setShowAIPrompt(false);
        setAIPrompt("");
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
        setSuggestion("");
      }
    }
  };

  const acceptSuggestion = () => {
    const currentBio = formData.bio;
    if (suggestion.startsWith(currentBio)) {
      const acceptedPart = suggestion.slice(currentBio.length);
      setFormData((prev) => ({ ...prev, bio: currentBio + acceptedPart }));
      setSuggestion("");
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

  // ✅ FINAL FIXED handleSubmit
  const handleSubmit = async () => {
    const filteredSkills = formData.skills.filter(
      (skill) => skill.trim() !== ""
    );
    const rawContact = formData.contactNumber.trim();
    const fullContact = `+92${rawContact}`;

    const updatedData = {
      name: formData.name,
      city: formData.city,
      contactNumber: fullContact,
      bio: formData.bio,
      skills: filteredSkills,
      profileImage: formData.profileImage,
    };

    // Validation
    if (
      !updatedData.name ||
      !updatedData.city ||
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

      console.log("✅ Profile submission response:", response.data);

      // ✅ IMMEDIATE UPDATE: Update both localStorage AND AuthContext
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          const updatedUserData = {
            ...parsedUser,
            emailVerified: true,
            profileCompleted: true,
          };

          console.log("✅ Immediately updating user:", updatedUserData);

          // Update localStorage
          localStorage.setItem("user", JSON.stringify(updatedUserData));

          // Update AuthContext
          updateUser(updatedUserData);
        }
      }

      setSuccessPopup({ show: true, message: response.data.message });
    } catch (error) {
      console.error("❌ Profile submission error:", error);
      showError(error.response?.data?.message || "Error submitting profile");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 py-8 px-4 relative overflow-hidden">
      {/* ... rest of your JSX remains exactly the same ... */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
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
            partners
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-white/50 overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-8 py-10 border-b border-green-100">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative group">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-28 h-28 rounded-3xl object-cover border-4 border-white shadow-2xl"
                    />
                  ) : (
                    <div className="w-28 h-28 bg-gradient-to-br from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center border-4 border-white shadow-2xl">
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
                    Upload a clear photo of yourself
                  </p>

                  {image && !imageUrl && (
                    <div className="mt-2 flex items-center gap-2">
                      <p className="text-sm text-green-600 font-medium">
                        Selected: {image.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ({(image.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    </div>
                  )}

                  {imageUrl && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600 font-medium flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Image uploaded successfully!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {(image || imageUrl) && (
                  <button
                    type="button"
                    onClick={removeImage}
                    className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <FaTimes />
                    Remove Image
                  </button>
                )}

                <label className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all cursor-pointer text-center shadow-lg hover:scale-105">
                  <FaPlus className="inline mr-2" />
                  {image || imageUrl ? "Change File" : "Choose File"}
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>

                {image && !imageUrl && (
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={uploadImage}
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg hover:scale-105 disabled:opacity-50 ${
                      uploadingImage
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700"
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
                )}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-10">
            <div className="mb-8">
              <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                Username
              </label>
              <div className="relative">
                <FaUsers className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  className="w-full pl-12 pr-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl text-gray-600 font-semibold cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none"
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="Enter your city"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none"
                  onChange={handleChange}
                  value={formData.city}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Country
                </label>
                <input
                  type="text"
                  value="Pakistan"
                  className="w-full px-4 py-4 bg-gray-100 border-2 border-gray-200 rounded-2xl cursor-not-allowed"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Contact Number
                </label>
                <div className="flex">
                  <div className="flex items-center px-4 py-4 bg-gray-100 border-2 border-r-0 border-gray-200 rounded-l-2xl">
                    <span className="font-semibold text-gray-600">+92</span>
                  </div>
                  <input
                    type="text"
                    placeholder="3001234567"
                    maxLength={10}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-r-2xl focus:border-green-400 focus:outline-none"
                    onChange={(e) => {
                      const digitsOnly = e.target.value.replace(/\D/g, "");
                      setFormData({ ...formData, contactNumber: digitsOnly });
                    }}
                    value={formData.contactNumber}
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-bold text-gray-700">
                  Bio
                </label>
                <button
                  type="button"
                  onClick={() => setShowAIPrompt(!showAIPrompt)}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-full"
                >
                  <FaRobot className="animate-pulse" />
                  Ask AI
                </button>
              </div>

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
                      placeholder="Describe yourself..."
                      value={aiPrompt}
                      onChange={(e) => setAIPrompt(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:outline-none"
                    />
                    <button
                      onClick={generateBioFromPrompt}
                      disabled={loadingAI || !aiPrompt.trim()}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
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

              <textarea
                placeholder="Tell us about yourself..."
                className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none resize-none"
                onChange={handleBioChange}
                onKeyDown={(e) => {
                  if (e.key === "Tab" && suggestion) {
                    e.preventDefault();
                    acceptSuggestion();
                  }
                }}
                value={formData.bio}
                rows={6}
              />
              <p className="text-sm text-gray-500 mt-2">
                {bioWordCount}/{maxWords} words
              </p>
            </div>

            <div className="mb-10">
              <label className="block text-sm font-bold text-gray-700 mb-4">
                Your Skills
              </label>
              <div className="space-y-4">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={skill}
                      placeholder={`Skill ${index + 1}`}
                      className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-400 focus:outline-none"
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                    />
                    {formData.skills.length > 1 && (
                      <button
                        onClick={() => removeSkill(index)}
                        className="w-12 h-12 bg-red-500 text-white rounded-2xl hover:bg-red-600"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addSkill}
                className="mt-4 flex items-center gap-2 text-green-600 font-semibold bg-green-50 px-4 py-3 rounded-2xl hover:bg-green-100"
              >
                <FaPlus /> Add Another Skill
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-2xl disabled:opacity-50 flex items-center justify-center gap-3"
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
