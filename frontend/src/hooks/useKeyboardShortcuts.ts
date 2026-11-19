import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface ShortcutConfig {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts() {
  const navigate = useNavigate()

  const shortcuts: ShortcutConfig[] = [
    {
      key: 'n',
      ctrlKey: true,
      description: 'Create new issue report',
      action: () => navigate('/report'),
    },
    {
      key: 'h',
      ctrlKey: true,
      description: 'Go to home',
      action: () => navigate('/'),
    },
    {
      key: 'm',
      ctrlKey: true,
      description: 'View map',
      action: () => navigate('/map'),
    },
    {
      key: 'r',
      ctrlKey: true,
      description: 'View my reports',
      action: () => navigate('/my-reports'),
    },
    {
      key: 's',
      ctrlKey: true,
      shiftKey: true,
      description: 'Search issues',
      action: () => {
        // Focus search input if exists
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement
        if (searchInput) {
          searchInput.focus()
        }
      },
    },
    {
      key: 'd',
      ctrlKey: true,
      description: 'Toggle dark mode',
      action: () => {
        document.documentElement.classList.toggle('dark')
        const isDark = document.documentElement.classList.contains('dark')
        localStorage.setItem('theme', isDark ? 'dark' : 'light')
      },
    },
    {
      key: '?',
      shiftKey: true,
      description: 'Show keyboard shortcuts',
      action: () => {
        // Show shortcuts modal
        showShortcutsModal()
      },
    },
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === e.key.toLowerCase() &&
          !!s.ctrlKey === e.ctrlKey &&
          !!s.shiftKey === e.shiftKey &&
          !!s.altKey === e.altKey
      )

      if (shortcut) {
        e.preventDefault()
        shortcut.action()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return shortcuts
}

function showShortcutsModal() {
  // Create modal dynamically
  const modal = document.createElement('div')
  modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in'
  modal.onclick = () => modal.remove()

  const content = document.createElement('div')
  content.className = 'bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full mx-4 animate-scale-in'
  content.onclick = (e) => e.stopPropagation()

  content.innerHTML = `
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">⌨️ Keyboard Shortcuts</h2>
      <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="space-y-2">
      <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-700 dark:text-gray-300">Create new report</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl + N</kbd>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-700 dark:text-gray-300">Go to home</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl + H</kbd>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-700 dark:text-gray-300">View map</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl + M</kbd>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-700 dark:text-gray-300">My reports</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl + R</kbd>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-700 dark:text-gray-300">Search</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl + Shift + S</kbd>
      </div>
      <div class="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700">
        <span class="text-gray-700 dark:text-gray-300">Toggle dark mode</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Ctrl + D</kbd>
      </div>
      <div class="flex items-center justify-between py-2">
        <span class="text-gray-700 dark:text-gray-300">Show shortcuts</span>
        <kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">Shift + ?</kbd>
      </div>
    </div>
    <div class="mt-6 text-center">
      <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
        Got it!
      </button>
    </div>
  `

  modal.appendChild(content)
  document.body.appendChild(modal)
}
