interface PriorityBadgeProps {
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function PriorityBadge({ priority, size = 'md', showLabel = true }: PriorityBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  }

  const priorityConfig = {
    CRITICAL: {
      icon: '🔴',
      label: 'Critical',
      className: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-800',
      pulse: true
    },
    HIGH: {
      icon: '🟠',
      label: 'High',
      className: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-800',
      pulse: false
    },
    MEDIUM: {
      icon: '🟡',
      label: 'Medium',
      className: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-800',
      pulse: false
    },
    LOW: {
      icon: '🟢',
      label: 'Low',
      className: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-800',
      pulse: false
    }
  }

  const config = priorityConfig[priority]

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full ${sizeClasses[size]} ${config.className} ${
        config.pulse ? 'animate-pulse' : ''
      }`}
    >
      <span className="mr-1">{config.icon}</span>
      {showLabel && config.label}
    </span>
  )
}
