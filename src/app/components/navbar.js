import { useEffect, useState, useCallback } from "react";
import { useSocket } from "../contexts/SocketContext";
import {
  FiBell,
  FiMail,
  FiUser,
  FiHome,
  FiSearch,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiExternalLink,
} from "react-icons/fi";
import {
  FaExchangeAlt,
  FaServicestack,
  FaUserCircle,
  FaPlus,
  FaList,
  FaChartBar,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import api from "../utils/api";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Sidebar({ isCollapsed, setIsCollapsed }) {
  const { socket, notification, setNotification } = useSocket();
  const [notificationCount, setNotificationCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isChatOpen } = useChat();

  const memoizedSetNotification = useCallback(setNotification, [
    setNotification,
  ]);

  useEffect(() => {
    if (user && user.userName) {
      const fetchNotifications = async () => {
        try {
          const response = await api.get(`${BASE_URL}/get-notifications`, {
            params: { recipient: user.userName },
          });
          memoizedSetNotification(response.data.notifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchNotifications();
    }
  }, [user, memoizedSetNotification]);

  useEffect(() => {
    if (socket) {
      socket.on("receive_notification", (notificationData) => {
        memoizedSetNotification((prevNotifications) => [
          ...prevNotifications,
          notificationData,
        ]);
      });
    }
  }, [socket, memoizedSetNotification]);

  useEffect(() => {
    if (notification && Array.isArray(notification)) {
      setNotificationCount(notification.filter((notif) => !notif.seen).length);
    }
  }, [notification]);

  useEffect(() => {
    if (socket && user) {
      socket.emit("my-room", user.userName);
    }
  }, [socket, user]);

  const toggleNotificationDropdown = async () => {
    setIsNotificationDropdownOpen((prev) => !prev);

    if (notificationCount > 0) {
      setNotificationCount(0);
      const unreadNotificationIds = notification
        .filter((notif) => !notif.seen)
        .map((notif) => notif._id);

      try {
        await api.post(`${BASE_URL}/update-notification`, {
          recipient: user.userName,
          notificationIds: unreadNotificationIds,
        });
        memoizedSetNotification((prev) =>
          prev.map((notif) => ({ ...notif, seen: true }))
        );
      } catch (error) {
        console.error(
          "Failed to mark notifications as read:",
          error.response?.data || error.message
        );
      }
    }
  };

  const handleLogout = async () => {
    try {
      await api.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true });
      logout();
      localStorage.removeItem("userId");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navigationItems = [
    { icon: FiHome, label: "Home", href: "/allservices", active: false },
    { icon: FaExchangeAlt, label: "My Swaps", href: "/myswaps", active: false },
    {
      icon: FaList,
      label: "All Services",
      href: "/allservices",
      active: false,
    },
    {
      icon: FaServicestack,
      label: "My Services",
      href: "/myuploadedservices",
      active: false,
    },
    { icon: FaPlus, label: "Offer Service", href: "/services", active: false },
    {
      icon: FaUserCircle,
      label: "My Profile",
      href: "/myprofile",
      active: false,
    },
  ];

  const NavItem = ({
    icon: Icon,
    label,
    href,
    badge,
    onClick,
    active = false,
  }) => (
    <div className="relative">
      {href ? (
        <Link href={href}>
          <div
            className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer group hover:bg-green-50 ${
              active
                ? "bg-green-100 text-green-600"
                : "text-gray-700 hover:text-green-600"
            }`}
          >
            <div className="relative">
              <Icon
                className={`text-xl ${
                  isCollapsed
                    ? ""
                    : "group-hover:scale-110 transition-transform"
                }`}
              />
              {badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {badge}
                </span>
              )}
            </div>
            {!isCollapsed && (
              <span className="font-medium text-base">{label}</span>
            )}
          </div>
        </Link>
      ) : (
        <div
          onClick={onClick}
          className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer group hover:bg-green-50 ${
            active
              ? "bg-green-100 text-green-600"
              : "text-gray-700 hover:text-green-600"
          }`}
        >
          <div className="relative">
            <Icon
              className={`text-xl ${
                isCollapsed ? "" : "group-hover:scale-110 transition-transform"
              }`}
            />
            {badge && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {badge}
              </span>
            )}
          </div>
          {!isCollapsed && (
            <span className="font-medium text-base">{label}</span>
          )}
        </div>
      )}
    </div>
  );

  const NotificationDropdown = () => (
    <div
      key={index}
      onClick={() => {
        // If it's a message notification, navigate to that chat
        if (notif.type === "message" && notif.sender) {
          router.push(`/messages?recipient=${notif.sender}`);
          setIsNotificationDropdownOpen(false);
          setIsMobileMenuOpen(false);
        }
      }}
      className={`px-6 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
        !notif.seen ? "bg-blue-50 border-l-blue-500" : "border-l-transparent"
      }`}
    >
      <p className="text-gray-800 text-sm leading-relaxed">{notif.message}</p>
      <p className="text-xs text-gray-500 mt-1">
        {new Date(notif.createdAt).toLocaleDateString()}
      </p>
    </div>
  );

  if (!user) return null;

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="text-xl font-bold text-green-600">Skill Swap</div>
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiMenu className="text-xl text-gray-700" />
          </button>
        </div>
      </div>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-72"
        } ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "lg:translate-x-0 -translate-x-full lg:block"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div
            className={`flex items-center ${
              isCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!isCollapsed && (
              <Link href="/">
                <div className="font-bold text-green-600 text-2xl">
                  Skill Swap
                </div>
              </Link>
            )}

            <div className="flex items-center gap-2">
              {/* Collapse Toggle - Desktop only */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiMenu className="text-gray-600" />
              </button>

              {/* Close Mobile Menu */}
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4 space-y-2">
          {/* Main Navigation */}
          {navigationItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={item.active}
            />
          ))}

          {/* Divider */}
          <div className="h-px bg-gray-200 my-4" />

          {/* Communication */}
          <NavItem icon={FiMail} label="Messages" href="/messages" />

          <div className="relative">
            <NavItem
              icon={FiBell}
              label="Notifications"
              badge={notificationCount}
              onClick={toggleNotificationDropdown}
            />
            {isNotificationDropdownOpen && <NotificationDropdown />}
          </div>
        </div>

        {/* User Section */}
        <div className="border-t border-gray-100 p-4">
          <div
            className={`flex items-center gap-3 p-3 rounded-2xl hover:bg-gray-50 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <FiUser className="text-white" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {user.name || user.userName}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  @{user.userName}
                </p>
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="mt-2">
            <NavItem icon={FiLogOut} label="Logout" onClick={handleLogout} />
          </div>
        </div>
      </div>
      {/* Mobile top spacing */}
      <div className="lg:hidden pt-16" />
    </>
  );
}
