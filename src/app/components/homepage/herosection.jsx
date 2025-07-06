// components/HeroSection.tsx
"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaExchangeAlt, FaUserPlus } from "react-icons/fa";

export default function HeroSection() {
  return (
    <section className="w-full px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left: Text content */}
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6">
            <span className="text-green-600">Pakistan’s</span> 1st AI-Based
            Skill Swapping Platform
          </h1>

          <p className="text-lg text-gray-700 mb-6">
            Trade your skills with passionate learners. Whether you're a
            developer learning art or a musician exploring coding—SkillSwap
            connects you.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/login">
              <button className="flex items-center gap-2 px-6 py-3 text-lg text-white bg-green-500 rounded-full hover:bg-green-600 shadow-md hover:shadow-lg transition-all">
                <FaExchangeAlt className="text-white" /> Start Swapping
              </button>
            </Link>
            <Link href="/signup">
              <button className="flex items-center gap-2 px-6 py-3 text-lg text-white bg-green-400 rounded-full hover:bg-green-500 shadow-md hover:shadow-lg transition-all">
                <FaUserPlus className="text-white" /> Join Now
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Image */}
        <div className="md:w-1/2 flex justify-center">
          <Image
            src="/first_image.png" // replace with your actual image later
            alt="Skill swapping illustration"
            width={500}
            height={400}
            // className="rounded-xl shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
