interface StatsCardProps {
  icon: string
  label: string
  value: number | string
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'blue' | 'green' | 'orange' | 'red' | 'purple'
  onClick?: () => void
}

export default function StatsCard({ icon, label, value, trend, color = 'blue', onClick }: StatsCardProps) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700',
    green: 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700',
    orange: 'from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700',
    red: 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700',
    purple: 'from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700',
  }

  const Component = onClick ? 'button' : 'div'

  return (
    <Component
      onClick={onClick}
      className={`relative overflow-hidden bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-white rounded-full"></div>
        <div className="absolute -left-2 -bottom-2 w-16 h-16 bg-white rounded-full"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{icon}</div>
          {trend && (
            <div
              className={`flex items-center space-x-1 text-sm font-semibold px-2 py-1 rounded-full ${
                trend.isPositive ? 'bg-white/20' : 'bg-black/20'
              }`}
            >
              <svg
                className={`w-4 h-4 ${trend.isPositive ? '' : 'transform rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm font-medium opacity-90">{label}</div>
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full hover:translate-x-0 transition-transform duration-1000"></div>
      </div>
    </Component>
  )
}
