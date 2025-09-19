// components/ProposeTimeModal.js
"use client";
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

export default function ProposeTimeModal({ isOpen, onClose, onSubmit }) {
  const [proposedTime, setProposedTime] = useState("");

  const handleSubmit = () => {
    if (!proposedTime.trim()) return;
    onSubmit(proposedTime);
    setProposedTime("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <FaTimes size={20} />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Propose a Time
        </h2>

        {/* Input Field */}
        <input
          type="number"
          min="1"
          placeholder="Enter hours..."
          value={proposedTime}
          onChange={(e) => setProposedTime(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
