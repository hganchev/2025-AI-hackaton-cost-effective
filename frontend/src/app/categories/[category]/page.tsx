"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, Search, Filter, Grid, List, BookOpen, Book, Award, Clock, User, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BookCard } from '@/components/book-card'

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  category: string
  year: number
  rating?: number
}

interface CategoryData {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
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

export default function CategoryPage({ params }: CategoryPageProps) {
  // State management
  const [books, setBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'author' | 'year' | 'rating'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [categoryData, setCategoryData] = useState<CategoryData | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Categories map for styling and icon display
  const categoriesMap: Record<string, CategoryData> = {
    'fiction': {
      id: 'fiction',
      name: 'Fiction',
      description: 'Explore worlds of imagination and storytelling',
      icon: <Book className="w-6 h-6" />,
      color: 'from-blue-500 to-indigo-600'
    },
    'non-fiction': {
      id: 'non-fiction',
      name: 'Non-Fiction',
      description: 'Discover facts, history and real-world knowledge',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-amber-500 to-orange-600'
    },
    'fantasy': {
      id: 'fantasy',
      name: 'Fantasy',
      description: 'Journey into magical realms and epic adventures',
      icon: <Award className="w-6 h-6" />,
      color: 'from-purple-500 to-violet-600'
    },
    'business': {
      id: 'business',
      name: 'Business',
      description: 'Insights into entrepreneurship and leadership',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600'
    },
    'history': {
      id: 'history',
      name: 'History',
      description: 'Explore the events and figures that shaped our world',
      icon: <Clock className="w-6 h-6" />,
      color: 'from-red-500 to-rose-600'
    },
    'biography': {
      id: 'biography',
      name: 'Biography',
      description: 'Life stories of influential and fascinating people',
      icon: <User className="w-6 h-6" />,
      color: 'from-pink-500 to-rose-600'
    },
    'default': {
      id: 'default',
      name: 'Category',
      description: 'Explore books in this category',
      icon: <Book className="w-6 h-6" />,
      color: 'from-slate-500 to-slate-700'
    }
  }
  
  // Function to generate placeholder books for demo purposes
  const generatePlaceholderBooks = (categoryId: string): Book[] => {
    const categoryName = categoriesMap[categoryId]?.name || categoriesMap['default'].name
    
    const booksByCategory: Record<string, Book[]> = {
      'fiction': [
        { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', coverImage: '/books/great-gatsby.jpg', description: 'A portrait of the Jazz Age in all of its decadence and excess.', category: 'Fiction', year: 1925, rating: 4.2 },
        { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', coverImage: '/books/mockingbird.jpg', description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.', category: 'Fiction', year: 1960, rating: 4.3 },
        { id: '3', title: '1984', author: 'George Orwell', coverImage: '/books/1984.jpg', description: 'A dystopian novel set in a totalitarian society.', category: 'Fiction', year: 1949, rating: 4.5 },
        { id: '4', title: 'Pride and Prejudice', author: 'Jane Austen', coverImage: '/books/pride.jpg', description: 'A romantic novel of manners that follows the character development of Elizabeth Bennet.', category: 'Fiction', year: 1813, rating: 4.4 },
        { id: '5', title: 'The Catcher in the Rye', author: 'J.D. Salinger', coverImage: '', description: 'A classic novel about teenage angst and alienation.', category: 'Fiction', year: 1951, rating: 4.0 },
        { id: '6', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', coverImage: '', description: 'An epic high-fantasy novel set in Middle-earth.', category: 'Fiction', year: 1954, rating: 4.7 }
      ],
      'non-fiction': [
        { id: '7', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', coverImage: '', description: 'A sweeping narrative of human history from the Stone Age to the twenty-first century.', category: 'Non-Fiction', year: 2011, rating: 4.6 },
        { id: '8', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', coverImage: '', description: 'An examination of the two systems that drive the way we think.', category: 'Non-Fiction', year: 2011, rating: 4.5 },
        { id: '9', title: 'A Brief History of Time', author: 'Stephen Hawking', coverImage: '', description: 'A landmark volume in science writing by one of the great minds of our time.', category: 'Non-Fiction', year: 1988, rating: 4.3 },
        { id: '10', title: 'Educated', author: 'Tara Westover', coverImage: '/books/educated.jpg', description: 'A memoir about a young girl who, kept out of school, leaves her survivalist family.', category: 'Non-Fiction', year: 2018, rating: 4.4 },
        { id: '11', title: 'The Diary of a Young Girl', author: 'Anne Frank', coverImage: '', description: 'The journal of a young girl who documents her life in hiding during the Nazi occupation.', category: 'Non-Fiction', year: 1947, rating: 4.5 }
      ],
      'fantasy': [
        { id: '12', title: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling', coverImage: '', description: 'The journey of a young wizard and his friends at Hogwarts School of Witchcraft and Wizardry.', category: 'Fantasy', year: 1997, rating: 4.7 },
        { id: '13', title: 'The Hobbit', author: 'J.R.R. Tolkien', coverImage: '', description: 'A fantasy novel about the adventures of Bilbo Baggins.', category: 'Fantasy', year: 1937, rating: 4.6 },
        { id: '14', title: 'A Game of Thrones', author: 'George R.R. Martin', coverImage: '', description: 'The first book in the "A Song of Ice and Fire" series.', category: 'Fantasy', year: 1996, rating: 4.5 },
        { id: '15', title: 'The Name of the Wind', author: 'Patrick Rothfuss', coverImage: '', description: 'The first of a trilogy telling the autobiography of Kvothe.', category: 'Fantasy', year: 2007, rating: 4.8 }
      ]
    }
    
    // Return the specific category's books or a default set
    return booksByCategory[categoryId] || [
      { id: '100', title: `${categoryName} Book 1`, author: 'Author Name', coverImage: '', description: `A sample book in the ${categoryName} category.`, category: categoryName, year: 2020, rating: 4.0 },
      { id: '101', title: `${categoryName} Book 2`, author: 'Another Author', coverImage: '', description: `Another sample book in the ${categoryName} category.`, category: categoryName, year: 2021, rating: 4.2 },
      { id: '102', title: `${categoryName} Book 3`, author: 'Third Author', coverImage: '', description: `A third sample book in the ${categoryName} category.`, category: categoryName, year: 2022, rating: 4.1 }
    ]
  }
  
  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      
      try {
        // In a real app, fetch from API
        // For demo, generate placeholder data
        const categoryId = params.category
        
        // Find category data
        const catData = categoriesMap[categoryId] || categoriesMap['default']
        setCategoryData({
          ...catData,
          id: categoryId
        })
        
        // Get books for this category
        const booksData = generatePlaceholderBooks(categoryId)
        setBooks(booksData)
      } catch (error) {
        console.error('Error loading category data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [params.category])
  
  // Filter and sort books
  const processBooks = () => {
    let processed = [...books]
    
    // Filter by search query
    if (searchQuery) {
      processed = processed.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Sort
    processed.sort((a, b) => {
      let compareA, compareB
      
      // Determine what to compare based on sortBy
      switch (sortBy) {
        case 'name':
          compareA = a.title.toLowerCase()
          compareB = b.title.toLowerCase()
          break
        case 'author':
          compareA = a.author.toLowerCase()
          compareB = b.author.toLowerCase()
          break
        case 'year':
          compareA = a.year || 0
          compareB = b.year || 0
          break
        case 'rating':
          compareA = a.rating || 0
          compareB = b.rating || 0
          break
        default:
          compareA = a.title.toLowerCase()
          compareB = b.title.toLowerCase()
      }
      
      // Apply sort direction
      if (sortDirection === 'asc') {
        return compareA > compareB ? 1 : -1
      } else {
        return compareA < compareB ? 1 : -1
      }
    })
    
    return processed
  }
  
  const filteredBooks = processBooks()
  
  // Toggle sort direction
  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
          <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded mx-auto"></div>
        </div>
      </div>
    )
  }
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Category Header */}
      {categoryData && (
        <section className={`relative bg-gradient-to-r ${categoryData.color}`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute transform -rotate-6 -translate-y-1/4 -right-1/4 w-2/3 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/3 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
                {React.cloneElement(categoryData.icon as React.ReactElement, { className: "w-10 h-10 text-white" })}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Link href="/categories" className="text-white/80 hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="sr-only">Back to Categories</span>
                  </Link>
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{categoryData.name}</h1>
                </div>
                <p className="text-white/90 text-lg max-w-3xl">
                  {categoryData.description}
                </p>
              </div>
              
              <div className="flex items-center gap-3 self-end md:self-center">
                <button 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${viewMode === 'grid' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90'} transition-colors`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Grid View"
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button 
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${viewMode === 'list' ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white/90'} transition-colors`}
                  onClick={() => setViewMode('list')}
                  aria-label="List View"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Search and Filter */}
      <section className="py-6 border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-auto flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600"
              />
            </div>
            
            <div className="w-full md:w-auto flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'author' | 'year' | 'rating')}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600"
                >
                  <option value="name">Title</option>
                  <option value="author">Author</option>
                  <option value="year">Year</option>
                  <option value="rating">Rating</option>
                </select>
                
                <button
                  onClick={toggleSortDirection}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                  aria-label={sortDirection === 'asc' ? 'Sort ascending' : 'Sort descending'}
                >
                  {sortDirection === 'asc' ? 'A-Z' : 'Z-A'}
                </button>
              </div>
              
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Books List */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredBooks.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                  {filteredBooks.map(book => (
                    <motion.div
                      key={book.id}
                      variants={fadeInUp}
                    >
                      <BookCard 
                        book={book} 
                        layout="grid" 
                      />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredBooks.map(book => (
                    <motion.div
                      key={book.id}
                      variants={fadeInUp}
                    >
                      <BookCard 
                        book={book} 
                        layout="list" 
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-slate-800 dark:text-white mb-2">No books found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try a different search term or browse another category
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
                <Link href="/categories">
                  <Button variant="outline" className="border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
} 