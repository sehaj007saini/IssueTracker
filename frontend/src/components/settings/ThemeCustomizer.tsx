import { useState } from 'react'

interface Theme {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  preview: string[]
}

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTheme, setSelectedTheme] = useState('default')

  const themes: Theme[] = [
    {
      id: 'default',
      name: 'Ocean Blue',
      primaryColor: '#0ea5e9',
      secondaryColor: '#7c3aed',
      accentColor: '#06b6d4',
      preview: ['from-blue-400', 'via-blue-500', 'to-purple-500']
    },
    {
      id: 'sunset',
      name: 'Sunset Orange',
      primaryColor: '#f97316',
      secondaryColor: '#dc2626',
      accentColor: '#fbbf24',
      preview: ['from-orange-400', 'via-red-500', 'to-pink-500']
    },
    {
      id: 'forest',
      name: 'Forest Green',
      primaryColor: '#10b981',
      secondaryColor: '#059669',
      accentColor: '#84cc16',
      preview: ['from-green-400', 'via-emerald-500', 'to-teal-500']
    },
    {
      id: 'royal',
      name: 'Royal Purple',
      primaryColor: '#8b5cf6',
      secondaryColor: '#6366f1',
      accentColor: '#a855f7',
      preview: ['from-purple-400', 'via-violet-500', 'to-indigo-500']
    },
    {
      id: 'rose',
      name: 'Rose Pink',
      primaryColor: '#ec4899',
      secondaryColor: '#be185d',
      accentColor: '#f472b6',
      preview: ['from-pink-400', 'via-rose-500', 'to-red-500']
    },
    {
      id: 'cyber',
      name: 'Cyber Neon',
      primaryColor: '#06b6d4',
      secondaryColor: '#8b5cf6',
      accentColor: '#f59e0b',
      preview: ['from-cyan-400', 'via-purple-500', 'to-pink-500']
    }
  ]

  const applyTheme = (theme: Theme) => {
    setSelectedTheme(theme.id)
    // Apply theme colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', theme.primaryColor)
    document.documentElement.style.setProperty('--color-secondary', theme.secondaryColor)
    document.documentElement.style.setProperty('--color-accent', theme.accentColor)
  }

  return (
    <>
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl shadow-2xl transform hover:scale-110 transition-all"
        title="Customize Theme"
      >
        🎨
      </button>

      {/* Theme Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">🎨 Theme Customizer</h2>
                  <p className="text-purple-100 text-sm mt-1">Choose your style</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Color Themes */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Color Themes
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => applyTheme(theme)}
                      className={`relative overflow-hidden rounded-xl p-4 transition-all transform hover:scale-105 ${
                        selectedTheme === theme.id
                          ? 'ring-4 ring-purple-500 shadow-lg'
                          : 'ring-1 ring-gray-200 dark:ring-gray-700'
                      }`}
                    >
                      {/* Gradient Preview */}
                      <div className={`h-20 rounded-lg bg-gradient-to-br ${theme.preview.join(' ')} mb-3`}></div>
                      
                      {/* Theme Name */}
                      <div className="text-left">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                          {theme.name}
                        </h4>
                        
                        {/* Color Dots */}
                        <div className="flex gap-1 mt-2">
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800" 
                            style={{backgroundColor: theme.primaryColor}}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800" 
                            style={{backgroundColor: theme.secondaryColor}}
                          ></div>
                          <div 
                            className="w-4 h-4 rounded-full border-2 border-white dark:border-gray-800" 
                            style={{backgroundColor: theme.accentColor}}
                          ></div>
                        </div>
                      </div>

                      {/* Selected Check */}
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Font Size
                </h3>
                <div className="flex gap-2">
                  {['Small', 'Medium', 'Large'].map((size) => (
                    <button
                      key={size}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Border Style
                </h3>
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors" style={{borderRadius: '4px'}}>
                    Sharp
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Rounded
                  </button>
                  <button className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-2xl text-gray-900 dark:text-white font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    Soft
                  </button>
                </div>
              </div>

              {/* Animations */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Animations
                </h3>
                <label className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer">
                  <span className="text-gray-900 dark:text-white font-medium">
                    Enable Animations
                  </span>
                  <input type="checkbox" defaultChecked className="toggle" />
                </label>
              </div>

              {/* Preview Card */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Preview
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Sample Card
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    This is how your interface will look with the selected theme.
                  </p>
                  <button className="px-6 py-2 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-lg font-medium shadow-lg">
                    Action Button
                  </button>
                </div>
              </div>

              {/* Reset Button */}
              <button className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                Reset to Default
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
