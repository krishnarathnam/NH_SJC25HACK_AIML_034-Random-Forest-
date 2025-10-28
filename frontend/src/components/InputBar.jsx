import _React, { useRef, useEffect } from 'react'

export default function InputBar({ inputMode, language, userInput, setUserInput, onSend, isListening, startListening, stopListening }) {
  const areaRef = useRef(null)

  useEffect(() => {
    if (!areaRef.current) return
    areaRef.current.style.height = 'auto'
    areaRef.current.style.height = Math.min(areaRef.current.scrollHeight, 160) + 'px'
  }, [userInput])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (userInput.trim()) onSend()
    }
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <div className="rounded-2xl border border-gray-300 bg-gray-50 px-3 py-2 transition-all">
            <textarea
              ref={areaRef}
              rows={1}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={language === 'kannada' ? 'ಏನಾದರೂ ಕೇಳಿ (Enter to send, Shift+Enter for newline)' : 'Ask anything (Enter to send, Shift+Enter for newline)'}
              className="w-full resize-none bg-transparent outline-none text-gray-900 placeholder-gray-400"
            />
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600' : 'bg-white text-gray-600 border border-gray-200'}`}
                title={language === 'kannada' ? 'ವಾಯ್ಸ್' : 'Voice'}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


