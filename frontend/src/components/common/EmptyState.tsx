import { ReactNode } from 'react'
import Button from './Button'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  children?: ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  children
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Animated Icon */}
      <div className="text-8xl mb-6 animate-bounce">{icon}</div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg">
          {actionLabel}
        </Button>
      )}

      {/* Custom Children */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
