import { useState, useEffect } from 'react'

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void
  onReset?: () => void
}

export default function SimpleCaptcha({ onVerify, onReset }: SimpleCaptchaProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    generateNewChallenge()
  }, [])

  const generateNewChallenge = () => {
    const n1 = Math.floor(Math.random() * 10) + 1
    const n2 = Math.floor(Math.random() * 10) + 1
    setNum1(n1)
    setNum2(n2)
    setUserAnswer('')
    setError('')
    setIsVerified(false)
    onVerify(false)
    onReset?.()
  }

  const handleVerify = () => {
    const correctAnswer = num1 + num2
    const userNum = parseInt(userAnswer)

    if (isNaN(userNum)) {
      setError('Please enter a valid number')
      onVerify(false)
      return
    }

    if (userNum === correctAnswer) {
      setIsVerified(true)
      setError('')
      onVerify(true)
    } else {
      setError('Incorrect answer. Please try again.')
      onVerify(false)
      generateNewChallenge()
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify()
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Security Verification *
      </label>
      
      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          {/* Challenge Display */}
          <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-md border-2 border-blue-300 font-mono text-lg font-bold">
            <span className="text-blue-900">{num1}</span>
            <span className="text-blue-600">+</span>
            <span className="text-blue-900">{num2}</span>
            <span className="text-blue-600">=</span>
            <span className="text-blue-400">?</span>
          </div>

          {/* Input */}
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isVerified}
            placeholder="Answer"
            className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />

          {/* Verify Button */}
          {!isVerified ? (
            <button
              type="button"
              onClick={handleVerify}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              Verify
            </button>
          ) : (
            <div className="flex items-center text-green-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="ml-1 font-medium">Verified</span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={generateNewChallenge}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            title="New challenge"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}

        {isVerified && (
          <p className="mt-2 text-sm text-green-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Security verification complete
          </p>
        )}
      </div>

      <p className="text-xs text-gray-500">
        This helps us prevent automated spam and fake reports
      </p>
    </div>
  )
}
