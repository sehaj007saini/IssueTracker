import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      const error = err as { response?: { data?: { message?: string } } }
      setError(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy-50 via-white to-sky-50 dark:from-navy-950 dark:via-navy-900 dark:to-navy-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-royal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md animate-slide-up">
        <div className="text-center">
          <div className="inline-block p-4 bg-white dark:bg-navy-800 rounded-2xl shadow-lg mb-4">
            <span className="text-6xl">🏛️</span>
          </div>
          <h2 className="text-4xl font-extrabold text-navy-900 dark:text-white mb-2">
            Welcome Back!
          </h2>
          <p className="text-lg text-navy-600 dark:text-navy-300">
            Sign in to continue making a difference
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 animate-slide-up" style={{animationDelay: '0.1s'}}>
        <div className="bg-white/80 dark:bg-navy-800/80 backdrop-blur-xl py-8 px-4 shadow-glass-lg sm:rounded-2xl sm:px-10 border border-navy-200 dark:border-navy-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-danger-50 dark:bg-danger-900/20 border-2 border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-xl animate-shake">
                <div className="flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-navy-700 dark:text-navy-300 mb-2">
                📧 Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm placeholder-navy-400 dark:placeholder-navy-500 bg-white dark:bg-navy-700 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-navy-700 dark:text-navy-300 mb-2">
                🔒 Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border-2 border-navy-300 dark:border-navy-600 rounded-xl shadow-sm placeholder-navy-400 dark:placeholder-navy-500 bg-white dark:bg-navy-700 text-navy-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-royal-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-royal-600 focus:ring-royal-500 border-navy-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-navy-700 dark:text-navy-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-royal-600 dark:text-royal-400 hover:text-royal-700">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-white font-bold bg-royal-600 hover:bg-royal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-royal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🚀 Sign in
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-300 dark:border-navy-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 dark:bg-navy-800/80 text-navy-500 dark:text-navy-400 font-medium">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login/otp"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-sky-300 dark:border-sky-700 rounded-xl text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-900/20 hover:bg-sky-100 dark:hover:bg-sky-900/30 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <span className="text-xl">📱</span>
                Login with OTP (SMS/WhatsApp)
              </Link>
            </div>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-navy-300 dark:border-navy-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/80 dark:bg-navy-800/80 text-navy-500 dark:text-navy-400">
                  Don't have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/register"
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border-2 border-navy-300 dark:border-navy-600 rounded-xl text-navy-700 dark:text-navy-300 bg-white dark:bg-navy-700 hover:bg-navy-50 dark:hover:bg-navy-600 font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all"
              >
                <span className="text-xl">✨</span>
                Create new account
              </Link>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-navy-500 dark:text-navy-400">
              By signing in, you agree to our{' '}
              <a href="#" className="text-royal-600 dark:text-royal-400 hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-royal-600 dark:text-royal-400 hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs font-medium text-navy-700 dark:text-navy-300">Earn Badges</div>
          </div>
          <div className="bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl mb-1">🗺️</div>
            <div className="text-xs font-medium text-navy-700 dark:text-navy-300">Track Issues</div>
          </div>
          <div className="bg-white/50 dark:bg-navy-800/50 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl mb-1">🌟</div>
            <div className="text-xs font-medium text-navy-700 dark:text-navy-300">Make Impact</div>
          </div>
        </div>
      </div>
    </div>
  )
}
