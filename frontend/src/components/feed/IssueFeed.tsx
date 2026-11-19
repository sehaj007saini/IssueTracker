import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Issue {
  id: string
  title: string
  description: string
  category: string
  status: string
  location: string
  createdAt: string
  reporterName: string
  photoUrl?: string
  priority?: string
}

export default function IssueFeed() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [filter, setFilter] = useState<'all' | 'new' | 'trending'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Connect to real API
    // Simulate real-time feed
    const mockIssues: Issue[] = [
      {
        id: '1',
        title: 'Large Pothole on MG Road',
        description: 'Dangerous pothole causing traffic issues',
        category: 'ROAD',
        status: 'REPORTED',
        location: 'MG Road, Sector 14',
        createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
        reporterName: 'John Doe',
        priority: 'HIGH'
      },
      // Add more mock data as needed
    ]
    
    setTimeout(() => {
      setIssues(mockIssues)
      setLoading(false)
    }, 1000)
  }, [filter])

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'CRITICAL': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      case 'HIGH': return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
      case 'MEDIUM': return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'LOW': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800'
    }
  }

  const getTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000)
    
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
      {/* Header with filters */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <span className="animate-pulse mr-2">🔴</span>
            Live Feed
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'new'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              New
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === 'trending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              🔥 Trending
            </button>
          </div>
        </div>
      </div>

      {/* Feed content */}
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading feed...
          </div>
        ) : issues.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No issues to display
          </div>
        ) : (
          issues.map((issue) => (
            <Link
              key={issue.id}
              to={`/issues/${issue.id}`}
              className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start space-x-3">
                {/* Photo thumbnail */}
                {issue.photoUrl && (
                  <img
                    src={issue.photoUrl}
                    alt={issue.title}
                    className="w-16 h-16 rounded object-cover"
                  />
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {issue.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                        {issue.description}
                      </p>
                    </div>
                    {issue.priority && (
                      <span className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    )}
                  </div>
                  
                  {/* Meta info */}
                  <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>📍 {issue.location}</span>
                    <span>•</span>
                    <span>👤 {issue.reporterName}</span>
                    <span>•</span>
                    <span className="text-primary-600 dark:text-primary-400 font-medium">
                      {getTimeAgo(issue.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 text-center">
        <Link
          to="/issues"
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          View All Issues →
        </Link>
      </div>
    </div>
  )
}
