// "use client";
// import { useEffect, useState, useRef } from "react";
// import api from "../../utils/api";
// import { useRouter } from "next/navigation";
// import { useAuth } from "../../contexts/AuthContext";
// import Link from "next/link";
// import {
//   IoAddCircleSharp,
//   IoCheckmarkCircle,
//   IoTime,
//   IoSwapHorizontal,
//   IoCloseCircle,
//   IoChatbubbleEllipses,
//   IoCalendarOutline,
//   IoPersonOutline,
//   IoTrendingUp,
// } from "react-icons/io5";
// import {
//   FaExchangeAlt,
//   FaClock,
//   FaCheck,
//   FaTimesCircle,
//   FaHourglassHalf,
//   FaComments,
//   FaInfoCircle,
//   FaStar,
//   FaUsers,
//   FaHeart,
//   FaRocket,
//   FaChartLine,
//   FaSpinner,
//   FaArrowUp,
//   FaTrophy,
//   FaPlus,
// } from "react-icons/fa";

// api.defaults.withCredentials = true;
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
// export default function SwapDashboard() {
//   const [swaps, setSwaps] = useState([]);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState("");
//   const [activeFilter, setActiveFilter] = useState("all");
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     accepted: 0,
//     partiallyCompleted: 0,
//     completed: 0,
//     cancelled: 0,
//   });
//   const router = useRouter();

//   const { user, loading: authLoading } = useAuth();
//   const isRedirecting = useRef(false);
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
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setCurrentUser(parsedUser.userName || "");
//       } catch (error) {
//         console.error("Error parsing stored user:", error);
//         setErrorMessage("Error loading user data");
//       }
//     } else {
//       setLoading(false);
//       return;

//       // setErrorMessage("User not logged in");
//     }
//   }, []);

//   useEffect(() => {
//     if (!currentUser) return;
//     fetchSwaps();
//   }, [currentUser]);

//   const fetchSwaps = async () => {
//     try {
//       setLoading(true);
//       const response = await api.get(`${BASE_URL}/api/swaps`, {
//         withCredentials: true,
//       });

//       if (response.data.swaps) {
//         const swapData = response.data.swaps;
//         setSwaps(swapData);

//         const newStats = {
//           total: swapData.length,
//           pending: swapData.filter((s) => s.status === "pending").length,
//           accepted: swapData.filter((s) => s.status === "accepted").length,
//           partiallyCompleted: swapData.filter(
//             (s) => s.status === "partially_completed"
//           ).length,
//           completed: swapData.filter((s) => s.status === "completed").length,
//           cancelled: swapData.filter((s) => s.status === "cancelled").length,
//         };
//         setStats(newStats);
//       }
//     } catch (error) {
//       console.error("Error fetching swaps:", error);
//       setErrorMessage("Failed to fetch swaps");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <FaClock className="text-yellow-500 animate-pulse" />;
//       case "accepted":
//         return <FaExchangeAlt className="text-blue-500 animate-bounce" />;
//       case "partially_completed":
//         return <FaHourglassHalf className="text-orange-500 animate-pulse" />;
//       case "completed":
//         return <FaCheck className="text-green-500 animate-bounce" />;
//       case "cancelled":
//         return <FaTimesCircle className="text-red-500" />;
//       default:
//         return <FaInfoCircle className="text-gray-500" />;
//     }
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
//       case "accepted":
//         return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
//       case "partially_completed":
//         return "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200";
//       case "completed":
//         return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
//       case "cancelled":
//         return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200";
//     }
//   };

//   const getStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "Pending Response";
//       case "accepted":
//         return "In Progress";
//       case "partially_completed":
//         return "Partially Complete";
//       case "completed":
//         return "Completed";
//       case "cancelled":
//         return "Cancelled";
//       default:
//         return status;
//     }
//   };

//   const filteredSwaps = swaps.filter((swap) => {
//     if (activeFilter === "all") return true;
//     return swap.status === activeFilter;
//   });

