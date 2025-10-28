import _React, { useEffect, useRef } from 'react'
import InputBar from './InputBar.jsx'

export default function ChatMessages({ messages }) {
  const endRef = useRef(null)

  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-2 pt-10 space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-2xl p-4 rounded-lg ${
              message.type === 'user'
                ? 'bg-[#023047] text-white'
                : 'bg-white border border-gray-200'
            }`}
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
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}


