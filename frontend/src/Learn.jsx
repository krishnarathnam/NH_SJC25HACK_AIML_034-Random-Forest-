import _React, { useRef, useEffect, useState } from 'react';
import SortingCardSidebar from './SortingCardSidebar.jsx';
import { authenticatedFetch } from './utils/auth.js';

const Learn = () => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedCard, setSelectedCard] = useState(null);
  const isPanningRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const delta = Math.sign(e.deltaY);
      setScale((s) => {
        const next = Math.min(3, Math.max(0.3, s * (delta > 0 ? 0.9 : 1.1)));
        return next;
      });
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
  }, []);

  const onMouseDown = (e) => {
    isPanningRef.current = true;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e) => {
    if (!isPanningRef.current) return;
    const dx = e.clientX - lastPosRef.current.x;
    const dy = e.clientY - lastPosRef.current.y;
    lastPosRef.current = { x: e.clientX, y: e.clientY };
    setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
  };

  const onMouseUp = () => {
    isPanningRef.current = false;
  };

  const zoomIn = () => setScale((s) => Math.min(3, s * 1.1));
  const zoomOut = () => setScale((s) => Math.max(0.3, s * 0.9));
  const reset = () => { setScale(1); setOffset({ x: 0, y: 0 }); };

  const roadmap = [
    { 
      key: 'selection', 
      x: 80, y: 80, 
      name: 'Selection Sort', 
      xp: 40, 
      difficulty: 'Easy', 
      progress: 60, 
      desc: 'Pick the smallest each round and place it in order.',
      importance: 'Selection Sort teaches the fundamental concept of finding minimum/maximum elements. It\'s used in systems where memory writes are expensive, like flash memory, and helps understand the trade-off between comparisons and swaps.',
      rewards: ['Selection Master Badge', '40 XP', 'Understanding of O(n²) complexity', 'Memory-efficient sorting knowledge']
    },
    { 
      key: 'bubble', 
      x: 520, y: 500, 
      name: 'Bubble Sort', 
      xp: 50, 
      difficulty: 'Easy', 
      progress: 20, 
      desc: 'Swap adjacent elements to float the largest to the end.',
      importance: 'Bubble Sort is perfect for learning sorting concepts because it\'s simple to understand and visualize. While not efficient for large datasets, it\'s still used in embedded systems and educational contexts.',
      rewards: ['Bubble Blaster Badge', '50 XP', 'Understanding of stable sorting', 'Visual sorting intuition']
    },
    { 
      key: 'insertion', 
      x: 960, y: 160, 
      name: 'Insertion Sort', 
      xp: 70, 
      difficulty: 'Medium', 
      progress: 0, 
      desc: 'Insert new items into the sorted left side one-by-one.',
      importance: 'Insertion Sort is highly practical for small datasets and nearly-sorted data. It\'s used in hybrid algorithms like Timsort and is excellent for understanding adaptive sorting behavior.',
      rewards: ['Insertion Expert Badge', '70 XP', 'Understanding of adaptive algorithms', 'Hybrid sorting knowledge']
    },
    { 
      key: 'merge', 
      x: 1400, y: 560, 
      name: 'Merge Sort', 
      xp: 100, 
      difficulty: 'Medium', 
      progress: 0, 
      desc: 'Divide into halves, sort each, and merge back together.',
      importance: 'Merge Sort is the foundation of divide-and-conquer algorithms. It\'s used in external sorting, database systems, and is guaranteed O(n log n) performance, making it crucial for understanding algorithmic efficiency.',
      rewards: ['Merge Master Badge', '100 XP', 'Understanding of divide-and-conquer', 'Stable sorting mastery']
    },
    { 
      key: 'quick', 
      x: 1760, y: 220, 
      name: 'Quick Sort', 
      xp: 120, 
      difficulty: 'Hard', 
      progress: 0, 
      desc: 'Choose a pivot and partition smaller vs bigger around it.',
      importance: 'Quick Sort is one of the most widely used sorting algorithms in practice. It\'s the default sorting algorithm in many programming languages and teaches important concepts about pivot selection and partitioning.',
      rewards: ['Quick Sort Champion Badge', '120 XP', 'Understanding of pivot strategies', 'In-place sorting mastery']
    },
    { 
      key: 'heap', 
      x: 2200, y: 720, 
      name: 'Heap Sort', 
      xp: 140, 
      difficulty: 'Hard', 
      progress: 0, 
      desc: 'Build a heap and remove the max repeatedly.',
      importance: 'Heap Sort combines heap data structures with sorting, teaching both concepts simultaneously. It\'s used in priority queues, operating systems, and is guaranteed O(n log n) with constant space complexity.',
      rewards: ['Heap Hero Badge', '140 XP', 'Understanding of heap data structures', 'Priority queue mastery']
    },
  ];

  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-50 relative">
      <div className="absolute top-4 left-4 flex gap-2 z-10">
        <button onClick={zoomOut} className="btn-pixel">-</button>
        <button onClick={zoomIn} className="btn-pixel">+</button>
        <button onClick={reset} className="btn-pixel">RESET</button>
      </div>
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          ref={contentRef}
          className="w-[2400px] h-[1400px] shadow-inner relative"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transformOrigin: '0 0',
            backgroundColor: '#f9fafb',
            backgroundImage: 'radial-gradient(rgba(2,48,71,0.2) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        >
          <svg width="2400" height="1400" className="absolute inset-0 pointer-events-none" viewBox="0 0 2400 1400" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowOrange" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fb8500" />
              </marker>
            </defs>
            {roadmap.slice(0, -1).map((a, i) => {
              const b = roadmap[i + 1];
              const startX = a.x + 240;
              const startY = a.y + 50;
              const endX = b.x - 20;
              const endY = b.y + 50;
              const cp1x = startX + 180;
              const cp1y = startY - 240;
              const cp2x = endX - 180;
              const cp2y = endY + 240;
              return (
                <path key={`seg-${a.key}`}
                  d={`M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`}
                  fill="none"
                  stroke="#fb8500"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="16 16"
                  markerEnd="url(#arrowOrange)"
                />
              );
            })}
          </svg>

          {roadmap.map((s) => (
            <div key={s.key} className="absolute" style={{ left: s.x, top: s.y }}>
              <div 
                className="bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm w-[260px] p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCard(s)}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-[#023047] font-pixel">{s.name}</div>
                  <span className="px-2 py-0.5 rounded text-xs bg-[#8B5CF6]/15 text-[#8B5CF6]">+{s.xp} XP</span>
                </div>
                <div className="mt-1 text-xs text-gray-600">{s.desc}</div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium text-[#023047]">{s.progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-[#023047]" style={{ width: `${s.progress}%` }} />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981]">Badge</span>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">{s.difficulty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <SortingCardSidebar selectedCard={selectedCard} onClose={() => setSelectedCard(null)} />
    </div>
  );
};

export default Learn;


