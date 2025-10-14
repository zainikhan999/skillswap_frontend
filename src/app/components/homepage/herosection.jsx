// "use client";
// import Link from "next/link";
// import React from "react";
// import { FaUsers, FaUserPlus, FaStar, FaHeart } from "react-icons/fa";
// import { HiUsers } from "react-icons/hi";

// export default function HeroSection() {
//   return (
//     <section className="relative w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 opacity-10">
//         <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
//       </div>

//       {/* Floating Geometric Shapes */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none">
//         <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
//         <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
//         <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-600 rounded-full animate-bounce delay-1000"></div>
//       </div>

//       <div className="relative max-w-7xl mx-auto px-6 py-20">
//         <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
//           {/* Left: Enhanced Text content */}
//           <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left">
//             {/* Badge */}
//             <div className="inline-flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-green-100 text-green-700 rounded-full text-xs lg:text-sm font-medium border border-green-200">
//               <FaHeart className="text-green-600 w-4 h-4" />
//               <span className="hidden sm:inline">
//                 Pakistan&apos;s First AI-Powered Platform
//               </span>
//               <span className="sm:hidden">AI-Powered Platform</span>
//             </div>

//             {/* Main Heading */}
//             <div className="space-y-4">
//               <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
//                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
//                   Pakistan's
//                 </span>{" "}
//                 1st AI-Based
//                 <br />
//                 Skill Swapping Platform
//               </h1>

//               <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
//                 Trade your skills with passionate learners. Whether you&apos;re
//                 a developer learning art or a musician exploring coding—
//                 <span className="font-semibold text-green-600">
//                   {" "}
//                   SkillSwap connects you.
//                 </span>
//               </p>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4 lg:py-6">
//               <div className="text-center">
//                 <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">
//                   10K+
//                 </div>
//                 <div className="text-xs sm:text-sm text-gray-500 font-medium">
//                   Active Users
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">
//                   500+
//                 </div>
//                 <div className="text-xs sm:text-sm text-gray-500 font-medium">
//                   Skills Available
//                 </div>
//               </div>
//               <div className="text-center">
//                 <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-1">
//                   2K+
//                 </div>
//                 <div className="text-xs sm:text-sm text-gray-500 font-medium">
//                   Successful Swaps
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced CTA Buttons */}
//             {/* Navigation Links (under buttons) */}
//             <div className="flex gap-4 flex-wrap pt-4 justify-center lg:justify-start">
//               <Link href="/login">
//                 <button className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
//                   <FaUsers className="text-white" />
//                   Start Swappings
//                 </button>
//               </Link>
//               <Link href="/signup">
//                 <button className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
//                   <FaUserPlus className="text-white" />
//                   Join Now
//                 </button>
//               </Link>
//             </div>

//             {/* Trust Indicators */}
//             <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4 justify-center lg:justify-start">
//               <div className="flex -space-x-3">
//                 <img
//                   src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
//                   alt="User profile"
//                   className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
//                 />
//                 <img
//                   src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
//                   alt="User profile"
//                   className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
//                 />
//                 <img
//                   src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
//                   alt="User profile"
//                   className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
//                 />
//                 <img
//                   src="https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
//                   alt="User profile"
//                   className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
//                 />
//               </div>
//               <div className="flex items-center gap-2 text-center sm:text-left">
//                 <div className="flex gap-1">
//                   {[...Array(5)].map((_, i) => (
//                     <FaStar key={i} className="text-yellow-400 w-4 h-4" />
//                   ))}
//                 </div>
//                 <span className="text-xs sm:text-sm font-medium text-gray-700">
//                   4.9/5 from 3,000+ reviews
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Right: Enhanced Image Section */}
//           <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
//             {/* Main Image Container */}
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
//               <div className="relative bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
//                 <div className="w-full h-60 sm:h-72 lg:h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
//                   {/* Placeholder for your image */}
//                   <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-300 opacity-50"></div>
//                   <div className="relative z-10 text-center">
//                     <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
//                       <HiUsers className="text-green-600 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
//                     </div>
//                   </div>

//                   {/* Floating Elements */}
//                   <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full animate-bounce"></div>
//                   <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 bg-pink-400 rounded-full animate-bounce delay-300"></div>
//                 </div>
//               </div>
//             </div>