//   const handleChatNavigation = (swap) => {
//     const otherUser =
//       swap.requester.userId.userName === currentUser
//         ? swap.responder.userId?.userName
//         : swap.requester.userId.userName;

//     if (otherUser) {
//       window.location.href = `/messages?recipient=${otherUser}`;
//     }
//   };

//   const StatCard = ({
//     icon,
//     title,
//     value,
//     color,
//     isActive,
//     onClick,
//     trend,
//   }) => (
//     <div
//       className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-rotate-1 relative overflow-hidden ${
//         isActive
//           ? `${color} shadow-2xl text-white`
//           : "bg-white/95 backdrop-blur-sm border border-white/50 hover:shadow-xl text-gray-700"
//       }`}
//       onClick={onClick}
//     >
//       {/* Animated background pattern */}
//       {isActive && (
//         <div className="absolute inset-0 opacity-20">
//           <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full blur-2xl animate-pulse"></div>
//           <div className="absolute bottom-2 left-2 w-12 h-12 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
//         </div>
//       )}

//       <div className="relative flex items-center gap-4">
//         <div
//           className={`text-3xl p-3 rounded-2xl ${
//             isActive
//               ? "bg-white/20"
//               : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
//           }`}
//         >
//           {icon}
//         </div>
//         <div className="flex-1">
//           <p
//             className={`text-sm font-semibold uppercase tracking-wide ${
//               isActive ? "text-white/90" : "text-gray-600"
//             }`}
//           >
//             {title}
//           </p>
//           <div className="flex items-center gap-2">
//             <p
//               className={`text-3xl font-bold ${
//                 isActive ? "text-white" : "text-gray-900"
//               }`}
//             >
//               {value}
//             </p>
//             {trend && (
//               <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
//                 <FaArrowUp className="text-xs" />
//                 <span>{trend}</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex justify-center items-center relative overflow-hidden">
//         {/* Animated background */}
//         <div className="absolute inset-0 opacity-5 pointer-events-none">
//           <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
//           <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         </div>

//         <div className="text-center">
//           <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
//             <FaSpinner className="text-white text-3xl animate-spin" />
//           </div>
//           <h3 className="text-2xl font-bold text-gray-800 mb-2">
//             Loading Your Swaps
//           </h3>
//           <p className="text-gray-600">
//             Please wait while we fetch your data...
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
//       {/* Animated Background Elements - Matching homepage */}
//       <div className="absolute inset-0 opacity-5 pointer-events-none">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       {/* Floating Geometric Shapes - Matching homepage */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
//         <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
//         <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-600 rounded-full animate-bounce delay-1000"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto p-6">
//         {/* Enhanced Header */}
//         <div className="text-center mb-12">
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 mb-6">
//             <FaRocket className="text-green-600 w-4 h-4 animate-bounce" />
//             Your Skill Journey
//           </div>
//           <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
//             Swap{" "}
//             <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
//               Dashboard
//             </span>
//           </h1>
//           <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
//             Track your skill exchanges, manage active swaps, and celebrate your
//             learning achievements.
//           </p>
//         </div>

