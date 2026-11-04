import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Header from '../../components/layout/Header'
import IssueMap from '../../components/maps/IssueMap'
import api from '../../services/api'
import { Issue } from '../../types/issue'

export default function MapPage() {
  const navigate = useNavigate()

  const { data: issues = [], isLoading, error } = useQuery({
    queryKey: ['issues'],
    queryFn: async () => {
      const response = await api.get<Issue[]>('/api/issues')
      return response.data
    }
  })

  const handleIssueClick = (issue: Issue) => {
    navigate(`/issues/${issue.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Issues Map</h1>
          <p className="mt-2 text-gray-600">
            View all reported issues on the map. Click markers to see details.
          </p>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading map...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600">Failed to load issues. Please try again.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span>Open</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                  <span>In Progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span>Resolved</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span>Under Verification</span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {issues.length} issue{issues.length !== 1 ? 's' : ''} displayed
              </div>
            </div>
            
            {issues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No issues to display on the map yet.</p>
              </div>
            ) : (
              <IssueMap
                issues={issues}
                center={issues.length > 0 ? [issues[0].latitude, issues[0].longitude] : [12.9716, 77.5946]}
                zoom={13}
                onIssueClick={handleIssueClick}
              />
            )}
          </div>
        )}
      </main>
    </div>
  )
}
