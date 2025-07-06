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
} from "react-icons/fa";

// Importing slick carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const skills = [
  {
    icon: <FaLaptopCode className="text-green-500 text-5xl" />,
    label: "Web Development",
  },
  {
    icon: <FaPaintBrush className="text-pink-500 text-5xl" />,
    label: "Graphic Design",
  },
  {
    icon: <FaLanguage className="text-blue-500 text-5xl" />,
    label: "Language Exchange",
  },
  {
    icon: <FaMicrophoneAlt className="text-purple-500 text-5xl" />,
    label: "Voice over and Video",
  },
  {
    icon: <FaChartLine className="text-orange-500 text-5xl" />,
    label: "Marketing Tips",
  },
  {
    icon: <FaUtensils className="text-red-500 text-5xl" />,
    label: "Cooking Skills",
  },
  {
    icon: <FaSpa className="text-teal-500 text-5xl" />,
    label: "Wellness & Yoga",
  },
  {
    icon: <FaPenFancy className="text-yellow-500 text-5xl" />,
    label: "Writing & Editing",
  },
];

export default function PopularSkillsSection() {
  // Slider settings for slick carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    centerPadding: "20px", // adds space between slides
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          centerPadding: "20px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerPadding: "10px",
        },
      },
    ],
  };

  return (
    <section className="bg-gradient-to-r from-green-300 to-green-500 py-20 px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-10">
        Popular Skills People Are Swapping
      </h2>
      <p className="text-center text-white max-w-xl mx-auto mb-12">
        From tech to arts, language to lifestyle—SkillSwap lets you exchange any
        skill with anyone, anywhere.
      </p>
      <div className="max-w-5xl mx-auto">
        <Slider {...settings}>
          {skills.map((skill, index) => (
            <div key={index} className="px-2">
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="mb-4">{skill.icon}</div>
                <p className="font-semibold text-lg text-gray-700">
                  {skill.label}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
