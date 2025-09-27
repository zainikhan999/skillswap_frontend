// "use client";
// import { useEffect, useState } from "react";
// import api from "../utils/api";
// import SuccessPopup from "../components/successPopup";
// import ErrorPopup from "../components/errorPopup";

// api.defaults.withCredentials = true;
// const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

// export default function SwapFormModal({
//   isOpen,
//   onClose,
//   recipient,
//   onSubmit,
// }) {
//   const [taskId, setTaskId] = useState("");
//   const [taskName, setTaskName] = useState("");
//   const [timeRequired, setTimeRequired] = useState("");
//   const [description, setDescription] = useState("");
//   const [deadline, setDeadline] = useState("");
//   const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [copyStatus, setCopyStatus] = useState("");

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedUser = localStorage.getItem("user");
//       if (storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setCurrentUserFromStorage(parsedUser.userName || "");
//         } catch (error) {
//           console.error("Error parsing stored user:", error);
//         }
//       }
//     }
//   }, []);

//   useEffect(() => {
//     if (isOpen) {
//       const generatedId = `task-${Date.now()}-${Math.floor(
//         Math.random() * 1000
//       )}`;
//       setTaskId(generatedId);
//     }
//   }, [isOpen]);

//   const handleSubmit = async () => {
//     try {
//       // const token = localStorage.getItem("token");

//       const response = await api.post(
//         `${BASE_URL}/api/swap-request`,
//         {
//           taskId: taskId,
//           currentUser: currentUserFromStorage,
//           recipient,
//           taskName,
//           timeRequired,
//           description,
//           deadline,
//         }
//         // {
//         //   headers: { Authorization: `Bearer ${token}` },
//         // }
//       );

//       console.log("Swap request created:", response.data);
//       setShowSuccess(true);
//       setTimeout(() => {
//         setShowSuccess(false);
//         onSubmit();
//         onClose();
//       }, 3000);

//       // Reset form
//       setTaskId("");
//       setTaskName("");
//       setTimeRequired("");
//       setDescription("");
//       setDeadline("");
//     } catch (error) {
//       console.error("Error submitting swap request:", error);
//       const backendMessage =
//         error?.response?.data?.message || "Something went wrong!";
//       setErrorMessage(backendMessage);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//       <div className="bg-white p-6 rounded-xl w-[90%] max-w-md shadow-xl">
//         <h2 className="text-xl font-bold mb-4">Create Swap Request</h2>

//         <label className="block mb-2">
//           <span className="text-sm font-medium">Your Username</span>
//           <input
//             type="text"
//             value={currentUserFromStorage}
//             readOnly
//             className="w-full p-2 bg-gray-100 rounded"
//           />
//         </label>

//         <label className="block mb-2">
//           <span className="text-sm font-medium">Recipient Username</span>
//           <input
//             type="text"
//             value={recipient}
//             readOnly
//             className="w-full p-2 bg-gray-100 rounded"
//           />
//         </label>

//         <label className="block mb-2">
//           <span className="text-sm font-medium">Task Name</span>
//           <input
//             type="text"
//             value={taskName}
//             onChange={(e) => setTaskName(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </label>

//         <label className="block mb-2">
//           <span className="text-sm font-medium">Time Required (hours)</span>
//           <input
//             type="number"
//             min="1"
//             value={timeRequired}
//             onChange={(e) => setTimeRequired(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </label>

//         <label className="block mb-2">
//           <span className="text-sm font-medium">Description</span>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </label>

//         <label className="block mb-4">
//           <span className="text-sm font-medium">Deadline</span>
//           <input
//             type="date"
//             value={deadline}
//             onChange={(e) => setDeadline(e.target.value)}
//             className="w-full p-2 border rounded"
//           />
//         </label>

//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 bg-green-500 text-white rounded"
//           >
//             Submit
//           </button>
//         </div>
//       </div>

