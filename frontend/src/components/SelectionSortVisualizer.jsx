import React, { useState, useEffect, useRef } from 'react';

const SelectionSortVisualizer = ({ isOpen, onClose }) => {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [minIndex, setMinIndex] = useState(-1);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState('Click "Next" to begin sorting!');
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Generate random array on mount or reset
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    setSorted([]);
    setComparing([]);
    setMinIndex(-1);
    setCurrentIndex(-1);
    setStep(0);
    setIsComplete(false);
    setDescription('Click "Next" to begin sorting!');
  };

  useEffect(() => {
    if (isOpen && array.length === 0) {
      generateArray();
    }
  }, [isOpen]);

  // TTS function to speak description
  const speakDescription = (text) => {
    if (isMuted) return;
    
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Selection Sort Algorithm - one step at a time
  const handleNext = () => {
    if (isComplete) {
      generateArray();
      return;
    }

    const arr = [...array];
    const n = arr.length;
    let currentStep = step;
    const sortedIndices = [...sorted];

    // Calculate which pass we're on
    const passIndex = sortedIndices.length;
    
    if (passIndex >= n - 1) {
      // Sorting complete
      const desc = '✅ Sorting Complete! Click "Next" to generate a new array.';
      setDescription(desc);
      speakDescription(desc);
      setSorted([...Array(n).keys()]);
      setIsComplete(true);
      setComparing([]);
      setMinIndex(-1);
      setCurrentIndex(-1);
      return;
    }

    // Find minimum in remaining unsorted portion
    if (currentStep === 0) {
      // Start new pass
      const desc = `Pass ${passIndex + 1}: Finding minimum in unsorted portion...`;
      setDescription(desc);
      speakDescription(desc);
      setCurrentIndex(passIndex);
      setMinIndex(passIndex);
      setComparing([passIndex]);
      setStep(1);
      return;
    }

    // Scanning through unsorted portion
    const scanIndex = passIndex + currentStep;
    
    if (scanIndex < n) {
      setCurrentIndex(scanIndex);
      setComparing([scanIndex, minIndex]);
      
      if (arr[scanIndex] < arr[minIndex]) {
        setMinIndex(scanIndex);
        const desc = `Found new minimum: ${arr[scanIndex]} at index ${scanIndex}`;
        setDescription(desc);
        speakDescription(desc);
      } else {
        const desc = `Comparing: ${arr[scanIndex]} >= ${arr[minIndex]} (current min)`;
        setDescription(desc);
        speakDescription(desc);
      }
      
      setStep(currentStep + 1);
    } else {
      // Swap minimum with first unsorted element
      let desc;
      if (minIndex !== passIndex) {
        desc = `Swapping ${arr[passIndex]} and ${arr[minIndex]} (minimum)`;
        [arr[passIndex], arr[minIndex]] = [arr[minIndex], arr[passIndex]];
        setArray(arr);
      } else {
        desc = `${arr[passIndex]} is already in correct position`;
      }
      setDescription(desc);
      speakDescription(desc);
      
      sortedIndices.push(passIndex);
      setSorted(sortedIndices);
      setStep(0);
      setComparing([]);
      setMinIndex(-1);
      setCurrentIndex(-1);
    }
  };

  // Reset array
  const handleReset = () => {
    generateArray();
  };

  if (!isOpen) return null;

  // Calculate bar height
  const maxValue = Math.max(...array, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white w-[85%] max-w-3xl max-h-[90vh] overflow-auto" style={{ borderRadius: '4px', boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.15)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Selection Sort</h2>
            <p className="text-sm text-gray-500 mt-0.5">Finds minimum element in each pass</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Visualization Area */}
        <div className="px-8 py-10">
          {/* Description */}
          <div className="mb-10 text-center">
            <div className="inline-block px-4 py-2 bg-yellow-100 text-gray-800 text-sm font-medium" style={{ borderRadius: '3px' }}>
              {description}
            </div>
          </div>

          {/* Array Visualization */}
          <div className="flex items-end justify-center gap-1.5 mb-12" style={{ height: '280px' }}>
            {array.map((value, idx) => {
              const heightPx = (value / maxValue) * 220;
              let barColor = '#D1D5DB'; // gray-300
              
              if (sorted.includes(idx)) {
                barColor = '#10B981'; // green-500
              } else if (idx === minIndex) {
                barColor = '#F59E0B'; // yellow-500
              } else if (comparing.includes(idx)) {
                barColor = '#EF4444'; // red-500
              } else if (idx === currentIndex) {
                barColor = '#3B82F6'; // blue-500
              }

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center flex-1 min-w-0"
                  style={{ height: '280px' }}
                >
                  {/* Value on top */}
                  <div className="h-6 flex items-start justify-center mb-1">
                    <span className="text-xs text-gray-700 font-semibold">{value}</span>
                  </div>
                  
                  {/* Bar */}
                  <div className="flex-1 w-full flex items-end">
                    <div
                      className="w-full transition-all duration-300 min-h-[24px]"
                      style={{ 
                        height: `${heightPx}px`,
                        backgroundColor: barColor,
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  </div>
                  
                  {/* Index below */}
                  <span className="text-xs text-gray-400 mt-2 font-medium">{idx}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mb-8 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-gray-300" style={{ borderRadius: '2px' }}></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500" style={{ borderRadius: '2px' }}></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-yellow-500" style={{ borderRadius: '2px' }}></div>
              <span>Minimum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-500" style={{ borderRadius: '2px' }}></div>
              <span>Sorted</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={handleNext}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors flex items-center gap-2"
              style={{ borderRadius: '3px' }}
            >
              {isComplete ? 'New Array' : 'Next Step'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button
              onClick={handleReset}
              className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
              style={{ borderRadius: '3px' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2"
              style={{ borderRadius: '3px' }}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">Algorithm Details</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Finds minimum element in unsorted portion</p>
            <p>• Swaps it with first unsorted element</p>
            <p>• Time: O(n²) all cases | Space: O(1)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectionSortVisualizer;

