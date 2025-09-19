"use client";
import { useEffect, useState } from "react";
import SuccessPopup from "../components/successPopup";
import ErrorPopup from "../components/errorPopup";
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
  const [showSuccess, setShowSuccess] = useState(false);
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
      // Reset form when modal opens
      setTaskName("");
      setTimeRequired("");
      setDescription("");
      setDeadline("");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    console.log("=== ACCEPT SWAP MODAL SUBMIT ===");
    console.log("Form values:", {
      taskName,
      timeRequired,
      description,
      deadline,
      currentUserFromStorage,
      recipient,
    });

    // Validate required fields
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
      // Prepare the swap response data - NO taskId needed for responders
      const swapResponseData = {
        taskName: taskName.trim(),
        timeRequired: parseInt(timeRequired),
        description: description.trim(),
        deadline: deadline,
        currentUser: currentUserFromStorage,
        recipient: recipient,
      };

      console.log("=== CALLING ONSUBMIT ===");
      console.log("swapResponseData:", swapResponseData);
      console.log("onSubmit function:", onSubmit);
      console.log("typeof onSubmit:", typeof onSubmit);

      if (onSubmit && typeof onSubmit === "function") {
        console.log("About to call onSubmit with data...");
        // Don't await here - let the parent handle async
        onSubmit(swapResponseData);
        console.log("onSubmit call completed");
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
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-600">
          Accept Swap Request
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Fill in the details of what you'll provide in return for this skill
          swap.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              Your Username
            </span>
            <input
              type="text"
              value={currentUserFromStorage}
              readOnly
              className="w-full p-2 bg-gray-100 border rounded mt-1"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              Responding to
            </span>
            <input
              type="text"
              value={recipient || ""}
              readOnly
              className="w-full p-2 bg-gray-100 border rounded mt-1"
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              Your Skill/Task Name *
            </span>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="What skill will you provide in return?"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              Time Required (hours) *
            </span>
            <input
              type="number"
              min="1"
              step="0.5"
              value={timeRequired}
              onChange={(e) => setTimeRequired(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="How many hours will this take?"
              required
            />
          </label>

          <label className="block mb-2">
            <span className="text-sm font-medium text-gray-700">
              Description *
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              placeholder="Describe what you'll provide in return..."
              rows="3"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium text-gray-700">
              Your Deadline *
            </span>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </label>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errorMessage}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
              disabled={!taskName || !timeRequired || !description || !deadline}
            >
              Accept & Submit Response
            </button>
          </div>
        </form>
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
