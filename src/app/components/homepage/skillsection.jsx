"use client";

import React from "react";
import Slider from "react-slick";
import {
  FaLaptopCode,
  FaPaintBrush,
  FaLanguage,
  FaMicrophoneAlt,
  FaChartLine,
  FaUtensils,
  FaSpa,
  FaPenFancy,
  FaStar,
  FaUsers,
  FaArrowLeft,
  FaArrowRight,
  FaHeart,
} from "react-icons/fa";

// Importing slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const skills = [
  {
    icon: <FaLaptopCode className="w-12 h-12" />,
    label: "Web Development",
    color: "from-green-400 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    count: "2.5K+",
    trending: true,
  },
  {
    icon: <FaPaintBrush className="w-12 h-12" />,
    label: "Graphic Design",
    color: "from-pink-400 to-rose-500",
    bgColor: "bg-pink-50",
    textColor: "text-pink-600",
    count: "1.8K+",
    trending: false,
  },
  {
    icon: <FaLanguage className="w-12 h-12" />,
    label: "Language Exchange",
    color: "from-blue-400 to-indigo-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    count: "3.2K+",
    trending: true,
  },
  {
    icon: <FaMicrophoneAlt className="w-12 h-12" />,
    label: "Voice & Video",
    color: "from-purple-400 to-violet-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    count: "950+",
    trending: false,
  },
  {
    icon: <FaChartLine className="w-12 h-12" />,
    label: "Marketing Tips",
    color: "from-orange-400 to-amber-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    count: "1.4K+ ",
    trending: true,
  },
  {
    icon: <FaUtensils className="w-12 h-12" />,
    label: "Cooking Skills",
    color: "from-red-400 to-pink-500",
    bgColor: "bg-red-50",
    textColor: "text-red-600",
    count: "2.1K+",
    trending: false,
  },
  {
    icon: <FaSpa className="w-12 h-12" />,
    label: "Wellness & Yoga",
    color: "from-teal-400 to-cyan-500",
    bgColor: "bg-teal-50",
    textColor: "text-teal-600",
    count: "1.6K+",
    trending: true,
  },
  {
    icon: <FaPenFancy className="w-12 h-12" />,
    label: "Writing & Editing",
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    count: "1.2K+ ",
    trending: false,
  },
];

// Custom arrow components
const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute z-30 left-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <FaArrowLeft className="text-green-600 w-5 h-5" />
    </div>
  );
};

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div
      className="absolute z-30 right-0 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      <FaArrowRight className="text-green-600 w-5 h-5" />
    </div>
  );
};

export default function PopularSkillsSection() {
  // Slider settings for slick carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
    ],
  };

  return (
    <section className="relative w-full bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Animated Background Elements - matching hero */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-emerald-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-300 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Geometric Shapes - matching hero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-green-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-green-600 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-green-300 rounded-full animate-bounce delay-1500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-20">
        {/* Header Section - matching hero style */}
        <div className="text-center mb-16 space-y-6">
          {/* Badge - matching hero style */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200">
            <FaUsers className="text-green-600 w-4 h-4" />
            Most Popular Skills
          </div>

          {/* Main Heading - matching hero typography */}
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Popular Skills People Are{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Swapping
              </span>
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              From tech to arts, language to lifestyle—SkillSwap lets you
              exchange any skill with anyone, anywhere.
              <span className="font-semibold text-green-600">
                {" "}
                Join the learning revolution!
              </span>
            </p>
          </div>

          {/* Stats - matching hero style */}
          <div className="grid grid-cols-3 gap-6 py-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-green-600 mb-1">
                50+
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Skill Categories
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-emerald-600 mb-1">
                15K+
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Active Learners
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-green-700 mb-1">
                98%
              </div>
              <div className="text-sm text-gray-500 font-medium">
                Success Rate
              </div>
            </div>
          </div>
        </div>

        {/* Skills Carousel */}
        <div className="relative">
          <Slider {...settings}>
            {skills.map((skill, index) => (
              <div key={index} className="px-3">
                <div className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-rotate-1 p-8 border border-gray-100">
                  {/* Trending Badge */}
                  {skill.trending && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🔥 Trending
                    </div>
                  )}

                  {/* Icon Container */}
                  <div
                    className={`relative mb-6 ${skill.bgColor} rounded-2xl p-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-20 rounded-2xl`}
                    ></div>
                    <div
                      className={`relative ${skill.textColor} flex justify-center`}
                    >
                      {skill.icon}
                    </div>

                    {/* Floating elements on icon */}
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <FaStar className="w-3 h-3 text-yellow-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 text-center">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                      {skill.label}
                    </h3>

                    {/* Learner Count */}
                    <div className="flex items-center justify-center gap-2">
                      <FaUsers className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">
                        {skill.count}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${skill.color} h-2 rounded-full transition-all duration-500`}
                        style={{
                          width: `${Math.floor(Math.random() * 40) + 60}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${skill.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-300`}
                  ></div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* Enhanced Call to action - matching hero buttons */}
        <div className="text-center mt-20 space-y-6">
          <div className="space-y-4">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Don&apos;t See Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
                Skill?
              </span>
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We support hundreds of skills across all categories. Join now and
              discover what you can learn or teach!
            </p>
          </div>

          <div className="flex gap-4 flex-wrap justify-center">
            <button className="flex items-center gap-2 px-8 py-4 text-lg text-white bg-green-500 rounded-full hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FaUsers className="w-5 h-5" />
              Browse All Skills
            </button>
            <button className="flex items-center gap-2 px-8 py-4 text-lg text-green-600 bg-white border-2 border-green-500 rounded-full hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <FaHeart className="w-5 h-5" />
              Add Your Skill
            </button>
          </div>

          {/* Trust indicators - matching hero */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 justify-center">
            <div className="flex -space-x-3">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                alt="User profile"
                className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                alt="User profile"
                className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                alt="User profile"
                className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-lg"
              />
              <img
                src="https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face"
                alt="User profile"
                className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-lg"
              />
            </div>
            <div className="flex items-center gap-2 text-center sm:text-left">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400 w-5 h-5" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">
                4.9/5 from 15,000+ skill swappers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave - matching hero */}
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
