import _React from 'react'

export default function NotesHandle({ open, onToggle }) {
  return (
    <div className="fixed top-28 right-0 z-40 select-none">
      <div className="flex flex-col items-end">
        <button
          onClick={onToggle}
          className="rounded-l-xl bg-orange-500 border border-gray-200 shadow-md px-2 py-2 hover:shadow-lg hover:border-gray-300 transition-transform translate-x-4 hover:translate-x-0"
          aria-label="Notes"
          title="Notes"
        >
          <svg className={`w-6 h-6 text-white ${open ? 'rotate-180' : ''} transition-transform`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </div>
  )
}


