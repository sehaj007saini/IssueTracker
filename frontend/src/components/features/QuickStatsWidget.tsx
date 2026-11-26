import { useState } from 'react'

export default function QuickStatsWidget() {
  const [isExpanded, setIsExpanded] = useState(false)

  const stats = [
    { label: 'Your Reports', value: '12', icon: '📝', change: '+2 this week', color: 'royal' },
    { label: 'Total Upvotes', value: '248', icon: '👍', change: '+15 today', color: 'sky' },
    { label: 'Resolved', value: '8', icon: '✅', change: '67% success', color: 'success' },
    { label: 'Rank', value: '#42', icon: '🏆', change: 'Top 5%', color: 'warning' },
  ]

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Collapsed View - Floating Badge */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="group flex items-center gap-3 bg-white dark:bg-navy-800 shadow-2xl rounded-full px-4 py-3 border-2 border-royal-500 hover:border-royal-600 transition-all hover:scale-105"
        >
          <span className="text-2xl">📊</span>
          <div className="text-left">
            <div className="text-sm font-bold text-navy-900 dark:text-white">Quick Stats</div>
            <div className="text-xs text-navy-600 dark:text-navy-400">Click to expand</div>
          </div>
          <svg className="w-5 h-5 text-royal-600 dark:text-royal-400 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Expanded View - Full Widget */}
      {isExpanded && (
        <div className="bg-white dark:bg-navy-800 shadow-2xl rounded-2xl p-6 w-80 border border-navy-200 dark:border-navy-700 animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h3 className="text-lg font-bold text-navy-900 dark:text-white">Your Stats</h3>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="p-1 hover:bg-navy-100 dark:hover:bg-navy-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-3 rounded-xl bg-gradient-to-br from-navy-50 to-sky-50 dark:from-navy-900/50 dark:to-sky-900/20 border border-navy-200 dark:border-navy-700 hover:shadow-md transition-all"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-navy-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs font-medium text-navy-600 dark:text-navy-400 mb-1">
                  {stat.label}
                </div>
                <div className={`text-xs font-semibold text-${stat.color}-600 dark:text-${stat.color}-400`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mb-4 p-3 bg-royal-50 dark:bg-royal-900/20 rounded-xl border border-royal-200 dark:border-royal-800">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-navy-900 dark:text-white">Level Progress</span>
              <span className="text-royal-600 dark:text-royal-400 font-bold">Level 3</span>
            </div>
            <div className="w-full bg-navy-200 dark:bg-navy-700 rounded-full h-3 mb-2">
              <div className="bg-gradient-to-r from-royal-500 to-sky-500 h-3 rounded-full" style={{width: '65%'}}></div>
            </div>
            <p className="text-xs text-navy-600 dark:text-navy-400">
              65% to Level 4 • 7 more reports needed
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2">
            <button className="flex-1 py-2 px-3 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-all">
              View Full Stats
            </button>
            <button className="p-2 bg-navy-100 dark:bg-navy-700 hover:bg-navy-200 dark:hover:bg-navy-600 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-navy-600 dark:text-navy-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
