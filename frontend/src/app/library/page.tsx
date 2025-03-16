"use client"

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/footer'
import { BookCard } from '@/components/book-card'
import { Filter, Grid, List } from 'lucide-react'
import Link from 'next/link'

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
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            coverImage: '/images/great-gatsby.jpg',
            description: 'A story of wealth, love, and the American Dream in the 1920s.',
            category: 'fiction',
            year: 1925
          },
          {
            id: '2',
            title: '1984',
            author: 'George Orwell',
            coverImage: '/images/1984.jpg',
            description: 'A dystopian novel about totalitarianism and surveillance.',
            category: 'fiction',
            year: 1949
          },
          {
            id: '3',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            coverImage: '/images/mockingbird.jpg',
            description: 'A story about racial injustice and moral growth in the American South.',
            category: 'fiction',
            year: 1960
          },
          {
            id: '4',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            coverImage: '/images/pride.jpg',
            description: 'A romantic novel about the societal expectations of women in the early 19th century.',
            category: 'romance',
            year: 1813
          },
          {
            id: '5',
            title: 'The Hobbit',
            author: 'J.R.R. Tolkien',
            coverImage: '/images/hobbit.jpg',
            description: 'A fantasy novel about the journey of Bilbo Baggins.',
            category: 'fantasy',
            year: 1937
          },
          {
            id: '6',
            title: 'A Brief History of Time',
            author: 'Stephen Hawking',
            coverImage: '/images/brief-history.jpg',
            description: 'A book about cosmology and the universe.',
            category: 'science',
            year: 1988
          },
          {
            id: '7',
            title: 'Sapiens: A Brief History of Humankind',
            author: 'Yuval Noah Harari',
            coverImage: '/images/sapiens.jpg',
            description: 'A book about the history and evolution of humans.',
            category: 'history',
            year: 2011
          },
          {
            id: '8',
            title: 'Steve Jobs',
            author: 'Walter Isaacson',
            coverImage: '/images/steve-jobs.jpg',
            description: 'A biography of Apple co-founder Steve Jobs.',
            category: 'biography',
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 w-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-card rounded-lg border shadow-sm overflow-hidden">
                  <div className="h-[240px] bg-muted"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-5 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Library Header */}
        <div className="bg-muted py-8 border-b">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Library</h1>
            <p className="text-muted-foreground">Browse our collection of books</p>
          </div>
        </div>
        
        {/* Filters and Controls */}
        <div className="border-b py-4 sticky top-16 bg-background z-10">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-md text-sm capitalize ${
                      selectedCategory === category
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative flex-grow max-w-md">
                  <input
                    type="search"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                
                {/* Sort Controls */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground hidden md:inline">Sort by:</span>
                  <select
                    value={`${sortBy}-${sortDirection}`}
                    onChange={(e) => {
                      const [newSortBy, newSortDirection] = e.target.value.split('-') as [SortOption, SortDirection]
                      setSortBy(newSortBy)
                      setSortDirection(newSortDirection)
                    }}
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="author-asc">Author (A-Z)</option>
                    <option value="author-desc">Author (Z-A)</option>
                    <option value="year-asc">Year (Oldest)</option>
                    <option value="year-desc">Year (Newest)</option>
                  </select>
                  
                  {/* View Mode Toggle */}
                  <button
                    onClick={toggleViewMode}
                    className="p-2 rounded-md hover:bg-muted"
                    aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
                  >
                    {viewMode === 'grid' ? (
                      <List className="h-5 w-5" />
                    ) : (
                      <Grid className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Books Display */}
        <div className="container mx-auto px-4 py-8">
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No books found</h2>
              <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSearchQuery('')
                  setSortBy('title')
                  setSortDirection('asc')
                }}
                className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBooks.map(book => (
                <div key={book.id} className="flex border rounded-lg overflow-hidden bg-card">
                  <div className="w-[120px] h-[180px] relative flex-shrink-0">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg">{book.title}</h3>
                    <p className="text-muted-foreground text-sm">{book.author}</p>
                    <p className="text-muted-foreground text-xs mt-1">Published: {book.year}</p>
                    <p className="text-sm mt-2 flex-grow">{book.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <Link 
                        href={`/book/${book.id}`} 
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Read Now
                      </Link>
                      <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">
                        {book.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  )
} 