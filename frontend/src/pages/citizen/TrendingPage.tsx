import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'

interface TrendingIssue {
  id: number
  title: string
  category: string
  location: string
  supports: number
  comments: number
  status: 'open' | 'in_progress' | 'resolved'
  createdAt: string
  image?: string
  trending_score: number
}

export default function TrendingPage() {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('week')
  
  // Mock data - replace with API call
  const trendingIssues: TrendingIssue[] = [
    {
      id: 1,
      title: 'Massive pothole on Main Street causing traffic delays',
      category: 'Roads & Infrastructure',
      location: 'Main Street, Downtown',
      supports: 324,
      comments: 56,
      status: 'in_progress',
      createdAt: '2 days ago',
      trending_score: 95,
    },
    {
      id: 2,
      title: 'Broken streetlight in residential area - safety concern',
      category: 'Public Safety',
      location: 'Oak Avenue, Sector 5',
      supports: 198,
      comments: 32,
      status: 'open',
      createdAt: '1 day ago',
      trending_score: 88,
    },
    {
      id: 3,
      title: 'Garbage not collected for 5 days - health hazard',
      category: 'Waste Management',
      location: 'Park Street, Area 12',
      supports: 445,
      comments: 89,
      status: 'in_progress',
      createdAt: '3 days ago',
      trending_score: 92,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'resolved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return '🔴'
      case 'in_progress': return '🟡'
      case 'resolved': return '🟢'
      default: return '⚪'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🔥 Trending Issues
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See what's hot in your community right now
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-8 flex gap-2 overflow-x-auto animate-slide-up" style={{animationDelay: '0.1s'}}>
          {(['today', 'week', 'month'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                timeFilter === filter
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {filter === 'today' && '📅 Today'}
              {filter === 'week' && '📊 This Week'}
              {filter === 'month' && '📈 This Month'}
            </button>
          ))}
        </div>

        {/* Trending Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Most Supported</p>
                <p className="text-2xl font-bold">445 supports</p>
              </div>
              <div className="text-4xl">👍</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium mb-1">Most Discussed</p>
                <p className="text-2xl font-bold">89 comments</p>
              </div>
              <div className="text-4xl">💬</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Fastest Growing</p>
                <p className="text-2xl font-bold">+28% today</p>
              </div>
              <div className="text-4xl">🚀</div>
            </div>
          </div>
        </div>

        {/* Trending Issues List */}
        <div className="space-y-6">
          {trendingIssues.map((issue, index) => (
            <div
              key={issue.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up"
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              <div className="flex items-start gap-4">
                {/* Trending Rank */}
                <div className="flex-shrink-0">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      #{index + 1}
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold animate-pulse">
                      🔥
                    </div>
                  </div>
                </div>

                {/* Issue Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                          {getStatusIcon(issue.status)} {issue.status.replace('_', ' ')}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                          {issue.category}
                        </span>
                      </div>
                      <Link to={`/issues/${issue.id}`}>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {issue.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          📍 {issue.location}
                        </span>
                        <span className="flex items-center gap-1">
                          🕒 {issue.createdAt}
                        </span>
                      </div>
                    </div>

                    {/* Trending Score */}
                    <div className="flex-shrink-0 text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {issue.trending_score}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">trending</div>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-6 mt-4">
                    <button className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 group-hover:scale-110 transition-transform">
                        👍
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">{issue.supports}</div>
                        <div className="text-xs text-gray-500">supports</div>
                      </div>
                    </button>

                    <Link to={`/issues/${issue.id}#comments`} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900 group-hover:scale-110 transition-transform">
                        💬
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-bold">{issue.comments}</div>
                        <div className="text-xs text-gray-500">comments</div>
                      </div>
                    </Link>

                    <button className="ml-auto flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all">
                      <span>🔖</span>
                      <span>Follow</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
            Load More Trending Issues
          </button>
        </div>
      </main>
    </div>
  )
}
