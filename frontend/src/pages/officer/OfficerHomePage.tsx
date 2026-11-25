import Header from '../../components/layout/Header'

export default function OfficerHomePage() {
  return (
    <div className="min-h-screen bg-navy-50 dark:bg-navy-950">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-navy-900 dark:text-white mb-8">Officer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 border border-navy-200 dark:border-navy-700 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Open Issues</h2>
              <div className="p-2 bg-royal-100 dark:bg-royal-900/30 rounded-lg">
                <svg className="w-6 h-6 text-royal-600 dark:text-royal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-4xl font-bold text-royal-600 dark:text-royal-400">--</p>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-400">Awaiting assignment</p>
          </div>
          <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 border border-navy-200 dark:border-navy-700 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-navy-900 dark:text-white">In Progress</h2>
              <div className="p-2 bg-warning-100 dark:bg-warning-900/30 rounded-lg">
                <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-4xl font-bold text-warning-600 dark:text-warning-400">--</p>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-400">Currently being resolved</p>
          </div>
          <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 border border-navy-200 dark:border-navy-700 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-navy-900 dark:text-white">Resolved</h2>
              <div className="p-2 bg-success-100 dark:bg-success-900/30 rounded-lg">
                <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-4xl font-bold text-success-600 dark:text-success-400">--</p>
            <p className="mt-2 text-sm text-navy-600 dark:text-navy-400">Successfully completed</p>
          </div>
        </div>
        <div className="bg-white dark:bg-navy-800 shadow-lg rounded-xl p-6 border border-navy-200 dark:border-navy-700">
          <h2 className="text-xl font-bold text-navy-900 dark:text-white mb-4">Assigned Issues</h2>
          <div className="text-center py-8">
            <div className="inline-block p-4 bg-sky-100 dark:bg-sky-900/30 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-sky-600 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-navy-600 dark:text-navy-300 text-lg">Assigned issues will be displayed here</p>
            <p className="text-navy-500 dark:text-navy-400 text-sm mt-2">View and manage all issues assigned to you</p>
          </div>
        </div>
      </main>
    </div>
  )
}
