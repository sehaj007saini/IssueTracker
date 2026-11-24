import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'

interface CalendarEvent {
  id: number
  date: Date
  title: string
  type: 'report' | 'resolved' | 'update' | 'deadline'
  status: string
  category: string
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Mock events
  const events: CalendarEvent[] = [
    { id: 1, date: new Date(2026, 10, 5), title: 'Pothole reported', type: 'report', status: 'open', category: 'Roads' },
    { id: 2, date: new Date(2026, 10, 10), title: 'Street light fixed', type: 'resolved', status: 'resolved', category: 'Safety' },
    { id: 3, date: new Date(2026, 10, 15), title: 'Waste collection', type: 'update', status: 'in_progress', category: 'Waste' },
    { id: 4, date: new Date(2026, 10, 20), title: 'Repair deadline', type: 'deadline', status: 'pending', category: 'Roads' },
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      event.date.getDate() === date.getDate() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getFullYear() === date.getFullYear()
    )
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'report': return 'bg-blue-500'
      case 'resolved': return 'bg-green-500'
      case 'update': return 'bg-yellow-500'
      case 'deadline': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'report': return '📝'
      case 'resolved': return '✅'
      case 'update': return '🔄'
      case 'deadline': return '⏰'
      default: return '📌'
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🗓️ Issue Calendar
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track issues and events over time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up" style={{animationDelay: '0.1s'}}>
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {monthName}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={previousMonth}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}

              {/* Days of month */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                const dayEvents = getEventsForDate(date)
                const isToday = date.toDateString() === new Date().toDateString()
                const isSelected = selectedDate?.toDateString() === date.toDateString()

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(date)}
                    className={`aspect-square p-2 rounded-lg transition-all hover:scale-105 ${
                      isToday 
                        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500' 
                        : isSelected
                        ? 'bg-purple-100 dark:bg-purple-900 ring-2 ring-purple-500'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className={`text-sm font-medium ${
                      isToday ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-white'
                    }`}>
                      {day}
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dayEvents.slice(0, 3).map((event, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full ${getEventColor(event.type)}`}
                          ></div>
                        ))}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-6 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Report</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Update</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Deadline</span>
              </div>
            </div>
          </div>

          {/* Events Sidebar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {selectedDate ? selectedDate.toLocaleDateString('default', { month: 'long', day: 'numeric' }) : 'All Events'}
            </h2>

            <div className="space-y-3">
              {(selectedDate ? getEventsForDate(selectedDate) : events).map((event) => (
                <Link
                  key={event.id}
                  to={`/issues/${event.id}`}
                  className="block p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:shadow-lg transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getEventColor(event.type)} flex items-center justify-center text-white text-xl`}>
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        <span>{event.category}</span>
                        <span>•</span>
                        <span>{event.date.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {selectedDate && getEventsForDate(selectedDate).length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-2">📭</div>
                  <p className="text-sm">No events on this date</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
