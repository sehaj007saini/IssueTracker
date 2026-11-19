import { useState } from 'react'

interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv'
  dateRange: 'all' | 'lastWeek' | 'lastMonth' | 'lastYear' | 'custom'
  categories: string[]
  statuses: string[]
  includePhotos: boolean
  includeComments: boolean
}

export default function ExportReports() {
  const [isExporting, setIsExporting] = useState(false)
  const [options, setOptions] = useState<ExportOptions>({
    format: 'pdf',
    dateRange: 'lastMonth',
    categories: [],
    statuses: [],
    includePhotos: true,
    includeComments: true
  })
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')

  const handleExport = async () => {
    setIsExporting(true)
    
    // TODO: Implement actual export logic
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Create mock file download
    const blob = new Blob(['Mock exported data'], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `issues-report-${Date.now()}.${options.format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    setIsExporting(false)
  }

  const toggleCategory = (category: string) => {
    if (options.categories.includes(category)) {
      setOptions({ ...options, categories: options.categories.filter(c => c !== category) })
    } else {
      setOptions({ ...options, categories: [...options.categories, category] })
    }
  }

  const toggleStatus = (status: string) => {
    if (options.statuses.includes(status)) {
      setOptions({ ...options, statuses: options.statuses.filter(s => s !== status) })
    } else {
      setOptions({ ...options, statuses: [...options.statuses, status] })
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          📥 Export Reports
        </h2>
      </div>

      <div className="space-y-6">
        {/* Export Format */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setOptions({ ...options, format: 'pdf' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                options.format === 'pdf'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">📄</div>
              <div className="font-medium text-gray-900 dark:text-white">PDF</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Best for viewing</div>
            </button>
            <button
              onClick={() => setOptions({ ...options, format: 'excel' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                options.format === 'excel'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">📊</div>
              <div className="font-medium text-gray-900 dark:text-white">Excel</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">For analysis</div>
            </button>
            <button
              onClick={() => setOptions({ ...options, format: 'csv' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                options.format === 'csv'
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
              }`}
            >
              <div className="text-3xl mb-2">📋</div>
              <div className="font-medium text-gray-900 dark:text-white">CSV</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Universal format</div>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Date Range
          </label>
          <select
            value={options.dateRange}
            onChange={(e) => setOptions({ ...options, dateRange: e.target.value as ExportOptions['dateRange'] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Time</option>
            <option value="lastWeek">Last 7 Days</option>
            <option value="lastMonth">Last 30 Days</option>
            <option value="lastYear">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {options.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">From</label>
                <input
                  type="date"
                  value={customDateFrom}
                  onChange={(e) => setCustomDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">To</label>
                <input
                  type="date"
                  value={customDateTo}
                  onChange={(e) => setCustomDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter by Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Filter by Category
          </label>
          <div className="flex flex-wrap gap-2">
            {['Water Supply', 'Waste Management', 'Street Lighting', 'Drainage', 'Road Infrastructure'].map(category => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  options.categories.includes(category)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {options.categories.length === 0 ? 'All categories will be included' : `${options.categories.length} categories selected`}
          </p>
        </div>

        {/* Filter by Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Filter by Status
          </label>
          <div className="flex flex-wrap gap-2">
            {['Reported', 'Acknowledged', 'In Progress', 'Resolved', 'Closed'].map(status => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  options.statuses.includes(status)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {options.statuses.length === 0 ? 'All statuses will be included' : `${options.statuses.length} statuses selected`}
          </p>
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Additional Options
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includePhotos}
              onChange={(e) => setOptions({ ...options, includePhotos: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">📸 Include Photos</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeComments}
              onChange={(e) => setOptions({ ...options, includeComments: e.target.checked })}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">💬 Include Comments</span>
          </label>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors flex items-center justify-center"
        >
          {isExporting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Exporting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500 dark:text-gray-400">
          Report will be downloaded to your device
        </p>
      </div>
    </div>
  )
}
