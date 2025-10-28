import React, { useState, useEffect } from 'react';

const BubbleSortVisualizer = ({ isOpen, onClose }) => {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [currentPass, setCurrentPass] = useState(0);
  const [step, setStep] = useState(0);
  const [description, setDescription] = useState('Click "Next Step" to begin sorting!');
  const [isComplete, setIsComplete] = useState(false);

  // Generate random array on mount or reset
  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    setSorted([]);
    setComparing([]);
    setCurrentPass(0);
    setStep(0);
    setIsComplete(false);
    setDescription('Click "Next Step" to begin sorting!');
  };

  useEffect(() => {
    if (isOpen && array.length === 0) {
      generateArray();
    }
  }, [isOpen]);

  // Bubble Sort Algorithm - one step at a time
  const handleNext = () => {
    if (isComplete) {
      generateArray();
      return;
    }

    const arr = [...array];
    const n = arr.length;
    const sortedIndices = [...sorted];

    // Check if sorting is complete
    if (sortedIndices.length >= n - 1) {
      setDescription('✅ Sorting Complete! Click "Next Step" to generate a new array.');
      setSorted([...Array(n).keys()]);
      setIsComplete(true);
      setComparing([]);
      return;
    }

    // Calculate which pass we're on and current position
    const pass = currentPass;
    const maxIndex = n - 1 - sortedIndices.length;
    
    if (step === 0 && pass === 0) {
      // Start first pass
      setDescription(`Pass ${pass + 1}: Comparing adjacent elements...`);
      setComparing([0, 1]);
      setStep(1);
      return;
    }

    const currentIndex = step - 1;

    if (currentIndex < maxIndex) {
      // Compare and swap if needed
      const left = currentIndex;
      const right = currentIndex + 1;
      
      setComparing([left, right]);
      
      if (arr[left] > arr[right]) {
        // Swap
        [arr[left], arr[right]] = [arr[right], arr[left]];
        setArray(arr);
        setDescription(`Swapping ${arr[right]} and ${arr[left]} (${arr[right]} > ${arr[left]})`);
      } else {
        setDescription(`No swap needed: ${arr[left]} ≤ ${arr[right]}`);
      }
      
      setStep(step + 1);
    } else {
      // End of pass - largest element is now in place
      sortedIndices.push(maxIndex);
      setSorted(sortedIndices);
      setComparing([]);
      setStep(0);
      setCurrentPass(pass + 1);
      
      if (sortedIndices.length < n - 1) {
        setDescription(`Pass ${pass + 1} complete! Element ${arr[maxIndex]} is in final position.`);
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
            <h2 className="text-2xl font-bold text-gray-800">Bubble Sort Visualizer</h2>
            <p className="text-sm text-gray-600 mt-1">Watch how Bubble Sort compares and swaps adjacent elements</p>
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
              
              if (sorted.includes(idx)) {
                barColor = 'bg-green-500';
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
          </div>
        </div>

        {/* Algorithm Info */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <h3 className="font-bold text-gray-800 mb-2">How Bubble Sort Works:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Compare adjacent elements in the array</li>
            <li>Swap them if they are in the wrong order</li>
            <li>Repeat the process for each pass through the array</li>
            <li>Each pass moves the largest unsorted element to its final position</li>
            <li>Time Complexity: O(n²) | Space Complexity: O(1)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BubbleSortVisualizer;

