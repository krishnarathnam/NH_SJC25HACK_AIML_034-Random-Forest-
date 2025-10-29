import React, { useState, useEffect } from 'react';
import { FaTimes, FaLightbulb, FaCheck, FaTimes as FaTimesIcon, FaTrophy, FaBolt } from 'react-icons/fa';
import { getPuzzlesForAlgorithm } from '../data/puzzleData.js';
import { authenticatedFetch } from '../utils/auth.js';

const getAlgorithmTheme = (algo) => {
  const map = {
    'Bubble Sort': { from: '#FF6B6B', to: '#F06595', accent: '#FF6B6B', badgeBg: '#FFE3E3', badgeText: '#C92A2A' },
    'Selection Sort': { from: '#F59E0B', to: '#F97316', accent: '#F59E0B', badgeBg: '#FEF3C7', badgeText: '#92400E' },
    'Insertion Sort': { from: '#10B981', to: '#34D399', accent: '#10B981', badgeBg: '#D1FAE5', badgeText: '#065F46' },
    'Merge Sort': { from: '#3B82F6', to: '#60A5FA', accent: '#3B82F6', badgeBg: '#DBEAFE', badgeText: '#1E40AF' },
    'Quick Sort': { from: '#A78BFA', to: '#8B5CF6', accent: '#8B5CF6', badgeBg: '#EDE9FE', badgeText: '#5B21B6' },
    'Heap Sort': { from: '#EC4899', to: '#F472B6', accent: '#EC4899', badgeBg: '#FCE7F3', badgeText: '#9D174D' },
  };
  return map[algo] || { from: '#6366F1', to: '#60A5FA', accent: '#6366F1', badgeBg: '#EEF2FF', badgeText: '#3730A3' };
};

