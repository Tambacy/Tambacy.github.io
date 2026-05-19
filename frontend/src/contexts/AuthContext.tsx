import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { authApi } from '@/lib/api'

export interface User {
  id: number
  email: string
  nickname: string
}

export interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthDialogOpen: boolean
  authDialogMode: 'login' | 'register'
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  openAuthDialog: (mode: 'login' | 'register') => void
  closeAuthDialog: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)
  const [authDialogMode, setAuthDialogMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken) {
      setToken(savedToken)
      authApi.getMe()
        .then((me) => {
          setUser({
            id: me.id,
            email: me.email,
            nickname: me.nickname,
          })
        })
        .catch(() => {
          localStorage.removeItem('token')
          setToken(null)
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response = await authApi.login({ email, password })
    localStorage.setItem('token', response.token)
    setToken(response.token)
    setUser({
      id: response.user.id,
      email: response.user.email,
      nickname: response.user.nickname,
    })
  }, [])

  const register = useCallback(async (email: string, password: string) => {
    const response = await authApi.register({ email, password })
    localStorage.setItem('token', response.token)
    setToken(response.token)
    setUser({
      id: response.user.id,
      email: response.user.email,
      nickname: response.user.nickname,
    })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const openAuthDialog = useCallback((mode: 'login' | 'register') => {
    setAuthDialogMode(mode)
    setIsAuthDialogOpen(true)
  }, [])

  const closeAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(false)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthDialogOpen,
        authDialogMode,
        login,
        register,
        logout,
        openAuthDialog,
        closeAuthDialog,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}