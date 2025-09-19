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
} from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import api from "../utils/api.js";
import { useSocket } from "../contexts/SocketContext";
import { useChat } from "../contexts/ChatContext";
import SwapFormModal from "../components/swapformModel";
import { useAuth } from "../contexts/AuthContext";
import ProposeTimeModal from "../components/timeModel.js";
import AcceptSwapModal from "../components/acceptswapModel";
api.defaults.withCredentials = true;

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

  // Refs
  const { socket, socketRef } = useSocket();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const searchParams = useSearchParams();
  const { isChatOpen, toggleChat } = useChat();
  const [isProposeTimeOpen, setIsProposeTimeOpen] = useState(false);

  const handleProposeTime = (time) => {
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

    toggleChat(user);
    setTimeout(() => fetchChatHistory(sender, user), 100);
  };

  // Handle swap request selection
  const handleSwapRequestClick = (swapRequest) => {
    setSelectedSwapRequest(swapRequest);
    setRecipient(null);
    setMessages([]);
  };

  // Accept swap request - Enhanced to handle swap details

  // Replace your handleAcceptSwapRequest function with this:
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

      // DON'T remove the request yet - wait until API call succeeds
      // setSwapRequests((prev) => prev.filter((req) => req.id !== swapRequestId));

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
      const token = localStorage.getItem("token");
      const response = await api.delete(
        `http://localhost:5000/api/swap-requests/${swapRequestId}`
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
    setAcceptingSwapRequestId(null); // Add this line
  };

  // In MessageComponent.js - Update the handleSubmitSwap function

  // Fixed handleSubmitSwap function with better error handling

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
        `http://localhost:5000/api/swap-requests/${acceptingSwapRequestId}/accept`,
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
        await api.post("http://localhost:5000/message", {
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

  // Fetch Chat History - Enhanced to handle swap messages
  const fetchChatHistory = async (user1, user2) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get(
        `http://localhost:5000/messages/${user1}/${user2}`
      );

      console.log("=== FETCH CHAT HISTORY DEBUG ===");
      console.log("API Response length:", res.data.length);
      console.log("Raw API data:", res.data);

      const formattedMessages = res.data
        .map((msg, index) => {
          console.log(`Processing message ${index}:`, {
            type: msg.type,
            sender: msg.sender,
            hasSwapData: !!msg.swapData,
            swapData: msg.swapData,
          });

          if (msg.type === "swap_details") {
            console.log("✅ Found swap_details message!");
            console.log("SwapData content:", msg.swapData);

            return {
              type: "swap_details",
              swapData: msg.swapData,
              user: msg.sender, // This might be the issue - check if sender is ObjectId vs username
              time: new Date(msg.timestamp).toLocaleTimeString(),
              timestamp: msg.timestamp,
              seen: msg.seen,
            };
          } else if (msg.type !== "swap") {
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

      console.log("=== FORMATTED MESSAGES ===");
      console.log("Total formatted messages:", formattedMessages.length);
      console.log(
        "Swap detail messages:",
        formattedMessages.filter((m) => m.type === "swap_details")
      );
      console.log("All formatted messages:", formattedMessages);

      setMessages(formattedMessages);
    } catch (err) {
      console.error("Failed to load chat history:", err);
    }
  };
  // Fetch swap requests
  const fetchSwapRequests = async () => {
    if (!sender) return;

    try {
      const token = localStorage.getItem("token");
      const response = await api.get(
        `http://localhost:5000/api/swap-requests/received/${sender}`
      );

      console.log("Fetched swap requests:", response.data);
      setSwapRequests(response.data);
    } catch (error) {
      console.error("Error fetching swap requests:", error);
    }
  };

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
    if (sender) {
      const token = localStorage.getItem("token");

      api
        .get(`http://localhost:5000/chats/${sender}`)
        .then((res) => {
          console.log("Fetched chat users:", res.data);
          setChatUsers(res.data);
        })
        .catch((err) => console.error("Error fetching chat users:", err));

      fetchSwapRequests();
    }
  }, [sender]);

  // Socket setup - Enhanced to handle swap messages
  useEffect(() => {
    if (!room) return;

    socket.emit("join_room", room);

    const handleMessage = ({ message, sender, timestamp, type, swapData }) => {
      if (type === "swap_details") {
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
      } else {
        setMessages((prev) => [
          ...prev,
          { text: message, user: sender, time: timestamp, timestamp },
        ]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => {
      socket.off("receive_message", handleMessage);
    };
  }, [room, socket]);

  // Fetch chat history when room + sender ready
  useEffect(() => {
    const recipientFromURL =
      searchParams.get("recipient") || localStorage.getItem("chatWith");
    if (room && sender && recipientFromURL) {
      fetchChatHistory(sender, recipientFromURL);
    }
  }, [room, sender, searchParams]);

  // Send message functions
  const sendMessageToBackend = async ({ room, message, sender, recipient }) => {
    try {
      const token = localStorage.getItem("token");
      await api.post("http://localhost:5000/message", {
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
    if (e.key === "Enter" && message.trim()) {
      handleSendMessage();
      e.preventDefault();
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
        const res = await api.post(
          "http://localhost:5000/api/get-user-profiles",
          { usernames: allUsernames }
        );

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

  // Component to render swap details in chat
  const SwapDetailsMessage = ({ swapData, user, timestamp }) => {
    const isSender = user === sender;

    return (
      <div
        className={`flex ${isSender ? "justify-end" : "justify-start"} mb-4`}
      >
        <div className={`max-w-[85%] ${isSender ? "ml-auto" : "mr-auto"}`}>
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <FaExchangeAlt className="text-2xl" />
              <h3 className="text-lg font-bold">Skill Swap Agreement</h3>
            </div>

            {/* Swap Details */}
            <div className="space-y-4">
              {/* Requester Task */}
              {swapData.requesterTask && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FaInfoCircle />
                    Requested Task
                  </h4>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Task:</strong> {swapData.requesterTask.taskName}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {swapData.requesterTask.description}
                    </p>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <FaClock />
                        {swapData.requesterTask.timeRequired}h
                      </span>
                      <span className="flex items-center gap-1">
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
              <div className="bg-white/10 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <FaInfoCircle />
                  Offered Task
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Task:</strong> {swapData.responderTask.taskName}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {swapData.responderTask.description}
                  </p>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {swapData.responderTask.timeRequired}h
                    </span>
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {new Date(
                        swapData.responderTask.deadline
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center pt-2 border-t border-white/20">
                <span className="text-sm opacity-80">
                  Swap ID: {swapData.swapId}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    swapData.status === "pending"
                      ? "bg-yellow-500"
                      : swapData.status === "accepted"
                      ? "bg-green-500"
                      : swapData.status === "completed"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                >
                  {swapData.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Timestamp */}
            <div className="text-xs mt-3 text-right opacity-70">
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

  return (
    <div className="h-screen flex overflow-hidden relative bg-white">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full w-64 bg-white shadow-2xl z-30 overflow-y-auto transition-transform transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:block`}
      >
        {/* Tabs Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
          <button
            className="text-xl text-green-600 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaArrowLeft />
          </button>

          <div className="flex gap-2">
            <button
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                activeTab === "chats"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("chats")}
            >
              Chats
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all relative ${
                activeTab === "requests"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveTab("requests")}
            >
              Requests
              {swapRequests.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {swapRequests.length}
                </span>
              )}
            </button>
          </div>

          <button
            className="text-xl text-red-500 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        {/* Sidebar Content - Chats Tab */}
        {activeTab === "chats" && (
          <div>
            {chatUsers.filter((user) => user !== sender).length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No chats available
              </div>
            ) : (
              chatUsers
                .filter((user) => user !== sender)
                .map((username) => {
                  const profile = userProfiles[username];
                  return (
                    <div
                      key={username}
                      className={`w-full text-left px-4 py-3 hover:bg-green-100 cursor-pointer flex items-center gap-3 transition-all ${
                        recipient === username
                          ? "bg-green-50 border-r-2 border-green-500"
                          : ""
                      }`}
                      onClick={() => handleRecipientClick(username)}
                    >
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={`${username} profile`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-green-500 text-2xl" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-gray-800 font-medium">
                          {username}
                        </span>
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        )}

        {/* Sidebar Content - Message Requests Tab */}
        {activeTab === "requests" && (
          <div>
            {swapRequests.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No message requests
              </div>
            ) : (
              swapRequests.map((swapRequest) => {
                const profile = userProfiles[swapRequest.user];
                return (
                  <div
                    key={swapRequest.id}
                    className={`w-full text-left px-4 py-3 hover:bg-blue-50 cursor-pointer transition-all border-b border-gray-100 ${
                      selectedSwapRequest?.id === swapRequest.id
                        ? "bg-blue-50 border-r-2 border-blue-500"
                        : ""
                    }`}
                    onClick={() => handleSwapRequestClick(swapRequest)}
                  >
                    <div className="flex items-start gap-3">
                      {profile?.profileImage ? (
                        <img
                          src={profile.profileImage}
                          alt={`${swapRequest.user} profile`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="text-blue-600 text-2xl" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900 truncate">
                            {swapRequest.user}
                          </span>
                          <span className="text-sm text-gray-600 truncate">
                            {swapRequest.taskName}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(
                              swapRequest.timestamp
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Main Content Panel */}
      <div className="flex-1 p-4 lg:ml-64 transition-all duration-300 ease-in-out mt-[-30px] h-[95%]">
        <div className="flex flex-col h-full bg-white rounded-2xl shadow-md overflow-hidden">
          {/* When viewing a regular chat */}
          {recipient && !selectedSwapRequest ? (
            <>
              {/* Chat Header */}
              <div className="flex justify-between items-center bg-green-500 px-6 py-6 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <button
                    className="lg:hidden text-2xl text-white hover:scale-110 transition-transform"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                  >
                    <FaBars />
                  </button>
                  <div className="text-xl font-semibold text-white">
                    {recipient}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
                    Complete Swap
                  </button>
                  <button className="bg-white text-green-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all">
                    Cancel Swap
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 bg-gradient-to-r from-green-50 via-green-100 to-green-200 rounded-b-xl shadow-inner overflow-y-auto">
                <div className="space-y-3">
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

                    // Handle regular messages
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
                          <div className="text-center text-sm text-gray-500 my-3">
                            {currentDate}
                          </div>
                        )}

                        <div
                          className={`flex items-start gap-2 ${
                            isSender ? "justify-end" : "justify-start"
                          }`}
                        >
                          {/* Profile Icon */}
                          {!isSender &&
                            (profile?.profileImage ? (
                              <img
                                src={profile.profileImage}
                                alt={`${msg.user} profile`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className="text-gray-600 text-2xl" />
                            ))}

                          {/* Message Box */}
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl shadow-sm break-words ${
                              isSender
                                ? "bg-green-600 text-white"
                                : "bg-white text-gray-800"
                            }`}
                          >
                            {msg.type === "time_proposal" ? (
                              <>
                                <p className="font-semibold">
                                  Proposed Time: {msg.proposedTime} hours
                                </p>
                                {!msg.accepted && !isSender && (
                                  <button
                                    onClick={() =>
                                      handleAcceptTime(msg.proposalIndex)
                                    }
                                    className="mt-2 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                  >
                                    Accept Time
                                  </button>
                                )}
                                {msg.accepted && (
                                  <span className="text-xs text-gray-500 mt-1">
                                    Accepted
                                  </span>
                                )}
                              </>
                            ) : (
                              <p>{msg.text}</p>
                            )}

                            <div className="text-xs mt-1 text-right opacity-70">
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

                          {isSender &&
                            (profile?.profileImage ? (
                              <img
                                src={profile.profileImage}
                                alt={`${msg.user} profile`}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <FaUserCircle className="text-gray-600 text-2xl" />
                            ))}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Message Input */}
              <div className="flex items-center gap-3 p-4 border-t bg-white">
                <textarea
                  className="flex-1 p-3 rounded-2xl bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none transition-all"
                  placeholder="Type your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-500 text-white px-5 py-2 rounded-full hover:bg-green-600 transition-all text-sm font-medium"
                >
                  Send
                </button>
                {/* Propose Time Button */}
                <button
                  onClick={() => setIsProposeTimeOpen(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-all text-sm font-medium"
                >
                  Propose Time
                </button>

                {/* Propose Time Modal */}
                <ProposeTimeModal
                  isOpen={isProposeTimeOpen}
                  onClose={() => setIsProposeTimeOpen(false)}
                  onSubmit={handleProposeTime}
                />
              </div>
            </>
          ) : selectedSwapRequest ? (
            /* When viewing a swap request - IMPROVED CARD DESIGN */
            <>
              {/* Swap Request Header */}
              <div className="flex justify-between items-center bg-blue-500 px-6 py-6 rounded-t-2xl">
                <div className="flex items-center gap-4">
                  <button
                    className="lg:hidden text-2xl text-white hover:scale-110 transition-transform"
                    onClick={() => setSidebarOpen(!isSidebarOpen)}
                  >
                    <FaBars />
                  </button>
                  <div className="text-xl font-semibold text-white">
                    Swap Request from {selectedSwapRequest.user}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedSwapRequest(null);
                    setActiveTab("chats");
                  }}
                  className="bg-white text-blue-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all"
                >
                  Back to Chats
                </button>
              </div>

              {/* Swap Request Details - IMPROVED CARD */}
              <div className="flex-1 p-6 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 overflow-y-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg max-w-2xl mx-auto border border-gray-200">
                  {/* Header with Profile */}
                  <div className="flex items-center gap-6 mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    {userProfiles[selectedSwapRequest.user]?.profileImage ? (
                      <img
                        src={
                          userProfiles[selectedSwapRequest.user].profileImage
                        }
                        alt={`${selectedSwapRequest.user} profile`}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                        <FaUserCircle className="text-white text-3xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedSwapRequest.user}
                      </h3>
                      <p className="text-gray-600 text-lg">
                        wants to swap skills with you
                      </p>
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Task Name
                      </label>
                      <p className="text-lg text-gray-900 font-medium">
                        {selectedSwapRequest.taskName}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Description
                      </label>
                      <p className="text-gray-900 leading-relaxed">
                        {selectedSwapRequest.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Time Required
                        </label>
                        <p className="text-lg text-gray-900 font-medium">
                          {selectedSwapRequest.timeRequired} hours
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                          Deadline
                        </label>
                        <p className="text-lg text-gray-900 font-medium">
                          {new Date(
                            selectedSwapRequest.deadline
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                        Received
                      </label>
                      <p className="text-gray-900">
                        {new Date(
                          selectedSwapRequest.timestamp
                        ).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - PROMINENT STYLING */}
                  <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() =>
                        handleAcceptSwapRequest(selectedSwapRequest.id)
                      }
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaCheck className="text-xl" />
                      Accept Request
                    </button>
                    <button
                      onClick={() =>
                        handleDeleteSwapRequest(selectedSwapRequest.id)
                      }
                      className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl hover:from-red-600 hover:to-red-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FaTrash className="text-xl" />
                      Decline Request
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Default empty state */
            <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-r from-green-50 via-green-100 to-green-200 rounded-2xl">
              <FaUserCircle className="text-green-600 text-6xl mb-4" />
              <h2 className="text-2xl font-bold text-green-700">Skill Swap</h2>
              <p className="text-gray-600 mt-2 text-center px-6">
                Connect, collaborate, and exchange skills with others. Select a
                chat from the left to start a conversation or check your message
                requests.
              </p>
            </div>
          )}
        </div>
      </div>

      <AcceptSwapModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        recipient={recipient}
        onSubmit={handleSubmitSwap}
      />
    </div>
  );
}
