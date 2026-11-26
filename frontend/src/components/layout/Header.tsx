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
    <header className="bg-navy-900 dark:bg-navy-950 shadow-lg transition-colors border-b border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <span className="text-3xl">🏛️</span>
              <span className="ml-3 text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                India Local Problems OS
              </span>
            </Link>
          </div>

          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className="text-white/90 hover:text-white hover:bg-navy-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {t('common.home')}
            </Link>
            <Link
              to="/report"
              className="text-white/90 hover:text-white hover:bg-royal-600 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {t('nav.reportIssue')}
            </Link>
            <Link
              to="/my-reports"
              className="text-white/90 hover:text-white hover:bg-navy-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              {t('nav.myReports')}
            </Link>
            {user?.role === 'OFFICER' || user?.role === 'ADMIN' ? (
              <>
                <Link
                  to="/officer"
                  className="text-white/90 hover:text-white hover:bg-navy-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  {t('nav.officerDashboard')}
                </Link>
                <Link
                  to="/analytics"
                  className="text-white/90 hover:text-white hover:bg-navy-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Analytics
                </Link>
              </>
            ) : null}
            <Link
              to="/map"
              className="text-white/90 hover:text-white hover:bg-navy-800 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Map View
            </Link>

            <div className="flex items-center space-x-2 ml-4 border-l border-navy-700 pl-4">
              <div className="text-white">
                <DarkModeToggle />
              </div>
              <div className="text-white">
                <NotificationBell />
              </div>
              <div className="text-white">
                <LanguageSwitcher />
              </div>
            </div>

            <div className="border-l border-navy-700 pl-4 ml-4">
              <div className="flex items-center space-x-3">
                <div className="text-sm text-right">
                  <p className="font-semibold text-white">{user?.name}</p>
                  <p className="text-xs text-sky-400">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-royal-600 hover:bg-royal-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md hover:shadow-lg"
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
