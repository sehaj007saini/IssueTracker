import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'

export default function HomePage() {
  const [stats, setStats] = useState({
    totalIssues: 1247,
    resolvedIssues: 892,
    activeUsers: 523,
    avgResolveTime: '3.2 days'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-purple-600 p-8 md:p-12 shadow-glass-lg animate-slide-up">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 h-72 w-72 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-72 w-72 rounded-full bg-purple-400 opacity-10 blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl animate-fade-in">
              🏛️ Report Civic Issues in Your Community
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-blue-100 md:text-xl animate-slide-up" style={{animationDelay: '0.1s'}}>
              Help improve your neighborhood by reporting potholes, broken infrastructure, and other civic problems. 
              Track progress and verify when issues are resolved. Together, we build better communities! 🌟
            </p>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center animate-scale-in" style={{animationDelay: '0.2s'}}>
              <Link
                to="/report"
                className="group relative px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <span className="flex items-center justify-center gap-2">
                  📝 Report an Issue
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link
                to="/map"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold text-lg border-2 border-white/30 hover:bg-white/20 transform hover:scale-105 transition-all duration-200"
              >
                🗺️ Explore Map
              </Link>
            </div>
          </div>
        </div>

        {/* Real-time Stats Dashboard */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Issues</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.totalIssues.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +12% from last month
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.resolvedIssues.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl">
                <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Resolution Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">71.5%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '71.5%'}}></div>
              </div>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.activeUsers.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-2 border-white dark:border-gray-800"></div>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">+28 today</span>
            </div>
          </div>

          <div className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Resolve Time</p>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stats.avgResolveTime}</p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-xl">
                <svg className="w-8 h-8 text-orange-600 dark:text-orange-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600 dark:text-orange-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              15% faster this month
            </div>
          </div>
        </div>

        {/* Features Grid with Modern Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="group relative bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl mb-4 shadow-lg">
                📝
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Report Issues</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Take a photo, add location, and describe the problem. Our AI helps categorize and prioritize your report.
              </p>
              <Link to="/report" className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
                Get started
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 text-white text-2xl mb-4 shadow-lg">
                📊
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Track Progress</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor the status of your reported issues in real-time. Get notifications when status changes.
              </p>
              <Link to="/my-reports" className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
                View reports
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="group relative bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 text-white text-2xl mb-4 shadow-lg">
                ✅
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verify Solutions</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Confirm when issues are properly resolved by authorities. Your verification helps maintain quality.
              </p>
              <Link to="/my-reports" className="mt-4 inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold group-hover:gap-2 transition-all">
                Learn more
                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works - Modern Timeline */}
        <div className="mt-20 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-8 md:p-12 shadow-glass-lg animate-slide-up" style={{animationDelay: '0.5s'}}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Four simple steps to make your community better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-14 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 dark:from-blue-900 dark:via-purple-900 dark:to-green-900"></div>
            
            {[
              { number: 1, title: 'Spot a Problem', desc: 'Notice a pothole or infrastructure issue in your area', icon: '🔍', color: 'from-blue-400 to-blue-600' },
              { number: 2, title: 'Report It', desc: 'Take a photo and submit the report with your location', icon: '📸', color: 'from-purple-400 to-purple-600' },
              { number: 3, title: 'Officers Resolve', desc: 'Municipal officers work on fixing the reported issue', icon: '🔧', color: 'from-orange-400 to-orange-600' },
              { number: 4, title: 'You Verify', desc: 'Confirm the issue has been properly fixed', icon: '✅', color: 'from-green-400 to-green-600' },
            ].map((step) => (
              <div key={step.number} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className={`relative z-10 flex items-center justify-center h-28 w-28 rounded-full bg-gradient-to-br ${step.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-5xl">{step.icon}</span>
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center justify-center h-8 w-8 rounded-full bg-white dark:bg-gray-800 shadow-lg border-4 border-white dark:border-gray-900 z-20">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-slide-up" style={{animationDelay: '0.6s'}}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium mb-4">
            <span className="animate-pulse">🎯</span>
            <span>Join thousands of active citizens</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your voice matters. Start reporting issues today and help build a better tomorrow.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started Now
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}
