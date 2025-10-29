import React, { useState, useEffect } from 'react';
import { FaTimes, FaLightbulb, FaCheck, FaTimes as FaTimesIcon, FaTrophy, FaBolt } from 'react-icons/fa';
import { getPuzzlesForAlgorithm } from '../data/puzzleData.js';
import { authenticatedFetch } from '../utils/auth.js';

const PuzzleMode = ({ isOpen, onClose, algorithm, onXPUpdate }) => {
  const [puzzles, setPuzzles] = useState([]);
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [result, setResult] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [solvedPuzzles, setSolvedPuzzles] = useState(new Set());
  const [allCompleted, setAllCompleted] = useState(false);

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
          className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white p-6 rounded-t-2xl z-10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaTrophy className="text-3xl" />
                <div>
                  <h2 className="text-2xl font-bold">Puzzle Mode</h2>
                  <p className="text-sm opacity-90">{algorithm}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold">Progress:</span>
              <div className="flex-1 bg-white/30 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-500"
                  style={{ width: `${(solvedPuzzles.size / puzzles.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-bold">{solvedPuzzles.size}/{puzzles.length}</span>
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
                    <div className="mt-3 inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg">
                      <FaBolt className="text-yellow-500" />
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
                <div className="mt-2 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                  <p className="text-sm text-gray-700">{currentPuzzle.hint}</p>
                </div>
              )}
            </div>

            {/* Result Message */}
            {result && (
              <div className={`mb-4 p-4 rounded-xl border-2 ${
                result.success 
                  ? 'bg-green-50 border-green-400 text-green-800' 
                  : 'bg-red-50 border-red-400 text-red-800'
              }`}>
                <div className="flex items-start gap-3">
                  {result.success ? (
                    <FaCheck className="text-2xl text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <FaTimesIcon className="text-2xl text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">{result.message}</p>
                    {result.xpGained && (
                      <p className="text-sm flex items-center gap-2 mt-2">
                        <FaBolt className="text-yellow-500" />
                        <span className="font-semibold">+{result.xpGained} XP earned!</span>
                      </p>
                    )}
                    {result.hint && !result.success && (
                      <p className="text-sm mt-2 text-gray-700">💡 {result.hint}</p>
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
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      Next Puzzle →
                    </button>
                  ) : result?.allComplete ? (
                    <button
                      onClick={onClose}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                    >
                      🏆 Finish & Close
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSubmit}
                        disabled={loading || solvedPuzzles.has(currentPuzzle.id)}
                        className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white font-bold py-3 px-6 rounded-xl hover:from-[#F7931E] hover:to-[#FF6B35] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                      >
                        {loading ? 'Checking...' : solvedPuzzles.has(currentPuzzle.id) ? 'Already Solved ✅' : 'Submit Solution'}
                      </button>
                      <button
                        onClick={() => setUserCode(currentPuzzle.starterCode)}
                        className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
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