//         {/* Error Message */}
//         {errorMessage && (
//           <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 rounded-3xl shadow-lg">
//             <div className="flex items-center gap-3">
//               <FaTimesCircle className="text-2xl text-red-500" />
//               <div>
//                 <h3 className="font-bold text-lg">Error</h3>
//                 <p>{errorMessage}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Enhanced Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
//           <StatCard
//             icon={<FaExchangeAlt />}
//             title="Total Swaps"
//             value={stats.total}
//             color="bg-gradient-to-br from-purple-500 to-indigo-600"
//             isActive={activeFilter === "all"}
//             onClick={() => setActiveFilter("all")}
//             trend="+12%"
//           />
//           <StatCard
//             icon={<FaClock />}
//             title="Pending"
//             value={stats.pending}
//             color="bg-gradient-to-br from-yellow-500 to-orange-600"
//             isActive={activeFilter === "pending"}
//             onClick={() => setActiveFilter("pending")}
//           />
//           <StatCard
//             icon={<IoSwapHorizontal />}
//             title="Active"
//             value={stats.accepted}
//             color="bg-gradient-to-br from-blue-500 to-cyan-600"
//             isActive={activeFilter === "accepted"}
//             onClick={() => setActiveFilter("accepted")}
//           />
//           <StatCard
//             icon={<FaHourglassHalf />}
//             title="Partial"
//             value={stats.partiallyCompleted}
//             color="bg-gradient-to-br from-orange-500 to-red-600"
//             isActive={activeFilter === "partially_completed"}
//             onClick={() => setActiveFilter("partially_completed")}
//           />
//           <StatCard
//             icon={<FaTrophy />}
//             title="Completed"
//             value={stats.completed}
//             color="bg-gradient-to-br from-green-500 to-emerald-600"
//             isActive={activeFilter === "completed"}
//             onClick={() => setActiveFilter("completed")}
//             trend="+8%"
//           />
//           <StatCard
//             icon={<FaTimesCircle />}
//             title="Cancelled"
//             value={stats.cancelled}
//             color="bg-gradient-to-br from-red-500 to-pink-600"
//             isActive={activeFilter === "cancelled"}
//             onClick={() => setActiveFilter("cancelled")}
//           />
//         </div>

//         {/* Enhanced Swap List */}
//         <div className="space-y-6">
//           {filteredSwaps.length === 0 ? (
//             <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
//               <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
//                 <FaExchangeAlt className="text-emerald-500 text-4xl" />
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">
//                 {activeFilter === "all"
//                   ? "No swaps yet"
//                   : `No ${activeFilter} swaps`}
//               </h3>
//               <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
//                 {activeFilter === "all"
//                   ? "Start your skill swapping journey today and connect with amazing people!"
//                   : `You don&apos;t have any ${activeFilter} swaps at the moment`}
//               </p>
//               <Link href="/services">
//                 <button
//                   // onClick={() => (window.location.href = "/services")}
//                   className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-3 mx-auto"
//                 >
//                   <FaRocket />
//                   Start Your First Swap
//                 </button>
//               </Link>
//             </div>
//           ) : (
//             filteredSwaps.map((swap) => {
//               const isRequester =
//                 swap.requester.userId.userName === currentUser;
//               const otherUser = isRequester
//                 ? swap.responder.userId
//                 : swap.requester.userId;
//               const myTask = isRequester ? swap.requester : swap.responder;
//               const theirTask = isRequester ? swap.responder : swap.requester;

