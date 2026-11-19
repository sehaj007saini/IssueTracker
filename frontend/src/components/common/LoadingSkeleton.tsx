interface LoadingSkeletonProps {
  type?: 'card' | 'list' | 'profile' | 'text'
  count?: number
}

export default function LoadingSkeleton({ type = 'card', count = 3 }: LoadingSkeletonProps) {
  const CardSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-300 dark:bg-gray-700"></div>
      
      {/* Content */}
      <div className="p-5">
        {/* Status badge */}
        <div className="h-6 w-24 bg-gray-300 dark:bg-gray-700 rounded-full mb-3"></div>
        
        {/* Title */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        
        {/* Description */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
        
        {/* Location */}
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
        
        {/* Footer */}
        <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-4">
            <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-5 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="h-5 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )

  const ListSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  )

  const ProfileSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-20 h-20 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-gray-300 dark:bg-gray-700 rounded-lg"></div>
        ))}
      </div>
    </div>
  )

  const TextSkeleton = () => (
    <div className="animate-pulse space-y-2">
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-4/6"></div>
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case 'list':
        return <ListSkeleton />
      case 'profile':
        return <ProfileSkeleton />
      case 'text':
        return <TextSkeleton />
      default:
        return <CardSkeleton />
    }
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </>
  )
}
