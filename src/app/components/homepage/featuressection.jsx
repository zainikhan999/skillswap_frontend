"use client";
import React from "react";
import { FaBrain, FaDatabase, FaUsers, FaExchangeAlt } from "react-icons/fa";

const features = [
  {
    title: "AI-Based Skill Evaluation",
    description:
      "Automatically assess your skill levels using intelligent AI to match you with ideal partners.",
    icon: (
      <div className="w-14 h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-full shadow-md mb-4 mx-auto">
        <FaBrain className="text-2xl" />
      </div>
    ),
  },
  {
    title: "Skill Bank",
    description:
      "Track, store, and display your acquired skills in a personalized dashboard.",
    icon: (
      <div className="w-14 h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-full shadow-md mb-4 mx-auto">
        <FaDatabase className="text-2xl" />
      </div>
    ),
  },
  {
    title: "Community Driven",
    description:
      "Connect with learners, mentors, and collaborators to grow your skills through exchange.",
    icon: (
      <div className="w-14 h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-full shadow-md mb-4 mx-auto">
        <FaUsers className="text-2xl" />
      </div>
    ),
  },
  {
    title: "Seamless Skill Swapping",
    description:
      "Swap skills with just a few clicks using our intuitive interface and smart suggestions.",
    icon: (
      <div className="w-14 h-14 flex items-center justify-center bg-green-100 text-green-600 rounded-full shadow-md mb-4 mx-auto">
        <FaExchangeAlt className="text-2xl" />
      </div>
    ),
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full px-6 py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Why Choose <span className="text-green-600">SkillSwap</span>?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
