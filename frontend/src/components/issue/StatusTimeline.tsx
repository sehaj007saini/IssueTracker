interface StatusTimelineProps {
  statusHistory: {
    status: string
    changedAt: string
    changedBy?: string
    notes?: string
  }[]
}

export default function StatusTimeline({ statusHistory }: StatusTimelineProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      REPORTED: 'bg-blue-500 dark:bg-blue-600',
      ACKNOWLEDGED: 'bg-yellow-500 dark:bg-yellow-600',
      IN_PROGRESS: 'bg-orange-500 dark:bg-orange-600',
      RESOLVED: 'bg-green-500 dark:bg-green-600',
      CLOSED: 'bg-gray-500 dark:bg-gray-600',
      REJECTED: 'bg-red-500 dark:bg-red-600',
    }
    return colors[status] || 'bg-gray-400'
  }

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      REPORTED: '📝',
      ACKNOWLEDGED: '👁️',
      IN_PROGRESS: '🔧',
      RESOLVED: '✅',
      CLOSED: '🔒',
      REJECTED: '❌',
    }
    return icons[status] || '📌'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        📊 Status Timeline
      </h3>

      <div className="space-y-6">
        {statusHistory.map((entry, index) => (
          <div key={index} className="relative flex items-start">
            {/* Vertical Line */}
            {index !== statusHistory.length - 1 && (
              <div 
                className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"
                style={{ transform: 'translateX(-50%)' }}
              />
            )}

            {/* Status Icon */}
            <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full ${getStatusColor(entry.status)} text-white text-sm font-semibold shrink-0`}>
              {getStatusIcon(entry.status)}
            </div>

            {/* Content */}
            <div className="ml-4 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                    {entry.status.replace(/_/g, ' ')}
                  </h4>
                  {entry.changedBy && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      by {entry.changedBy}
                    </p>
                  )}
                  {entry.notes && (
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                      {entry.notes}
                    </p>
                  )}
                </div>
                <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-4">
                  {formatDate(entry.changedAt)}
                </time>
              </div>
            </div>
          </div>
        ))}
      </div>

      {statusHistory.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">
          No status updates yet
        </p>
      )}
    </div>
  )
}
