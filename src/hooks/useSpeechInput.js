import { useEffect, useRef, useState } from 'react'

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null

export function useSpeechInput({ language, onResult }) {
  const [status, setStatus] = useState('READY')
  const recognitionRef = useRef(null)
  const available = Boolean(SpeechRecognition)

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop?.()
    }
  }, [])

  function start() {
    if (!available) return
    try {
      const recognition = new SpeechRecognition()
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      setStatus('LISTENING')
      recognition.onresult = (event) => {
        setStatus('PROCESSING')
        const text = event.results?.[0]?.[0]?.transcript || ''
        if (text) onResult(text)
        setStatus('ANSWER CAPTURED')
      }
      recognition.onerror = () => setStatus('READY')
      recognition.onend = () => {
        setStatus((prev) => (prev === 'LISTENING' ? 'READY' : prev))
      }
      recognitionRef.current = recognition
      recognition.start()
    } catch {
      setStatus('READY')
    }
  }

  function stop() {
    recognitionRef.current?.stop?.()
    setStatus('READY')
  }

  return { available, status, start, stop, setStatus }
}
