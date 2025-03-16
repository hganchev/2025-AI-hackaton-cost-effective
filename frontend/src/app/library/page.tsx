"use client"

import { useState, useEffect } from 'react'
import { Filter, Grid, List, Search, BookOpen, Clock, BookText } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookCard } from '@/components/book-card'
import { Button } from '@/components/ui/button'

// Define types for better code organization
interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  category: string
  year: number
}

type ViewMode = 'grid' | 'list'
type SortOption = 'title' | 'author' | 'year'
type SortDirection = 'asc' | 'desc'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Library() {
  // State management with proper typing
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<SortOption>('title')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)

  // Categories for filtering
  const categories = [
    'all',
    'fiction',
    'non-fiction',
    'science',
    'history',
    'biography',
    'fantasy',
    'mystery',
    'romance'
  ]

  // Fetch books on component mount
  useEffect(() => {
    const fetchBooks = async (): Promise<void> => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Mock data for books
        const mockBooks: Book[] = [
          {
            id: '1',
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            coverImage: "https://m.media-amazon.com/images/I/71FTb9X6wsL._AC_UF894,1000_QL80_.jpg",
            description: "A story of wealth, love, and the American Dream in the 1920s.",
            category: "Fiction",
            year: 1925
          },
          {
            id: '2',
            title: "1984",
            author: "George Orwell",
            coverImage: "https://m.media-amazon.com/images/I/71kxa1-0mfL._AC_UF1000,1000_QL80_.jpg",
            description: "A dystopian novel about totalitarianism and surveillance.",
            category: "Fiction",
            year: 1949
          },
          {
            id: '3',
            title: "To Kill a Mockingbird",
            author: "Harper Lee",
            coverImage: "https://m.media-amazon.com/images/I/81aY1lxk+9L._AC_UF1000,1000_QL80_.jpg",
            description: "A story about racial injustice and moral growth in the American South.",
            category: "Fiction",
            year: 1960
          },
          {
            id: '4',
            title: "Pride and Prejudice",
            author: "Jane Austen",
            coverImage: "https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg",
            description: "A romantic novel about the societal expectations of women in the early 19th century.",
            category: "Romance",
            year: 1813
          },
          {
            id: '5',
            title: "The Hobbit",
            author: "J.R.R. Tolkien",
            coverImage: "https://m.media-amazon.com/images/I/710+HcoP38L._AC_UF1000,1000_QL80_.jpg",
            description: "A fantasy novel about the journey of Bilbo Baggins.",
            category: "Fantasy",
            year: 1937
          },
          {
            id: '6',
            title: "A Brief History of Time",
            author: "Stephen Hawking",
            coverImage: "https://m.media-amazon.com/images/I/A1xkFZX5k-L._AC_UF1000,1000_QL80_.jpg",
            description: "A book about cosmology and the universe.",
            category: "Science",
            year: 1988
          },
          {
            id: '7',
            title: "Sapiens: A Brief History of Humankind",
            author: "Yuval Noah Harari",
            coverImage: "https://m.media-amazon.com/images/I/713jIoMO3UL._AC_UF1000,1000_QL80_.jpg",
            description: "A book about the history and evolution of humans.",
            category: "History",
            year: 2011
          }
        ]

        setBooks(mockBooks)
        setFilteredBooks(mockBooks)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching books:', error)
        setLoading(false)
      }
    }
    
    fetchBooks()
  }, [])

  // Apply filters and sorting when dependencies change
  useEffect(() => {
    let result = [...books]
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(book => book.category === selectedCategory)
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        book => 
          book.title.toLowerCase().includes(query) || 
          book.author.toLowerCase().includes(query) ||
          book.description.toLowerCase().includes(query)
      )
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0
      
      if (sortBy === 'title') {
        comparison = a.title.localeCompare(b.title)
      } else if (sortBy === 'author') {
        comparison = a.author.localeCompare(b.author)
      } else if (sortBy === 'year') {
        comparison = a.year - b.year
      }
      
      return sortDirection === 'asc' ? comparison : -comparison
    })
    
    setFilteredBooks(result)
  }, [books, selectedCategory, sortBy, sortDirection, searchQuery])

  // Handler functions
  const handleCategoryChange = (category: string): void => {
    setSelectedCategory(category)
  }
  
  const handleSortChange = (option: SortOption): void => {
    if (sortBy === option) {
      // Toggle direction if same option is selected
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(option)
      setSortDirection('asc')
    }
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value)
  }
  
  const toggleViewMode = (): void => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid')
  }

  // Get the category icon based on name
  const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
      case 'fiction': return <BookText className="w-4 h-4" />;
      case 'history': return <Clock className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <main className="flex-grow">
        {/* Hero section skeleton */}
        <div className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 py-20">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-4 max-w-2xl">
              <div className="h-10 w-2/3 bg-amber-200/50 dark:bg-slate-700/50 rounded"></div>
              <div className="h-5 w-full bg-amber-200/50 dark:bg-slate-700/50 rounded"></div>
              <div className="h-5 w-3/4 bg-amber-200/50 dark:bg-slate-700/50 rounded"></div>
            </div>
          </div>
        </div>
        
        {/* Filters skeleton */}
        <div className="border-b py-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <div className="animate-pulse flex flex-wrap gap-4">
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
              <div className="h-10 w-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
            </div>
          </div>
        </div>
        
        {/* Books skeleton */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-slate-200 dark:bg-slate-800 rounded-lg mb-4"></div>
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-2"></div>
                <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/4 -right-1/4 w-2/3 h-screen bg-amber-200/40 dark:bg-amber-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-1/3 h-1/3 bg-amber-300/30 dark:bg-amber-700/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-amber-300">Digital Library</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-8">
              Discover thousands of books from every genre. Find your next favorite read or revisit beloved classics.
            </p>
            
            {/* Search bar in hero section */}
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
              <input
                type="search"
                placeholder="Search by title, author, or description..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full h-12 rounded-full pl-12 pr-4 bg-white/90 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-400 transition-all duration-300"
              />
            </div>
            
            <div className="flex flex-wrap gap-2 mt-6">
              <span className="text-slate-600 dark:text-slate-400 font-medium">Popular:</span>
              {categories.slice(1, 5).map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Filters and Controls */}
      <div className="sticky top-20 z-30 bg-white dark:bg-slate-900 border-b border-amber-100 dark:border-slate-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
              
              {selectedCategory !== 'all' && (
                <div className="inline-flex gap-1 items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
                  <span className="capitalize">{selectedCategory}</span>
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {searchQuery && (
                <div className="inline-flex gap-1 items-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-sm">
                  <Search className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">{searchQuery}</span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-amber-200 dark:hover:bg-amber-800"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
              </div>
              
              {/* Sort dropdown */}
              <select
                value={`${sortBy}-${sortDirection}`}
                onChange={(e) => {
                  const [newSortBy, newSortDirection] = e.target.value.split('-') as [SortOption, SortDirection]
                  setSortBy(newSortBy)
                  setSortDirection(newSortDirection)
                }}
                className="h-9 rounded-md border border-amber-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:border-amber-500 dark:focus:border-amber-400"
              >
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="author-asc">Author (A-Z)</option>
                <option value="author-desc">Author (Z-A)</option>
                <option value="year-asc">Year (Oldest)</option>
                <option value="year-desc">Year (Newest)</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 rounded-md p-1 flex">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md ${viewMode === 'grid' 
                    ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                    : 'hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                  aria-label="Grid view"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md ${viewMode === 'list' 
                    ? 'bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' 
                    : 'hover:bg-amber-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Expandable filters */}
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-amber-100 dark:border-slate-800"
            >
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                      selectedCategory === category
                        ? 'bg-amber-500 text-white dark:bg-amber-600'
                        : 'bg-white dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Books Display */}
      <div className="container mx-auto px-4 py-8">
        {filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-amber-50 dark:bg-slate-800/50 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full mb-4">
              <Search className="h-8 w-8 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">No books found</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">We couldn't find any books matching your current filters. Try adjusting your search or browse our other categories.</p>
            <Button
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
                setSortBy('title')
                setSortDirection('asc')
                setShowFilters(false)
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-600"
            >
              Reset All Filters
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredBooks.map(book => (
              <motion.div 
                key={book.id}
                variants={fadeInUp}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {filteredBooks.map(book => (
              <motion.div 
                key={book.id}
                variants={fadeInUp}
              >
                <BookCard book={book} layout="list" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </main>
  )
} 