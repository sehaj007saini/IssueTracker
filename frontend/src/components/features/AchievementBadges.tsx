import { useState } from 'react'

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  progress?: number
  requirement?: number
}

export default function AchievementBadges() {
  const [badges] = useState<Badge[]>([
    { id: '1', name: 'First Report', description: 'Submit your first issue', icon: '🎯', rarity: 'common', unlocked: true },
    { id: '2', name: 'Eagle Eye', description: 'Report 10 issues', icon: '👁️', rarity: 'rare', unlocked: true, progress: 10, requirement: 10 },
    { id: '3', name: 'Community Hero', description: 'Get 100 upvotes', icon: '🦸', rarity: 'epic', unlocked: false, progress: 45, requirement: 100 },
    { id: '4', name: 'Civic Champion', description: 'Report 50 issues', icon: '🏆', rarity: 'legendary', unlocked: false, progress: 28, requirement: 50 },
    { id: '5', name: 'Verified Reporter', description: 'Verify 5 resolutions', icon: '✅', rarity: 'rare', unlocked: true },
    { id: '6', name: 'Speed Reporter', description: 'Report within 1 hour of issue', icon: '⚡', rarity: 'epic', unlocked: false, progress: 3, requirement: 5 },
  ])

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-navy-400 to-navy-600'
      case 'rare': return 'from-sky-400 to-sky-600'
      case 'epic': return 'from-royal-400 to-royal-600'
      case 'legendary': return 'from-warning-400 to-danger-500'
      default: return 'from-navy-400 to-navy-600'
    }
  }

  return (
    <div className="bg-white dark:bg-navy-800 rounded-xl shadow-lg border border-navy-200 dark:border-navy-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-navy-900 dark:text-white">Your Achievements</h3>
        <span className="px-3 py-1 bg-royal-100 dark:bg-royal-900/30 text-royal-700 dark:text-royal-400 rounded-full text-sm font-semibold">
          {badges.filter(b => b.unlocked).length}/{badges.length}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`relative p-4 rounded-xl border-2 transition-all ${
              badge.unlocked
                ? 'border-royal-300 dark:border-royal-700 bg-gradient-to-br from-royal-50 to-sky-50 dark:from-royal-900/20 dark:to-sky-900/20 hover:scale-105 cursor-pointer'
                : 'border-navy-200 dark:border-navy-700 bg-navy-50 dark:bg-navy-900/50 opacity-60'
            }`}
          >
            {/* Badge Icon with Rarity Gradient */}
            <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center text-3xl shadow-lg ${!badge.unlocked && 'grayscale'}`}>
              {badge.unlocked ? badge.icon : '🔒'}
            </div>

            {/* Badge Info */}
            <div className="text-center">
              <h4 className="font-bold text-navy-900 dark:text-white text-sm mb-1">
                {badge.name}
              </h4>
              <p className="text-xs text-navy-600 dark:text-navy-400 mb-2">
                {badge.description}
              </p>

              {/* Progress Bar for Locked Badges */}
              {!badge.unlocked && badge.progress !== undefined && badge.requirement && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-navy-600 dark:text-navy-400 mb-1">
                    <span>{badge.progress}</span>
                    <span>{badge.requirement}</span>
                  </div>
                  <div className="w-full bg-navy-200 dark:bg-navy-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-royal-500 to-sky-500 h-2 rounded-full transition-all"
                      style={{ width: `${(badge.progress / badge.requirement) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Rarity Badge */}
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                badge.rarity === 'legendary' ? 'bg-gradient-to-r from-warning-500 to-danger-500 text-white' :
                badge.rarity === 'epic' ? 'bg-royal-500 text-white' :
                badge.rarity === 'rare' ? 'bg-sky-500 text-white' :
                'bg-navy-500 text-white'
              }`}>
                {badge.rarity.toUpperCase()}
              </span>
            </div>

            {/* Unlock Animation Effect */}
            {badge.unlocked && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 bg-success-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 pt-6 border-t border-navy-200 dark:border-navy-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-royal-600 dark:text-royal-400">
              {badges.filter(b => b.unlocked).length}
            </div>
            <div className="text-xs text-navy-600 dark:text-navy-400">Unlocked</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-warning-600 dark:text-warning-400">
              {badges.filter(b => b.rarity === 'legendary' && b.unlocked).length}
            </div>
            <div className="text-xs text-navy-600 dark:text-navy-400">Legendary</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
              {Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100)}%
            </div>
            <div className="text-xs text-navy-600 dark:text-navy-400">Completion</div>
          </div>
        </div>
      </div>
    </div>
  )
}
