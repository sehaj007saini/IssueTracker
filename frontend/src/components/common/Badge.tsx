interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  icon?: string
}

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  rounded = true,
  icon
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  }

  const roundedClass = rounded ? 'rounded-full' : 'rounded'

  return (
    <span
      className={`inline-flex items-center font-semibold ${variantClasses[variant]} ${sizeClasses[size]} ${roundedClass}`}
    >
      {icon && <span className="mr-1">{icon}</span>}
      {children}
    </span>
  )
}