//             {/* Floating Cards */}
//             <div className="hidden sm:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl border border-gray-100 max-w-xs transform hover:scale-105 transition-transform duration-300">
//               <div className="flex items-center gap-2 lg:gap-3">
//                 <img
//                   src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
//                   alt="Ahmed's profile"
//                   className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="text-sm lg:text-base font-semibold text-gray-900">
//                     New Match!
//                   </p>
//                   <p className="text-xs lg:text-sm text-gray-500">
//                     Ahmed wants to learn coding
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="hidden sm:block absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl border border-gray-100 max-w-xs transform hover:scale-105 transition-transform duration-300">
//               <div className="flex items-center gap-2 lg:gap-3">
//                 <img
//                   src="https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
//                   alt="User profile"
//                   className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
//                 />
//                 <div>
//                   <p className="text-sm lg:text-base font-semibold text-gray-900">
//                     Skill Mastered!
//                   </p>
//                   <p className="text-xs lg:text-sm text-gray-500">
//                     Photography basics completed
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Wave */}
//       <div className="absolute bottom-0 left-0 right-0">
//         <svg
//           viewBox="0 0 1440 120"
//           className="w-full h-16 sm:h-20 lg:h-24 fill-white"
//         >
//           <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
//         </svg>
//       </div>
//     </section>
//   );
// }
"use client";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { FaUsers, FaUserPlus, FaStar, FaHeart } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-600 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          {/* Left: Enhanced Text content */}
          <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8 text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-green-100 text-green-700 rounded-full text-xs lg:text-sm font-medium border border-green-200">
              <FaHeart className="text-green-600 w-4 h-4" />
              <span className="hidden sm:inline">
                Pakistan&apos;s First AI-Powered Platform
              </span>
              <span className="sm:hidden">AI-Powered Platform</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                  Pakistan's
                </span>{" "}
                1st AI-Based
                <br />
                Skill Swapping Platform
              </h1>

              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                Trade your skills with passionate learners. Whether you&apos;re
                a developer learning art or a musician exploring coding—
                <span className="font-semibold text-green-600">
                  {" "}
                  SkillSwap connects you.
                </span>
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 py-4 lg:py-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                  10K+
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Active Users
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">
                  500+
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Skills Available
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-1">
                  2K+
                </div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium">
                  Successful Swaps
                </div>
              </div>
            </div>

            {/* Enhanced CTA Buttons */}
            {/* Navigation Links (under buttons) */}
            <div className="flex gap-4 flex-wrap pt-4 justify-center lg:justify-start">
              <Link href="/login">
                <button className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <FaUsers className="text-white" />
                  Start Swappings
                </button>
              </Link>
              <Link href="/signup">
                <button className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300">
                  <FaUserPlus className="text-white" />
                  Join Now
                </button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 pt-4 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                <img
                  src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
                />
                <img
                  src="https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full border-3 border-white object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-center sm:text-left">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 w-4 h-4" />
                  ))}
                </div>
                <span className="text-xs sm:text-sm font-medium text-gray-700">
                  4.9/5 from 3,000+ reviews
                </span>
              </div>
            </div>
          </div>

          {/* Right: Enhanced Image Section */}
          <div className="w-full lg:w-1/2 relative mt-8 lg:mt-0">
            {/* Main Image Container */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur-2xl opacity-20 transform rotate-6"></div>
              <div className="relative bg-white p-4 sm:p-6 lg:p-8 rounded-3xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="w-full h-60 sm:h-72 lg:h-80 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {/* Placeholder for your image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-200 to-emerald-300 opacity-50"></div>
                  <div className="relative z-10 text-center">
                    <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg p-4">
                      <Image
                        src="/skill_swap.png"
                        alt="SkillSwap Logo"
                        width={200}
                        height={200}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full animate-bounce"></div>
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-4 h-4 sm:w-6 sm:h-6 bg-pink-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            <div className="hidden sm:block absolute -top-4 -right-4 lg:-top-6 lg:-right-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl border border-gray-100 max-w-xs transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <img
                  src="https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="Ahmed's profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm lg:text-base font-semibold text-gray-900">
                    New Match!
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Ahmed wants to learn coding
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:block absolute -bottom-4 -left-4 lg:-bottom-6 lg:-left-6 bg-white rounded-2xl p-3 lg:p-4 shadow-xl border border-gray-100 max-w-xs transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-2 lg:gap-3">
                <img
                  src="https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                  alt="User profile"
                  className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm lg:text-base font-semibold text-gray-900">
                    Skill Mastered!
                  </p>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Photography basics completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          className="w-full h-16 sm:h-20 lg:h-24 fill-white"
        >
          <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}
