import _React, { useEffect, useRef, useState } from 'react'
import InputBar from './InputBar.jsx'

export default function ChatMessages({ messages }) {
  const endRef = useRef(null)
  const [hoveredMessageId, setHoveredMessageId] = useState(null)
  const [speakingMessageId, setSpeakingMessageId] = useState(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  const handleSpeak = (text, messageId) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel()
    
    if (speakingMessageId === messageId) {
      // If already speaking this message, stop it
      setSpeakingMessageId(null)
      return
    }

    // Create speech synthesis
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9 // Slightly slower for clarity
    utterance.pitch = 1.0
    utterance.volume = 1.0
    
    utterance.onstart = () => {
      setSpeakingMessageId(messageId)
    }
    
    utterance.onend = () => {
      setSpeakingMessageId(null)
    }
    
    utterance.onerror = () => {
      setSpeakingMessageId(null)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    window.speechSynthesis.cancel()
    setSpeakingMessageId(null)
  }

  return (
    <div className="flex-1 overflow-y-auto p-2 pt-10 space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`relative max-w-2xl p-4 rounded-lg ${
              message.type === 'user'
                ? 'bg-[#023047] text-white'
                : 'bg-white border border-gray-200'
            }`}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            {message.isLoading ? (
              <div className="flex items-center justify-center">
                <img
                  src="/loading_image.png"
                  alt="Sorty is thinking"
                  className="w-16 h-16 float-y select-none"
                  draggable="false"
                />
              </div>
            ) : (
              <>
                <div className="whitespace-pre-wrap pr-8">{message.content}</div>
                
                {/* TTS Button - Shows on hover */}
                {(hoveredMessageId === message.id || speakingMessageId === message.id) && !message.isLoading && (
                  <button
                    onClick={() => handleSpeak(message.content, message.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-200 ${
                      speakingMessageId === message.id
                        ? 'bg-blue-500 text-white animate-pulse'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title={speakingMessageId === message.id ? 'Stop' : 'Read aloud'}
                  >
                    {speakingMessageId === message.id ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1zm4 0a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}


