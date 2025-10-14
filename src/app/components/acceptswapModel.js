"use client";
import { useEffect, useState } from "react";
import { FaGift, FaHandPointRight } from "react-icons/fa";

export default function AcceptSwapModal({
  isOpen,
  onClose,
  recipient,
  onSubmit,
}) {
  const [taskName, setTaskName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

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
      setTaskName("");
      setTimeRequired("");
      setDescription("");
      setDeadline("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    if (!taskName.trim()) {
      setErrorMessage("Task name is required");
      return;
    }
    if (!timeRequired || parseInt(timeRequired) <= 0) {
      setErrorMessage("Time required must be greater than 0");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Description is required");
      return;
    }
    if (!deadline) {
      setErrorMessage("Deadline is required");
      return;
    }

    try {
      const swapResponseData = {
        taskName: taskName.trim(),
        timeRequired: parseInt(timeRequired),
        description: description.trim(),
        deadline: deadline,
        currentUser: currentUserFromStorage,
        recipient: recipient,
      };

      if (onSubmit && typeof onSubmit === "function") {
        onSubmit(swapResponseData);
      } else {
        console.error("onSubmit is not a function:", onSubmit);
        setErrorMessage("Error: Form submission handler not found");
        return;
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      const errorMsg = error?.message || "Something went wrong!";
      setErrorMessage(errorMsg);
    }
  };

  const handleClose = () => {
    setTaskName("");
    setTimeRequired("");
    setDescription("");
    setDeadline("");
    setErrorMessage("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <h2 className="text-lg font-bold text-green-800">
            Accept Swap Request
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Confirm what you&apos;ll do and what you need in return
          </p>
        </div>

        <div className="p-4">
          {/* Usernames */}
          <div className="grid grid-cols-2 gap-2 mb-3">
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
              <label className="text-xs font-medium">Responding to</label>
              <input
                type="text"
                value={recipient || ""}
                readOnly
                className="w-full p-1.5 bg-gray-100 rounded text-xs mt-0.5"
              />
            </div>
          </div>

          {/* What You'll Do for Them */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-3">
            <div className="flex items-center gap-1 mb-2">
              <FaGift className="text-blue-600 text-xs" />
              <h3 className="font-semibold text-xs text-blue-800">
                What You&apos;ll Do for {recipient}
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-blue-900 block mb-0.5">
                  Your Skill/Service
                </label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full p-1.5 border border-blue-200 rounded text-xs focus:outline-none focus:border-blue-400"
                  placeholder="e.g., Web Development, Tutoring"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-blue-900 block mb-0.5">
                  Hours You&apos;ll Provide
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={timeRequired}
                  onChange={(e) => setTimeRequired(e.target.value)}
                  className="w-full p-1.5 border border-blue-200 rounded text-xs focus:outline-none focus:border-blue-400"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-blue-900 block mb-0.5">
                  Details
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-1.5 border border-blue-200 rounded text-xs focus:outline-none resize-none focus:border-blue-400"
                  placeholder="What you'll do for them..."
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* What You Need from Them */}
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-3">
            <div className="flex items-center gap-1 mb-2">
              <FaHandPointRight className="text-green-600 text-xs" />
              <h3 className="font-semibold text-xs text-green-800">
                What You Need from {recipient}
              </h3>
            </div>

            <div>
              <label className="text-xs font-medium text-green-900 block mb-0.5">
                Your Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full p-1.5 border border-green-200 rounded text-xs focus:outline-none focus:border-green-400"
                min={new Date().toISOString().split("T")[0]}
              />
              <p className="text-xs text-green-600 mt-1">
                When you need their task completed
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-3 py-1.5 bg-gray-200 rounded text-xs font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 py-1.5 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 disabled:opacity-50"
              disabled={!taskName || !timeRequired || !description || !deadline}
            >
              Accept & Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
