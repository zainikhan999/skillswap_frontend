"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import SuccessPopup from "../components/successPopup";
import ErrorPopup from "../components/errorPopup";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SwapFormModal({
  isOpen,
  onClose,
  recipient,
  onSubmit,
}) {
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

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

  const handleSubmit = async () => {
    try {
      // const token = localStorage.getItem("token");

      const response = await api.post(
        `${BASE_URL}/api/swap-request`,
        {
          taskId: taskId,
          currentUser: currentUserFromStorage,
          recipient,
          taskName,
          timeRequired,
          description,
          deadline,
        }
        // {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );

      console.log("Swap request created:", response.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit();
        onClose();
      }, 3000);

      // Reset form
      setTaskId("");
      setTaskName("");
      setTimeRequired("");
      setDescription("");
      setDeadline("");
    } catch (error) {
      console.error("Error submitting swap request:", error);
      const backendMessage =
        error?.response?.data?.message || "Something went wrong!";
      setErrorMessage(backendMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Create Swap Request</h2>

        <label className="block mb-2">
          <span className="text-sm font-medium">Your Username</span>
          <input
            type="text"
            value={currentUserFromStorage}
            readOnly
            className="w-full p-2 bg-gray-100 rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Recipient Username</span>
          <input
            type="text"
            value={recipient}
            readOnly
            className="w-full p-2 bg-gray-100 rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Task Name</span>
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Time Required (hours)</span>
          <input
            type="number"
            min="1"
            value={timeRequired}
            onChange={(e) => setTimeRequired(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Deadline</span>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </label>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
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
