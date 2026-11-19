import { Link } from 'react-router-dom'
import PriorityBadge from '../common/PriorityBadge'

interface IssueCardProps {
  id: string
  title: string
  description: string
  category: string
  status: string
  priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  location: string
  createdAt: string
  supportCount: number
  commentCount: number
  photoUrl?: string
  reporterName: string
}

export default function IssueCard({
  id,
  title,
  description,
  category,
  status,
  priority,
  location,
  createdAt,
  supportCount,
  commentCount,
  photoUrl,
  reporterName
}: IssueCardProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      REPORTED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      ACKNOWLEDGED: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      IN_PROGRESS: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
      RESOLVED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      CLOSED: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400',
      REJECTED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    }
    return colors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      WATER_SUPPLY: '💧',
      WASTE_MANAGEMENT: '🗑️',
      STREET_LIGHTING: '💡',
      DRAINAGE: '🌊',
      ROAD_INFRASTRUCTURE: '🛣️',
    }
    return icons[category] || '📌'
  }

  const formatTimeAgo = (dateString: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000)
    
    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <Link to={`/issues/${id}`}>
      <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1">
        {/* Image Header */}
        {photoUrl && (
          <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900">
            <img
              src={photoUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            
            {/* Priority Badge on Image */}
            {priority && (
              <div className="absolute top-3 right-3">
                <PriorityBadge priority={priority} size="sm" />
              </div>
            )}
            
            {/* Category Badge on Image */}
            <div className="absolute bottom-3 left-3">
              <span className="px-3 py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-900 dark:text-white">
                {getCategoryIcon(category)} {category.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Status Badge */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
              {status.replace(/_/g, ' ')}
            </span>
            {!photoUrl && priority && (
              <PriorityBadge priority={priority} size="sm" />
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="line-clamp-1">{location}</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              {/* Support Count */}
              <div className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
                <span className="font-medium">{supportCount}</span>
              </div>

              {/* Comment Count */}
              <div className="flex items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-medium">{commentCount}</span>
              </div>
            </div>

            {/* Time and Reporter */}
            <div className="text-xs text-gray-500 dark:text-gray-500 text-right">
              <div>{formatTimeAgo(createdAt)}</div>
              <div className="font-medium">{reporterName}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
