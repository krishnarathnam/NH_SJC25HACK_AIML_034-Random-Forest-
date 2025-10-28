import _React from 'react'

export default function BackHandle({ onBack }) {
  return (
    <div className="fixed top-16 left-0 z-40 select-none">
      <div className="flex flex-col items-start group">
        <button
          onClick={onBack}
          className="rounded-r-xl bg-orange-500 border border-gray-200 shadow-md px-2 py-2 hover:shadow-lg hover:border-gray-300 transition-transform -translate-x-4 group-hover:translate-x-0 flex items-center gap-2"
          aria-label="Back to Roadmap"
          title="Back to Roadmap"
        >
          <svg className="w-6 h-6 text-white transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-xs text-white hidden group-hover:inline">Back to Roadmap</span>
        </button>
      </div>
    </div>
  )
}


