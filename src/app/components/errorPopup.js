// components/ErrorPopup.jsx
"use client";
import { useEffect } from "react";
import { FaTimesCircle } from "react-icons/fa";

export default function ErrorPopup({ message = "Failed!", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm flex flex-col items-center">
        <FaTimesCircle className="text-red-500 w-16 h-16 mb-4" />
        <h2 className="text-xl font-semibold text-red-700">{message}</h2>
      </div>
    </div>
  );
}
