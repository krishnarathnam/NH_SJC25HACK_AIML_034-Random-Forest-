import _React from 'react';

const AlgorithmProgress = ({ progressPercent = 0, currentAlgorithm = '' }) => {
  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-gray-500">
          Progress
        </span>
        <span className="text-xs font-bold text-emerald-600">
          {progressPercent}%
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 transition-all duration-700 ease-out rounded-full shadow-sm"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
      {progressPercent === 100 && (
        <div className="mt-1.5 text-center text-xs text-emerald-600 font-semibold">
          ✓ Mastered!
        </div>
      )}
    </div>
  );
};

export default AlgorithmProgress;

