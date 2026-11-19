import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

interface Command {
  id: string
  label: string
  icon: string
  action: () => void
  keywords: string[]
  category: string
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)

  const commands: Command[] = [
    // Navigation
    { id: 'home', label: 'Go to Home', icon: '🏠', action: () => navigate('/'), keywords: ['home', 'dashboard'], category: 'Navigation' },
    { id: 'report', label: 'Report New Issue', icon: '📝', action: () => navigate('/report'), keywords: ['report', 'new', 'create'], category: 'Actions' },
    { id: 'my-reports', label: 'My Reports', icon: '📋', action: () => navigate('/my-reports'), keywords: ['my', 'reports', 'list'], category: 'Navigation' },
    { id: 'map', label: 'View Map', icon: '🗺️', action: () => navigate('/map'), keywords: ['map', 'location'], category: 'Navigation' },
    { id: 'analytics', label: 'Analytics Dashboard', icon: '📊', action: () => navigate('/analytics'), keywords: ['analytics', 'stats', 'dashboard'], category: 'Navigation' },
    
    // Settings
    { id: 'theme-light', label: 'Switch to Light Mode', icon: '☀️', action: () => switchTheme('light'), keywords: ['theme', 'light', 'bright'], category: 'Settings' },
    { id: 'theme-dark', label: 'Switch to Dark Mode', icon: '🌙', action: () => switchTheme('dark'), keywords: ['theme', 'dark', 'night'], category: 'Settings' },
    { id: 'notifications', label: 'Notification Settings', icon: '🔔', action: () => navigate('/settings/notifications'), keywords: ['notifications', 'settings'], category: 'Settings' },
    
    // Quick Actions
    { id: 'shortcuts', label: 'Show Keyboard Shortcuts', icon: '⌨️', action: () => showShortcuts(), keywords: ['shortcuts', 'keyboard', 'keys'], category: 'Help' },
    { id: 'export', label: 'Export Reports', icon: '📥', action: () => {}, keywords: ['export', 'download'], category: 'Actions' },
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  )

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, Command[]>)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
        setSearch('')
        setSelectedIndex(0)
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }

      // Arrow navigation
      if (isOpen && filteredCommands.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % filteredCommands.length)
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length)
        } else if (e.key === 'Enter') {
          e.preventDefault()
          executeCommand(filteredCommands[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const executeCommand = (command: Command) => {
    command.action()
    setIsOpen(false)
    setSearch('')
    setSelectedIndex(0)
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setSelectedIndex(0)
              }}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-lg"
            />
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
              Esc
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-4xl mb-2">🔍</p>
              <p>No commands found</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  {category}
                </div>
                {cmds.map((cmd, idx) => {
                  const globalIndex = filteredCommands.indexOf(cmd)
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => executeCommand(cmd)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full px-4 py-3 flex items-center space-x-3 transition-colors ${
                        selectedIndex === globalIndex
                          ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="text-2xl">{cmd.icon}</span>
                      <span className="flex-1 text-left text-gray-900 dark:text-white font-medium">
                        {cmd.label}
                      </span>
                      {selectedIndex === globalIndex && (
                        <kbd className="px-2 py-1 bg-white dark:bg-gray-900 rounded text-xs font-mono text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600">
                          ↵
                        </kbd>
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↓</kbd>
              <span>Navigate</span>
            </span>
            <span className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
              <span>Select</span>
            </span>
          </div>
          <span>Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600">Ctrl + K</kbd> to open</span>
        </div>
      </div>
    </div>
  )
}

function switchTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}

function showShortcuts() {
  // Trigger keyboard shortcuts modal
  const event = new KeyboardEvent('keydown', { key: '?', shiftKey: true })
  window.dispatchEvent(event)
}
