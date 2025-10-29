import _React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BackHandle from './components/BackHandle.jsx'
import SettingsHandle from './components/SettingsHandle.jsx'
import SettingsPanel from './components/SettingsPanel.jsx'
import ChatMessages from './components/ChatMessages.jsx'
import AlgorithmProgress from './components/AlgorithmProgress.jsx'
import InputBar from './components/InputBar.jsx'
import NotesSidebar from './components/NotesSidebar.jsx'
import NotesHandle from './components/NotesHandle.jsx'
import SelectionSortVisualizer from './components/SelectionSortVisualizer.jsx'
import BubbleSortVisualizer from './components/BubbleSortVisualizer.jsx'
import InsertionSortVisualizer from './components/InsertionSortVisualizer.jsx'
import MergeSortVisualizer from './components/MergeSortVisualizer.jsx'
import QuickSortVisualizer from './components/QuickSortVisualizer.jsx'
import HeapSortVisualizer from './components/HeapSortVisualizer.jsx'
import PuzzleMode from './components/PuzzleMode.jsx'
import algorithmData from './data/algorithmData.js'
import useSpeechRecognition from './hooks/useSpeechRecognition.js'
import { authenticatedFetch, getAccessToken } from './utils/auth.js'

const LearningPage = ({ setXpData }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentAlgorithm = location.state?.algorithm || "Selection Sort";
  const contextId = `algo:${currentAlgorithm}`;
  
  console.log(`🔑 Using contextId: ${contextId}`);

  const [chatMessages, setChatMessages] = useState([]);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [visualizerOpen, setVisualizerOpen] = useState(false);
  const [puzzleOpen, setPuzzleOpen] = useState(false);
  
  // Auto-hint feature states
  const [showHintPrompt, setShowHintPrompt] = useState(false);
  const [currentHint, setCurrentHint] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [lastBotMessage, setLastBotMessage] = useState('');

  useEffect(() => {
    async function fetchHistory() {
      try {
        console.log(`📚 Fetching history for contextId=${contextId}`);
        
        const res = await authenticatedFetch(
          `http://localhost:3001/api/history/${contextId}`
        );
        const data = await res.json();
        console.log(`📚 Received history:`, data);

        if (data.history && data.history.length > 0) {
          console.log(`✅ Loading ${data.history.length} messages from history`);
          setChatMessages(
            data.history.map((m, i) => ({
              id: i + 1,
              type: m.role === "student" ? "user" : "bot",
              content: m.content,
            }))
          );
        } else {
          console.log(`ℹ️ No history found, showing welcome message`);
          setChatMessages([
            {
              id: 1,
              type: "bot",
              content: `Welcome to learning ${currentAlgorithm}! Let's begin…`,
            },
          ]);
        }
      } catch (e) {
        console.error("❌ History fetch failed:", e);
        // Show welcome message on error
        setChatMessages([
          {
            id: 1,
            type: "bot",
            content: `Welcome to learning ${currentAlgorithm}! Let's begin…`,
          },
        ]);
      }
    }
    fetchHistory();
  }, [contextId, currentAlgorithm, navigate]);
  const [userInput, setUserInput] = useState('');
  
  const [learnMode, setLearnMode] = useState('guide');
  const [language, setLanguage] = useState('english');
  const [inputMode, setInputMode] = useState('text');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [xpPeekaboo, setXpPeekaboo] = useState(null);
  
  // Progress tracking state
  const [sessionXp, setSessionXp] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [milestoneHit, setMilestoneHit] = useState(null);
  
  const { supported, isListening, text, start, stop, reset } = useSpeechRecognition({ language })
  useEffect(() => { if (text) setUserInput(text) }, [text])

  // Auto-hint timer: Show hint prompt after 15 seconds of inactivity
  useEffect(() => {
    if (!lastBotMessage || userInput.trim().length > 0) {
      // Don't show hint if user is typing
      setShowHintPrompt(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowHintPrompt(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, [lastBotMessage, userInput]);

  // Hide hint when user starts typing
  useEffect(() => {
    if (userInput.trim().length > 0) {
      setShowHint(false);
      setShowHintPrompt(false);
    }
  }, [userInput]);

  // Fetch session XP/level data on mount
  useEffect(() => {
    async function fetchSessionData() {
      try {
        const res = await authenticatedFetch(
          `http://localhost:3001/api/session/${contextId}`
        );
        const data = await res.json();
        if (setXpData && typeof data.xpLevel === 'number') {
          setXpData({
            xpLevel: data.xpLevel,
            currentLevelXP: data.currentLevelXP || 0,
            xpForNextLevel: data.xpForNextLevel || 100,
            totalXP: data.totalXP || 0
          });
        }
        // Update local session XP
        setSessionXp(data.totalXP || 0);
      } catch (e) {
        console.error('Session XP fetch failed:', e);
      }
    }
    fetchSessionData();
  }, [contextId, setXpData]);

  // Fetch progress data on mount
  useEffect(() => {
    async function fetchProgressData() {
      try {
        const res = await authenticatedFetch(
          `http://localhost:3001/api/progress/${currentAlgorithm}`
        );
        const data = await res.json();
        setProgressPercent(data.percent || 0);
      } catch (e) {
        console.error('Progress fetch failed:', e);
      }
    }
    fetchProgressData();
  }, [currentAlgorithm]);

  // Refetch history in selected language when toggled in settings
  useEffect(() => {
    let cancelled = false;
    async function refetch() {
      try {
        const langQuery = language === 'kannada' ? '?language=kannada' : '';
        
        const res = await authenticatedFetch(
          `http://localhost:3001/api/history/${contextId}${langQuery}`
        );
        const data = await res.json();
        if (cancelled) return;
        if (data.history && data.history.length > 0) {
          setChatMessages(
            data.history.map((m, i) => ({
              id: i + 1,
              type: m.role === 'student' ? 'user' : 'bot',
              content: m.content,
            }))
          );
        }
      } catch (e) {
        console.error('History refetch failed:', e);
      }
    }
    refetch();
    return () => { cancelled = true }
  }, [language, contextId]);

  // (Design revert) No special reload overlay on language change

  const algorithm =
    algorithmData[currentAlgorithm] || algorithmData["Selection Sort"];

  // Generate hint based on last bot message
  const generateHint = async () => {
    if (!lastBotMessage) return;

    try {
      const token = getAccessToken();
      const response = await fetch("http://localhost:3001/api/generate-hint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          lastMessage: lastBotMessage,
          algorithm: currentAlgorithm
        }),
      });

      const data = await response.json();
      if (data.success && data.hint) {
        setCurrentHint(data.hint);
        setShowHint(true);
        setShowHintPrompt(false);
      }
    } catch (error) {
      console.error('Failed to generate hint:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Hide hints when user sends a message
    setShowHintPrompt(false);
    setShowHint(false);
    setCurrentHint('');

    // capture before clearing
    const toSend = userInput.trim();

    // append user message
    const userMsgId = Date.now();
    setChatMessages((prev) => [
      ...prev,
      { id: userMsgId, type: "user", content: toSend },
    ]);

    // clear input
    setUserInput("");

    // add loading bubble
    const tempId = userMsgId + 1;
    setChatMessages((prev) => [
      ...prev,
      {
        id: tempId,
        type: "bot",
        content: "Sorty is thinking... 🤔",
        isLoading: true,
      },
    ]);

    try {
      const token = getAccessToken();
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          contextId,
          message: toSend,
          algorithm: currentAlgorithm,
          learnMode,
          language,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setChatMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...msg, content: data.response, isLoading: false }
              : msg
          )
        );

        // Store last bot message for hint generation
        setLastBotMessage(data.response);
        
        // Hide any existing hints when new message arrives
        setShowHintPrompt(false);
        setShowHint(false);
        setCurrentHint('');

        // Trigger XP peekaboo animation
        if (typeof data.xpGain === 'number' && data.xpGain > 0) {
          setXpPeekaboo(data.xpGain);
          setTimeout(() => setXpPeekaboo(null), 2000);
        }

        // Update global XP data for navbar
        if (setXpData && typeof data.xpLevel === 'number') {
          setXpData({
            xpLevel: data.xpLevel,
            currentLevelXP: data.currentLevelXP || 0,
            xpForNextLevel: data.xpForNextLevel || 100,
            totalXP: data.totalXP || 0
          });
        }

        // Update session XP and progress
        if (typeof data.totalXP === 'number') {
          setSessionXp(data.totalXP);
        }
        if (data.progress && typeof data.progress.percent === 'number') {
          const newPercent = data.progress.percent;
          const oldPercent = progressPercent;
          setProgressPercent(newPercent);
          
          // Check if milestone was just hit (progress increased)
          if (data.progress.xpEarned > 0 && newPercent > oldPercent) {
            setMilestoneHit({ 
              percent: newPercent,
              xp: data.progress.xpEarned 
            });
            setTimeout(() => setMilestoneHit(null), 3000);
          }
        }
      } else {
        throw new Error(data.error || "AI error");
      }
    } catch (error) {
      console.error("Error calling Ollama API:", error);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? {
                ...msg,
                content:
                  "Sorry, Sorty is having trouble connecting. Please try again!",
                isLoading: false,
              }
            : msg
        )
      );
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-50 flex relative">
      {/* XP Peekaboo Monster */}
      {xpPeekaboo !== null && (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-50 xp-peekaboo">
          <div className="relative flex flex-col items-center">
            {/* Floating XP text above monster */}
            <div className="absolute -top-16 xp-float">
              <div className="font-pixel text-yellow-400 text-2xl font-bold drop-shadow-lg">
                +{xpPeekaboo} XP
              </div>
            </div>
            {/* Monster logo */}
            <img
              src="/xp_image.png"
              alt="XP Monster"
              className="w-32 h-32 select-none"
              draggable="false"
            />
          </div>
        </div>
      )}

      {/* Milestone Achievement Toast */}
      {milestoneHit && (
        <div className="fixed top-20 right-6 z-50 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎯</span>
            <div>
              <div className="font-bold">Milestone Reached!</div>
              <div className="text-sm">Progress: {milestoneHit.percent}% • +{milestoneHit.xp} XP</div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${notesOpen ? 'mr-0' : ''}`}>
        <BackHandle onBack={() => navigate('/learn')} />

        <SettingsHandle open={settingsOpen} onToggle={() => setSettingsOpen(!settingsOpen)} />
        <SettingsPanel
          open={settingsOpen}
          learnMode={learnMode}
          setLearnMode={setLearnMode}
          language={language}
          setLanguage={setLanguage}
        />

        <div className="relative flex items-center py-3 bg-gradient-to-b from-gray-50 to-white border-b border-gray-100 pr-43 px-6">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
            <AlgorithmProgress 
              progressPercent={progressPercent}
              currentAlgorithm={currentAlgorithm}
            />
          </div>
          
          {/* Action Buttons - Show for all sorting algorithms */}
          {(currentAlgorithm === "Selection Sort" || 
            currentAlgorithm === "Bubble Sort" || 
            currentAlgorithm === "Insertion Sort" ||
            currentAlgorithm === "Merge Sort" ||
            currentAlgorithm === "Quick Sort" ||
            currentAlgorithm === "Heap Sort") && (
            <div className="ml-auto flex gap-3">
              <button
                onClick={() => setPuzzleOpen(true)}
                className="btn-pixel bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white hover:from-[#F7931E] hover:to-[#FF6B35]"
                title={`Puzzle Mode for ${currentAlgorithm}`}
              >
                🎮 PUZZLE
              </button>
              <button
                onClick={() => setVisualizerOpen(true)}
                className="btn-pixel text-[#023047]"
                title={`Open ${currentAlgorithm} Visualizer`}
              >
                VISUALIZE
              </button>
            </div>
          )}
        </div>

        <ChatMessages messages={chatMessages} />

        {/* Auto-Hint Feature */}
        <div className="relative">
          {/* Hint Prompt Button */}
          {showHintPrompt && !showHint && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 animate-fade-in">
              <button
                onClick={generateHint}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-800 px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 font-semibold text-sm"
              >
                💡 Hint?
              </button>
            </div>
          )}

          {/* Hint Display */}
          {showHint && currentHint && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 animate-fade-in">
              <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3 shadow-lg">
                <div className="flex items-start gap-2">
                  <span className="text-xl">💡</span>
                  <p className="text-sm text-gray-800 flex-1">{currentHint}</p>
                  <button
                    onClick={() => setShowHint(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <InputBar
          inputMode={inputMode}
          language={language}
          userInput={userInput}
          setUserInput={setUserInput}
          onSend={handleSendMessage}
          isListening={isListening}
          startListening={start}
          stopListening={stop}
        />
      </div>

      <NotesHandle open={notesOpen} onToggle={() => setNotesOpen(!notesOpen)} />
      <NotesSidebar open={notesOpen} notes={notes} setNotes={setNotes} currentAlgorithm={currentAlgorithm} />

      {/* Visualizer Modals */}
      {currentAlgorithm === "Selection Sort" && (
        <SelectionSortVisualizer 
          isOpen={visualizerOpen}
          onClose={() => setVisualizerOpen(false)}
        />
      )}
      
      {currentAlgorithm === "Bubble Sort" && (
        <BubbleSortVisualizer 
          isOpen={visualizerOpen}
          onClose={() => setVisualizerOpen(false)}
        />
      )}
      
      {currentAlgorithm === "Insertion Sort" && (
        <InsertionSortVisualizer 
          isOpen={visualizerOpen}
          onClose={() => setVisualizerOpen(false)}
        />
      )}
      
      {currentAlgorithm === "Merge Sort" && (
        <MergeSortVisualizer 
          isOpen={visualizerOpen}
          onClose={() => setVisualizerOpen(false)}
        />
      )}
      
      {currentAlgorithm === "Quick Sort" && (
        <QuickSortVisualizer 
          isOpen={visualizerOpen}
          onClose={() => setVisualizerOpen(false)}
        />
      )}
      
      {currentAlgorithm === "Heap Sort" && (
        <HeapSortVisualizer 
          isOpen={visualizerOpen}
          onClose={() => setVisualizerOpen(false)}
        />
      )}

      {/* Puzzle Mode - Available for all algorithms */}
      <PuzzleMode
        isOpen={puzzleOpen}
        onClose={() => setPuzzleOpen(false)}
        algorithm={currentAlgorithm}
        onXPUpdate={async (xpGained) => {
          // Refresh session data to get updated XP
          try {
            const res = await authenticatedFetch(
              `http://localhost:3001/api/session/${contextId}`
            );
            const data = await res.json();
            
            if (setXpData) {
              setXpData({
                xpLevel: data.xpLevel,
                currentLevelXP: data.currentLevelXP,
                xpForNextLevel: data.xpForNextLevel,
                totalXP: data.totalXP
              });
            }
            
            console.log(`🎮 Puzzle completed! +${xpGained} XP. Total: ${data.totalXP}`);
          } catch (error) {
            console.error('Failed to refresh XP:', error);
          }
        }}
      />
    </div>
  );
};

export default LearningPage;
