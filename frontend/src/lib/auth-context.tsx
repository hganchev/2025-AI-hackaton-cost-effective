"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Session, User, UserCredentials, UserRegistration } from "@/types"
import { api } from "./api"

const SESSION_STORAGE_KEY = "bookapp_session"

interface AuthResponse {
  user: User;
  token: string;
}

const getStoredSession = (): Session | null => {
  if (typeof window === "undefined") return null
  
  try {
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY)
    const session = storedSession ? JSON.parse(storedSession) : null
    
    if (session && session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      return null
    }
    
    return session
  } catch (error) {
    console.error("Error reading session:", error)
    return null
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  register: (data: UserRegistration) => Promise<{ success: boolean; error?: string }>
  login: (credentials: UserCredentials) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Initialize AuthProvider with stored session
  useEffect(() => {
    const session = getStoredSession()
    if (session) {
      setUser(session.user)
    }
    setIsLoading(false)
  }, [])
  
  const register = async (data: UserRegistration): Promise<{ success: boolean; error?: string }> => {
    const result = await api.register(data)
    return result
  }
  
  const login = async (credentials: UserCredentials): Promise<{ success: boolean; error?: string }> => {
    const result = await api.login(credentials)
    
    if (result.success && result.data) {
      const { user, token } = result.data
      
      const session: Session = {
        user,
        token,
        expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      }
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      setUser(user)
      return { success: true }
    }
    
    return { success: false, error: result.error }
  }
  
  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setUser(null)
  }
  
  const updateUser = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    const result = await api.updateUser(data)
    
    if (result.success && result.data) {
      const session = getStoredSession()
      if (session) {
        session.user = result.data
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      }
      setUser(result.data)
      return { success: true }
    }
    
    return { success: false, error: result.error }
  }
  
  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    register,
    login,
    logout,
    updateUser
  }
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 