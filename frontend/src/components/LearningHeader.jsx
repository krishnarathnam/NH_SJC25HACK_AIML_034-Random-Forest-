import _React from 'react'

export default function LearningHeader({ currentAlgorithm, onBack }) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            ← Back to Roadmap |
          </button>
          <h1 className="text-sm font-bold text-[#023047] font-pixel">
            {currentAlgorithm}
          </h1>
        </div>
      </div>
    </div>
  )
}