//               return (
//                 <div
//                   key={swap._id}
//                   className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
//                 >
//                   {/* Enhanced Header */}
//                   <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 border-b border-green-100">
//                     <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//                       <div className="flex items-center gap-6">
//                         <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
//                           {getStatusIcon(swap.status)}
//                         </div>
//                         <div>
//                           <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                             Skill Swap with{" "}
//                             {otherUser?.userName || "Unknown User"}
//                           </h3>
//                           <div className="flex items-center gap-4 text-sm text-gray-600">
//                             <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
//                               <FaInfoCircle />
//                               <span className="font-medium">
//                                 ID: {swap.swapId}
//                               </span>
//                             </div>
//                             <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
//                               <IoCalendarOutline />
//                               <span className="font-medium">
//                                 Created{" "}
//                                 {new Date(swap.createdAt).toLocaleDateString()}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <span
//                           className={`px-4 py-2 rounded-2xl text-sm font-bold border shadow-lg ${getStatusColor(
//                             swap.status
//                           )}`}
//                         >
//                           {getStatusText(swap.status)}
//                         </span>
//                         {(swap.status === "accepted" ||
//                           swap.status === "partially_completed") && (
//                           <button
//                             onClick={() => handleChatNavigation(swap)}
//                             className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:scale-105"
//                           >
//                             <FaComments />
//                             Chat Now
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Enhanced Swap Details */}
//                   <div className="p-8">
//                     <div className="grid md:grid-cols-2 gap-8">
//                       {/* My Task */}
//                       <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
//                           <h4 className="font-bold text-blue-900 text-lg">
//                             {isRequester
//                               ? "Your Requested Task"
//                               : "Your Offered Task"}
//                           </h4>
//                         </div>
//                         <div className="space-y-4">
//                           <div>
//                             <h5 className="font-bold text-xl text-gray-900 mb-2">
//                               {myTask.taskName}
//                             </h5>
//                             <p className="text-gray-700 leading-relaxed">
//                               {myTask.description}
//                             </p>
//                           </div>
//                           <div className="flex flex-wrap items-center gap-3">
//                             <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-blue-700">
//                               <FaClock />
//                               {myTask.timeRequired} hours
//                             </span>
//                             <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-blue-700">
//                               <IoCalendarOutline />
//                               Due:{" "}
//                               {new Date(myTask.deadline).toLocaleDateString()}
//                             </span>
//                           </div>
//                           {swap.status === "partially_completed" &&
//                             myTask.completedAt && (
//                               <div className="bg-green-100 border-2 border-green-200 rounded-xl p-3">
//                                 <div className="flex items-center gap-2 text-green-800">
//                                   <FaCheck className="animate-bounce" />
//                                   <span className="font-bold">
//                                     Completed on{" "}
//                                     {new Date(
//                                       myTask.completedAt
//                                     ).toLocaleDateString()}
//                                   </span>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       </div>

//                       {/* Their Task */}
//                       <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
//                         <div className="flex items-center gap-3 mb-4">
//                           <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
//                           <h4 className="font-bold text-green-900 text-lg">
//                             {isRequester
//                               ? "Their Offered Task"
//                               : "Their Requested Task"}
//                           </h4>
//                         </div>
//                         <div className="space-y-4">
//                           <div>
//                             <h5 className="font-bold text-xl text-gray-900 mb-2">
//                               {theirTask.taskName || "Awaiting Response..."}
//                             </h5>
//                             <p className="text-gray-700 leading-relaxed">
//                               {theirTask.description ||
//                                 "Waiting for their task details to be provided"}
//                             </p>
//                           </div>
//                           {theirTask.timeRequired && theirTask.deadline && (
//                             <div className="flex flex-wrap items-center gap-3">
//                               <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-green-700">
//                                 <FaClock />
//                                 {theirTask.timeRequired} hours
//                               </span>
//                               <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-green-700">
//                                 <IoCalendarOutline />
//                                 Due:{" "}
//                                 {new Date(
//                                   theirTask.deadline
//                                 ).toLocaleDateString()}
//                               </span>
//                             </div>
//                           )}
//                           {swap.status === "partially_completed" &&
//                             theirTask.completedAt && (
//                               <div className="bg-green-100 border-2 border-green-200 rounded-xl p-3">
//                                 <div className="flex items-center gap-2 text-green-800">
//                                   <FaCheck className="animate-bounce" />
//                                   <span className="font-bold">
//                                     Completed on{" "}
//                                     {new Date(
//                                       theirTask.completedAt
//                                     ).toLocaleDateString()}
//                                   </span>
//                                 </div>
//                               </div>
//                             )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Enhanced Progress Indicators */}
//                     {swap.status === "partially_completed" && (
//                       <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl shadow-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
//                             <FaHourglassHalf className="text-orange-500 text-xl animate-pulse" />
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-orange-800 text-lg mb-1">
//                               Partial Completion Status
//                             </h4>
//                             <div className="text-orange-700 space-y-1">
//                               {/* Check completion status based on current user's role */}
//                               {isRequester ? (
//                                 <>
//                                   {swap.requesterCompleted && (
//                                     <div>✓ You completed your part</div>
//                                   )}
//                                   {swap.responderCompleted && (
//                                     <div>✓ They completed their part</div>
//                                   )}
//                                 </>
//                               ) : (
//                                 <>
//                                   {swap.responderCompleted && (
//                                     <div>✓ You completed your part</div>
//                                   )}
//                                   {swap.requesterCompleted && (
//                                     <div>✓ They completed their part</div>
//                                   )}
//                                 </>
//                               )}

