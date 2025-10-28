import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaCrown, FaBolt, FaStar, FaFire } from 'react-icons/fa';
import { getCurrentUser } from './utils/auth.js';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const response = await fetch('http://localhost:3001/api/leaderboard');
        const data = await response.json();
        setLeaderboard(data.leaderboard || []);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, []);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-400 text-2xl animate-pulse" />;
    if (rank === 2) return <FaTrophy className="text-gray-400 text-xl" />;
    if (rank === 3) return <FaMedal className="text-orange-400 text-xl" />;
    return null;
  };

  const getRankDisplay = (rank) => {
    if (rank <= 3) return getRankIcon(rank);
    return <span className="font-bold text-gray-600">#{rank}</span>;
  };

  const getRankStyle = (rank) => {
    if (rank === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white shadow-lg shadow-yellow-400/50';
    if (rank === 2) return 'bg-gradient-to-br from-gray-300 to-gray-500 text-white shadow-lg shadow-gray-400/50';
    if (rank === 3) return 'bg-gradient-to-br from-orange-400 to-orange-600 text-white shadow-lg shadow-orange-400/50';
    return 'bg-gradient-to-br from-blue-50 to-blue-100 text-gray-700';
  };

  const isCurrentUser = (userId) => {
    return currentUser && userId.toString() === currentUser.id.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaTrophy className="text-6xl text-yellow-500 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600 font-semibold">Loading champions...</p>
        </div>
      </div>
    );
  }

  const topThree = leaderboard.slice(0, 3);
  const restOfLeaders = leaderboard.slice(3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div 
        className="bg-gradient-to-br from-[#023047] via-[#8B5CF6] to-[#023047] text-white py-20 relative overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(rgba(145, 145, 145, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom right, #023047, #8B5CF6, #023047)
          `,
          backgroundSize: '24px 24px, 100% 100%',
        }}
      >
        {/* Animated floating icons */}
        <div className="absolute inset-0 opacity-10">
          <FaStar className="absolute top-20 left-10 text-3xl animate-bounce" style={{ animationDelay: '0s' }} />
          <FaBolt className="absolute top-40 right-20 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }} />
          <FaTrophy className="absolute bottom-20 left-1/4 text-3xl animate-bounce" style={{ animationDelay: '1s' }} />
          <FaCrown className="absolute top-32 right-1/3 text-4xl animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-4 mb-4">
            <FaTrophy className="text-5xl text-yellow-300 animate-pulse" />
            <h1 className="font-pixel-large text-white drop-shadow-lg">HALL OF FAME</h1>
            <FaTrophy className="text-5xl text-yellow-300 animate-pulse" />
          </div>
          <p className="text-xl opacity-90 mb-2">🌟 Elite Sorting Masters 🌟</p>
          <p className="text-sm opacity-75">Compete, Learn, Dominate!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Top 3 Podium */}
        {topThree.length >= 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">🏆 Top Champions 🏆</h2>
            <div className="flex items-end justify-center gap-8 mb-8">
              {/* 2nd Place */}
              <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-2xl p-6 shadow-2xl border-4 border-gray-400 w-48">
                  <div className="flex justify-center mb-3">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <FaTrophy className="text-4xl text-gray-500" />
                    </div>
                  </div>
                  <p className="font-bold text-center text-gray-800 text-lg mb-2 truncate">{topThree[1].name}</p>
                  <div className="bg-white/50 rounded-lg px-3 py-2 text-center mb-2">
                    <p className="text-sm font-semibold text-gray-700">Level {topThree[1].level}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg px-3 py-2 text-center">
                    <p className="font-bold text-white text-lg">{topThree[1].totalXP.toLocaleString()} XP</p>
                  </div>
                </div>
                <div className="bg-gray-400 rounded-t-xl w-40 h-24 mt-4 flex items-center justify-center shadow-lg border-4 border-gray-500">
                  <span className="font-bold text-4xl text-white">2</span>
                </div>
              </div>

              {/* 1st Place - BIGGER */}
              <div className="flex flex-col items-center transform hover:scale-105 transition-transform -mt-8">
                <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-2xl p-8 shadow-2xl border-4 border-yellow-500 w-56 relative">
                  <div className="absolute -top-4 -right-4 bg-yellow-500 rounded-full p-2 shadow-lg animate-spin-slow">
                    <FaStar className="text-2xl text-white" />
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="bg-white rounded-full p-4 shadow-lg">
                      <FaCrown className="text-5xl text-yellow-500 animate-pulse" />
                    </div>
                  </div>
                  <p className="font-bold text-center text-gray-800 text-xl mb-3 truncate">{topThree[0].name}</p>
                  <div className="bg-white/60 rounded-lg px-4 py-2 text-center mb-3">
                    <p className="text-base font-bold text-gray-800">Level {topThree[0].level}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-lg px-4 py-3 text-center">
                    <p className="font-bold text-white text-xl">{topThree[0].totalXP.toLocaleString()} XP</p>
                  </div>
                </div>
                <div className="bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-t-xl w-48 h-32 mt-4 flex items-center justify-center shadow-xl border-4 border-yellow-500">
                  <span className="font-bold text-5xl text-white drop-shadow-lg">1</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center transform hover:scale-105 transition-transform">
                <div className="bg-gradient-to-br from-orange-300 via-orange-400 to-orange-600 rounded-2xl p-6 shadow-2xl border-4 border-orange-500 w-48">
                  <div className="flex justify-center mb-3">
                    <div className="bg-white rounded-full p-3 shadow-lg">
                      <FaMedal className="text-4xl text-orange-600" />
                    </div>
                  </div>
                  <p className="font-bold text-center text-white text-lg mb-2 truncate">{topThree[2].name}</p>
                  <div className="bg-white/50 rounded-lg px-3 py-2 text-center mb-2">
                    <p className="text-sm font-semibold text-orange-900">Level {topThree[2].level}</p>
                  </div>
                  <div className="bg-orange-800 rounded-lg px-3 py-2 text-center">
                    <p className="font-bold text-white text-lg">{topThree[2].totalXP.toLocaleString()} XP</p>
                  </div>
                </div>
                <div className="bg-orange-500 rounded-t-xl w-40 h-20 mt-4 flex items-center justify-center shadow-lg border-4 border-orange-600">
                  <span className="font-bold text-4xl text-white">3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
            <FaStar className="text-4xl mx-auto mb-3" />
            <p className="text-4xl font-bold mb-1">{leaderboard.length}</p>
            <p className="text-sm opacity-90">Total Champions</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
            <FaBolt className="text-4xl mx-auto mb-3" />
            <p className="text-4xl font-bold mb-1">
              {leaderboard.reduce((sum, u) => sum + u.totalXP, 0).toLocaleString()}
            </p>
            <p className="text-sm opacity-90">Total XP Earned</p>
          </div>
          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-center text-white shadow-lg transform hover:scale-105 transition-transform">
            <FaFire className="text-4xl mx-auto mb-3" />
            <p className="text-4xl font-bold mb-1">
              {leaderboard.length > 0 ? Math.max(...leaderboard.map(u => u.level)) : 0}
            </p>
            <p className="text-sm opacity-90">Highest Level</p>
          </div>
        </div>

        {/* All Rankings */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#023047] to-[#8B5CF6] px-6 py-4">
            <h2 className="text-xl font-bold text-white">📊 All Rankings</h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {leaderboard.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <FaTrophy className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No champions yet. Be the first! 🚀</p>
              </div>
            ) : (
              leaderboard.map((user, index) => (
                <div
                  key={user.userId}
                  className={`px-6 py-4 flex items-center justify-between transition-all ${
                    isCurrentUser(user.userId) 
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-purple-500 hover:from-purple-100 hover:to-pink-100' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank Badge */}
                    <div className={`w-14 h-14 rounded-full ${getRankStyle(user.rank)} flex items-center justify-center font-bold shadow-md`}>
                      {getRankDisplay(user.rank)}
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-lg text-gray-900">{user.name}</p>
                        {isCurrentUser(user.userId) && (
                          <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-3 py-1 rounded-full font-semibold animate-pulse">
                            YOU
                          </span>
                        )}
                        {user.rank <= 10 && user.rank > 3 && (
                          <span className="text-yellow-500 text-sm">⭐</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                          Level {user.level}
                        </span>
                        {user.level >= 5 && (
                          <FaFire className="text-orange-500 text-sm" title="High Level!" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* XP Display */}
                  <div className="text-right">
                    <p className="font-bold text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {user.totalXP.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 font-semibold">EXPERIENCE</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer Message */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 border-2 border-yellow-300 rounded-xl px-8 py-4 shadow-lg">
            <p className="font-bold text-gray-800 flex items-center gap-2 justify-center">
              <FaStar className="text-yellow-500" />
              Keep learning and climbing the ranks!
              <FaStar className="text-yellow-500" />
            </p>
            <p className="text-sm text-gray-600 mt-1">Every XP counts towards your legacy! 🚀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
