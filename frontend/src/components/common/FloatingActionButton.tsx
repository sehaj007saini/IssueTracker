import { useState } from 'react'
import { Link } from 'react-router-dom'

interface Action {
  id: string
  label: string
  icon: string
  link: string
  color: string
}

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false)

  const actions: Action[] = [
    {
      id: 'report',
      label: 'Report Issue',
      icon: '📝',
      link: '/report',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'map',
      label: 'View Map',
      icon: '🗺️',
      link: '/map',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'trending',
      label: 'Trending',
      icon: '🔥',
      link: '/trending',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'search',
      label: 'Search',
      icon: '🔍',
      link: '/search',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action Menu */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex flex-col gap-3 animate-slide-up">
          {actions.map((action, index) => (
            <Link
              key={action.id}
              to={action.link}
              onClick={() => setIsOpen(false)}
              className="group flex items-center gap-3 animate-slide-up"
              style={{animationDelay: `${index * 0.05}s`}}
            >
              <span className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {action.label}
              </span>
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center text-2xl shadow-lg transform hover:scale-110 transition-all cursor-pointer`}>
                {action.icon}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-2xl transform hover:scale-110 transition-all ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Backdrop when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
