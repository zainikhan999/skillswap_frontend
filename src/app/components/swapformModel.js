"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import SuccessPopup from "../components/successPopup";
import ErrorPopup from "../components/errorPopup";
import {
  FaExchangeAlt,
  FaHandsHelping,
  FaHandPointRight,
  FaGift,
} from "react-icons/fa";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SwapFormModal({
  isOpen,
  onClose,
  recipient,
  onSubmit,
}) {
  const [taskId, setTaskId] = useState("");
  const [needSkill, setNeedSkill] = useState("");
  const [needDescription, setNeedDescription] = useState("");
  const [needDeadline, setNeedDeadline] = useState("");
  const [offerSkill, setOfferSkill] = useState("");
  const [offerHours, setOfferHours] = useState("");
  const [offerDescription, setOfferDescription] = useState("");
  const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [needDescError, setNeedDescError] = useState("");
  const [offerDescError, setOfferDescError] = useState("");
  const [activeTab, setActiveTab] = useState("direct-swap");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUserFromStorage(parsedUser.userName || "");
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      const generatedId = `task-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      setTaskId(generatedId);
    }
  }, [isOpen]);

  const handleDescriptionChange = (value, setter, errorSetter) => {
    const wordCount = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    if (wordCount > 100) {
      errorSetter("Max 100 words");
      return;
    } else {
      errorSetter("");
    }
    setter(value);
  };

  const handleDirectSwapSubmit = async () => {
    try {
      // Combine descriptions: What they need + What they offer
      const combinedDescription = `WHAT I NEED: ${needDescription.trim()}\n\nWHAT I OFFER: ${offerSkill} - ${offerDescription.trim()}`;

      const response = await api.post(`${BASE_URL}/api/swap-request`, {
        taskId,
        currentUser: currentUserFromStorage,
        recipient,
        taskName: needSkill, // What they need
        description: combinedDescription, // Combined: need + offer details
        deadline: needDeadline,
        timeRequired: offerHours, // Hours they'll offer
      });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit();
        onClose();
      }, 3000);
      resetForm();
    } catch (error) {
      console.error("Error submitting swap request:", error);
      const backendMessage =
        error?.response?.data?.message || "Something went wrong!";
      setErrorMessage(backendMessage);
    }
  };

  const resetForm = () => {
    setTaskId("");
    setNeedSkill("");
    setNeedDescription("");
    setNeedDeadline("");
    setOfferSkill("");
    setOfferHours("");
    setOfferDescription("");
    setNeedDescError("");
    setOfferDescError("");
  };

  const handleSubmit = () => {
    if (activeTab === "direct-swap") {
      handleDirectSwapSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-2.5 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-sm font-bold text-center">Skill Swap Request</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <div
            className={`flex-1 p-2 cursor-pointer text-center ${
              activeTab === "direct-swap"
                ? "bg-green-50 border-b-2 border-green-500"
                : "bg-gray-50 hover:bg-green-25"
            }`}
            onClick={() => setActiveTab("direct-swap")}
          >
            <FaExchangeAlt
              className={`inline text-xs mb-1 ${
                activeTab === "direct-swap" ? "text-green-600" : "text-gray-400"
              }`}
            />
            <h3
              className={`font-semibold text-xs ${
                activeTab === "direct-swap" ? "text-green-700" : "text-gray-600"
              }`}
            >
              Direct Swap
            </h3>
          </div>

          <div className="flex-1 p-2 cursor-not-allowed text-center bg-gray-100 opacity-60">
            <FaHandsHelping className="inline text-xs mb-1 text-gray-400" />
            <h3 className="font-semibold text-xs text-gray-600">
              Skill Bank (Soon)
            </h3>
          </div>
        </div>

        {/* Form */}
        <div className="p-3">
          {/* Usernames */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div>
              <label className="text-xs font-medium">Your Username</label>
              <input
                type="text"
                value={currentUserFromStorage}
                readOnly
                className="w-full p-1.5 bg-gray-100 rounded text-xs mt-0.5"
              />
            </div>
            <div>
              <label className="text-xs font-medium">Sending to</label>
              <input
                type="text"
                value={recipient}
                readOnly
                className="w-full p-1.5 bg-gray-100 rounded text-xs mt-0.5"
              />
            </div>
          </div>

          {/* What You Need */}
          <div className="bg-green-50 border border-green-200 rounded p-2.5 mb-2">
            <div className="flex items-center gap-1 mb-2">
              <FaHandPointRight className="text-green-600 text-xs" />
              <h3 className="font-semibold text-xs text-green-800">
                What You Need from {recipient}
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-green-900 block mb-0.5">
                  Skill/Service Needed
                </label>
                <input
                  type="text"
                  value={needSkill}
                  onChange={(e) => setNeedSkill(e.target.value)}
                  className="w-full p-1.5 border border-green-200 rounded text-xs focus:outline-none focus:border-green-400"
                  placeholder="e.g., Web Dev, Math Tutoring"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-green-900 block mb-0.5">
                  Task Details
                </label>
                <textarea
                  value={needDescription}
                  onChange={(e) =>
                    handleDescriptionChange(
                      e.target.value,
                      setNeedDescription,
                      setNeedDescError
                    )
                  }
                  className={`w-full p-1.5 border rounded text-xs focus:outline-none resize-none ${
                    needDescError
                      ? "border-red-400"
                      : "border-green-200 focus:border-green-400"
                  }`}
                  placeholder="What you need them to do..."
                  rows={2}
                />
                {needDescError && (
                  <p className="text-xs text-red-500 mt-0.5">{needDescError}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-green-900 block mb-0.5">
                  Deadline
                </label>
                <input
                  type="date"
                  value={needDeadline}
                  onChange={(e) => setNeedDeadline(e.target.value)}
                  className="w-full p-1.5 border border-green-200 rounded text-xs focus:outline-none focus:border-green-400"
                />
              </div>
            </div>
          </div>

          {/* What You Offer */}
          <div className="bg-blue-50 border border-blue-200 rounded p-2.5">
            <div className="flex items-center gap-1 mb-2">
              <FaGift className="text-blue-600 text-xs" />
              <h3 className="font-semibold text-xs text-blue-800">
                What You&apos;ll Offer in Return
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-blue-900 block mb-0.5">
                  Your Skill/Service
                </label>
                <input
                  type="text"
                  value={offerSkill}
                  onChange={(e) => setOfferSkill(e.target.value)}
                  className="w-full p-1.5 border border-blue-200 rounded text-xs focus:outline-none focus:border-blue-400"
                  placeholder="e.g., Graphic Design, Content Writing"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-blue-900 block mb-0.5">
                  Hours You&apos;ll Provide
                </label>
                <input
                  type="number"
                  min="1"
                  value={offerHours}
                  onChange={(e) => setOfferHours(e.target.value)}
                  className="w-full p-1.5 border border-blue-200 rounded text-xs focus:outline-none focus:border-blue-400"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-blue-900 block mb-0.5">
                  Details
                </label>
                <textarea
                  value={offerDescription}
                  onChange={(e) =>
                    handleDescriptionChange(
                      e.target.value,
                      setOfferDescription,
                      setOfferDescError
                    )
                  }
                  className={`w-full p-1.5 border rounded text-xs focus:outline-none resize-none ${
                    offerDescError
                      ? "border-red-400"
                      : "border-blue-200 focus:border-blue-400"
                  }`}
                  placeholder="What you'll do for them..."
                  rows={2}
                />
                {offerDescError && (
                  <p className="text-xs text-red-500 mt-0.5">
                    {offerDescError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-200 rounded text-xs font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600"
            >
              Send Request
            </button>
          </div>
        </div>
      </div>

      {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
      {errorMessage && (
        <ErrorPopup
          message={errorMessage}
          onClose={() => setErrorMessage("")}
        />
      )}
    </div>
  );
}
