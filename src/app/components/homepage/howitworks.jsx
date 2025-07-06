"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaIdBadge,
  FaCloudUploadAlt,
  FaHandshake,
} from "react-icons/fa";

const steps = [
  {
    title: "Sign Up",
    description: "Create your free SkillSwap account in seconds.",
    image: "/signup_step.png", // Example image for Sign Up step
    icon: <FaUserPlus className="text-white text-2xl" />,
  },
  {
    title: "Create Your Profile",
    description: "Add your skills, bio, and what you want to learn.",
    image: "/profile.png", // Example image for Create Profile step
    icon: <FaIdBadge className="text-white text-2xl" />,
  },
  {
    title: "Upload Your Service",
    description: "List the services or skills you can offer to others.",
    image: "/services.png", // Example image for Upload Service step
    icon: <FaCloudUploadAlt className="text-white text-2xl" />,
  },
  {
    title: "Start Swapping",
    description: "Get matched and start learning or teaching right away!",
    image: "/swap.png", // Example image for Start Swapping step
    icon: <FaHandshake className="text-white text-2xl" />,
  },
];

export default function HowItWorksSection() {
  return (
    <section className="w-full px-6 py-24 bg-gradient-to-r from-green-300 to-green-500">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
          How It Works?
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full border-l-4 border-white z-0"></div>

          {/* Step cards */}
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`mb-8 flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              } z-10`} // Ensure cards are above the line
            >
              {/* Content Section */}
              <div className="md:w-1/2 px-6 mb-4 md:mb-0 relative z-10">
                {" "}
                {/* Added relative and z-10 */}
                <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <div className="flex justify-center mb-4">
                    <img
                      src={step.image}
                      alt={step.title}
                      className="max-w-full h-auto object-contain rounded-lg" // Ensure image fits the box
                      style={{ maxHeight: "200px" }} // Ensure image doesn't break layout
                    />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-base md:text-lg">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector with icon */}
              <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-green-500 shadow-md border-4 border-white mx-auto md:mx-0 hover:bg-green-600 transition-colors duration-300 mb-6 md:mb-0">
                {step.icon}
              </div>

              {/* Empty space */}
              <div className="md:w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
