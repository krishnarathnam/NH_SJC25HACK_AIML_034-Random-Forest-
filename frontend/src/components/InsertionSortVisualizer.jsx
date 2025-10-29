import React, { useState, useEffect } from 'react';

const InsertionSortVisualizer = ({ isOpen, onClose }) => {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [currentKey, setCurrentKey] = useState(-1);
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState('Click "Next Step" to begin sorting!');
  const [isComplete, setIsComplete] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Generate random array on mount or reset
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    setSorted([0]); // First element is considered sorted
    setComparing([]);
    setCurrentKey(-1);
    setStep(0);
    setIsComplete(false);
    setDescription('Click "Next Step" to begin sorting!');
  };

  useEffect(() => {
    if (isOpen && array.length === 0) {
      generateArray();
    }
  }, [isOpen]);

  // TTS function to speak description
  const speakDescription = (text) => {
    if (isMuted) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  // Insertion Sort Algorithm - one step at a time
  const handleNext = () => {
    if (isComplete) {
      generateArray();
      return;
    }

    const arr = [...array];
    const n = arr.length;
    const sortedIndices = [...sorted];

    // Check if sorting is complete
    if (sortedIndices.length >= n) {
      const desc = '✅ Sorting Complete! Click "Next Step" to generate a new array.';
      setDescription(desc);
      speakDescription(desc);
      setSorted([...Array(n).keys()]);
      setIsComplete(true);
      setComparing([]);
      setCurrentKey(-1);
      return;
    }

    // Get the next unsorted element (key)
    const keyIndex = sortedIndices.length;
    
    if (step === 0) {
      // Pick the next element to insert
      setCurrentKey(keyIndex);
      const desc = `Inserting ${arr[keyIndex]} into sorted portion...`;
      setDescription(desc);
      speakDescription(desc);
      setComparing([keyIndex]);
      setStep(keyIndex);
      return;
    }

    const compareIndex = step - 1;

    if (compareIndex >= 0 && arr[compareIndex] > arr[compareIndex + 1]) {
      // Swap elements
      setComparing([compareIndex, compareIndex + 1]);
      [arr[compareIndex], arr[compareIndex + 1]] = [arr[compareIndex + 1], arr[compareIndex]];
      setArray(arr);
      const desc = `Shifting ${arr[compareIndex + 1]} right (${arr[compareIndex]} > ${arr[compareIndex + 1]})`;
      setDescription(desc);
      speakDescription(desc);
      setStep(step - 1);
    } else {
      // Found correct position or reached start
      sortedIndices.push(keyIndex);
      setSorted(sortedIndices);
      setComparing([]);
      setCurrentKey(-1);
      setStep(0);
      
      if (sortedIndices.length < n) {
        const desc = `${arr[compareIndex + 1]} inserted in correct position!`;
        setDescription(desc);
        speakDescription(desc);
      }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Insertion Sort Visualizer</h2>
            <p className="text-sm text-gray-600 mt-1">Watch how Insertion Sort builds the sorted array one element at a time</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/80 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Visualization Area */}
        <div className="p-8">
          {/* Description Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">{description}</p>
          </div>

          {/* Array Visualization */}
          <div className="flex items-end justify-center gap-2 mb-8" style={{ height: '256px' }}>
            {array.map((value, idx) => {
              const heightPx = (value / maxValue) * 200; // 200px max height
              let barColor = 'bg-gray-400';
              
              if (idx < sorted.length && idx !== currentKey) {
                barColor = 'bg-green-500';
              } else if (idx === currentKey) {
                barColor = 'bg-yellow-500';
              } else if (comparing.includes(idx)) {
                barColor = 'bg-red-500';
              }

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-end flex-1 min-w-0"
                >
                  <div
                    className={`w-full ${barColor} transition-all duration-300 rounded-t-lg relative group min-h-[20px]`}
                    style={{ height: `${heightPx}px` }}
                  >
                    {/* Value label on hover */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {value}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2 font-semibold">{value}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Key (Inserting)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Sorted</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2 text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {isComplete ? 'New Array' : 'Next Step'}
            </button>
            
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset
            </button>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`px-6 py-3 font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2 ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title={isMuted ? 'Unmute narration' : 'Mute narration'}
            >
              {isMuted ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
              )}
              {isMuted ? 'Muted' : 'Audio On'}
            </button>
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <h3 className="font-bold text-gray-800 mb-2">How Insertion Sort Works:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Start with the first element (considered sorted)</li>
            <li>Pick the next element (key) from unsorted portion</li>
            <li>Compare key with elements in sorted portion</li>
            <li>Shift larger elements to the right to make space</li>
            <li>Insert the key in its correct position</li>
            <li>Time Complexity: O(n²) | Space Complexity: O(1)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InsertionSortVisualizer;