const PuzzleMode = ({ isOpen, onClose, algorithm, onXPUpdate }) => {
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState(new Set());
  const [allCompleted, setAllCompleted] = useState(false);

  const theme = getAlgorithmTheme(algorithm);

  useEffect(() => {
    if (isOpen && algorithm) {
      loadPuzzleData();
    }
  }, [isOpen, algorithm]);

  const loadPuzzleData = async () => {
    const algorithmPuzzles = getPuzzlesForAlgorithm(algorithm);
    setPuzzles(algorithmPuzzles);
    
    // Fetch completed puzzles from backend
    try {
      const response = await authenticatedFetch(
        `http://localhost:3001/api/puzzle/completed/${algorithm}`
      );
      const data = await response.json();
      
      if (data.success) {
        const completed = new Set(data.completedPuzzles || []);
        setSolvedPuzzles(completed);
        
        // Check if all puzzles are completed
        if (completed.size === algorithmPuzzles.length && algorithmPuzzles.length > 0) {
          setAllCompleted(true);
          setResult({
            success: true,
            message: '🏆 You have completed all puzzles for ' + algorithm + '!',
            allComplete: true
          });
        } else {
          // Find first unsolved puzzle
          const firstUnsolvedIndex = algorithmPuzzles.findIndex(p => !completed.has(p.id));
          const startIndex = firstUnsolvedIndex >= 0 ? firstUnsolvedIndex : 0;
          setCurrentPuzzleIndex(startIndex);
          setUserCode(algorithmPuzzles[startIndex]?.starterCode || '');
          setAllCompleted(false);
        }
      } else {
        setCurrentPuzzleIndex(0);
        setUserCode(algorithmPuzzles[0]?.starterCode || '');
      }
      
      setResult(null);
      setShowHint(false);
    } catch (error) {
      console.error('Failed to load puzzle data:', error);
      setCurrentPuzzleIndex(0);
      setUserCode(algorithmPuzzles[0]?.starterCode || '');
      setResult(null);
      setShowHint(false);
    }
  };

  const currentPuzzle = puzzles[currentPuzzleIndex];

  const handleSubmit = async () => {
    if (!userCode.trim()) {
      setResult({ success: false, message: 'Please write some code first!' });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Send code to backend for LLM evaluation
      const response = await authenticatedFetch('http://localhost:3001/api/puzzle/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithm,
          puzzleId: currentPuzzle.id,
          userCode,
          solution: currentPuzzle.solution,
          testCases: currentPuzzle.testCases
        })
      });

      const data = await response.json();

      if (data.success && data.isCorrect) {
        setResult({ 
          success: true, 
          message: '🎉 Perfect! You solved it!',
          xpGained: currentPuzzle.xpReward
        });
        
        // Mark puzzle as solved
        setSolvedPuzzles(prev => new Set([...prev, currentPuzzle.id]));

        // Award XP
        if (onXPUpdate) {
          onXPUpdate(currentPuzzle.xpReward);
        }
      } else {
        setResult({ 
          success: false, 
          message: data.feedback || '❌ Not quite right. Try again!',
          hint: data.hint
        });
      }
    } catch (error) {
      console.error('Puzzle check error:', error);
      setResult({ 
        success: false, 
        message: '❌ Error checking solution. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNextPuzzle = () => {
    // Find next unsolved puzzle
    let nextIndex = currentPuzzleIndex + 1;
    while (nextIndex < puzzles.length && solvedPuzzles.has(puzzles[nextIndex].id)) {
      nextIndex++;
    }
    
    if (nextIndex < puzzles.length) {
      setCurrentPuzzleIndex(nextIndex);
      setUserCode(puzzles[nextIndex].starterCode);
      setResult(null);
      setShowHint(false);
    } else {
      // All puzzles completed
      setAllCompleted(true);
      setResult({ 
        success: true, 
        message: '🏆 Congratulations! You completed all puzzles for ' + algorithm + '!',
        allComplete: true
      });
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen || !currentPuzzle) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="bg-white w-[85%] max-w-3xl max-h-[90vh] overflow-auto pointer-events-auto"
          style={{ borderRadius: '4px', boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.15)' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Puzzle Mode</h2>
              <p className="text-sm text-gray-500 mt-0.5">{algorithm}</p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              aria-label="Close"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-8 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-gray-700">Progress</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-500"
                  style={{ width: `${(solvedPuzzles.size / puzzles.length) * 100}%`, backgroundColor: theme.accent }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{solvedPuzzles.size}/{puzzles.length}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {allCompleted ? (
              /* All Puzzles Completed View */
              <div className="text-center py-12">
                <FaTrophy className="text-8xl text-yellow-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-gray-800 mb-3">
                  🎉 All Puzzles Completed!
                </h3>
                <p className="text-gray-600 text-lg mb-6">
                  You've mastered all coding challenges for {algorithm}
                </p>
                <div className="inline-flex items-center gap-3 bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold text-lg">
                  <FaCheck className="text-2xl" />
                  <span>{solvedPuzzles.size}/{puzzles.length} Puzzles Solved</span>
                </div>
                <div className="mt-8">
                  <button
                    onClick={onClose}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-8 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Close & Continue Learning
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Puzzle Info */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold text-gray-800">{currentPuzzle.title}</h3>
                      {solvedPuzzles.has(currentPuzzle.id) && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300">
                          ✅ COMPLETED
                        </span>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(currentPuzzle.difficulty)}`}>
                      {currentPuzzle.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{currentPuzzle.description}</p>
                  
                  {/* XP Reward Badge */}
                  {!solvedPuzzles.has(currentPuzzle.id) && (
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-lg" style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}>
                      <FaBolt style={{ color: theme.accent }} />
                      <span className="font-semibold">+{currentPuzzle.xpReward} XP Reward</span>
                    </div>
                  )}
                </div>

            {/* Code Editor */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Solution:
              </label>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm bg-gray-50 border-2 border-gray-300 rounded-xl focus:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/20"
                placeholder="Write your code here..."
                spellCheck="false"
              />
            </div>

            {/* Hint Button */}
            <div className="mb-4">
              <button
                onClick={() => setShowHint(!showHint)}
                className="flex items-center gap-2 text-yellow-600 hover:text-yellow-700 font-semibold transition-colors"
              >
                <FaLightbulb className="text-lg" />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-gray-50 rounded" style={{ borderLeft: `3px solid ${theme.accent}` }}>
                  <p className="text-sm text-gray-700">{currentPuzzle.hint}</p>
                </div>
              )}
            </div>

            {result && (
              <div className={`mb-4 p-3 rounded border ${
                result.success 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-start gap-2">
                  {result.success ? (
                    <FaCheck className="text-lg flex-shrink-0 mt-0.5" />
                  ) : (
                    <FaTimesIcon className="text-lg flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm mb-1">{result.message}</p>
                    {result.xpGained && (
                      <p className="text-xs flex items-center gap-1 mt-1">
                        <FaBolt className="text-yellow-500" />
                        <span className="font-medium">+{result.xpGained} XP earned!</span>
                      </p>
                    )}
                    {result.hint && !result.success && (
                      <p className="text-xs mt-1 text-gray-700">💡 {result.hint}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {result?.success && !result?.allComplete ? (
                    <button
                      onClick={handleNextPuzzle}
                      className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors"
                      style={{ borderRadius: '3px' }}
                    >
                      Next Puzzle →
                    </button>
                  ) : result?.allComplete ? (
                    <button
                      onClick={onClose}
                      className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors"
                      style={{ borderRadius: '3px' }}
                    >
                      🏆 Finish & Close
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={loading || solvedPuzzles.has(currentPuzzle.id)}
                        className="flex-1 px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ borderRadius: '3px' }}
                      >
                        {loading ? 'Checking...' : solvedPuzzles.has(currentPuzzle.id) ? 'Already Solved ✅' : 'Submit Solution'}
                      </button>
                      <button
                        onClick={() => setUserCode(currentPuzzle.starterCode)}
                        className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
                        style={{ borderRadius: '3px' }}
                      >
                        Reset Code
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PuzzleMode;

