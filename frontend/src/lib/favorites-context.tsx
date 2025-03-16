"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Book } from "@/types/index"
import { useAuth } from "./auth-context"

// Ключ за localStorage
const FAVORITES_STORAGE_KEY = "bookapp_favorites"

// Получаване на запазените любими книги от localStorage
const getStoredFavorites = (userId: string | undefined): string[] => {
  if (typeof window === "undefined" || !userId) return []
  
  try {
    const storedFavorites = localStorage.getItem(`${FAVORITES_STORAGE_KEY}_${userId}`)
    return storedFavorites ? JSON.parse(storedFavorites) : []
  } catch (error) {
    console.error("Грешка при четене на любими книги:", error)
    return []
  }
}

interface FavoritesContextType {
  favorites: string[]
  isFavorite: (bookId: string) => boolean
  addToFavorites: (bookId: string) => void
  removeFromFavorites: (bookId: string) => void
  toggleFavorite: (bookId: string) => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  
  // Инициализираме любимите книги при зареждане или промяна на потребителя
  useEffect(() => {
    if (user) {
      setFavorites(getStoredFavorites(user.id))
    } else {
      setFavorites([])
    }
  }, [user])
  
  // Синхронизираме любимите книги с localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(`${FAVORITES_STORAGE_KEY}_${user.id}`, JSON.stringify(favorites))
    }
  }, [favorites, user])
  
  const isFavorite = (bookId: string) => {
    return favorites.includes(bookId)
  }
  
  const addToFavorites = (bookId: string) => {
    if (!user) return
    if (!isFavorite(bookId)) {
      setFavorites(prev => [...prev, bookId])
    }
  }
  
  const removeFromFavorites = (bookId: string) => {
    if (!user) return
    setFavorites(prev => prev.filter(id => id !== bookId))
  }
  
  const toggleFavorite = (bookId: string) => {
    if (isFavorite(bookId)) {
      removeFromFavorites(bookId)
    } else {
      addToFavorites(bookId)
    }
  }
  
  const value = {
    favorites,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite
  }
  
  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites трябва да се използва вътре в FavoritesProvider")
  }
  return context
} 