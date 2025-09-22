import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext"; // Import useSocket
import { FiBell, FiMail, FiUser } from "react-icons/fi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext"; // Import useChat to check if chat is open
import api from "../utils/api";
api.defaults.withCredentials = true;
const BASE_URL = import.meta.env.VITE_BACKEND_URL;
export default function Navbar() {
  const { socket, notification, setNotification } = useSocket(); // Access notification from context
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isChatOpen } = useChat(); // Consume ChatContext to check if chat is open
  // Add this at the top of your component

  useEffect(() => {
    if (user && user.userName) {
      // Check if user and userName are available
      const fetchNotifications = async () => {
        try {
          const response = await api.get(`${BASE_URL}/get-notifications`, {
            params: { recipient: user.userName }, // The user's username
          });

          setNotification(response.data.notifications); // Store the fetched notifications
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };

      fetchNotifications();
    }
  }, [user]); // Trigger on component mount or whenever user changes

  useEffect(() => {
    if (socket) {
      socket.on("receive_notification", (notificationData) => {
        // Handle new notification
        setNotification((prevNotifications) => [
          ...prevNotifications,
          notificationData,
        ]);
      });
    }
  }, [socket]);

  // Handle socket notifications
  useEffect(() => {
    if (notification && Array.isArray(notification)) {
      setNotificationCount(notification.filter((notif) => !notif.seen).length); // Count unread notifications
    }
  }, [notification]);

  // Join user to their room when the socket is ready
  useEffect(() => {
    if (socket && user) {
      // Join the user's individual room using their user ID
      socket.emit("my-room", user.userName);
    }
  }, [socket, user]);

  const toggleNotificationDropdown = async () => {
    setIsNotificationDropdownOpen((prev) => !prev);
    setIsUserDropdownOpen(false);

    if (notificationCount > 0) {
      setNotificationCount(0); // Reset unread count when opening dropdown

      // Get the list of notification IDs that are unread
      const unreadNotificationIds = notification
        .filter((notif) => !notif.seen)
        .map((notif) => {
          console.log("Notification:", notif); // Log the notification object to inspect it
          return notif._id;
        });

      console.log("Unread notification IDs:", unreadNotificationIds);

      // Mark notifications as read in the backend using api
      try {
        await api.post(`${BASE_URL}/update-notification`, {
          recipient: user.userName,
          notificationIds: unreadNotificationIds,
        });
        // Mark notifications as read locally
        setNotification((prev) =>
          prev.map((notif) => ({
            ...notif,
            seen: true,
          }))
        );
      } catch (error) {
        console.error(
          "Failed to mark notifications as read:",
          error.response?.data || error.message
        );
      }
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
    setIsNotificationDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await api.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });

      // Clear client state
      logout();
      localStorage.removeItem("userId");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar fixed top-0 left-0 w-full flex items-center justify-between px-6 py-3 bg-white text-gray-800 shadow-md z-50">
      <Link href="/">
        <div className="text-lg font-semibold cursor-pointer">Skill Swap</div>
      </Link>

      <div className="flex items-center space-x-6">
        {/* Notifications */}
        {user && (
          <div className="navbar__notifications relative">
            <FiBell
              className="text-gray-700 text-xl cursor-pointer"
              onClick={toggleNotificationDropdown}
            />
            {notificationCount > 0 && !isChatOpen && (
              <span className="notification__badge absolute -top-1 -right-2 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {notificationCount}
              </span>
            )}
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-64 py-2 z-50">
                <h3 className="font-semibold text-lg px-4 py-2">
                  Notifications
                </h3>
                {notification.length > 0 ? (
                  notification.map((notif, index) => (
                    <div
                      key={index}
                      className={`block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer ${
                        !notif.seen ? "bg-gray-100" : ""
                      }`}
                    >
                      {notif.message}
                    </div>
                  ))
                ) : (
                  <div className="block w-full text-left px-4 py-2 text-gray-500">
                    No notifications yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {/* Messages */}
        {user && (
          <div className="navbar__messages relative">
            <Link href="/messages">
              <FiMail className="text-gray-700 text-xl cursor-pointer" />
            </Link>
          </div>
        )}
        {/* User */}
        {user && (
          <div className="relative">
            <div
              className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center cursor-pointer"
              onClick={toggleUserDropdown}
            >
              <FiUser className="text-white text-lg" />
            </div>

            {isUserDropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md w-40 py-2 z-50">
                <div
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() => router.push("/myprofile")}
                >
                  My Profile
                </div>
                <div
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() => router.push("/myuploadedservices")}
                >
                  My Services
                </div>
                <div
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() => router.push("/services")}
                >
                  Offer Service
                </div>
                <div
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() => router.push("/allservices")}
                >
                  All Services
                </div>
                <div
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={() => router.push("/myswaps")}
                >
                  My Swaps
                </div>

                <div
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
