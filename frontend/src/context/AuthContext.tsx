import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types/user'
import { authService } from '../services/authService'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = authService.getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const authData = await authService.login({ email, password })
    authService.saveAuth(authData)
    setUser({
      id: authData.userId,
      email: authData.email,
      name: email.split('@')[0], // Temporary until we get name from backend
      role: authData.role as 'CITIZEN' | 'OFFICER' | 'ADMIN',
    })
  }

  const register = async (email: string, password: string, name: string, phone?: string) => {
    const authData = await authService.register({ email, password, name, phone })
    authService.saveAuth(authData)
    setUser({
      id: authData.userId,
      email: authData.email,
      name,
      phone,
      role: authData.role as 'CITIZEN' | 'OFFICER' | 'ADMIN',
    })
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
