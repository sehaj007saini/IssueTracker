import { useState, useEffect, useRef } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  language?: string
  placeholder?: string
}

export default function VoiceInput({ 
  onTranscript, 
  language = 'en-US',
  placeholder = 'Describe the issue...' 
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcriptPiece + ' '
        } else {
          interimTranscript += transcriptPiece
        }
      }

      setTranscript(finalTranscript || interimTranscript)
      if (finalTranscript) {
        onTranscript(finalTranscript.trim())
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [language, onTranscript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start()
      setIsListening(true)
      setTranscript('')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-500 dark:text-gray-400 p-2 bg-gray-100 dark:bg-gray-800 rounded">
        🎤 Voice input not supported in this browser
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={isListening ? stopListening : startListening}
        className={`relative overflow-hidden px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
          isListening
            ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        <div className="flex items-center space-x-2">
          <svg
            className={`w-5 h-5 ${isListening ? 'animate-bounce' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
          <span>{isListening ? 'Stop Recording' : 'Start Voice Input'}</span>
        </div>

        {/* Recording indicator */}
        {isListening && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="absolute w-full h-full bg-red-500 opacity-20 animate-ping"></div>
          </div>
        )}
      </button>

      {/* Live transcript */}
      {transcript && (
        <div className="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg animate-fade-in">
          <div className="flex items-start space-x-2">
            <div className="text-primary-600 dark:text-primary-400 animate-pulse">🎤</div>
            <p className="text-sm text-gray-900 dark:text-white flex-1">{transcript}</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      {isListening && (
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400 animate-fade-in">
          💡 Speak clearly and describe the issue in detail
        </p>
      )}
    </div>
  )
}