//                               {/* Show completion message */}
//                               {swap.requesterCompleted &&
//                                 swap.responderCompleted && (
//                                   <div className="font-semibold text-green-700 mt-2">
//                                     🎉 Both parties completed their tasks!
//                                   </div>
//                                 )}
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     )}

//                     {swap.status === "completed" && swap.fullyCompletedAt && (
//                       <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
//                             <FaTrophy className="text-green-500 text-xl animate-bounce" />
//                           </div>
//                           <div>
//                             <h4 className="font-bold text-green-800 text-lg mb-1">
//                               Swap Successfully Completed!
//                             </h4>
//                             <p className="text-green-700">
//                               Completed on{" "}
//                               {new Date(
//                                 swap.fullyCompletedAt
//                               ).toLocaleDateString()}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>

//         {/* Enhanced Floating Add Button */}
//         <div className="fixed bottom-8 right-8 z-50">
//           <Link href="/services">
//             <button
//               className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-3xl shadow-2xl hover:shadow-green-300/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
//               title="Create New Swap"
//             >
//               <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//               <IoAddCircleSharp className="text-4xl relative z-10" />
//             </button>
//           </Link>
//         </div>

//         {/* Trust Indicators */}
//         <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-gray-200">
//           <div className="flex -space-x-2">
//             <img
//               src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
//               alt="User"
//               className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
//             />
//             <img
//               src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
//               alt="User"
//               className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
//             />
//             <img
//               src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
//               alt="User"
//               className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
//             />
//           </div>
//           <div className="flex items-center gap-1">
//             {[...Array(5)].map((_, i) => (
//               <FaStar key={i} className="text-yellow-400 text-lg" />
//             ))}
//           </div>
//           <span className="text-sm text-gray-600 font-medium">
//             Join 15K+ successful skill swappers
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import {
  IoAddCircleSharp,
  IoCheckmarkCircle,
  IoTime,
  IoSwapHorizontal,
  IoCloseCircle,
  IoChatbubbleEllipses,
  IoCalendarOutline,
  IoPersonOutline,
  IoTrendingUp,
} from "react-icons/io5";
import {
  FaExchangeAlt,
  FaClock,
  FaCheck,
  FaTimesCircle,
  FaHourglassHalf,
  FaComments,
  FaInfoCircle,
  FaStar,
  FaUsers,
  FaHeart,
  FaRocket,
  FaChartLine,
  FaSpinner,
  FaArrowUp,
  FaTrophy,
  FaPlus,
} from "react-icons/fa";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
export default function SwapDashboard() {
  const [swaps, setSwaps] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    partiallyCompleted: 0,
    completed: 0,
    cancelled: 0,
  });
  const router = useRouter();

  const { user } = useAuth();
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser.userName || "");
      } catch (error) {
        console.error("Error parsing stored user:", error);
        setErrorMessage("Error loading user data");
      }
    } else {
      setLoading(false);
      return;

      // setErrorMessage("User not logged in");
    }
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    fetchSwaps();
  }, [currentUser]);

  const fetchSwaps = async () => {
    try {
      setLoading(true);
      const response = await api.get(`${BASE_URL}/api/swaps`, {
        withCredentials: true,
      });

      if (response.data.swaps) {
        const swapData = response.data.swaps;
        setSwaps(swapData);

        const newStats = {
          total: swapData.length,
          pending: swapData.filter((s) => s.status === "pending").length,
          accepted: swapData.filter((s) => s.status === "accepted").length,
          partiallyCompleted: swapData.filter(
            (s) => s.status === "partially_completed"
          ).length,
          completed: swapData.filter((s) => s.status === "completed").length,
          cancelled: swapData.filter((s) => s.status === "cancelled").length,
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error("Error fetching swaps:", error);
      setErrorMessage("Failed to fetch swaps");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-yellow-500 animate-pulse" />;
      case "accepted":
        return <FaExchangeAlt className="text-blue-500 animate-bounce" />;
      case "partially_completed":
        return <FaHourglassHalf className="text-orange-500 animate-pulse" />;
      case "completed":
        return <FaCheck className="text-green-500 animate-bounce" />;
      case "cancelled":
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-200";
      case "accepted":
        return "bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-blue-200";
      case "partially_completed":
        return "bg-gradient-to-r from-orange-100 to-red-100 text-orange-800 border-orange-200";
      case "completed":
        return "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Response";
      case "accepted":
        return "In Progress";
      case "partially_completed":
        return "Partially Complete";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const filteredSwaps = swaps.filter((swap) => {
    if (activeFilter === "all") return true;
    return swap.status === activeFilter;
  });

  const handleChatNavigation = (swap) => {
    const otherUser =
      swap.requester.userId.userName === currentUser
        ? swap.responder.userId?.userName
        : swap.requester.userId.userName;

    if (otherUser) {
      window.location.href = `/messages?recipient=${otherUser}`;
    }
  };

  const StatCard = ({
    icon,
    title,
    value,
    color,
    isActive,
    onClick,
    trend,
  }) => (
    <div
      className={`p-6 rounded-3xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:-rotate-1 relative overflow-hidden ${
        isActive
          ? `${color} shadow-2xl text-white`
          : "bg-white/95 backdrop-blur-sm border border-white/50 hover:shadow-xl text-gray-700"
      }`}
      onClick={onClick}
    >
      {/* Animated background pattern */}
      {isActive && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-2 right-2 w-16 h-16 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-white rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
      )}

      <div className="relative flex items-center gap-4">
        <div
          className={`text-3xl p-3 rounded-2xl ${
            isActive
              ? "bg-white/20"
              : "bg-gradient-to-br from-emerald-100 to-green-100 text-emerald-600"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <p
            className={`text-sm font-semibold uppercase tracking-wide ${
              isActive ? "text-white/90" : "text-gray-600"
            }`}
          >
            {title}
          </p>
          <div className="flex items-center gap-2">
            <p
              className={`text-3xl font-bold ${
                isActive ? "text-white" : "text-gray-900"
              }`}
            >
              {value}
            </p>
            {trend && (
              <div className="flex items-center gap-1 text-xs bg-white/20 px-2 py-1 rounded-full">
                <FaArrowUp className="text-xs" />
                <span>{trend}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex justify-center items-center relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-400 to-green-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <FaSpinner className="text-white text-3xl animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            Loading Your Swaps
          </h3>
          <p className="text-gray-600">
            Please wait while we fetch your data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Animated Background Elements - Matching homepage */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Geometric Shapes - Matching homepage */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-600 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 mb-6">
            <FaRocket className="text-green-600 w-4 h-4 animate-bounce" />
            Your Skill Journey
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
            Swap{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Dashboard
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Track your skill exchanges, manage active swaps, and celebrate your
            learning achievements.
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 text-red-800 rounded-3xl shadow-lg">
            <div className="flex items-center gap-3">
              <FaTimesCircle className="text-2xl text-red-500" />
              <div>
                <h3 className="font-bold text-lg">Error</h3>
                <p>{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-12">
          <StatCard
            icon={<FaExchangeAlt />}
            title="Total Swaps"
            value={stats.total}
            color="bg-gradient-to-br from-purple-500 to-indigo-600"
            isActive={activeFilter === "all"}
            onClick={() => setActiveFilter("all")}
            trend="+12%"
          />
          <StatCard
            icon={<FaClock />}
            title="Pending"
            value={stats.pending}
            color="bg-gradient-to-br from-yellow-500 to-orange-600"
            isActive={activeFilter === "pending"}
            onClick={() => setActiveFilter("pending")}
          />
          <StatCard
            icon={<IoSwapHorizontal />}
            title="Active"
            value={stats.accepted}
            color="bg-gradient-to-br from-blue-500 to-cyan-600"
            isActive={activeFilter === "accepted"}
            onClick={() => setActiveFilter("accepted")}
          />
          <StatCard
            icon={<FaHourglassHalf />}
            title="Partial"
            value={stats.partiallyCompleted}
            color="bg-gradient-to-br from-orange-500 to-red-600"
            isActive={activeFilter === "partially_completed"}
            onClick={() => setActiveFilter("partially_completed")}
          />
          <StatCard
            icon={<FaTrophy />}
            title="Completed"
            value={stats.completed}
            color="bg-gradient-to-br from-green-500 to-emerald-600"
            isActive={activeFilter === "completed"}
            onClick={() => setActiveFilter("completed")}
            trend="+8%"
          />
          <StatCard
            icon={<FaTimesCircle />}
            title="Cancelled"
            value={stats.cancelled}
            color="bg-gradient-to-br from-red-500 to-pink-600"
            isActive={activeFilter === "cancelled"}
            onClick={() => setActiveFilter("cancelled")}
          />
        </div>

        {/* Enhanced Swap List */}
        <div className="space-y-6">
          {filteredSwaps.length === 0 ? (
            <div className="text-center py-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50">
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-green-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaExchangeAlt className="text-emerald-500 text-4xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {activeFilter === "all"
                  ? "No swaps yet"
                  : `No ${activeFilter} swaps`}
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                {activeFilter === "all"
                  ? "Start your skill swapping journey today and connect with amazing people!"
                  : `You don't have any ${activeFilter} swaps at the moment`}
              </p>
              <button
                onClick={() => (window.location.href = "/services")}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-xl hover:scale-105 flex items-center gap-3 mx-auto"
              >
                <FaRocket />
                Start Your First Swap
              </button>
            </div>
          ) : (
            filteredSwaps.map((swap) => {
              const isRequester =
                swap.requester.userId.userName === currentUser;
              const otherUser = isRequester
                ? swap.responder.userId
                : swap.requester.userId;
              const myTask = isRequester ? swap.requester : swap.responder;
              const theirTask = isRequester ? swap.responder : swap.requester;

              return (
                <div
                  key={swap._id}
                  className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
                >
                  {/* Enhanced Header */}
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-8 border-b border-green-100">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                          {getStatusIcon(swap.status)}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2">
                            Skill Swap with{" "}
                            {otherUser?.userName || "Unknown User"}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                              <FaInfoCircle />
                              <span className="font-medium">
                                ID: {swap.swapId}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/60 px-3 py-1 rounded-full">
                              <IoCalendarOutline />
                              <span className="font-medium">
                                Created{" "}
                                {new Date(swap.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold border shadow-lg ${getStatusColor(
                            swap.status
                          )}`}
                        >
                          {getStatusText(swap.status)}
                        </span>
                        {(swap.status === "accepted" ||
                          swap.status === "partially_completed") && (
                          <button
                            onClick={() => handleChatNavigation(swap)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg hover:scale-105"
                          >
                            <FaComments />
                            Chat Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Swap Details */}
                  <div className="p-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      {/* My Task */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-blue-900 text-lg">
                            {isRequester
                              ? "Your Requested Task"
                              : "Your Offered Task"}
                          </h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-bold text-xl text-gray-900 mb-2">
                              {myTask.taskName}
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {myTask.description}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-blue-700">
                              <FaClock />
                              {myTask.timeRequired} hours
                            </span>
                            <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-blue-700">
                              <IoCalendarOutline />
                              Due:{" "}
                              {new Date(myTask.deadline).toLocaleDateString()}
                            </span>
                          </div>
                          {swap.status === "partially_completed" &&
                            myTask.completedAt && (
                              <div className="bg-green-100 border-2 border-green-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-green-800">
                                  <FaCheck className="animate-bounce" />
                                  <span className="font-bold">
                                    Completed on{" "}
                                    {new Date(
                                      myTask.completedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>

                      {/* Their Task */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-100 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-pulse"></div>
                          <h4 className="font-bold text-green-900 text-lg">
                            {isRequester
                              ? "Their Offered Task"
                              : "Their Requested Task"}
                          </h4>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h5 className="font-bold text-xl text-gray-900 mb-2">
                              {theirTask.taskName || "Awaiting Response..."}
                            </h5>
                            <p className="text-gray-700 leading-relaxed">
                              {theirTask.description ||
                                "Waiting for their task details to be provided"}
                            </p>
                          </div>
                          {theirTask.timeRequired && theirTask.deadline && (
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-green-700">
                                <FaClock />
                                {theirTask.timeRequired} hours
                              </span>
                              <span className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-full text-sm font-semibold text-green-700">
                                <IoCalendarOutline />
                                Due:{" "}
                                {new Date(
                                  theirTask.deadline
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          {swap.status === "partially_completed" &&
                            theirTask.completedAt && (
                              <div className="bg-green-100 border-2 border-green-200 rounded-xl p-3">
                                <div className="flex items-center gap-2 text-green-800">
                                  <FaCheck className="animate-bounce" />
                                  <span className="font-bold">
                                    Completed on{" "}
                                    {new Date(
                                      theirTask.completedAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Progress Indicators */}
                    {swap.status === "partially_completed" && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                            <FaHourglassHalf className="text-orange-500 text-xl animate-pulse" />
                          </div>
                          <div>
                            <h4 className="font-bold text-orange-800 text-lg mb-1">
                              Partial Completion Status
                            </h4>
                            <div className="text-orange-700 space-y-1">
                              {/* Check completion status based on current user's role */}
                              {isRequester ? (
                                <>
                                  {swap.requesterCompleted && (
                                    <div>✓ You completed your part</div>
                                  )}
                                  {swap.responderCompleted && (
                                    <div>✓ They completed their part</div>
                                  )}
                                </>
                              ) : (
                                <>
                                  {swap.responderCompleted && (
                                    <div>✓ You completed your part</div>
                                  )}
                                  {swap.requesterCompleted && (
                                    <div>✓ They completed their part</div>
                                  )}
                                </>
                              )}

                              {/* Show completion message */}
                              {swap.requesterCompleted &&
                                swap.responderCompleted && (
                                  <div className="font-semibold text-green-700 mt-2">
                                    🎉 Both parties completed their tasks!
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {swap.status === "completed" && swap.fullyCompletedAt && (
                      <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl shadow-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                            <FaTrophy className="text-green-500 text-xl animate-bounce" />
                          </div>
                          <div>
                            <h4 className="font-bold text-green-800 text-lg mb-1">
                              Swap Successfully Completed!
                            </h4>
                            <p className="text-green-700">
                              Completed on{" "}
                              {new Date(
                                swap.fullyCompletedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Enhanced Floating Add Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button
            onClick={() => (window.location.href = "/services")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white p-6 rounded-3xl shadow-2xl hover:shadow-green-300/50 transform hover:scale-110 transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
            title="Create New Swap"
          >
            <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <IoAddCircleSharp className="text-4xl relative z-10" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <FaPlus className="text-white text-xs" />
            </div>
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="flex items-center justify-center gap-4 mt-16 pt-8 border-t border-gray-200">
          <div className="flex -space-x-2">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
              alt="User"
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
            />
            <img
              src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
              alt="User"
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
            />
            <img
              src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&fit=crop&crop=face"
              alt="User"
              className="w-12 h-12 rounded-full border-3 border-white shadow-lg"
            />
          </div>
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400 text-lg" />
            ))}
          </div>
          <span className="text-sm text-gray-600 font-medium">
            Join 15K+ successful skill swappers
          </span>
        </div>
      </div>
    </div>
  );
}
