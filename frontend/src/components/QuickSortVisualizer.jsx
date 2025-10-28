import React, { useState, useEffect } from 'react';

const QuickSortVisualizer = ({ isOpen, onClose }) => {
  const [array, setArray] = useState([]);
  const [pivot, setPivot] = useState(-1);
  const [comparing, setComparing] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [partitioning, setPartitioning] = useState([]);
  const [description, setDescription] = useState('Click "Next Step" to begin sorting!');
  const [isComplete, setIsComplete] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const generateArray = () => {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(Math.floor(Math.random() * 90) + 10);
    }
    setArray(newArray);
    setSorted([]);
    setComparing([]);
    setPivot(-1);
    setPartitioning([]);
    setIsComplete(false);
    setCurrentStep(0);
    setDescription('Click "Next Step" to begin sorting!');
    
    const allSteps = [];
    const arr = [...newArray];
    quickSortSteps(arr, 0, arr.length - 1, allSteps);
    setSteps(allSteps);
  };

  const quickSortSteps = (arr, low, high, steps) => {
    if (low < high) {
      const pi = partitionSteps(arr, low, high, steps);
      quickSortSteps(arr, low, pi - 1, steps);
      quickSortSteps(arr, pi + 1, high, steps);
    } else if (low === high) {
      steps.push({
        type: 'single',
        index: low,
        description: `Element at index ${low} is in final position`
      });
    }
  };

  const partitionSteps = (arr, low, high, steps) => {
    const pivotValue = arr[high];
    steps.push({
      type: 'select_pivot',
      pivot: high,
      low,
      high,
      description: `Selected pivot: ${pivotValue} at index ${high}`
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        description: `Comparing ${arr[j]} with pivot ${pivotValue}`
      });

      if (arr[j] < pivotValue) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            type: 'swap',
            indices: [i, j],
            array: [...arr],
            description: `Swapping ${arr[i]} and ${arr[j]} (smaller than pivot)`
          });
        }
      }
    }

    i++;
    [arr[i], arr[high]] = [arr[high], arr[i]];
    steps.push({
      type: 'pivot_place',
      indices: [i, high],
      pivot: i,
      array: [...arr],
      description: `Placing pivot ${pivotValue} at its final position (index ${i})`
    });

    return i;
  };

  useEffect(() => {
    if (isOpen && array.length === 0) {
      generateArray();
    }
  }, [isOpen]);

  const handleNext = () => {
    if (isComplete) {
      generateArray();
      return;
    }

    if (currentStep >= steps.length) {
      setDescription('✅ Sorting Complete! All pivots are in their final positions.');
      setSorted([...Array(array.length).keys()]);
      setIsComplete(true);
      setComparing([]);
      setPivot(-1);
      setPartitioning([]);
      return;
    }

    const step = steps[currentStep];
    setDescription(step.description);

    switch (step.type) {
      case 'select_pivot':
        setPivot(step.pivot);
        setPartitioning(Array.from({ length: step.high - step.low + 1 }, (_, i) => step.low + i));
        setComparing([]);
        break;
      case 'compare':
        setComparing(step.indices);
        break;
      case 'swap':
        setArray(step.array);
        setComparing(step.indices);
        break;
      case 'pivot_place':
        setArray(step.array);
        setSorted(prev => [...prev, step.pivot]);
        setPivot(-1);
        setPartitioning([]);
        setComparing([]);
        break;
      case 'single':
        setSorted(prev => [...prev, step.index]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Quick Sort Visualizer</h2>
            <p className="text-sm text-gray-600 mt-1">Watch how Quick Sort partitions around pivots</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/80 transition-colors" aria-label="Close">
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm font-medium text-blue-900">{description}</p>
          </div>

          <div className="flex items-end justify-center gap-2 mb-8" style={{ height: '256px' }}>
            {array.map((value, idx) => {
              const heightPx = (value / maxValue) * 200;
              let barColor = 'bg-gray-400';
              
              if (sorted.includes(idx)) {
                barColor = 'bg-green-500';
              } else if (idx === pivot) {
                barColor = 'bg-yellow-500';
              } else if (comparing.includes(idx)) {
                barColor = 'bg-red-500';
              } else if (partitioning.includes(idx)) {
                barColor = 'bg-blue-500';
              }

              return (
                <div key={idx} className="flex flex-col items-center justify-end flex-1 min-w-0">
                  <div className={`w-full ${barColor} transition-all duration-300 rounded-t-lg relative group min-h-[20px]`} style={{ height: `${heightPx}px` }}>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                      {value}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 mt-2 font-semibold">{value}</span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-6 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-400 rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Partitioning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span>Pivot</span>
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

          <div className="flex justify-center gap-4">
            <button onClick={handleNext} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2 text-lg">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {isComplete ? 'New Array' : 'Next Step'}
            </button>
            
            <button onClick={handleReset} className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors shadow-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <h3 className="font-bold text-gray-800 mb-2">How Quick Sort Works:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Select a pivot element (usually last element)</li>
            <li>Partition: move smaller elements left, larger right</li>
            <li>Place pivot in its final sorted position</li>
            <li>Recursively sort left and right partitions</li>
            <li>Time Complexity: O(n log n) avg | Space Complexity: O(log n)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default QuickSortVisualizer;

