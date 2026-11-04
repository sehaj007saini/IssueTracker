export interface User {
  id: number
  email: string
  name: string
  phone?: string
  role: 'CITIZEN' | 'OFFICER' | 'ADMIN'
}

export interface AuthResponse {
  token: string
  tokenType: string
  userId: number
  email: string
  role: string
  expiresIn: number
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  phone?: string
  role?: 'CITIZEN' | 'OFFICER' | 'ADMIN'
}