//       {showSuccess && <SuccessPopup onClose={() => setShowSuccess(false)} />}
//       {errorMessage && (
//         <ErrorPopup
//           message={errorMessage}
//           onClose={() => setErrorMessage("")}
//         />
//       )}
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import api from "../utils/api";
import SuccessPopup from "../components/successPopup";
import ErrorPopup from "../components/errorPopup";
import { FaExchangeAlt, FaHandsHelping } from "react-icons/fa";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SwapFormModal({
  isOpen,
  onClose,
  recipient,
  onSubmit,
}) {
  // Existing state
  const [taskId, setTaskId] = useState("");
  const [taskName, setTaskName] = useState("");
  const [timeRequired, setTimeRequired] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [currentUserFromStorage, setCurrentUserFromStorage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  // New state for tab switching
  const [activeTab, setActiveTab] = useState("direct-swap"); // "direct-swap" or "skill-bank"

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

  const handleDirectSwapSubmit = async () => {
    try {
      const response = await api.post(`${BASE_URL}/api/swap-request`, {
        taskId: taskId,
        currentUser: currentUserFromStorage,
        recipient,
        taskName,
        timeRequired,
        description,
        deadline,
      });

      console.log("Swap request created:", response.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit();
        onClose();
      }, 3000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error submitting swap request:", error);
      const backendMessage =
        error?.response?.data?.message || "Something went wrong!";
      setErrorMessage(backendMessage);
    }
  };

  const handleSkillBankSubmit = async () => {
    try {
      // New API call for skill bank request
      const response = await api.post(`${BASE_URL}/api/skill-bank-request`, {
        skillName: taskName,
        description,
        currentUser: currentUserFromStorage,
      });

      console.log("Skill bank request created:", response.data);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onSubmit();
        onClose();
      }, 3000);

      // Reset form
      resetForm();
    } catch (error) {
      console.error("Error submitting skill bank request:", error);
      const backendMessage =
        error?.response?.data?.message || "Something went wrong!";
      setErrorMessage(backendMessage);
    }
  };

  const resetForm = () => {
    setTaskId("");
    setTaskName("");
    setTimeRequired("");
    setDescription("");
    setDeadline("");
  };

  const handleSubmit = () => {
    if (activeTab === "direct-swap") {
      handleDirectSwapSubmit();
    } else {
      handleSkillBankSubmit();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-center">Choose Request Type</h2>
        </div>

        {/* Compact Tab Sections */}
        <div className="flex">
          {/* Direct Swap Section */}
          <div
            className={`flex-1 p-3 cursor-pointer transition-all ${
              activeTab === "direct-swap"
                ? "bg-green-50 border-r-2 border-green-500"
                : "bg-gray-50 border-r border-gray-200 hover:bg-green-25"
            }`}
            onClick={() => setActiveTab("direct-swap")}
          >
            <div className="text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  activeTab === "direct-swap" ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <FaExchangeAlt className="text-white text-sm" />
              </div>
              <h3
                className={`font-semibold text-sm ${
                  activeTab === "direct-swap"
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                Direct Swap
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Exchange skills with specific person
              </p>
            </div>
          </div>

          {/* Skill Bank Section */}
          <div
            className={`flex-1 p-3 cursor-pointer transition-all ${
              activeTab === "skill-bank"
                ? "bg-green-50"
                : "bg-gray-50 hover:bg-green-25"
            }`}
            onClick={() => setActiveTab("skill-bank")}
          >
            <div className="text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  activeTab === "skill-bank" ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <FaHandsHelping className="text-white text-sm" />
              </div>
              <h3
                className={`font-semibold text-sm ${
                  activeTab === "skill-bank"
                    ? "text-green-700"
                    : "text-gray-600"
                }`}
              >
                Skill Bank
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Request help from community
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-3 border-t border-gray-200">
          <h2 className="text-base font-semibold mb-2">
            {activeTab === "direct-swap"
              ? "Create Swap Request"
              : "Request Help from Community"}
          </h2>

          {/* Username Fields - Single Row */}
          {activeTab === "direct-swap" ? (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <label className="block">
                <span className="text-xs font-medium block mb-1">
                  Your Username
                </span>
                <input
                  type="text"
                  value={currentUserFromStorage}
                  readOnly
                  className="w-full p-1.5 bg-gray-100 rounded text-xs"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium block mb-1">
                  Recipient Username
                </span>
                <input
                  type="text"
                  value={recipient}
                  readOnly
                  className="w-full p-1.5 bg-gray-100 rounded text-xs"
                />
              </label>
            </div>
          ) : (
            <label className="block mb-2">
              <span className="text-xs font-medium block mb-1">
                Your Username
              </span>
              <input
                type="text"
                value={currentUserFromStorage}
                readOnly
                className="w-full p-1.5 bg-gray-100 rounded text-xs"
              />
            </label>
          )}

          {/* Skill/Task Name - Always shown */}
          <label className="block mb-2">
            <span className="text-xs font-medium block mb-1">
              {activeTab === "direct-swap"
                ? "Task Name"
                : "Skill You Need Help With"}
            </span>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-1.5 border rounded text-xs"
              placeholder={
                activeTab === "direct-swap"
                  ? "What task do you need?"
                  : "e.g., Python Programming, Guitar Lessons"
              }
            />
          </label>

          {/* Time Required and Deadline in single row for direct swap */}
          {activeTab === "direct-swap" && (
            <div className="grid grid-cols-2 gap-2 mb-2">
              <label className="block">
                <span className="text-xs font-medium block mb-1">
                  Time Required (hours)
                </span>
                <input
                  type="number"
                  min="1"
                  value={timeRequired}
                  onChange={(e) => setTimeRequired(e.target.value)}
                  className="w-full p-1.5 border rounded text-xs"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium block mb-1">Deadline</span>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full p-1.5 border rounded text-xs"
                />
              </label>
            </div>
          )}

          {/* Description - Always shown */}
          <label className="block mb-2">
            <span className="text-xs font-medium block mb-1">Description</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-1.5 border rounded text-xs"
              placeholder={
                activeTab === "direct-swap"
                  ? "Describe what you need help with..."
                  : "Explain what specific help you need and your current level..."
              }
              rows={2}
            />
          </label>

          {/* Skill Bank Info */}
          {activeTab === "skill-bank" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2">
              <p className="text-xs text-green-800">
                <strong>💡 How Skill Bank works:</strong>
                <br />
                • Request help from the community • No immediate exchange
                required
                <br />• Help others later to pay it forward • Build your
                community karma!
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-gray-300 rounded text-xs hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className={`px-3 py-1.5 text-white rounded text-xs transition-colors ${
                activeTab === "direct-swap"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {activeTab === "direct-swap"
                ? "Submit Swap Request"
                : "Request Help"}
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
