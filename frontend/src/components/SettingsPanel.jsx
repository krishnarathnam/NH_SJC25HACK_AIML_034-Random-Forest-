import _React from 'react'

export default function SettingsPanel({ open, learnMode, setLearnMode, language, setLanguage }) {
  if (!open) return null
  return (
    <div className="mt-2 mr-2 w-[92vw] max-w-2xl bg-white/95 backdrop-blur rounded-xl shadow-md border border-gray-200 overflow-hidden fixed top-20 right-2 z-30">
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Learning Style</h3>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setLearnMode('guide')} className={`p-2 rounded-lg border text-xs transition-all ${learnMode === 'guide' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>Guide</button>
                <button onClick={() => setLearnMode('ask')} className={`p-2 rounded-lg border text-xs transition-all ${learnMode === 'ask' ? 'border-amber-500 bg-amber-50 text-amber-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>Ask</button>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">Language</h3>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setLanguage('english')} className={`p-2 rounded-lg border text-xs transition-all ${language === 'english' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>English</button>
                <button onClick={() => setLanguage('kannada')} className={`p-2 rounded-lg border text-xs transition-all ${language === 'kannada' ? 'border-yellow-500 bg-yellow-50 text-yellow-700' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>ಕನ್ನಡ</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


