import { useEffect, useState } from 'react'
import Header from '../../components/layout/Header'
import api from '../../services/api'

interface Analytics {
  totalIssues: number
  openIssues: number
  assignedIssues: number
  inProgressIssues: number
  resolvedIssues: number
  reopenedIssues: number
  averageResolutionTimeDays: number
  issuesLastWeek: number
  issuesBySeverity: Record<string, number>
  issuesByStatus: Record<string, number>
  issuesByCategory: Record<string, number>
  issuesByWard?: Record<string, number>
}

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/analytics')
      setAnalytics(response.data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">Loading analytics...</div>
        </main>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-red-600">Failed to load analytics</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Issues"
            value={analytics.totalIssues}
            icon="📊"
            color="blue"
          />
          <MetricCard
            title="Open Issues"
            value={analytics.openIssues}
            icon="🔴"
            color="red"
          />
          <MetricCard
            title="In Progress"
            value={analytics.inProgressIssues}
            icon="⚙️"
            color="yellow"
          />
          <MetricCard
            title="Resolved"
            value={analytics.resolvedIssues}
            icon="✅"
            color="green"
          />
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Average Resolution Time"
            value={`${analytics.averageResolutionTimeDays.toFixed(1)} days`}
          />
          <StatCard
            title="Issues This Week"
            value={analytics.issuesLastWeek}
          />
          <StatCard
            title="Reopened Issues"
            value={analytics.reopenedIssues}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* By Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Status</h3>
            <div className="space-y-3">
              {Object.entries(analytics.issuesByStatus).map(([status, count]) => (
                <BarItem
                  key={status}
                  label={status.replace('_', ' ')}
                  value={count}
                  total={analytics.totalIssues}
                  color={getStatusColor(status)}
                />
              ))}
            </div>
          </div>

          {/* By Severity */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Severity</h3>
            <div className="space-y-3">
              {Object.entries(analytics.issuesBySeverity).map(([severity, count]) => (
                <BarItem
                  key={severity}
                  label={severity}
                  value={count}
                  total={analytics.totalIssues}
                  color={getSeverityColor(severity)}
                />
              ))}
            </div>
          </div>

          {/* By Category */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">By Category</h3>
            <div className="space-y-3">
              {Object.entries(analytics.issuesByCategory).map(([category, count]) => (
                <BarItem
                  key={category}
                  label={category}
                  value={count}
                  total={analytics.totalIssues}
                />
              ))}
            </div>
          </div>

          {/* By Ward */}
          {analytics.issuesByWard && Object.keys(analytics.issuesByWard).length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">By Ward</h3>
              <div className="space-y-3">
                {Object.entries(analytics.issuesByWard)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([ward, count]) => (
                    <BarItem
                      key={ward}
                      label={ward}
                      value={count}
                      total={analytics.totalIssues}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function MetricCard({ title, value, icon, color }: any) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`text-4xl ${colors[color] || 'bg-gray-50 text-gray-600'} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function BarItem({ label, value, total, color = 'bg-royal-600' }: any) {
  const percentage = (value / total) * 100

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-navy-700 dark:text-navy-300">{label}</span>
        <span className="text-navy-600 dark:text-navy-400">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPEN: 'bg-red-500',
    ASSIGNED: 'bg-blue-500',
    IN_PROGRESS: 'bg-yellow-500',
    RESOLVED: 'bg-green-500',
    REOPENED: 'bg-orange-500',
  }
  return colors[status] || 'bg-gray-500'
}

function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    CRITICAL: 'bg-red-600',
    HIGH: 'bg-orange-500',
    MEDIUM: 'bg-yellow-500',
    LOW: 'bg-green-500',
  }
  return colors[severity] || 'bg-gray-500'
}
