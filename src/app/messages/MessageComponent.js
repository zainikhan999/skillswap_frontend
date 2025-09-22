"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  FaBars,
  FaUserCircle,
  FaArrowLeft,
  FaTimes,
  FaCheck,
  FaTrash,
  FaExchangeAlt,
  FaClock,
  FaCalendarAlt,
  FaInfoCircle,
  FaBan,
  FaPaperPlane,
  FaPlus,
  FaSearch,
  FaChevronRight,
  FaCircle,
} from "react-icons/fa";

import { useSearchParams } from "next/navigation";
import api from "../utils/api.js";
import { useSocket } from "../contexts/SocketContext";
import { useChat } from "../contexts/ChatContext";
import { useAuth } from "../contexts/AuthContext";
import ProposeTimeModal from "../components/timeModel.js";
import AcceptSwapModal from "../components/acceptswapModel";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function MessageComponent() {
  // State Variables
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [swapRequests, setSwapRequests] = useState([]);
  const [sender, setSender] = useState("");
  const [room, setRoom] = useState("");
  const [chatUsers, setChatUsers] = useState([]);
  const [swapAccepted, setSwapAccepted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipient, setRecipient] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});
  const [activeTab, setActiveTab] = useState("chats");
  const [selectedSwapRequest, setSelectedSwapRequest] = useState(null);
  const [currentSwapId, setCurrentSwapId] = useState(null);
  const [acceptingSwapRequestId, setAcceptingSwapRequestId] = useState(null);
  const [isSwapCompleted, setIsSwapCompleted] = useState(false);

  // Refs
  const { socket, socketRef } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const [currentSwapStatus, setCurrentSwapStatus] = useState(null);
  const [isChatDisabled, setIsChatDisabled] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const searchParams = useSearchParams();
  const { isChatOpen, toggleChat } = useChat();
  const [isProposeTimeOpen, setIsProposeTimeOpen] = useState(false);

  // Add state for tracking current swap details
  const [currentSwapDetails, setCurrentSwapDetails] = useState(null);

  useEffect(() => {
    if (!room) return;

    socket.emit("join_room", room);

    const handleMessage = ({ message, sender, timestamp, type, swapData }) => {
      console.log("Socket message received:", { type, message, swapData });

      if (type === "swap_details") {
        const swapStatus = swapData?.status?.toLowerCase();
        console.log("Swap status from socket:", swapStatus);

        // IMMEDIATELY update state when receiving swap updates
        setCurrentSwapStatus(swapStatus);
        setIsChatDisabled(swapStatus === "completed");

        setMessages((prev) => [
          ...prev,
          {
            type: "swap_details",
            swapData,
            user: sender,
            time: timestamp,
            timestamp,
          },
        ]);
      } else if (type === "system") {
        // Check if it's a completion message and update status
        if (message.includes("FULLY COMPLETED")) {
          console.log("Setting chat disabled to TRUE");
          setCurrentSwapStatus("completed");
          setIsChatDisabled(true);
        } else if (message.includes("marked their part complete")) {
          console.log("Setting status to PARTIALLY_COMPLETED");
          setCurrentSwapStatus("partially_completed");
          setIsChatDisabled(false); // Keep chat open for partial completion
        }

        setMessages((prev) => [
          ...prev,
          {
            text: message,
            user: "system",
            time: timestamp,
            timestamp,
            type: "system",
          },
        ]);
      } else {
        // Regular message - only add if chat is not disabled
        if (!isChatDisabled) {
          setMessages((prev) => [
            ...prev,
            { text: message, user: sender, time: timestamp, timestamp },
          ]);
        }
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [room, socket, isChatDisabled]);

  // Function to extract swap ID from messages and check completion status
  const getCurrentSwapStatus = () => {
    // Get swapId directly in this function
    const swapMessage = messages
      .filter((msg) => msg.type === "swap_details")
      .pop();

    const swapId = swapMessage?.swapData?.swapId || null;

    // First try to get status from state
    if (currentSwapStatus) {
      return {
        swapId: swapId,
        isFullyCompleted: currentSwapStatus === "completed",
        isPartiallyCompleted: currentSwapStatus === "partially_completed",
        status: currentSwapStatus,
      };
    }

    // Fallback to checking messages
    if (!swapMessage)
      return { swapId: null, isFullyCompleted: false, status: null };

    const status = swapMessage.swapData?.status?.toLowerCase();
    return {
      swapId: swapId,
      isFullyCompleted: status === "completed",
      isPartiallyCompleted: status === "partially_completed",
      status: status,
    };
  };

  const checkSwapStatusFromAPI = async (swapId) => {
    try {
      const response = await api.get(`${BASE_URL}/api/swaps/${swapId}/status`);
      const { bothCompleted, status } = response.data;

      console.log("API Status check:", { status, bothCompleted });

      // Only update if we don't have a more recent status from sockets
      if (!currentSwapStatus || currentSwapStatus !== status) {
        setCurrentSwapStatus(status);
        setIsChatDisabled(bothCompleted);
      }

      return { bothCompleted, status };
    } catch (error) {
      console.error("Error checking swap status:", error);
      return { bothCompleted: false, status: null };
    }
  };

  // Check if messaging should be disabled
  const isMessagingDisabled = () => {
    return isChatDisabled; // Use state instead of checking messages
  };

  // Complete Swap Handler - Updated to disable messaging
  const handleCompleteSwap = async () => {
    const { swapId } = getCurrentSwapStatus();

    if (!swapId) {
      alert("No active swap found to complete");
      return;
    }

    try {
      const response = await api.put(
        `${BASE_URL}/api/swaps/${swapId}/complete`
      );

      if (response.status === 200) {
        const { bothCompleted, swap } = response.data;

        // IMMEDIATELY update state
        setCurrentSwapStatus(swap.status);
        setIsChatDisabled(bothCompleted);

        // Update messages
        setMessages((prev) =>
          prev.map((msg) => {
            if (
              msg.type === "swap_details" &&
              msg.swapData?.swapId === swapId
            ) {
              return {
                ...msg,
                swapData: {
                  ...msg.swapData,
                  status: swap.status,
                },
              };
            }
            return msg;
          })
        );

        if (bothCompleted) {
          alert(
            "Swap fully completed! Both parties have marked it complete. Chat is now closed."
          );
        } else {
          alert(
            "Your part of the swap has been marked as complete. Waiting for the other party to complete their part."
          );
        }

        // Refresh chat history
        setTimeout(() => fetchChatHistory(sender, recipient), 500);
      }
    } catch (error) {
      console.error("Error completing swap:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to complete swap";
      alert(`Error: ${errorMessage}`);
    }
  };

  // Enhanced SwapDetailsMessage component - Mobile optimized
  const SwapDetailsMessage = ({ swapData, user, timestamp }) => {
    const isSender = user === sender;
    const swapId = swapData?.swapId;
    const status = swapData?.status?.toLowerCase();

    const canTakeAction =
      status === "accepted" || status === "partially_completed";
    const isFullyCompleted = status === "completed";
    const isPartiallyCompleted = status === "partially_completed";

    return (
      <div
        className={`flex ${isSender ? "justify-end" : "justify-start"} mb-6`}
      >
        <div
          className={`max-w-[90%] sm:max-w-[85%] ${
            isSender ? "ml-auto" : "mr-auto"
          }`}
        >
          <div
            className={`rounded-2xl p-4 sm:p-6 text-white shadow-lg ${
              isFullyCompleted
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                : isPartiallyCompleted
                ? "bg-gradient-to-br from-amber-500 to-orange-500"
                : "bg-gradient-to-br from-blue-500 to-purple-600"
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              {isFullyCompleted ? (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaCheck className="text-lg" />
                </div>
              ) : isPartiallyCompleted ? (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaClock className="text-lg" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaExchangeAlt className="text-lg" />
                </div>
              )}
              <div>
                <h3 className="text-base sm:text-lg font-bold leading-tight">
                  {isFullyCompleted
                    ? "Completed Skill Swap"
                    : isPartiallyCompleted
                    ? "Partially Completed"
                    : "Skill Swap Agreement"}
                </h3>
                <p className="text-xs sm:text-sm text-white/80">
                  Swap ID: {swapId}
                </p>
              </div>
            </div>

            {/* Swap Details - Mobile optimized */}
            <div className="space-y-3 sm:space-y-4">
              {/* Requester Task */}
              {swapData.requesterTask && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                    <FaInfoCircle className="text-sm" />
                    Requested Task
                  </h4>
                  <div className="text-xs sm:text-sm space-y-2">
                    <div>
                      <span className="font-medium">Task:</span>{" "}
                      {swapData.requesterTask.taskName}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      {swapData.requesterTask.description}
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs">
                      <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                        <FaClock />
                        {swapData.requesterTask.timeRequired}h
                      </span>
                      <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                        <FaCalendarAlt />
                        {new Date(
                          swapData.requesterTask.deadline
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Responder Task */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                  <FaInfoCircle className="text-sm" />
                  Offered Task
                </h4>
                <div className="text-xs sm:text-sm space-y-2">
                  <div>
                    <span className="font-medium">Task:</span>{" "}
                    {swapData.responderTask.taskName}
                  </div>
                  <div>
                    <span className="font-medium">Description:</span>{" "}
                    {swapData.responderTask.description}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                      <FaClock />
                      {swapData.responderTask.timeRequired}h
                    </span>
                    <span className="flex items-center gap-1 bg-white/10 px-2 py-1 rounded-full">
                      <FaCalendarAlt />
                      {new Date(
                        swapData.responderTask.deadline
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button - Mobile optimized */}
              {canTakeAction && !isFullyCompleted && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
                  <button
                    onClick={handleCompleteSwap}
                    className="w-full bg-white text-gray-800 px-4 py-3 rounded-xl text-sm font-semibold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FaCheck />
                    Mark as Complete
                  </button>
                </div>
              )}

              {/* Status Messages - Mobile optimized */}
              {isPartiallyCompleted && (
                <div className="bg-yellow-400/20 backdrop-blur-sm rounded-xl p-3 border border-yellow-400/30">
                  <p className="text-xs sm:text-sm font-medium">
                    One party has completed their part. Waiting for the other
                    party to complete.
                  </p>
                </div>
              )}

              {isFullyCompleted && (
                <div className="bg-green-400/20 backdrop-blur-sm rounded-xl p-3 border border-green-400/30">
                  <p className="text-xs sm:text-sm font-medium">
                    Both parties have completed this swap. Chat is now closed.
                  </p>
                </div>
              )}

              {/* Status Badge */}
              <div className="flex justify-center pt-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    status === "pending"
                      ? "bg-yellow-500"
                      : status === "accepted"
                      ? "bg-green-500"
                      : status === "partially_completed"
                      ? "bg-orange-500"
                      : status === "completed"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                >
                  {status === "partially_completed"
                    ? "PARTIAL"
                    : status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs mt-3 text-center text-white/70">
              {timestamp &&
                new Date(timestamp).toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile-optimized chat header
  const renderChatHeader = () => {
    const { swapId, isFullyCompleted, isPartiallyCompleted } =
      getCurrentSwapStatus();
    const profile = userProfiles[recipient];

    return (
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              className="lg:hidden text-white hover:bg-white/20 p-2 rounded-full transition-all"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              <FaBars className="text-lg" />
            </button>

            {/* Profile section */}
            <div className="flex items-center gap-3 min-w-0">
              {profile?.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt={`${recipient} profile`}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white/30"
                />
              ) : (
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaUserCircle className="text-white text-xl" />
                </div>
              )}

              <div className="min-w-0">
                <div className="text-white font-semibold text-base sm:text-lg truncate">
                  {recipient}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status badges and action button */}
          <div className="flex items-center gap-2">
            {isFullyCompleted && (
              <div className="hidden sm:flex bg-white/20 px-3 py-1 rounded-full text-white text-xs items-center gap-1">
                <FaCheck className="text-xs" />
                Completed
              </div>
            )}
            {isPartiallyCompleted && (
              <div className="hidden sm:flex bg-yellow-400/30 px-3 py-1 rounded-full text-white text-xs items-center gap-1">
                <FaClock className="text-xs" />
                Waiting
              </div>
            )}

            {swapId && !isFullyCompleted && (
              <button
                onClick={handleCompleteSwap}
                className="bg-white text-green-600 px-3 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-all whitespace-nowrap"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Enhanced message input with better mobile experience
  const renderMessageInput = () => {
    const { isFullyCompleted } = getCurrentSwapStatus();

    if (isFullyCompleted) {
      return (
        <div className="p-4 bg-gray-50 border-t">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCheck className="text-2xl text-green-500" />
            </div>
            <p className="font-medium text-sm">Swap Completed Successfully!</p>
            <p className="text-xs mt-1">
              Both parties have completed their tasks.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="p-3 sm:p-4 bg-white border-t border-gray-100">
        <div className="flex items-end gap-2 sm:gap-3">
          <div className="flex-1">
            <textarea
              className="w-full p-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm placeholder-gray-500 transition-all max-h-32 min-h-[44px]"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows="1"
              style={{
                height: "auto",
                minHeight: "44px",
              }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 128) + "px";
              }}
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsProposeTimeOpen(true)}
              className="bg-gray-100 text-gray-600 p-3 rounded-full hover:bg-gray-200 transition-all"
              title="Propose Time"
            >
              <FaClock className="text-sm" />
            </button>

            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={`p-3 rounded-full transition-all ${
                message.trim()
                  ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg"
                  : "bg-gray-100 text-gray-400"
              }`}
              title="Send Message"
            >
              <FaPaperPlane className="text-sm" />
            </button>
          </div>
        </div>

        <ProposeTimeModal
          isOpen={isProposeTimeOpen}
          onClose={() => setIsProposeTimeOpen(false)}
          onSubmit={handleProposeTime}
        />
      </div>
    );
  };

  const handleProposeTime = (time) => {
    if (isMessagingDisabled()) {
      alert(
        "This conversation has been closed. No further messages can be sent."
      );
      return;
    }

    console.log("Proposed Time:", time);

    socketRef.current.emit("message", {
      room,
      message: `Proposed time: ${time} hours`,
      sender,
      recipient,
      type: "time_proposal",
      proposedTime: time,
    });
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle recipient selection for chats
  const handleRecipientClick = (user) => {
    if (user === sender) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("chatWith", user);
    }

    const newUrl = `?recipient=${user}`;
    router.push(newUrl);

    const newRoom = [sender, user].sort().join("_");
    setRoom(newRoom);
    setRecipient(user);
    setSelectedSwapRequest(null);
    setActiveTab("chats");

    // Close sidebar on mobile after selection
    setSidebarOpen(false);

    toggleChat(user);
    setTimeout(() => fetchChatHistory(sender, user), 100);
  };

  // Handle swap request selection
  const handleSwapRequestClick = (swapRequest) => {
    setSelectedSwapRequest(swapRequest);
    setRecipient(null);
    setMessages([]);
    setSidebarOpen(false); // Close sidebar on mobile
  };

  // Accept swap request - Enhanced to handle swap details
  const handleAcceptSwapRequest = async (swapRequestId) => {
    try {
      const acceptedRequest = swapRequests.find(
        (req) => req.id === swapRequestId
      );

      if (!acceptedRequest) {
        alert("Swap request not found");
        return;
      }

      // Store the swap request ID for later use
      setAcceptingSwapRequestId(swapRequestId);

      // Clear selected swap request and open modal
      setSelectedSwapRequest(null);
      setIsModalOpen(true);
      setActiveTab("chats");

      // Add user to chat list immediately so they can see the chat
      if (!chatUsers.includes(acceptedRequest.user)) {
        setChatUsers((prev) => [...prev, acceptedRequest.user]);
      }

      // Set up the chat but don't switch to it yet
      setRecipient(acceptedRequest.user);
      const newRoom = [sender, acceptedRequest.user].sort().join("_");
      setRoom(newRoom);
    } catch (error) {
      console.error("Error accepting swap request:", error);
      alert("Failed to accept swap request");
    }
  };

  // Delete/Reject swap request
  const handleDeleteSwapRequest = async (swapRequestId) => {
    try {
      const response = await api.delete(
        `${BASE_URL}/api/swap-requests/${swapRequestId}`
      );

      if (response.status === 200) {
        setSwapRequests((prev) =>
          prev.filter((req) => req.id !== swapRequestId)
        );
        setSelectedSwapRequest(null);
        alert("Swap request deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting swap request:", error);
      alert("Failed to delete swap request");
    }
  };

  const handleSwapAcceptance = async () => {
    setSwapAccepted(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentSwapId(null);
    setAcceptingSwapRequestId(null);
  };

  // Replace your handleSubmitSwap function with this:
  const handleSubmitSwap = async (swapDetails) => {
    console.log("handleSubmitSwap called with:", swapDetails);

    if (!swapDetails) {
      console.error("swapDetails is undefined!");
      alert("Error: Form data is missing. Please try again.");
      return;
    }

    if (!acceptingSwapRequestId) {
      console.error("acceptingSwapRequestId is missing!");
      alert("Error: No swap request ID found");
      return;
    }

    try {
      // Get the original request details
      const originalRequest = swapRequests.find(
        (req) => req.id === acceptingSwapRequestId
      );

      if (!originalRequest) {
        alert("Original swap request not found");
        return;
      }

      const requestBody = {
        taskName: swapDetails.taskName,
        timeRequired: parseInt(swapDetails.timeRequired),
        description: swapDetails.description,
        deadline: swapDetails.deadline,
      };

      console.log("Sending to API:", requestBody);

      const response = await api.post(
        `${BASE_URL}/api/swap-requests/${acceptingSwapRequestId}/accept`,
        requestBody
      );

      if (response.status === 200) {
        // NOW remove the request from the list since API call succeeded
        setSwapRequests((prev) =>
          prev.filter((req) => req.id !== acceptingSwapRequestId)
        );

        // Create swap details object for the message
        const swapDetailsMessage = {
          swapId: response.data.swapId || acceptingSwapRequestId,
          status: "accepted",
          requesterTask: {
            taskName: originalRequest.taskName,
            description: originalRequest.description,
            timeRequired: originalRequest.timeRequired,
            deadline: originalRequest.deadline,
          },
          responderTask: {
            taskName: swapDetails.taskName,
            description: swapDetails.description,
            timeRequired: swapDetails.timeRequired,
            deadline: swapDetails.deadline,
          },
        };

        // Send the swap details message to the chat
        const roomName = [sender, originalRequest.user].sort().join("_");

        // Send to backend
        await api.post(`${BASE_URL}/message`, {
          room: roomName,
          message: "Swap agreement created",
          sender,
          recipient: originalRequest.user,
          type: "swap_details",
          swapData: swapDetailsMessage,
        });

        // Emit via socket
        socketRef.current.emit("message", {
          room: roomName,
          message: "Swap agreement created",
          sender,
          recipient: originalRequest.user,
          type: "swap_details",
          swapData: swapDetailsMessage,
        });

        // Close modal and switch to the chat
        setIsModalOpen(false);
        setAcceptingSwapRequestId(null);

        // Switch to the chat with this user
        handleRecipientClick(originalRequest.user);

        // Fetch updated chat history
        setTimeout(() => fetchChatHistory(sender, originalRequest.user), 500);

        alert("Swap accepted successfully!");
      }
    } catch (error) {
      console.error("Error accepting swap:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to accept swap request";
      alert(`Error: ${errorMessage}`);
    }
  };

  // Fetch Chat History - Enhanced to handle swap messages and check completion status
  const fetchChatHistory = async (user1, user2) => {
    try {
      const res = await api.get(`${BASE_URL}/messages/${user1}/${user2}`);

      console.log("=== FETCH CHAT HISTORY DEBUG ===");
      console.log("API Response length:", res.data.length);

      let foundSwapId = null;
      let latestSwapStatus = null;

      const formattedMessages = res.data
        .map((msg, index) => {
          // Handle swap details messages
          if (msg.type === "swap_details") {
            const swapStatus = msg.swapData?.status?.toLowerCase();
            foundSwapId = msg.swapData?.swapId;
            latestSwapStatus = swapStatus; // Keep track of latest status

            return {
              type: "swap_details",
              swapData: msg.swapData,
              user: msg.sender,
              time: new Date(msg.timestamp).toLocaleTimeString(),
              timestamp: msg.timestamp,
              seen: msg.seen,
            };
          }
          // Handle system messages
          else if (msg.type === "system") {
            // Check system messages for completion status updates
            if (msg.message.includes("FULLY COMPLETED")) {
              latestSwapStatus = "completed";
            } else if (msg.message.includes("marked their part complete")) {
              latestSwapStatus = "partially_completed";
            }

            return {
              type: "system",
              text: msg.message,
              user: "system",
              time: new Date(msg.timestamp).toLocaleTimeString(),
              timestamp: msg.timestamp,
              seen: msg.seen,
            };
          }
          // Handle regular messages (skip swap type messages)
          else if (msg.type !== "swap") {
            return {
              text: msg.message,
              user: msg.sender,
              time: new Date(msg.timestamp).toLocaleTimeString(),
              timestamp: msg.timestamp,
              seen: msg.seen,
            };
          }
          return null;
        })
        .filter(Boolean);

      console.log("Total formatted messages:", formattedMessages.length);
      console.log("Latest swap status from history:", latestSwapStatus);

      setMessages(formattedMessages);

      // Only set initial status if we don't already have a current status
      // This prevents overriding socket updates
      if (!currentSwapStatus && latestSwapStatus) {
        setCurrentSwapStatus(latestSwapStatus);
        setIsChatDisabled(latestSwapStatus === "completed");
      }

      // Double-check swap status from API if we found a swap
      // But don't override if we already have a current status from sockets
      if (foundSwapId && !currentSwapStatus) {
        setTimeout(() => checkSwapStatusFromAPI(foundSwapId), 100);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };

  // Fetch swap requests

  // Initialize Sender and Room
  useEffect(() => {
    let parsedUser = null;
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        parsedUser = JSON.parse(storedUser);
        setSender(parsedUser.userName);
      }
    }

    const recipientFromURL = searchParams.get("recipient");
    if (parsedUser) {
      let recipient = recipientFromURL;
      if (!recipient) {
        recipient = localStorage.getItem("chatWith");
      } else {
        localStorage.setItem("chatWith", recipientFromURL);
      }
      if (recipient) {
        const roomName = [parsedUser.userName, recipient].sort().join("_");
        setRoom(roomName);
        setRecipient(recipient);
      }
    }
  }, [searchParams]);

  // Fetch Chat Users and Swap Requests
  useEffect(() => {
    if (!sender) return;

    const fetchSwapRequests = async () => {
      try {
        const response = await api.get(
          `${BASE_URL}/api/swap-requests/received/${sender}`
        );
        console.log("Fetched swap requests:", response.data);
        setSwapRequests(response.data);
      } catch (error) {
        console.error("Error fetching swap requests:", error);
      }
    };

    // Fetch chat users
    api
      .get(`${BASE_URL}/chats/${sender}`)
      .then((res) => {
        console.log("Fetched chat users:", res.data);
        setChatUsers(res.data);
      })
      .catch((err) => console.error("Error fetching chat users:", err));

    fetchSwapRequests();
  }, [sender]);

  // Fetch chat history when room + sender ready
  useEffect(() => {
    const recipientFromURL =
      searchParams.get("recipient") || localStorage.getItem("chatWith");
    if (room && sender && recipientFromURL) {
      fetchChatHistory(sender, recipientFromURL);
    }
  }, [room, sender, searchParams]);

  // Send message functions - Updated to check completion status
  const sendMessageToBackend = async ({ room, message, sender, recipient }) => {
    try {
      await api.post(`${BASE_URL}/message`, {
        room,
        message,
        sender,
        recipient,
      });
    } catch (error) {
      console.error("Error sending message to backend:", error);
    }
  };

  const handleSendMessage = async () => {
    if (isMessagingDisabled()) {
      alert(
        "This conversation has been closed. No further messages can be sent."
      );
      return;
    }

    if (message.trim() && socketRef.current && recipient) {
      const roomName = [sender, recipient].sort().join("_");

      socketRef.current.emit("join_room", roomName);

      try {
        await sendMessageToBackend({
          room: roomName,
          message,
          sender,
          recipient,
        });

        socketRef.current.emit("message", {
          room: roomName,
          message,
          sender,
          recipient,
        });

        setRoom(roomName);
        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isMessagingDisabled()) {
        handleSendMessage();
      }
    }
  };

  // Load profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      const chatUsernames = chatUsers.filter((user) => user !== sender);
      const swapRequestUsernames = swapRequests.map((req) => req.user);
      const allUsernames = Array.from(
        new Set([sender, ...chatUsernames, ...swapRequestUsernames])
      );

      if (allUsernames.length === 0) return;

      try {
        const res = await api.post(`${BASE_URL}api/get-user-profiles`, {
          usernames: allUsernames,
        });

        const profilesMap = {};
        res.data.forEach((profile) => {
          profilesMap[profile.username] = profile;
        });
        setUserProfiles(profilesMap);
        console.log("Fetched user profiles:", profilesMap);
      } catch (err) {
        console.error("Failed to fetch user profiles", err);
      }
    };

    if (sender && (chatUsers.length > 0 || swapRequests.length > 0)) {
      fetchProfiles();
    }
  }, [sender, chatUsers, swapRequests]);

  const getFormattedDate = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return null;

    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Mobile-First Sidebar - Green Theme */}
      <div
        className={`fixed top-0 left-0 h-full w-80 sm:w-96 bg-white shadow-2xl z-30 overflow-hidden transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-80 flex flex-col`}
      >
        {/* Sidebar Header - Green Theme */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FaUserCircle className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-white font-semibold text-lg">Messages</h2>
              <p className="text-white/80 text-sm">{sender}</p>
            </div>
          </div>
          <button
            className="lg:hidden text-white hover:bg-white/20 p-2 rounded-full transition-all"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        {/* Simple Tabs - Clean Green Theme */}
        <div className="flex bg-white border-b border-gray-200">
          <div
            className={`flex-1 py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "chats"
                ? "text-green-600 bg-green-50/30 border-b-2 border-green-500"
                : "text-gray-600 hover:text-green-500 hover:bg-green-50/20"
            }`}
            onClick={() => setActiveTab("chats")}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium">Chats</span>
              {chatUsers.filter((user) => user !== sender).length > 0 && (
                <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center">
                  {chatUsers.filter((user) => user !== sender).length}
                </span>
              )}
            </div>
          </div>

          <div className="w-px bg-gray-200"></div>

          <div
            className={`flex-1 py-3 px-4 cursor-pointer transition-all duration-300 ${
              activeTab === "requests"
                ? "text-green-600 bg-green-50/30 border-b-2 border-green-500"
                : "text-gray-600 hover:text-green-500 hover:bg-green-50/20"
            }`}
            onClick={() => setActiveTab("requests")}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm font-medium">Requests</span>
              {swapRequests.length > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] h-4 flex items-center justify-center">
                  {swapRequests.length}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Chats Tab */}
          {activeTab === "chats" && (
            <div className="divide-y divide-gray-100">
              {chatUsers.filter((user) => user !== sender).length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserCircle className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-2">
                    No chats yet
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Start a conversation by accepting a swap request
                  </p>
                </div>
              ) : (
                chatUsers
                  .filter((user) => user !== sender)
                  .map((username) => {
                    const profile = userProfiles[username];
                    const isActive = recipient === username;

                    return (
                      <div
                        key={username}
                        className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                          isActive
                            ? "bg-green-50 border-r-4 border-green-500"
                            : ""
                        }`}
                        onClick={() => handleRecipientClick(username)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {profile?.profileImage ? (
                              <img
                                src={profile.profileImage}
                                alt={`${username} profile`}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <FaUserCircle className="text-white text-xl" />
                              </div>
                            )}
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h3
                                className={`font-medium truncate ${
                                  isActive ? "text-green-700" : "text-gray-900"
                                }`}
                              >
                                {username}
                              </h3>
                              <FaChevronRight
                                className={`text-sm ${
                                  isActive ? "text-green-500" : "text-gray-400"
                                }`}
                              />
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                              Tap to continue conversation
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === "requests" && (
            <div className="divide-y divide-gray-100">
              {swapRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaExchangeAlt className="text-gray-400 text-2xl" />
                  </div>
                  <h3 className="text-gray-600 font-medium mb-2">
                    No requests
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Swap requests will appear here when received
                  </p>
                </div>
              ) : (
                swapRequests.map((swapRequest) => {
                  const profile = userProfiles[swapRequest.user];
                  const isSelected = selectedSwapRequest?.id === swapRequest.id;

                  return (
                    <div
                      key={swapRequest.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-green-50 border-r-4 border-green-500"
                          : ""
                      }`}
                      onClick={() => handleSwapRequestClick(swapRequest)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          {profile?.profileImage ? (
                            <img
                              src={profile.profileImage}
                              alt={`${swapRequest.user} profile`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                              <FaUserCircle className="text-white text-xl" />
                            </div>
                          )}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <FaCircle className="text-white text-xs" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`font-medium truncate ${
                                isSelected ? "text-green-700" : "text-gray-900"
                              }`}
                            >
                              {swapRequest.user}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {new Date(
                                swapRequest.timestamp
                              ).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 truncate mb-1">
                            {swapRequest.taskName}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-2">
                            {swapRequest.description}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                              {swapRequest.timeRequired}h
                            </span>
                            <FaChevronRight
                              className={`text-sm ${
                                isSelected ? "text-green-500" : "text-gray-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="flex-1 flex flex-col lg:ml-0 bg-white">
        {/* When viewing a regular chat */}
        {recipient && !selectedSwapRequest ? (
          <>
            {/* Enhanced Chat Header */}
            {renderChatHeader()}

            {/* Messages Area - Mobile optimized */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-white px-3 sm:px-4 py-4">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((msg, index) => {
                  // Handle swap details messages
                  if (msg.type === "swap_details") {
                    return (
                      <SwapDetailsMessage
                        key={index}
                        swapData={msg.swapData}
                        user={msg.user}
                        timestamp={msg.timestamp}
                      />
                    );
                  }

                  // Handle system messages
                  if (msg.type === "system") {
                    return (
                      <div key={index} className="flex justify-center my-4">
                        <div className="bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm max-w-xs text-center">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  // Handle regular messages - Mobile optimized with Green Theme
                  const isSender = msg.user === sender;
                  const currentDate = getFormattedDate(msg.timestamp);
                  const previousDate =
                    index > 0
                      ? getFormattedDate(messages[index - 1].timestamp)
                      : null;
                  const showDateSeparator =
                    index === 0 || currentDate !== previousDate;
                  const profile = userProfiles[msg.user];

                  return (
                    <div key={index}>
                      {showDateSeparator && currentDate && (
                        <div className="flex justify-center my-4">
                          <div className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full">
                            {currentDate}
                          </div>
                        </div>
                      )}

                      <div
                        className={`flex items-end gap-2 ${
                          isSender ? "justify-end" : "justify-start"
                        } mb-2`}
                      >
                        {/* Profile Icon for received messages */}
                        {!isSender && (
                          <div className="flex-shrink-0">
                            {profile?.profileImage ? (
                              <img
                                src={profile.profileImage}
                                alt={`${msg.user} profile`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                                <FaUserCircle className="text-white text-sm" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Message Bubble - Enhanced mobile design with Green Theme */}
                        <div
                          className={`max-w-[75%] sm:max-w-[70%] px-4 py-3 rounded-2xl shadow-sm break-words relative ${
                            isSender
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-br-md"
                              : "bg-white text-gray-800 border border-gray-100 rounded-bl-md"
                          }`}
                        >
                          {msg.type === "time_proposal" ? (
                            <div>
                              <p className="font-semibold text-sm">
                                Proposed Time: {msg.proposedTime} hours
                              </p>
                              {!msg.accepted &&
                                !isSender &&
                                !isMessagingDisabled() && (
                                  <button
                                    onClick={() =>
                                      handleAcceptTime(msg.proposalIndex)
                                    }
                                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600 text-xs font-medium"
                                  >
                                    Accept Time
                                  </button>
                                )}
                              {msg.accepted && (
                                <span className="text-xs opacity-70 mt-1 block">
                                  ✓ Accepted
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm sm:text-base leading-relaxed">
                              {msg.text}
                            </p>
                          )}

                          {/* Message timestamp */}
                          <div
                            className={`text-xs mt-1 ${
                              isSender ? "text-white/70" : "text-gray-500"
                            }`}
                          >
                            {msg.timestamp &&
                              new Date(msg.timestamp).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "numeric",
                                }
                              )}
                          </div>
                        </div>

                        {/* Profile icon for sent messages with Green Theme */}
                        {isSender && (
                          <div className="flex-shrink-0">
                            {userProfiles[sender]?.profileImage ? (
                              <img
                                src={userProfiles[sender].profileImage}
                                alt="Your profile"
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                                <FaUserCircle className="text-white text-sm" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Enhanced Message Input */}
            {renderMessageInput()}
          </>
        ) : selectedSwapRequest ? (
          /* Enhanced Swap Request View - Mobile optimized with Green Theme */
          <>
            {/* Swap Request Header - Green Theme */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <button
                    className="lg:hidden text-white hover:bg-white/20 p-2 rounded-full transition-all"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                  >
                    <FaBars className="text-lg" />
                  </button>

                  <div className="min-w-0">
                    <div className="text-white font-semibold text-base sm:text-lg">
                      Swap Request
                    </div>
                    <div className="text-white/80 text-sm truncate">
                      from {selectedSwapRequest.user}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedSwapRequest(null);
                    setActiveTab("chats");
                  }}
                  className="bg-white text-green-600 px-3 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-white/90 transition-all"
                >
                  Back
                </button>
              </div>
            </div>

            {/* Enhanced Swap Request Details - Mobile-first design with Green Theme */}
            <div className="flex-1 overflow-y-auto bg-gradient-to-b from-green-50 to-white p-4">
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Profile Header - Green Theme */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-6 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      {userProfiles[selectedSwapRequest.user]?.profileImage ? (
                        <img
                          src={
                            userProfiles[selectedSwapRequest.user].profileImage
                          }
                          alt={`${selectedSwapRequest.user} profile`}
                          className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                          <FaUserCircle className="text-white text-2xl" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {selectedSwapRequest.user}
                        </h3>
                        <p className="text-gray-600">
                          wants to swap skills with you
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                          <FaClock className="text-xs" />
                          {new Date(
                            selectedSwapRequest.timestamp
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="p-6 space-y-6">
                    {/* Task Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Task Name
                      </label>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-900 font-medium text-lg">
                          {selectedSwapRequest.taskName}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Description
                      </label>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <p className="text-gray-900 leading-relaxed">
                          {selectedSwapRequest.description}
                        </p>
                      </div>
                    </div>

                    {/* Time and Deadline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Time Required
                        </label>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                          <p className="text-2xl font-bold text-green-600">
                            {selectedSwapRequest.timeRequired}
                          </p>
                          <p className="text-sm text-gray-500">hours</p>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Deadline
                        </label>
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                          <p className="text-lg font-semibold text-gray-900">
                            {new Date(
                              selectedSwapRequest.deadline
                            ).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-500">deadline</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - Mobile optimized */}
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() =>
                          handleAcceptSwapRequest(selectedSwapRequest.id)
                        }
                        className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <FaCheck className="text-xl" />
                        Accept Request
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteSwapRequest(selectedSwapRequest.id)
                        }
                        className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold text-base shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                      >
                        <FaTrash className="text-xl" />
                        Decline Request
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Enhanced Default Empty State - Mobile optimized with Green Theme */
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 px-6">
            <div className="text-center max-w-md">
              {/* Animated Icon with Green Theme */}
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaExchangeAlt className="text-white text-3xl" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
                Welcome to Skill Swap
              </h2>

              <p className="text-gray-600 text-center leading-relaxed mb-8">
                Connect with others to exchange skills and knowledge.
                {!isSidebarOpen && (
                  <>
                    <br className="sm:hidden" />
                    <span className="sm:hidden">
                      Tap the menu to get started.
                    </span>
                  </>
                )}
              </p>

              {/* Quick actions for mobile with Green Theme */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => {
                    setSidebarOpen(true);
                    setActiveTab("chats");
                  }}
                  className="flex items-center justify-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl hover:bg-green-600 transition-all font-medium shadow-lg"
                >
                  <FaUserCircle />
                  View Chats
                </button>

                <button
                  onClick={() => {
                    setSidebarOpen(true);
                    setActiveTab("requests");
                  }}
                  className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl hover:bg-emerald-600 transition-all font-medium shadow-lg relative"
                >
                  <FaExchangeAlt />
                  View Requests
                  {swapRequests.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                      {swapRequests.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Accept Swap Modal */}
      <AcceptSwapModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipient={recipient}
        onSubmit={handleSubmitSwap}
      />
    </div>
  );
}
