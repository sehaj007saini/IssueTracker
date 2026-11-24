import { useState } from 'react'
import Header from '../../components/layout/Header'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  const stats = {
    totalReports: 28,
    resolvedIssues: 19,
    pending: 7,
    rejected: 2,
    totalSupports: 342,
    commentsReceived: 86,
    verificationsDone: 15,
    impactScore: 892,
    rank: 23,
    badges: 7
  }

  const categoryBreakdown = [
    { category: 'Roads & Infrastructure', count: 12, percentage: 43, color: 'from-blue-400 to-blue-600' },
    { category: 'Public Safety', count: 6, percentage: 21, color: 'from-green-400 to-green-600' },
    { category: 'Waste Management', count: 5, percentage: 18, color: 'from-yellow-400 to-yellow-600' },
    { category: 'Other', count: 5, percentage: 18, color: 'from-purple-400 to-purple-600' },
  ]

  const monthlyActivity = [
    { month: 'Jan', reports: 2, resolved: 1 },
    { month: 'Feb', reports: 4, resolved: 3 },
    { month: 'Mar', reports: 3, resolved: 2 },
    { month: 'Apr', reports: 6, resolved: 4 },
    { month: 'May', reports: 5, resolved: 4 },
    { month: 'Jun', reports: 8, resolved: 5 },
  ]

  const achievements = [
    { title: 'Community Hero', description: '50+ issue reports', date: '2 weeks ago', icon: '🦸', rarity: 'epic' },
    { title: 'Eagle Eye', description: '10+ verified issues', date: '1 month ago', icon: '👁️', rarity: 'rare' },
    { title: 'Quick Reporter', description: '5 reports in one day', date: '1 month ago', icon: '⚡', rarity: 'epic' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            📊 My Analytics
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your community impact and contributions
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8 flex gap-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {range === 'week' && '📅 This Week'}
              {range === 'month' && '📊 This Month'}
              {range === 'year' && '📈 This Year'}
            </button>
          ))}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalReports}</div>
                <div className="text-blue-100 text-sm">Total Reports</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-green-300">↑ 24%</span>
              <span className="text-blue-100">vs last {timeRange}</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.resolvedIssues}</div>
                <div className="text-green-100 text-sm">Resolved</div>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full" 
                style={{width: `${(stats.resolvedIssues / stats.totalReports) * 100}%`}}
              ></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <span className="text-3xl">👍</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.totalSupports}</div>
                <div className="text-purple-100 text-sm">Total Supports</div>
              </div>
            </div>
            <div className="text-sm text-purple-100">
              Avg. {Math.round(stats.totalSupports / stats.totalReports)} per report
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <span className="text-3xl">🏆</span>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{stats.impactScore}</div>
                <div className="text-orange-100 text-sm">Impact Score</div>
              </div>
            </div>
            <div className="text-sm text-orange-100">
              Rank #{stats.rank} in community
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Breakdown */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📂 Reports by Category
            </h2>
            
            <div className="space-y-4">
              {categoryBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                      style={{width: `${item.percentage}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Monthly Activity Chart */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📈 Monthly Activity
              </h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {monthlyActivity.map((month) => (
                  <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col gap-1">
                      <div 
                        className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition-all hover:from-blue-500 hover:to-blue-700"
                        style={{height: `${(month.reports / 8) * 100}%`, minHeight: '20px'}}
                        title={`${month.reports} reports`}
                      ></div>
                      <div 
                        className="w-full bg-gradient-to-t from-green-400 to-green-600 rounded-t-lg transition-all hover:from-green-500 hover:to-green-700"
                        style={{height: `${(month.resolved / 8) * 100}%`, minHeight: '15px'}}
                        title={`${month.resolved} resolved`}
                      ></div>
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {month.month}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🏅 Recent Achievements
            </h2>
            
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 border-2 border-gray-100 dark:border-gray-600">
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${
                      achievement.rarity === 'epic' ? 'from-purple-400 to-purple-600' : 'from-blue-400 to-blue-600'
                    } flex items-center justify-center text-2xl shadow-lg`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {achievement.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {achievement.date}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.badges}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Badges</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.verificationsDone}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Verifications</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
