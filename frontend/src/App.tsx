import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import './i18n/config'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OtpLoginPage from './pages/auth/OtpLoginPage'
import HomePage from './pages/citizen/HomePage'
import ReportIssuePage from './pages/citizen/ReportIssuePage'
import IssueDetailPage from './pages/citizen/IssueDetailPage'
import MyReportsPage from './pages/citizen/MyReportsPage'
import MapPage from './pages/citizen/MapPage'
import OfficerHomePage from './pages/officer/OfficerHomePage'
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard'
import NotificationPreferencesPage from './pages/settings/NotificationPreferencesPage'
import ProtectedRoute from './components/layout/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes - directly accessible */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/otp" element={<OtpLoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/report" element={<ReportIssuePage />} />
              <Route path="/issues/:id" element={<IssueDetailPage />} />
              <Route path="/my-reports" element={<MyReportsPage />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/officer" element={<OfficerHomePage />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/settings/notifications" element={<NotificationPreferencesPage />} />
              
              {/* Default redirect */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
