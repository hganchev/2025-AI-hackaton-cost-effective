"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Book, BookData, Category } from "@/types/index"
import { generateId } from "./utils"
import { useAuth } from "./auth-context"

// Ключове за localStorage
const BOOKS_STORAGE_KEY = "bookapp_books"
const CATEGORIES_STORAGE_KEY = "bookapp_categories"

// Получаване на запазените книги от localStorage
const getStoredBooks = (): Book[] => {
  if (typeof window === "undefined") return []
  
  try {
    const storedBooks = localStorage.getItem(BOOKS_STORAGE_KEY)
    return storedBooks ? JSON.parse(storedBooks) : []
  } catch (error) {
    console.error("Грешка при четене на книги:", error)
    return []
  }
}

// Получаване на запазените категории от localStorage
const getStoredCategories = (): Category[] => {
  if (typeof window === "undefined") return []
  
  try {
    const storedCategories = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    return storedCategories ? JSON.parse(storedCategories) : []
  } catch (error) {
    console.error("Грешка при четене на категории:", error)
    return []
  }
}

// Примерни категории за първоначално зареждане
const initialCategories: Category[] = [
  { id: "cat1", name: "Фантастика", slug: "fantasy" },
  { id: "cat2", name: "Трилър", slug: "thriller" },
  { id: "cat3", name: "Романтика", slug: "romance" },
  { id: "cat4", name: "Исторически", slug: "historical" },
  { id: "cat5", name: "Научна-фантастика", slug: "sci-fi" },
]

// Примерни книги за първоначално зареждане
const initialBooks: Book[] = [
  {
    id: "book1",
    title: "Хари Потър и Философският камък",
    author: "Дж. К. Роулинг",
    coverImage: "/images/book-placeholder.jpg",
    description: "Първата книга от поредицата за Хари Потър, в която младият магьосник открива своето минало и започва обучение в училището за магия Хогуортс.",
    category: "cat1",
    year: 1997
  },
  {
    id: "book2",
    title: "1984",
    author: "Джордж Оруел",
    coverImage: "/images/book-placeholder.jpg",
    description: "Антиутопичен роман, представящ тоталитарно общество, в което правителството контролира всеки аспект от човешкия живот.",
    category: "cat5",
    year: 1949
  },
  {
    id: "book3",
    title: "Престъпление и наказание",
    author: "Фьодор Достоевски",
    coverImage: "/images/book-placeholder.jpg",
    description: "Психологически роман, изследващ моралните дилеми на бедния студент Расколников, който убива лихварка.",
    category: "cat2",
    year: 1866
  }
]

interface BooksContextType {
  books: Book[]
  categories: Category[]
  getBookById: (id: string) => Book | undefined
  getBooksByCategory: (categoryId: string | undefined) => Book[]
  addBook: (book: Omit<Book, "id">) => Book
  updateBook: (id: string, data: Partial<Book>) => Book | undefined
  deleteBook: (id: string) => void
  searchBooks: (query: string) => Book[]
  sortBooks: (books: Book[], sortBy: "title" | "author" | "year", direction: "asc" | "desc") => Book[]
}

const BooksContext = createContext<BooksContextType | undefined>(undefined)

export function BooksProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  
  // Инициализираме книгите и категориите при първо зареждане
  useEffect(() => {
    const storedBooks = getStoredBooks()
    const storedCategories = getStoredCategories()
    
    if (storedBooks.length === 0) {
      setBooks(initialBooks)
    } else {
      setBooks(storedBooks)
    }
    
    if (storedCategories.length === 0) {
      setCategories(initialCategories)
    } else {
      setCategories(storedCategories)
    }
  }, [])
  
  // Синхронизираме книгите с localStorage
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books))
    }
  }, [books])
  
  // Синхронизираме категориите с localStorage
  useEffect(() => {
    if (categories.length > 0) {
      localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories))
    }
  }, [categories])
  
  const getBookById = (id: string) => {
    return books.find(book => book.id === id)
  }
  
  const getBooksByCategory = (categoryId: string | undefined) => {
    if (!categoryId) return books
    return books.filter(book => book.category === categoryId)
  }
  
  const addBook = (bookData: Omit<Book, "id">) => {
    // Проверяваме дали потребителят е влязъл в профила си
    if (!user) {
      throw new Error("Трябва да сте влезли в профила си, за да добавите книга")
    }
    
    // Проверяваме дали потребителят е админ (ако нямаме роли, всеки може да добавя)
    if (user.role !== "admin" && user.role !== "user") {
      throw new Error("Нямате права да добавяте книги")
    }
    
    // Създаваме нова книга
    const newBook: Book = {
      id: generateId(),
      ...bookData
    }
    
    // Добавяме книгата към масива
    setBooks(prev => [...prev, newBook])
    
    return newBook
  }
  
  const updateBook = (id: string, data: Partial<Book>) => {
    // Проверяваме дали потребителят е влязъл в профила си
    if (!user) {
      throw new Error("Трябва да сте влезли в профила си, за да редактирате книга")
    }
    
    // Проверяваме дали книгата съществува
    const bookIndex = books.findIndex(book => book.id === id)
    if (bookIndex === -1) return undefined
    
    // Актуализираме книгата
    const updatedBook = { ...books[bookIndex], ...data }
    
    // Актуализираме масива с книги
    const updatedBooks = [...books]
    updatedBooks[bookIndex] = updatedBook
    setBooks(updatedBooks)
    
    return updatedBook
  }
  
  const deleteBook = (id: string) => {
    // Проверяваме дали потребителят е влязъл в профила си
    if (!user) {
      throw new Error("Трябва да сте влезли в профила си, за да изтриете книга")
    }
    
    // Проверяваме дали потребителят е админ
    if (user.role !== "admin") {
      throw new Error("Само администратори могат да изтриват книги")
    }
    
    // Изтриваме книгата
    setBooks(prev => prev.filter(book => book.id !== id))
  }
  
  const searchBooks = (query: string) => {
    if (!query.trim()) return books
    
    const lowerQuery = query.toLowerCase()
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerQuery) ||
      book.author.toLowerCase().includes(lowerQuery) ||
      (book.description && book.description.toLowerCase().includes(lowerQuery))
    )
  }
  
  const sortBooks = (booksToSort: Book[], sortBy: "title" | "author" | "year", direction: "asc" | "desc") => {
    const sortedBooks = [...booksToSort]
    
    sortedBooks.sort((a, b) => {
      let result = 0
      
      if (sortBy === "title") {
        result = a.title.localeCompare(b.title)
      } else if (sortBy === "author") {
        result = a.author.localeCompare(b.author)
      } else if (sortBy === "year") {
        // Ако няма година, слагаме я най-отдолу
        if (!a.year && !b.year) result = 0
        else if (!a.year) result = 1
        else if (!b.year) result = -1
        else result = a.year - b.year
      }
      
      return direction === "asc" ? result : -result
    })
    
    return sortedBooks
  }
  
  const value = {
    books,
    categories,
    getBookById,
    getBooksByCategory,
    addBook,
    updateBook,
    deleteBook,
    searchBooks,
    sortBooks
  }
  
  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  )
}

export const useBooks = () => {
  const context = useContext(BooksContext)
  if (context === undefined) {
    throw new Error("useBooks трябва да се използва вътре в BooksProvider")
  }
  return context
} 