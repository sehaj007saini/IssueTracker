import { useState } from 'react'

interface UserStats {
  issuesReported: number
  issuesResolved: number
  issuesSupported: number
  comments: number
  reputation: number
  joinedDate: string
  badges: string[]
}

interface UserProfileProps {
  userId: string
  userName: string
  userEmail: string
  userRole: string
  userPhone?: string
}

export default function UserProfile({ userId, userName, userEmail, userRole, userPhone }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'badges'>('overview')
  
  // Mock data - replace with API call
  const stats: UserStats = {
    issuesReported: 24,
    issuesResolved: 18,
    issuesSupported: 67,
    comments: 142,
    reputation: 856,
    joinedDate: '2024-01-15',
    badges: ['🌟 Early Adopter', '🏆 Top Contributor', '📸 Photo Pro', '🔥 Trending Reporter']
  }

  const getReputationLevel = (rep: number) => {
    if (rep >= 1000) return { level: 'Expert', color: 'text-purple-600 dark:text-purple-400', icon: '👑' }
    if (rep >= 500) return { level: 'Advanced', color: 'text-blue-600 dark:text-blue-400', icon: '⭐' }
    if (rep >= 200) return { level: 'Intermediate', color: 'text-green-600 dark:text-green-400', icon: '🌱' }
    return { level: 'Beginner', color: 'text-gray-600 dark:text-gray-400', icon: '🌟' }
  }

  const repLevel = getReputationLevel(stats.reputation)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow transition-colors">
      {/* Profile Header */}
      <div className="relative h-32 bg-gradient-to-r from-primary-500 to-primary-700 rounded-t-lg">
        <div className="absolute -bottom-16 left-6">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-5xl font-bold text-white shadow-lg">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 px-6 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userName}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{userEmail}</p>
            {userPhone && (
              <p className="text-gray-600 dark:text-gray-400">📱 {userPhone}</p>
            )}
            <div className="flex items-center space-x-2 mt-2">
              <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-full">
                {userRole}
              </span>
              <span className={`px-3 py-1 ${repLevel.color} bg-opacity-10 text-sm font-medium rounded-full flex items-center`}>
                {repLevel.icon} {repLevel.level}
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-3xl font-bold ${repLevel.color}`}>
              {stats.reputation}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Reputation Points</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Joined {new Date(stats.joinedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'activity'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              📈 Activity
            </button>
            <button
              onClick={() => setActiveTab('badges')}
              className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'badges'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              🏆 Badges ({stats.badges.length})
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.issuesReported}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Issues Reported</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.issuesResolved}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Issues Resolved</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.issuesSupported}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Issues Supported</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.comments}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Comments Posted</div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl mr-3">📝</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Reported "Large Pothole on MG Road"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl mr-3">💬</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Commented on "Street Light Issue"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <span className="text-2xl mr-3">👍</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">Supported "Garbage Collection Problem"</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">1 day ago</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.badges.map((badge, index) => (
                <div key={index} className="flex items-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="text-3xl mr-4">{badge.split(' ')[0]}</div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {badge.substring(badge.indexOf(' ') + 1)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Earned for excellence</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex space-x-3">
          <button className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md font-medium transition-colors">
            ✏️ Edit Profile
          </button>
          <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md font-medium transition-colors">
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  )
}
