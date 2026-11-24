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
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-sky-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Professional Hero Section */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-100 dark:bg-royal-900/30 text-royal-700 dark:text-royal-300 rounded-full text-sm font-semibold mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span>Empowering Citizens, Building Better Communities</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-navy-900 dark:text-white mb-6 leading-tight">
            India Local Problems<br />
            <span className="text-royal-600 dark:text-royal-400">Civic Issue Portal</span>
          </h1>
          
          <p className="text-xl text-navy-600 dark:text-navy-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Report civic issues, track their resolution, and contribute to building a better community.
            Your voice matters in shaping our nation's infrastructure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/report"
              className="group px-8 py-4 bg-royal-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-royal-700 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Report an Issue
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link
              to="/my-reports"
              className="px-8 py-4 bg-white dark:bg-navy-800 text-royal-600 dark:text-royal-400 text-lg font-semibold rounded-xl border-2 border-royal-600 dark:border-royal-500 hover:bg-royal-50 dark:hover:bg-navy-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center gap-2 shadow-md"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              View My Reports
            </Link>
          </div>
        </div>

        {/* Professional Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16 animate-slide-up" style={{animationDelay: '0.1s'}}>
          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-royal-100 dark:bg-royal-900/30 rounded-lg">
                <svg className="w-8 h-8 text-royal-600 dark:text-royal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-navy-900 dark:text-white mb-1">
              {stats.totalIssues.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-navy-600 dark:text-navy-400">Total Issues Reported</div>
            <div className="mt-3 flex items-center text-sm text-success-600 dark:text-success-400">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              +12% this month
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-navy-900 dark:text-white mb-1">
              {stats.resolvedIssues.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-navy-600 dark:text-navy-400">Issues Resolved</div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-navy-600 dark:text-navy-400">Resolution Rate</span>
                <span className="font-semibold text-navy-900 dark:text-white">71.5%</span>
              </div>
              <div className="w-full bg-navy-200 dark:bg-navy-700 rounded-full h-2">
                <div className="bg-success-500 h-2 rounded-full" style={{width: '71.5%'}}></div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <svg className="w-8 h-8 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-navy-900 dark:text-white mb-1">
              {stats.activeUsers.toLocaleString()}
            </div>
            <div className="text-sm font-medium text-navy-600 dark:text-navy-400">Active Citizens</div>
            <div className="mt-3 flex items-center">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-royal-400 to-sky-500 border-2 border-white dark:border-navy-800"></div>
                ))}
              </div>
              <span className="ml-2 text-sm text-navy-600 dark:text-navy-400">+28 today</span>
            </div>
          </div>

          <div className="bg-white dark:bg-navy-800 rounded-xl p-6 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-3 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                <svg className="w-8 h-8 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-navy-900 dark:text-white mb-1">
              {stats.avgResolveTime}
            </div>
            <div className="text-sm font-medium text-navy-600 dark:text-navy-400">Avg. Resolution Time</div>
            <div className="mt-3 flex items-center text-sm text-success-600 dark:text-success-400">
              <svg className="w-4 h-4 mr-1 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              15% faster
            </div>
          </div>
        </div>

        {/* Professional Feature Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <div className="group bg-white dark:bg-navy-800 rounded-xl p-8 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-2xl hover:-translate-y-2 hover:border-royal-400 dark:hover:border-royal-600 transition-all duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-royal-100 dark:bg-royal-900/30 text-royal-600 dark:text-royal-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">Report Issues</h3>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
              Take a photo, add location, and describe the problem. Our AI helps categorize and prioritize your report for quick resolution.
            </p>
            <Link to="/report" className="mt-6 inline-flex items-center text-royal-600 dark:text-royal-400 font-semibold group-hover:gap-2 transition-all">
              Get started
              <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="group bg-white dark:bg-navy-800 rounded-xl p-8 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-2xl hover:-translate-y-2 hover:border-sky-400 dark:hover:border-sky-600 transition-all duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">Track Progress</h3>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
              Monitor the status of your reported issues in real-time. Get instant notifications when officials respond or update status.
            </p>
            <Link to="/my-reports" className="mt-6 inline-flex items-center text-sky-600 dark:text-sky-400 font-semibold group-hover:gap-2 transition-all">
              View reports
              <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="group bg-white dark:bg-navy-800 rounded-xl p-8 shadow-lg border border-navy-200 dark:border-navy-700 hover:shadow-2xl hover:-translate-y-2 hover:border-success-400 dark:hover:border-success-600 transition-all duration-300">
            <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400 mb-6 group-hover:scale-110 transition-transform">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-navy-900 dark:text-white mb-3">Verify Solutions</h3>
            <p className="text-navy-600 dark:text-navy-300 leading-relaxed">
              Confirm when issues are properly resolved by authorities. Your verification helps maintain accountability and quality.
            </p>
            <Link to="/my-reports" className="mt-6 inline-flex items-center text-success-600 dark:text-success-400 font-semibold group-hover:gap-2 transition-all">
              Learn more
              <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Professional How It Works Section */}
        <div className="bg-sky-50 dark:bg-navy-800/50 rounded-3xl p-8 md:p-12 shadow-lg border border-sky-100 dark:border-navy-700 animate-slide-up" style={{animationDelay: '0.3s'}}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-navy-600 dark:text-navy-300 max-w-2xl mx-auto">
              Four simple steps to make your community better
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: 1, title: 'Spot a Problem', desc: 'Notice a pothole or infrastructure issue in your area', icon: '🔍', color: 'royal' },
              { number: 2, title: 'Report It', desc: 'Take a photo and submit the report with your location', icon: '📸', color: 'sky' },
              { number: 3, title: 'Officers Resolve', desc: 'Municipal officers work on fixing the reported issue', icon: '🔧', color: 'warning' },
              { number: 4, title: 'You Verify', desc: 'Confirm the issue has been properly fixed', icon: '✅', color: 'success' },
            ].map((step) => (
              <div key={step.number} className="relative text-center">
                <div className={`w-20 h-20 rounded-full bg-${step.color}-600 dark:bg-${step.color}-500 text-white flex items-center justify-center text-5xl mx-auto mb-4 shadow-lg hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>
                <div className={`absolute top-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white dark:bg-navy-800 shadow-lg border-4 border-${step.color}-100 dark:border-${step.color}-900 z-10`}>
                  <span className="text-lg font-bold text-navy-900 dark:text-white">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-2 mt-2">{step.title}</h3>
                <p className="text-sm text-navy-600 dark:text-navy-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-royal-600 to-sky-600 dark:from-royal-700 dark:to-sky-700 rounded-3xl p-12 shadow-2xl animate-slide-up" style={{animationDelay: '0.4s'}}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-semibold mb-4">
            <span className="animate-pulse">🎯</span>
            <span>Join thousands of active citizens</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Your voice matters. Start reporting issues today and help build a better tomorrow for your community.
          </p>
          <Link
            to="/report"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-royal-600 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Get Started Now
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  )
}
