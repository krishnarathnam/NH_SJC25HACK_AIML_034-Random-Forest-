import React, { useState, useEffect } from 'react';
import { FaTimes, FaTrophy, FaBolt, FaStar, FaFire } from 'react-icons/fa';
import { getCurrentUser, authenticatedFetch } from '../utils/auth.js';

const UserDashboard = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [algorithmProgress, setAlgorithmProgress] = useState([]);
  const [sessionScores, setSessionScores] = useState([]);
  const [skillDistribution, setSkillDistribution] = useState({ beginner: 0, intermediate: 0, advanced: 0 });
  const [loading, setLoading] = useState(true);
  const currentUser = getCurrentUser();

  const algorithms = [
    'Selection Sort',
    'Bubble Sort', 
    'Insertion Sort',
    'Merge Sort',
    'Quick Sort',
    'Heap Sort'
  ];

  useEffect(() => {
    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch all algorithm progress
      const progressPromises = algorithms.map(async (algo) => {
        try {
          const res = await authenticatedFetch(`http://localhost:3001/api/progress/${algo}`);
          const data = await res.json();
          return {
            algorithm: algo,
            percent: data.percent || 0,
            level: data.level || 'beginner',
            totalXP: data.totalXpFromMilestones || 0,
            isCompleted: data.isCompleted || false
          };
        } catch (err) {
          return {
            algorithm: algo,
            percent: 0,
            level: 'beginner',
            totalXP: 0,
            isCompleted: false
          };
        }
      });

      const progress = await Promise.all(progressPromises);
      setAlgorithmProgress(progress);

      // Fetch session scores for skill distribution
      try {
        const sessionsRes = await authenticatedFetch('http://localhost:3001/api/user/sessions');
        const sessionsData = await sessionsRes.json();
        
        if (sessionsData.success && sessionsData.sessions) {
          setSessionScores(sessionsData.sessions);
          
          // Calculate skill level distribution based on scores
          const distribution = { beginner: 0, intermediate: 0, advanced: 0 };
          sessionsData.sessions.forEach(session => {
            const level = session.level || 'intermediate';
            distribution[level] = (distribution[level] || 0) + 1;
          });
          setSkillDistribution(distribution);
        }
      } catch (err) {
        console.error('Failed to fetch session scores:', err);
      }

      // Calculate total stats
      const totalXP = progress.reduce((sum, p) => sum + p.totalXP, 0);
      const completedCount = progress.filter(p => p.isCompleted).length;
      
      setUserData({
        name: currentUser?.name || 'User',
        email: currentUser?.email || '',
        totalXP,
        completedAlgorithms: completedCount,
        totalAlgorithms: algorithms.length
      });
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-300';
    }
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-700 border-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getProgressColor = (percent) => {
    if (percent === 0) return 'bg-gray-200';
    if (percent < 25) return 'bg-blue-200';
    if (percent < 50) return 'bg-blue-400';
    if (percent < 75) return 'bg-purple-400';
    if (percent < 100) return 'bg-purple-600';
    return 'bg-green-500';
  };

  const getProgressIntensity = (percent) => {
    if (percent === 0) return 'opacity-20';
    if (percent < 25) return 'opacity-40';
    if (percent < 50) return 'opacity-60';
    if (percent < 75) return 'opacity-80';
    return 'opacity-100';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Dashboard Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#023047] to-[#8B5CF6] text-white p-6 rounded-t-2xl z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">User Dashboard</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            {/* User Info */}
            {!loading && userData && (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold">{userData.name}</p>
                  <p className="text-sm opacity-90">{userData.email}</p>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B5CF6] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard...</p>
            </div>
          ) : (
            <div className="p-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                  <FaBolt className="text-3xl mb-2" />
                  <p className="text-3xl font-bold">{userData?.totalXP || 0}</p>
                  <p className="text-sm opacity-90">Total XP Earned</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white shadow-lg">
                  <FaTrophy className="text-3xl mb-2" />
                  <p className="text-3xl font-bold">{userData?.completedAlgorithms || 0}/{userData?.totalAlgorithms || 6}</p>
                  <p className="text-sm opacity-90">Algorithms Mastered</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white shadow-lg">
                  <FaFire className="text-3xl mb-2" />
                  <p className="text-3xl font-bold">
                    {Math.round(algorithmProgress.reduce((sum, p) => sum + p.percent, 0) / algorithms.length)}%
                  </p>
                  <p className="text-sm opacity-90">Overall Progress</p>
                </div>
              </div>

              {/* Algorithm Progress Heatmap */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaStar className="text-yellow-500" />
                  Algorithm Progress Heatmap
                </h3>
                
                {/* Legend */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <span>Progress Intensity:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gray-200 rounded"></div>
                    <span>0%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-400 rounded"></div>
                    <span>25%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-400 rounded"></div>
                    <span>50%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded"></div>
                    <span>75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded"></div>
                    <span>100%</span>
                  </div>
                </div>

                {/* Heatmap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {algorithmProgress.map((algo) => (
                    <div
                      key={algo.algorithm}
                      className="border-2 border-gray-200 rounded-xl p-4 hover:border-[#8B5CF6] transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-gray-800">{algo.algorithm}</h4>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getLevelBadge(algo.level)}`}>
                          {algo.level.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span className="font-bold">{algo.percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(algo.percent)} transition-all duration-500`}
                            style={{ width: `${algo.percent}%` }}
                          />
                        </div>
                      </div>

                      {/* Visual Heatmap Cells */}
                      <div className="grid grid-cols-10 gap-1 mb-3">
                        {[...Array(10)].map((_, i) => {
                          const threshold = (i + 1) * 10;
                          const isActive = algo.percent >= threshold;
                          return (
                            <div
                              key={i}
                              className={`h-6 rounded transition-all ${
                                isActive 
                                  ? `${getProgressColor(algo.percent)} ${getProgressIntensity(algo.percent)}`
                                  : 'bg-gray-100'
                              }`}
                              title={`${threshold}%`}
                            />
                          );
                        })}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-purple-600">
                          <FaBolt className="text-xs" />
                          <span className="font-semibold">{algo.totalXP} XP</span>
                        </div>
                        {algo.isCompleted && (
                          <div className="flex items-center gap-1 text-green-600">
                            <FaTrophy className="text-xs" />
                            <span className="font-semibold">Completed!</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Overview - Updated with Skill Distribution */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Overview</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="bg-green-500 text-white rounded-lg p-4 mb-2">
                      <p className="text-3xl font-bold">
                        {skillDistribution.beginner}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Beginner</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-yellow-500 text-white rounded-lg p-4 mb-2">
                      <p className="text-3xl font-bold">
                        {skillDistribution.intermediate}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Intermediate</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-red-500 text-white rounded-lg p-4 mb-2">
                      <p className="text-3xl font-bold">
                        {skillDistribution.advanced}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700">Advanced</p>
                  </div>
                </div>
                
                {/* Average Score Display */}
                {sessionScores.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-300">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold text-gray-700">Average Adaptive Score</span>
                      <span className="text-2xl font-bold text-[#023047]">
                        {Math.round(sessionScores.reduce((sum, s) => sum + (s.score || 50), 0) / sessionScores.length)}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;

