"use client";
import { useState, useEffect } from "react";
import api from "../../utils/api";
import {
  FaTrophy,
  FaUserCircle,
  FaCheck,
  FaClock,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

api.defaults.withCredentials = true;
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [expandedUsers, setExpandedUsers] = useState(new Set());

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get(`${BASE_URL}/api/leaderboard`);
      setLeaderboardData(response.data.leaderboard);
      setCurrentUser(response.data.currentUser);
      setTotalUsers(response.data.totalUsers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    }
  };

  const toggleUserDetails = (userId) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const getBadgeColor = (color) => {
    const colors = {
      gold: "from-yellow-400 to-yellow-600",
      purple: "from-purple-400 to-purple-600",
      blue: "from-blue-400 to-blue-600",
      orange: "from-orange-400 to-orange-600",
      green: "from-green-400 to-green-600",
      gray: "from-gray-400 to-gray-600",
    };
    return colors[color] || colors.gray;
  };

  const getRankMedal = (rank) => {
    if (rank === 1) return { icon: "🥇", color: "text-yellow-500" };
    if (rank === 2) return { icon: "🥈", color: "text-gray-400" };
    if (rank === 3) return { icon: "🥉", color: "text-orange-600" };
    return { icon: `#${rank}`, color: "text-gray-600" };
  };

  if (loading) {
    return (
      <div className="bg-white shadow-xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayedUsers = showAll
    ? leaderboardData.slice(3)
    : leaderboardData.slice(3, 10);

  return (
    <div className="bg-white shadow-xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 md:p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 flex items-center justify-center">
              <FaTrophy className="text-xl md:text-2xl" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Leaderboard</h2>
              <p className="text-white/80 text-xs md:text-sm">
                Top Contributors
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl md:text-3xl font-bold">{totalUsers}</div>
            <div className="text-white/80 text-xs md:text-sm">Total Users</div>
          </div>
        </div>
      </div>

      {/* Current User Card */}
      {currentUser && (
        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div className="relative">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt="Your Profile"
                    className="w-14 h-14 rounded-full object-cover border-3 border-green-500"
                  />
                ) : (
                  <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center">
                    <FaUserCircle className="w-10 h-10 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full px-2 py-0.5 text-xs font-bold text-green-600 border-2 border-green-500">
                  #{currentUser.rank}
                </div>
              </div>
              <div>
                <div className="font-bold text-gray-900">
                  {currentUser.firstName} {currentUser.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  @{currentUser.userName}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">
                  {currentUser.completedSwaps}
                </div>
                <div className="text-xs text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-yellow-600">
                  {currentUser.pendingSwaps || 0}
                </div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {currentUser.cancelledSwaps || 0}
                </div>
                <div className="text-xs text-gray-600">Cancelled</div>
              </div>
              <div
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(
                  currentUser.badge.color
                )} text-white text-sm font-semibold flex items-center gap-1`}
              >
                <span>{currentUser.badge.icon}</span>
                <span>{currentUser.badge.name}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top 3 Podium */}
      {leaderboardData.length >= 3 && (
        <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="flex items-end justify-center gap-2 md:gap-4 flex-wrap md:flex-nowrap">
            {/* 2nd Place */}
            <div className="flex-1 max-w-[200px] md:max-w-xs w-full">
              <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg border-2 border-gray-200 transform translate-y-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2">🥈</div>
                  {leaderboardData[1].profileImage ? (
                    <img
                      src={leaderboardData[1].profileImage}
                      alt={leaderboardData[1].userName}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-2 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <FaUserCircle className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </div>
                  )}
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    {leaderboardData[1].firstName}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    @{leaderboardData[1].userName}
                  </div>
                  <div className="mt-2 text-xl md:text-2xl font-bold text-gray-600">
                    {leaderboardData[1].completedSwaps}
                  </div>
                  <div className="text-xs text-gray-500">completed</div>
                </div>
              </div>
            </div>

            {/* 1st Place */}
            <div className="flex-1 max-w-[200px] md:max-w-xs w-full">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl p-3 md:p-4 shadow-2xl border-2 border-yellow-500 transform scale-105">
                <div className="text-center text-white">
                  <div className="text-3xl md:text-4xl mb-2">🏆</div>
                  {leaderboardData[0].profileImage ? (
                    <img
                      src={leaderboardData[0].profileImage}
                      alt={leaderboardData[0].userName}
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full mx-auto mb-2 object-cover border-3 border-white"
                    />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-white/30 rounded-full mx-auto mb-2 flex items-center justify-center border-3 border-white">
                      <FaUserCircle className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                  )}
                  <div className="font-bold text-base md:text-lg">
                    {leaderboardData[0].firstName}
                  </div>
                  <div className="text-xs md:text-sm opacity-90">
                    @{leaderboardData[0].userName}
                  </div>
                  <div className="mt-2 text-2xl md:text-3xl font-bold">
                    {leaderboardData[0].completedSwaps}
                  </div>
                  <div className="text-xs md:text-sm opacity-90">completed</div>
                </div>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="flex-1 max-w-[200px] md:max-w-xs w-full">
              <div className="bg-white rounded-xl p-3 md:p-4 shadow-lg border-2 border-orange-200 transform translate-y-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl mb-2">🥉</div>
                  {leaderboardData[2].profileImage ? (
                    <img
                      src={leaderboardData[2].profileImage}
                      alt={leaderboardData[2].userName}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-2 object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-orange-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <FaUserCircle className="w-8 h-8 md:w-12 md:h-12 text-white" />
                    </div>
                  )}
                  <div className="font-bold text-gray-900 text-sm md:text-base">
                    {leaderboardData[2].firstName}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    @{leaderboardData[2].userName}
                  </div>
                  <div className="mt-2 text-xl md:text-2xl font-bold text-orange-600">
                    {leaderboardData[2].completedSwaps}
                  </div>
                  <div className="text-xs text-gray-500">completed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rest of Leaderboard (4+) */}
      <div className="p-6 space-y-3 max-h-[600px] overflow-y-auto">
        {displayedUsers.map((user) => {
          const medal = getRankMedal(user.rank);
          const isExpanded = expandedUsers.has(user.userId);

          return (
            <div
              key={user.userId}
              className={`rounded-xl transition-all ${
                user.isCurrentUser
                  ? "bg-green-50 border-2 border-green-300"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer"
                onClick={() => toggleUserDetails(user.userId)}
              >
                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                  <div
                    className={`text-lg md:text-2xl font-bold ${medal.color} min-w-[30px] md:min-w-[40px]`}
                  >
                    {medal.icon}
                  </div>
                  <div className="relative flex-shrink-0">
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.userName}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <FaUserCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs md:text-sm text-gray-600 truncate">
                      @{user.userName} • {user.city}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-lg md:text-xl font-bold text-green-600">
                      {user.completedSwaps}
                    </div>
                    <div className="text-[10px] md:text-xs text-gray-600">
                      Completed
                    </div>
                  </div>
                  <div
                    className={`px-2 md:px-3 py-1 rounded-full bg-gradient-to-r ${getBadgeColor(
                      user.badge.color
                    )} text-white text-[10px] md:text-xs font-semibold whitespace-nowrap`}
                  >
                    {user.badge.icon}{" "}
                    <span className="hidden sm:inline">{user.badge.name}</span>
                  </div>
                  {isExpanded ? (
                    <FaChevronUp className="text-gray-400" />
                  ) : (
                    <FaChevronDown className="text-gray-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FaCheck className="text-green-500" />
                        <span className="text-xs text-gray-600">Completed</span>
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-green-600">
                        {user.completedSwaps}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FaClock className="text-yellow-500" />
                        <span className="text-xs text-gray-600">Pending</span>
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-yellow-600">
                        {user.pendingSwaps || 0}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FaTimes className="text-red-500" />
                        <span className="text-xs text-gray-600">Cancelled</span>
                      </div>
                      <div className="text-xl md:text-2xl font-bold text-red-600">
                        {user.cancelledSwaps || 0}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600">Hours Given</div>
                      <div className="text-lg font-bold text-blue-600">
                        {user.hoursGiven || 0}h
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-2 text-center">
                      <div className="text-xs text-gray-600">
                        Hours Received
                      </div>
                      <div className="text-lg font-bold text-purple-600">
                        {user.hoursReceived || 0}h
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Show More/Less Button */}
        {leaderboardData.length > 10 && (
          <div className="text-center pt-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all font-semibold text-sm shadow-md hover:shadow-lg"
            >
              {showAll
                ? `Show Less`
                : `Show All ${leaderboardData.length - 10} More Users`}
            </button>
          </div>
        )}
      </div>

      {leaderboardData.length === 0 && (
        <div className="p-12 text-center text-gray-500">
          <FaTrophy className="text-5xl mx-auto mb-4 opacity-20" />
          <p className="text-lg">No completed swaps yet</p>
          <p className="text-sm">Be the first to complete a swap!</p>
        </div>
      )}
    </div>
  );
}
