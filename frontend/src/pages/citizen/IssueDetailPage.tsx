import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Header from '../../components/layout/Header'
import CommentSection from '../../components/comments/CommentSection'
import api from '../../services/api'
import { Issue } from '../../types/issue'

interface Comment {
  id: number
  user: {
    id: number
    name: string
  }
  comment: string
  isEdited: boolean
  createdAt: string
  parent?: Comment
}

export default function IssueDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: issue, isLoading: issueLoading } = useQuery({
    queryKey: ['issue', id],
    queryFn: async () => {
      const response = await api.get<Issue>(`/api/issues/${id}`)
      return response.data
    },
    enabled: !!id
  })

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const response = await api.get<Comment[]>(`/api/issues/${id}/comments`)
      return response.data
    },
    enabled: !!id
  })

  const addCommentMutation = useMutation({
    mutationFn: async ({ comment, parentId }: { comment: string; parentId?: number }) => {
      const response = await api.post(`/api/issues/${id}/comments`, {
        comment,
        parentId
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
    }
  })

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      await api.delete(`/api/issues/${id}/comments/${commentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', id] })
    }
  })

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      OPEN: 'bg-red-100 text-red-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
      RESOLUTION_SUBMITTED: 'bg-purple-100 text-purple-800',
      UNDER_VERIFICATION: 'bg-indigo-100 text-indigo-800',
      RESOLVED: 'bg-green-100 text-green-800',
      REOPENED: 'bg-orange-100 text-orange-800'
    }
    return statusColors[status] || 'bg-gray-100 text-gray-800'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'text-red-600'
      case 'HIGH': return 'text-orange-600'
      case 'MEDIUM': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  if (issueLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading issue details...</p>
          </div>
        </main>
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-red-600">Issue not found.</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Issue #{issue.id}</h1>
              <p className="mt-2 text-gray-600">{issue.address}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusBadge(issue.status)}`}>
                {issue.status.replace('_', ' ')}
              </span>
              <span className={`text-sm font-semibold ${getSeverityColor(issue.severity)}`}>
                {issue.severity} Severity
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-gray-900">{issue.description}</p>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Reports</h3>
                <p className="text-gray-900">{issue.reportCount} citizen(s) reported this issue</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Support</h3>
                <p className="text-gray-900">{issue.supportCount} citizen(s) supporting resolution</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created</h3>
                <p className="text-gray-900">{new Date(issue.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {issue.photoUrl && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Photo Evidence</h3>
              <img 
                src={issue.photoUrl} 
                alt="Issue" 
                className="max-w-full h-auto rounded-lg shadow"
              />
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
            <p className="text-gray-900">
              📍 {issue.latitude.toFixed(6)}, {issue.longitude.toFixed(6)}
            </p>
          </div>
        </div>

        <CommentSection
          issueId={parseInt(id!)}
          comments={comments}
          onAddComment={async (comment, parentId) => {
            await addCommentMutation.mutateAsync({ comment, parentId })
          }}
          onDeleteComment={async (commentId) => {
            await deleteCommentMutation.mutateAsync(commentId)
          }}
        />
      </main>
    </div>
  )
}
