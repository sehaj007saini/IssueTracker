import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Issue {
  id: number
  title: string
  category: string
  location: string
  timestamp: string
  priority: 'high' | 'medium' | 'low'
  votes: number
}

export default function RealTimeFeed() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Simulate real-time updates
    const mockIssues: Issue[] = [
      { id: 1, title: 'Pothole on MG Road', category: 'Roads', location: 'MG Road, Sector 15', timestamp: '2 min ago', priority: 'high', votes: 24 },
      { id: 2, title: 'Street light not working', category: 'Public Safety', location: 'Park Avenue', timestamp: '5 min ago', priority: 'medium', votes: 12 },
      { id: 3, title: 'Garbage not collected', category: 'Waste', location: 'Residential Area', timestamp: '8 min ago', priority: 'low', votes: 8 },
    ]
    setIssues(mockIssues)

    // Simulate new issues coming in
    const interval = setInterval(() => {
      if (isLive) {
        const newIssue: Issue = {
          id: Date.now(),
          title: 'New issue reported',
          category: 'Roads',
          location: 'Random Location',
          timestamp: 'Just now',
          priority: 'medium',
          votes: 0
        }
        setIssues(prev => [newIssue, ...prev.slice(0, 9)])
      }
    }, 15000) // New issue every 15 seconds

    return () => clearInterval(interval)
  }, [isLive])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger-600 bg-danger-50 dark:bg-danger-900/20'
      case 'medium': return 'text-warning-600 bg-warning-50 dark:bg-warning-900/20'
      case 'low': return 'text-sky-600 bg-sky-50 dark:bg-sky-900/20'
      default: return 'text-navy-600 bg-navy-50'
    }
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-navy-200 dark:border-navy-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-navy-900 dark:text-white">Live Issue Feed</h3>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger-500"></span>
              </span>
            )}
            <span className={`text-sm font-medium ${isLive ? 'text-danger-600' : 'text-navy-500'}`}>
              {isLive ? 'LIVE' : 'PAUSED'}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsLive(!isLive)}
          className="text-sm text-royal-600 dark:text-royal-400 hover:text-royal-700 font-medium"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        {issues.map((issue, index) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="block p-3 rounded-lg border border-navy-200 dark:border-navy-700 hover:border-royal-400 dark:hover:border-royal-600 hover:shadow-md transition-all animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                  <span className="text-xs text-navy-500 dark:text-navy-400">{issue.category}</span>
                </div>
                <h4 className="font-semibold text-navy-900 dark:text-white truncate">{issue.title}</h4>
                <div className="flex items-center gap-4 mt-1 text-xs text-navy-600 dark:text-navy-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {issue.location}
                  </span>
                  <span>• {issue.timestamp}</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <button className="p-1 hover:bg-navy-100 dark:hover:bg-navy-700 rounded transition-colors">
                  <svg className="w-5 h-5 text-royal-600 dark:text-royal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <span className="text-sm font-bold text-royal-600 dark:text-royal-400">{issue.votes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
