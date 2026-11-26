import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function EmergencyReportButton() {
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const handleEmergencyReport = () => {
    // Navigate to report page with emergency flag
    navigate('/report?emergency=true')
    setShowConfirm(false)
  }

  return (
    <>
      {/* Floating Emergency Button */}
      <button
        onClick={() => setShowConfirm(true)}
        className="fixed bottom-6 right-6 z-50 group"
        title="Report Emergency Issue"
      >
        <div className="relative">
          {/* Pulsing animation */}
          <span className="absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75 animate-ping"></span>
          
          {/* Button */}
          <div className="relative flex items-center justify-center w-16 h-16 bg-danger-600 hover:bg-danger-700 rounded-full shadow-2xl transition-all transform group-hover:scale-110">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        {/* Tooltip */}
        <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-navy-900 text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          🚨 Emergency Report
        </span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-danger-100 dark:bg-danger-900/30 rounded-full">
              <svg className="w-8 h-8 text-danger-600 dark:text-danger-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-center text-navy-900 dark:text-white mb-2">
              Report Emergency Issue?
            </h3>
            
            <p className="text-center text-navy-600 dark:text-navy-300 mb-6">
              Emergency reports receive <strong>immediate priority</strong> and are fast-tracked to authorities. Use only for urgent issues requiring immediate attention.
            </p>

            <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-xl p-4 mb-6">
              <p className="text-sm text-warning-800 dark:text-warning-300">
                <strong>⚠️ Emergency examples:</strong>
                <br/>• Major road hazards
                <br/>• Public safety threats
                <br/>• Fire/flood damage
                <br/>• Critical infrastructure failure
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-navy-300 dark:border-navy-600 text-navy-700 dark:text-navy-300 font-semibold rounded-xl hover:bg-navy-50 dark:hover:bg-navy-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEmergencyReport}
                className="flex-1 px-6 py-3 bg-danger-600 hover:bg-danger-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
