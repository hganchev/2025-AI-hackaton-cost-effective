"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Session, User, UserCredentials, UserRegistration } from "@/types/index"
import { generateId } from "./utils"

// Временна база данни за демо целите (в реален проект това би било API)
const USERS_STORAGE_KEY = "bookapp_users"
const SESSION_STORAGE_KEY = "bookapp_session"

const getStoredUsers = (): User[] => {
  if (typeof window === "undefined") return []
  
  try {
    const storedUsers = localStorage.getItem(USERS_STORAGE_KEY)
    return storedUsers ? JSON.parse(storedUsers) : []
  } catch (error) {
    console.error("Грешка при четене на потребители:", error)
    return []
  }
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
    console.error("Грешка при четене на сесия:", error)
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
  const [users, setUsers] = useState<User[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Инициализираме AuthProvider със запазените потребители и сесия
  useEffect(() => {
    setUsers(getStoredUsers())
    const session = getStoredSession()
    
    if (session) {
      setUser(session.user)
    }
    
    setIsLoading(false)
  }, [])
  
  // Синхронизираме потребителите с localStorage
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    }
  }, [users])
  
  const register = async (data: UserRegistration): Promise<{ success: boolean; error?: string }> => {
    // Валидираме входните данни
    if (!data.name || !data.email || !data.password) {
      return { success: false, error: "Всички полета са задължителни" }
    }
    
    if (data.password !== data.confirmPassword) {
      return { success: false, error: "Паролите не съвпадат" }
    }
    
    // Проверяваме дали имейлът вече е използван
    const existingUser = users.find(u => u.email === data.email)
    if (existingUser) {
      return { success: false, error: "Имейл адресът вече е регистриран" }
    }
    
    // Създаваме нов потребител
    const newUser: User = {
      id: generateId(),
      name: data.name,
      email: data.email,
      role: 'user'
    }
    
    // Добавяме го към масива с потребители
    setUsers(prev => [...prev, newUser])
    
    // Създаваме сесия
    const session: Session = {
      user: newUser,
      token: Math.random().toString(36).substring(2, 15),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 дни
    }
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    setUser(newUser)
    
    return { success: true }
  }
  
  const login = async (credentials: UserCredentials): Promise<{ success: boolean; error?: string }> => {
    // Валидираме входните данни
    if (!credentials.email || !credentials.password) {
      return { success: false, error: "Всички полета са задължителни" }
    }
    
    // Проверяваме дали потребителят съществува
    // В реален проект тук бихме изпратили заявка към API
    const existingUser = users.find(u => u.email === credentials.email)
    if (!existingUser) {
      return { success: false, error: "Невалиден имейл или парола" }
    }
    
    // В демото не съхраняваме парола, така че приемаме всяка парола
    // В реален проект бихме сравнили хеширани пароли
    
    // Създаваме сесия
    const session: Session = {
      user: existingUser,
      token: Math.random().toString(36).substring(2, 15),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 дни
    }
    
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    setUser(existingUser)
    
    return { success: true }
  }
  
  const logout = () => {
    localStorage.removeItem(SESSION_STORAGE_KEY)
    setUser(null)
  }
  
  const updateUser = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: "Не сте влезли в профила си" }
    }
    
    // Актуализираме потребителя
    const updatedUser = { ...user, ...data }
    
    // Актуализираме масива с потребители
    setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u))
    
    // Актуализираме текущия потребител
    setUser(updatedUser)
    
    // Актуализираме сесията
    const session = getStoredSession()
    if (session) {
      session.user = updatedUser
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))
    }
    
    return { success: true }
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
    throw new Error("useAuth трябва да се използва вътре в AuthProvider")
  }
  return context
} 