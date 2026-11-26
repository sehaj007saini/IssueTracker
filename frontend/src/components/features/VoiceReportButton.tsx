import { useState, useRef } from 'react'

export default function VoiceReportButton() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [showModal, setShowModal] = useState(false)
  const recognitionRef = useRef<any>(null)

  const startRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        let finalTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPart + ' '
          } else {
            interimTranscript += transcriptPart
          }
        }

        setTranscript(finalTranscript + interimTranscript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsRecording(false)
      }

      recognitionRef.current.start()
      setIsRecording(true)
      setShowModal(true)
    } else {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = () => {
    // Here you would submit the transcript to your report form
    console.log('Submitting voice report:', transcript)
    setShowModal(false)
    setTranscript('')
  }

  return (
    <>
      {/* Voice Report Button */}
      <button
        onClick={startRecording}
        className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        🎤 Voice Report
      </button>

      {/* Voice Recording Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-scale-in">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white">Voice Report</h3>
              <button
                onClick={() => {
                  stopRecording()
                  setShowModal(false)
                  setTranscript('')
                }}
                className="p-2 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Recording Animation */}
            {isRecording && (
              <div className="flex flex-col items-center justify-center mb-6">
                <div className="relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75 animate-ping"></span>
                  <div className="relative flex items-center justify-center w-24 h-24 bg-sky-600 rounded-full shadow-2xl">
                    <svg className="w-12 h-12 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-4 text-lg font-semibold text-sky-600 dark:text-sky-400 animate-pulse">
                  Listening...
                </p>
              </div>
            )}

            {/* Transcript Display */}
            <div className="mb-6">
              <label className="block text-sm font-bold text-navy-700 dark:text-navy-300 mb-2">
                Transcript
              </label>
              <div className="min-h-32 p-4 bg-navy-50 dark:bg-navy-900/50 border-2 border-navy-200 dark:border-navy-700 rounded-xl">
                {transcript ? (
                  <p className="text-navy-900 dark:text-white">{transcript}</p>
                ) : (
                  <p className="text-navy-400 dark:text-navy-500 italic">
                    Start speaking to describe the issue...
                  </p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-sky-800 dark:text-sky-300">
                <strong>💡 Tips:</strong> Speak clearly and describe:
                <br/>• What is the issue?
                <br/>• Where is it located?
                <br/>• How serious is it?
                <br/>• Any additional details
              </p>
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {isRecording ? (
                <button
                  onClick={stopRecording}
                  className="flex-1 px-6 py-3 bg-danger-600 hover:bg-danger-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  ⏹️ Stop Recording
                </button>
              ) : (
                <>
                  <button
                    onClick={startRecording}
                    className="flex-1 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                  >
                    🎤 Start Recording
                  </button>
                  {transcript && (
                    <button
                      onClick={handleSubmit}
                      className="flex-1 px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      ✅ Use This Report
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
