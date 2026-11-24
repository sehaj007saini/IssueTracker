import { useState } from 'react'
import Header from '../../components/layout/Header'

interface LeaderboardUser {
  id: number
  name: string
  avatar: string
  points: number
  reportsSubmitted: number
  issuesResolved: number
  verificationsCompleted: number
  badges: string[]
  rank: number
  rankChange: number
}

interface Badge {
  id: string
  name: string
  icon: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export default function LeaderboardPage() {
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'all'>('week')
  
  const badges: Badge[] = [
    { id: '1', name: 'First Report', icon: '🎯', description: 'Submit your first issue report', rarity: 'common' },
    { id: '2', name: 'Eagle Eye', icon: '👁️', description: 'Report 10 issues', rarity: 'rare' },
    { id: '3', name: 'Community Hero', icon: '🦸', description: 'Report 50 issues', rarity: 'epic' },
    { id: '4', name: 'Verified Master', icon: '✅', description: 'Verify 25 resolved issues', rarity: 'rare' },
    { id: '5', name: 'Speed Demon', icon: '⚡', description: 'Report 5 issues in one day', rarity: 'epic' },
    { id: '6', name: 'Legend', icon: '👑', description: 'Top 10 contributor for 3 months', rarity: 'legendary' },
  ]

  const leaderboard: LeaderboardUser[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      avatar: '👨',
      points: 2450,
      reportsSubmitted: 45,
      issuesResolved: 32,
      verificationsCompleted: 28,
      badges: ['🎯', '👁️', '🦸', '✅'],
      rank: 1,
      rankChange: 2
    },
    {
      id: 2,
      name: 'Priya Sharma',
      avatar: '👩',
      points: 2180,
      reportsSubmitted: 38,
      issuesResolved: 29,
      verificationsCompleted: 25,
      badges: ['🎯', '👁️', '✅'],
      rank: 2,
      rankChange: -1
    },
    {
      id: 3,
      name: 'Amit Patel',
      avatar: '👨‍💼',
      points: 1950,
      reportsSubmitted: 35,
      issuesResolved: 24,
      verificationsCompleted: 22,
      badges: ['🎯', '👁️'],
      rank: 3,
      rankChange: 1
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-500'
      case 'rare': return 'from-blue-400 to-blue-600'
      case 'epic': return 'from-purple-400 to-purple-600'
      case 'legendary': return 'from-yellow-400 to-orange-500'
      default: return 'from-gray-400 to-gray-500'
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'from-yellow-400 to-yellow-600'
      case 2: return 'from-gray-300 to-gray-400'
      case 3: return 'from-orange-400 to-orange-600'
      default: return 'from-blue-400 to-blue-600'
    }
  }

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return '🏅'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🏆 Community Leaderboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See top contributors making a difference
          </p>
        </div>

        {/* Time Filter */}
        <div className="mb-8 flex justify-center gap-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
          {(['week', 'month', 'all'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                timeFilter === filter
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {filter === 'week' && '📅 This Week'}
              {filter === 'month' && '📊 This Month'}
              {filter === 'all' && '⭐ All Time'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-2 space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
            {leaderboard.map((user, index) => (
              <div
                key={user.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className={`flex-shrink-0 relative`}>
                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${getRankColor(user.rank)} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="text-4xl">{getRankMedal(user.rank)}</span>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-full text-xs font-bold">
                      #{user.rank}
                    </div>
                    {user.rankChange !== 0 && (
                      <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        user.rankChange > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {user.rankChange > 0 ? '↑' : '↓'}
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-3xl">{user.avatar}</span>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {user.badges.map((badge, i) => (
                            <span key={i} className="text-lg">{badge}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {user.reportsSubmitted}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Reports</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {user.issuesResolved}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Resolved</div>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-2 text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {user.verificationsCompleted}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">Verified</div>
                      </div>
                    </div>
                  </div>

                  {/* Points */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                      {user.points.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Badges Section */}
          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg sticky top-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                🏅 Badges Collection
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Earn badges by contributing to your community
              </p>

              <div className="space-y-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className="group bg-gradient-to-br from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl p-4 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                          {badge.name}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {badge.description}
                        </p>
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                          badge.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                          badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {badge.rarity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white text-center">
                <div className="text-3xl mb-2">🎯</div>
                <p className="font-bold mb-1">Start Earning Badges!</p>
                <p className="text-sm opacity-90 mb-3">Report issues to unlock achievements</p>
                <button className="w-full bg-white text-orange-600 rounded-lg py-2 font-bold hover:bg-gray-100 transition-colors">
                  Report Issue
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
