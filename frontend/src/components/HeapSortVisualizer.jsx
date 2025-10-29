import React, { useState, useEffect } from 'react';

const HeapSortVisualizer = ({ isOpen, onClose }) => {
  const [array, setArray] = useState([]);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [heaping, setHeaping] = useState([]);
  const [description, setDescription] = useState('Click "Next Step" to begin sorting!');
  const [isComplete, setIsComplete] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    setSorted([]);
    setComparing([]);
    setHeaping([]);
    setIsComplete(false);
    setCurrentStep(0);
    setDescription('Click "Next Step" to begin sorting!');
    
    const allSteps = [];
    const arr = [...newArray];
    heapSortSteps(arr, allSteps);
    setSteps(allSteps);
  };

  const heapSortSteps = (arr, steps) => {
    const n = arr.length;

    // Build max heap
    steps.push({
      type: 'build_heap_start',
      description: 'Building max heap from array...'
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapifySteps(arr, n, i, steps);
    }

    steps.push({
      type: 'build_heap_complete',
      description: 'Max heap built! Largest element is at root.'
    });

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        type: 'extract',
        indices: [0, i],
        description: `Extracting max ${arr[0]}, swapping with position ${i}`
      });

      [arr[0], arr[i]] = [arr[i], arr[0]];
      steps.push({
        type: 'swap',
        indices: [0, i],
        array: [...arr],
        sortedIndex: i,
        description: `${arr[i]} is now in final position`
      });

      heapifySteps(arr, i, 0, steps);
    }

    steps.push({
      type: 'final',
      description: 'Last element is in place. Sorting complete!'
    });
  };

  const heapifySteps = (arr, n, i, steps) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    steps.push({
      type: 'heapify_start',
      index: i,
      description: `Heapifying subtree rooted at index ${i}`
    });

    if (left < n) {
      steps.push({
        type: 'compare',
        indices: [left, largest],
        description: `Comparing left child ${arr[left]} with ${arr[largest]}`
      });

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < n) {
      steps.push({
        type: 'compare',
        indices: [right, largest],
        description: `Comparing right child ${arr[right]} with ${arr[largest]}`
      });

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      steps.push({
        type: 'swap_heap',
        indices: [i, largest],
        description: `Swapping ${arr[i]} with ${arr[largest]} to maintain heap property`
      });

      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      steps.push({
        type: 'after_swap',
        indices: [i, largest],
        array: [...arr]
      });

      heapifySteps(arr, n, largest, steps);
    }
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

  const handleNext = () => {
    if (isComplete) {
      generateArray();
      return;
    }

    if (currentStep >= steps.length) {
      const desc = '✅ Sorting Complete! Array is fully sorted.';
      setDescription(desc);
      speakDescription(desc);
      setSorted([...Array(array.length).keys()]);
      setIsComplete(true);
      setComparing([]);
      setHeaping([]);
      return;
    }

    const step = steps[currentStep];
    setDescription(step.description);
    speakDescription(step.description);

    switch (step.type) {
      case 'build_heap_start':
      case 'build_heap_complete':
        setHeaping([]);
        setComparing([]);
        break;
      case 'heapify_start':
        setHeaping([step.index]);
        setComparing([]);
        break;
      case 'compare':
        setComparing(step.indices);
        break;
      case 'extract':
        setComparing(step.indices);
        break;
      case 'swap':
        setArray(step.array);
        setSorted(prev => [...prev, step.sortedIndex]);
        setComparing([]);
        break;
      case 'swap_heap':
        setComparing(step.indices);
        break;
      case 'after_swap':
        setArray(step.array);
        setComparing([]);
        break;
      case 'final':
        setSorted(prev => [...prev, 0]);
        setComparing([]);
        setHeaping([]);
        break;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleReset = () => {
    generateArray();
  };

  if (!isOpen) return null;

  const maxValue = Math.max(...array, 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white w-[85%] max-w-3xl max-h-[90vh] overflow-auto" style={{ borderRadius: '4px', boxShadow: '0 0 0 1px rgba(0,0,0,0.05), 0 20px 40px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 tracking-tight">Heap Sort</h2>
            <p className="text-sm text-gray-500 mt-0.5">Uses binary heap structure for sorting</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded transition-colors" aria-label="Close">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-10">
          <div className="mb-10 text-center">
            <div className="inline-block px-4 py-2 bg-yellow-100 text-gray-800 text-sm font-medium" style={{ borderRadius: '3px' }}>
              {description}
            </div>
          </div>

          <div className="flex items-end justify-center gap-1.5 mb-12" style={{ height: '280px' }}>
            {array.map((value, idx) => {
              const heightPx = (value / maxValue) * 220;
              let barColor = '#D1D5DB';
              
              if (sorted.includes(idx)) {
                barColor = '#10B981';
              } else if (comparing.includes(idx)) {
                barColor = '#EF4444';
              } else if (heaping.includes(idx)) {
                barColor = '#A855F7';
              }

              return (
                <div key={idx} className="flex flex-col items-center flex-1 min-w-0" style={{ height: '280px' }}>
                  <div className="h-6 flex items-start justify-center mb-1">
                    <span className="text-xs text-gray-700 font-semibold">{value}</span>
                  </div>
                  <div className="flex-1 w-full flex items-end">
                    <div className="w-full transition-all duration-300 min-h-[24px]" style={{ height: `${heightPx}px`, backgroundColor: barColor, borderRadius: '2px 2px 0 0' }} />
                  </div>
                  <span className="text-xs text-gray-400 mt-2 font-medium">{idx}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-8 mb-8 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-gray-300" style={{ borderRadius: '2px' }}></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-purple-500" style={{ borderRadius: '2px' }}></div>
              <span>Heapifying</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-red-500" style={{ borderRadius: '2px' }}></div>
              <span>Comparing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-green-500" style={{ borderRadius: '2px' }}></div>
              <span>Sorted</span>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button onClick={handleNext} className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors flex items-center gap-2" style={{ borderRadius: '3px' }}>
              {isComplete ? 'New Array' : 'Next Step'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            <button onClick={handleReset} className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2" style={{ borderRadius: '3px' }}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>

            <button onClick={() => setIsMuted(!isMuted)} className="px-5 py-2.5 border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors flex items-center gap-2" style={{ borderRadius: '3px' }} title={isMuted ? 'Unmute' : 'Mute'}>
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

        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
          <h3 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">Algorithm Details</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>• Builds max heap, then extracts maximum repeatedly</p>
            <p>• Heapifies reduced heap after each extraction</p>
            <p>• Time: O(n log n) all cases | Space: O(1)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeapSortVisualizer;

