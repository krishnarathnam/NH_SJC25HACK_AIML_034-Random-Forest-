import { useCallback, useEffect, useRef, useState } from 'react'

export default function useSpeechRecognition({ language = 'english' } = {}) {
  const recognitionRef = useRef(null)
  const [isListening, setIsListening] = useState(false)
  const [supported, setSupported] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setSupported(false)
      recognitionRef.current = null
      return
    }
    setSupported(true)

    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
      recognitionRef.current = null
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language === 'kannada' ? 'kn-IN' : 'en-US'

    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (event) => {
      let composed = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        composed += result[0]?.transcript || ''
      }
      setText(composed)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    return () => {
      try { recognition.stop() } catch {}
      recognitionRef.current = null
    }
  }, [language])

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    try { recognitionRef.current.start() } catch {}
  }, [isListening])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try { recognitionRef.current.stop() } catch {}
    setIsListening(false)
  }, [])

  const reset = useCallback(() => setText(''), [])

  return { supported, isListening, text, start, stop, reset }
}


