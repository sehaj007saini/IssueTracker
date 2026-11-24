import { useState } from 'react'
import Header from '../../components/layout/Header'

export default function CommunityImpactPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

  const impactStats = {
    totalIssuesResolved: 892,
    livesImproved: 4567,
    communityEngagement: 85,
    responseTime: 72,
    satisfactionRate: 94,
    activeVolunteers: 234,
    citySavings: '₹12.5L',
    carbonSaved: '245kg'
  }

  const topContributors = [
    { name: 'Rajesh Kumar', avatar: '👨', issues: 45, impact: 892 },
    { name: 'Priya Sharma', avatar: '👩', issues: 38, impact: 756 },
    { name: 'Amit Patel', avatar: '👨‍💼', issues: 35, impact: 698 }
  ]

  const categoryImpact = [
    { category: 'Roads', fixed: 234, pending: 23, improvement: '+45%' },
    { category: 'Safety', fixed: 189, pending: 12, improvement: '+38%' },
    { category: 'Waste', fixed: 156, pending: 34, improvement: '+52%' },
    { category: 'Water', fixed: 143, pending: 18, improvement: '+41%' }
  ]

  const milestones = [
    { title: '1000 Issues Resolved', date: 'June 2026', icon: '🎯', color: 'from-blue-500 to-blue-600' },
    { title: '5000 Active Users', date: 'May 2026', icon: '👥', color: 'from-green-500 to-green-600' },
    { title: 'Zero Open Critical Issues', date: 'April 2026', icon: '✅', color: 'from-purple-500 to-purple-600' },
    { title: 'City Partnership', date: 'March 2026', icon: '🤝', color: 'from-orange-500 to-orange-600' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 text-center animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🌍 Community Impact Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            See the positive change we're creating together
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="mb-8 flex justify-center gap-2 animate-slide-up" style={{animationDelay: '0.1s'}}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-105 ${
                timeRange === range
                  ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {range === 'week' && '📅 This Week'}
              {range === 'month' && '📊 This Month'}
              {range === 'year' && '📈 This Year'}
            </button>
          ))}
        </div>

        {/* Key Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">✅</div>
            <div className="text-3xl font-bold mb-1">{impactStats.totalIssuesResolved}</div>
            <div className="text-green-100">Issues Resolved</div>
            <div className="mt-3 text-sm bg-white/20 rounded-lg px-3 py-1 inline-block">
              +127 this month
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">❤️</div>
            <div className="text-3xl font-bold mb-1">{impactStats.livesImproved.toLocaleString()}</div>
            <div className="text-blue-100">Lives Improved</div>
            <div className="mt-3 text-sm bg-white/20 rounded-lg px-3 py-1 inline-block">
              Estimated reach
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-3xl font-bold mb-1">{impactStats.satisfactionRate}%</div>
            <div className="text-purple-100">Satisfaction Rate</div>
            <div className="mt-3 text-sm bg-white/20 rounded-lg px-3 py-1 inline-block">
              Based on surveys
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
            <div className="text-5xl mb-3">💰</div>
            <div className="text-3xl font-bold mb-1">{impactStats.citySavings}</div>
            <div className="text-orange-100">City Savings</div>
            <div className="mt-3 text-sm bg-white/20 rounded-lg px-3 py-1 inline-block">
              Through efficiency
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Impact */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up" style={{animationDelay: '0.3s'}}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📊 Impact by Category
            </h2>
            
            <div className="space-y-4">
              {categoryImpact.map((category) => (
                <div key={category.category} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {category.category}
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full text-sm font-medium">
                      {category.improvement}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {category.fixed}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Fixed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {category.pending}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Pending</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                      style={{width: `${(category.fixed / (category.fixed + category.pending)) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up" style={{animationDelay: '0.4s'}}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              🏆 Community Champions
            </h2>
            
            <div className="space-y-4">
              {topContributors.map((contributor, index) => (
                <div key={contributor.name} className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-xl">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${
                    index === 0 ? 'from-yellow-400 to-yellow-600' :
                    index === 1 ? 'from-gray-300 to-gray-400' :
                    'from-orange-400 to-orange-600'
                  } flex items-center justify-center text-3xl shadow-lg`}>
                    {contributor.avatar}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {contributor.name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <span>📝 {contributor.issues} reports</span>
                      <span>•</span>
                      <span>🎯 {contributor.impact} impact</span>
                    </div>
                  </div>
                  
                  <div className="text-3xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </div>
                </div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {impactStats.activeVolunteers}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Active Volunteers</div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {impactStats.responseTime}h
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Avg Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg animate-slide-up" style={{animationDelay: '0.5s'}}>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            🎯 Community Milestones
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${milestone.color} flex items-center justify-center text-5xl shadow-lg mb-4 animate-pulse`}>
                  {milestone.icon}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                  {milestone.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {milestone.date}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="mt-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white shadow-lg animate-slide-up" style={{animationDelay: '0.6s'}}>
          <div className="text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-3xl font-bold mb-4">
              Environmental Impact
            </h2>
            <p className="text-lg text-green-100 mb-6">
              Our community efforts have contributed to a greener city
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">{impactStats.carbonSaved}</div>
                <div className="text-green-100">CO₂ Reduced</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">134</div>
                <div className="text-green-100">Trees Planted</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <div className="text-4xl font-bold mb-2">89%</div>
                <div className="text-green-100">Waste Recycled</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
