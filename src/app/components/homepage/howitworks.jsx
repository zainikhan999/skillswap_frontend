"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaIdBadge,
  FaCloudUploadAlt,
  FaHandshake,
  FaArrowRight,
  FaComments,
} from "react-icons/fa";
import Link from "next/link";

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your free SkillSwap account in seconds with our streamlined registration process.",
    image: "/signup_step.png",
    icon: <FaUserPlus className="text-white text-2xl" />,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-500",
  },
  {
    title: "Create Your Profile",
    description:
      "Showcase your expertise and learning goals with a comprehensive profile that highlights your unique skills.",
    image: "/profile.png",
    icon: <FaIdBadge className="text-white text-2xl" />,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-500",
  },
  {
    title: "Upload Your Service",
    description:
      "List the services and skills you can offer, setting your own terms and availability preferences.",
    image: "/services.png",
    icon: <FaCloudUploadAlt className="text-white text-2xl" />,
    color: "from-orange-500 to-orange-600",
    bgColor: "bg-orange-500",
  },
  {
    title: "Connect & Message",
    description:
      "Send swap requests to potential partners and chat in real-time to discuss details, coordinate schedules, and build meaningful connections.",
    image: "/messages.png",
    icon: <FaComments className="text-white text-2xl" />,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full px-6 py-24 bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-emerald-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-green-400 rounded-full animate-bounce delay-300"></div>
        <div className="absolute top-3/4 right-1/4 w-4 h-4 bg-emerald-500 rounded-full animate-bounce delay-700"></div>
        <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-green-600 rounded-full animate-bounce delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium border border-green-200 mb-6">
            <FaArrowRight className="text-green-600 w-4 h-4" />
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            How It{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">
              Works?
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started with SkillSwap in just four simple steps. Our AI-powered
            platform makes skill exchange effortless and rewarding.
          </p>
        </motion.div>

        <div className="relative">
          {/* Enhanced vertical line with gradient */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-400 via-emerald-500 to-green-600 rounded-full shadow-lg z-0 hidden md:block"></div>

          {/* Step cards */}
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row-reverse" : ""
                } relative z-10`}
              >
                {/* Content Section */}
                <div className="md:w-5/12 px-4">
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 relative overflow-hidden group"
                  >
                    {/* Card background gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                    ></div>

                    {/* Step number */}
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                      {index + 1}
                    </div>

                    {/* Image placeholder with enhanced styling */}
                    <div className="mb-6 relative">
                      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                        <div className="w-full h-full relative">
                          <img
                            src={step.image}
                            alt={step.title}
                            className="w-full h-full object-cover rounded-2xl"
                            onError={(e) => {
                              const target = e.currentTarget;
                              const container = target.parentElement;
                              if (container) {
                                target.style.display = "none";
                                const fallback =
                                  container.querySelector(".fallback-content");
                                if (fallback) fallback.style.display = "flex";
                              }
                            }}
                          />
                          {/* Fallback placeholder */}
                          <div
                            className={`fallback-content absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 hidden items-center justify-center`}
                          >
                            <div className="relative z-10 text-center">
                              <div
                                className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg`}
                              >
                                {step.icon}
                              </div>
                              <p className="text-sm text-gray-500 font-medium">
                                Image Loading...
                              </p>
                              <p className="text-xs text-gray-400">
                                {step.image}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Floating elements */}
                        <div className="absolute top-3 right-3 w-4 h-4 bg-yellow-400 rounded-full animate-bounce opacity-60"></div>
                        <div className="absolute bottom-3 left-3 w-3 h-3 bg-pink-400 rounded-full animate-bounce delay-300 opacity-60"></div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors duration-300">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {step.description}
                    </p>

                    {/* Decorative arrow for desktop */}
                    {index < steps.length - 1 && (
                      <div
                        className={`hidden md:block absolute ${
                          index % 2 === 0 ? "-left-16" : "-right-16"
                        } top-1/2 transform -translate-y-1/2`}
                      >
                        <FaArrowRight
                          className={`text-green-400 text-2xl ${
                            index % 2 === 0 ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    )}
                  </motion.div>
                </div>

                {/* Enhanced connector with icon */}
                <div className="relative z-20 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`w-16 h-16 rounded-full ${step.bgColor} shadow-xl border-4 border-white flex items-center justify-center hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    {step.icon}

                    {/* Pulse effect */}
                    <div
                      className={`absolute inset-0 ${step.bgColor} rounded-full animate-ping opacity-20`}
                    ></div>
                  </motion.div>
                </div>

                {/* Empty space for layout balance */}
                <div className="md:w-5/12" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to action at the bottom */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of learners and experts already swapping skills on
              our platform.
            </p>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-emerald-600 rounded-full hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FaUserPlus className="w-5 h-5" />
                Get Started Now
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
