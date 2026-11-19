import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationBell from '../common/NotificationBell'
import LanguageSwitcher from '../common/LanguageSwitcher'
import DarkModeToggle from '../common/DarkModeToggle'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">🚧</span>
              <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">
                {t('common.appName')}
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t('common.home')}
            </Link>
            <Link
              to="/report"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t('nav.reportIssue')}
            </Link>
            <Link
              to="/my-reports"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              {t('nav.myReports')}
            </Link>
            {user?.role === 'OFFICER' || user?.role === 'ADMIN' ? (
              <>
                <Link
                  to="/officer"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('nav.officerDashboard')}
                </Link>
                <Link
                  to="/analytics"
                  className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Analytics
                </Link>
              </>
            ) : null}
            <Link
              to="/map"
              className="text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 px-3 py-2 rounded-md text-sm font-medium"
            >
              Map View
            </Link>

            <DarkModeToggle />
            <NotificationBell />
            <LanguageSwitcher />

            <div className="border-l border-gray-300 dark:border-gray-700 pl-4 ml-4">
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
