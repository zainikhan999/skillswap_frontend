import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm mb-2">
          Contact us:{" "}
          <a
            href="mailto:skillswap.pak@gmail.com"
            className="text-green-400 hover:text-green-300 transition-colors duration-200 underline"
          >
            skillswap.pak@gmail.com
          </a>
        </p>
        <p className="text-sm text-gray-400">
          © 2025 SkillSwap. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
