"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import SuccessPopup from "../components/successPopup";
import ErrorPopup from "../components/errorPopup"; // 👈 Import added

export default function SwapFormModal({
  isOpen,
  onClose,
  recipient,
  currentUser,
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

  const generateTaskId = () => {
    const newId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setTaskId(newId);
  };

  const handleSubmit = () => {
    axios
      .post("http://localhost:5000/swapform", {
        taskId,
        currentUser: currentUserFromStorage,
        recipient,
        taskName,
        timeRequired,
        description,
        deadline,
      })
      .then((response) => {
        console.log("Swap details saved successfully:", response.data);
        setTaskId("");
        setTaskName("");
        setTimeRequired("");
        setDescription("");
        setDeadline("");
        setShowSuccess(true);

        setTimeout(() => {
          setShowSuccess(false);
          onSubmit();
          onClose();
        }, 3000);
      })
      .catch((error) => {
        console.error("Error saving swap details:", error);
        const backendMessage =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Something went wrong!";

        setErrorMessage(backendMessage); // 👈 Show backend error
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Swap Details</h2>

        {/* Task ID with Generate & Copy */}
        <label className="block mb-2">
          <span className="text-sm font-medium">Task ID</span>
          <div className="flex flex-wrap gap-2 mb-1">
            <input
              type="text"
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              placeholder="Generate or paste ID"
              className="flex-1 min-w-[150px] p-2 border rounded"
            />
            <button
              type="button"
              onClick={generateTaskId}
              className="px-2 py-1 text-sm bg-blue-500 text-white rounded whitespace-nowrap"
            >
              Generate
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(taskId);
                setCopyStatus("Copied!");
                setTimeout(() => setCopyStatus(""), 1500);
              }}
              className="px-2 py-1 text-sm bg-gray-300 rounded whitespace-nowrap"
              disabled={!taskId}
            >
              {copyStatus || "Copy"}
            </button>
          </div>

          <p className="text-xs text-gray-600">
            This ID links two swap requests together. Click "Generate" to start
            a swap, or paste the Task ID sent by someone else.
          </p>
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">You (Sender)</span>
          <input
            type="text"
            value={currentUserFromStorage}
            readOnly
            className="w-full p-2 rounded bg-gray-100"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Exchange User</span>
          <input
            type="text"
            value={recipient}
            readOnly
            className="w-full p-2 rounded bg-gray-100"
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
          <span className="text-sm font-medium">Time Required (in hours)</span>
          <input
            type="number"
            min="0"
            step="0.5"
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

      {/* Toasts */}
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
