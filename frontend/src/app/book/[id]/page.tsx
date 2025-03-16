"use client"

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Bookmark, Share2, Settings } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Define types for better code organization and type safety
interface BookData {
  id: string
  title: string
  author: string
  coverImage: string
  description: string
  content: string[]
  totalPages: number
}

interface BookReaderProps {
  params: {
    id: string
  }
}

export default function BookReader({ params }: BookReaderProps) {
  // State management with proper typing
  const [book, setBook] = useState<BookData | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [fontSize, setFontSize] = useState<number>(16)
  const [lineHeight, setLineHeight] = useState<number>(1.6)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  // Fetch book data on component mount or when params change
  useEffect(() => {
    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const fetchBookData = async (): Promise<void> => {
      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const mockBook: BookData = {
          id: params.id,
          title: getBookTitle(params.id),
          author: getBookAuthor(params.id),
          coverImage: `/images/${getBookImageName(params.id)}.jpg`,
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          content: generateMockContent(50), // Generate 50 paragraphs of mock content
          totalPages: 50
        }
        
        setBook(mockBook)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching book data:', error)
        setLoading(false)
      }
    }
    
    fetchBookData()
  }, [params.id])

  // Helper functions for book data
  const getBookTitle = (id: string): string => {
    switch (id) {
      case '1': return 'The Great Gatsby'
      case '2': return '1984'
      case '3': return 'To Kill a Mockingbird'
      default: return 'Pride and Prejudice'
    }
  }
  
  const getBookAuthor = (id: string): string => {
    switch (id) {
      case '1': return 'F. Scott Fitzgerald'
      case '2': return 'George Orwell'
      case '3': return 'Harper Lee'
      default: return 'Jane Austen'
    }
  }
  
  const getBookImageName = (id: string): string => {
    switch (id) {
      case '1': return 'great-gatsby'
      case '2': return '1984'
      case '3': return 'mockingbird'
      default: return 'pride'
    }
  }

  // Navigation handlers
  const nextPage = (): void => {
    if (book && currentPage < book.totalPages) {
      setCurrentPage(prevPage => prevPage + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevPage = (): void => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1)
      window.scrollTo(0, 0)
    }
  }

  // Settings handlers
  const toggleSettings = (): void => {
    setShowSettings(prevState => !prevState)
  }

  const changeFontSize = (size: number): void => {
    setFontSize(size)
  }

  const changeLineHeight = (height: number): void => {
    setLineHeight(height)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-muted rounded mb-4"></div>
            <div className="h-4 w-40 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Book Not Found</h1>
            <p className="mb-6">Sorry, we couldn't find the book you're looking for.</p>
            <Link href="/" className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              Return Home
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Main content
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        {/* Book Header */}
        <div className="bg-muted py-4 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-muted-foreground hover:text-foreground">
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">Back to Home</span>
                </Link>
                <h1 className="text-lg font-medium">{book.title}</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
                  aria-label="Bookmark this book"
                >
                  <Bookmark className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
                  aria-label="Share this book"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button 
                  className="p-2 rounded-full hover:bg-accent hover:text-accent-foreground"
                  onClick={toggleSettings}
                  aria-label="Reader settings"
                >
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-card border-b shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Font Size</h3>
                  <div className="flex items-center space-x-4">
                    {[
                      { size: 14, label: 'Small' },
                      { size: 16, label: 'Medium' },
                      { size: 18, label: 'Large' },
                      { size: 20, label: 'X-Large' }
                    ].map(option => (
                      <button 
                        key={option.size}
                        className={`px-3 py-1 rounded-md ${fontSize === option.size ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        onClick={() => changeFontSize(option.size)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Line Spacing</h3>
                  <div className="flex items-center space-x-4">
                    {[
                      { height: 1.4, label: 'Tight' },
                      { height: 1.6, label: 'Normal' },
                      { height: 1.8, label: 'Relaxed' },
                      { height: 2, label: 'Loose' }
                    ].map(option => (
                      <button 
                        key={option.height}
                        className={`px-3 py-1 rounded-md ${lineHeight === option.height ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                        onClick={() => changeLineHeight(option.height)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Book Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div 
              className="prose prose-lg dark:prose-invert mx-auto"
              style={{ 
                fontSize: `${fontSize}px`, 
                lineHeight: lineHeight 
              }}
            >
              {book.content[currentPage - 1].split('\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4">{paragraph}</p>
              ))}
            </div>
            
            {/* Page Navigation */}
            <div className="mt-12 flex items-center justify-between">
              <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  currentPage === 1 
                    ? 'text-muted-foreground cursor-not-allowed' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
                <span>Previous</span>
              </button>
              
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {book.totalPages}
              </div>
              
              <button 
                onClick={nextPage}
                disabled={currentPage === book.totalPages}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  currentPage === book.totalPages 
                    ? 'text-muted-foreground cursor-not-allowed' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
      
    </div>
  )
}

// Helper function to generate mock content
function generateMockContent(pages: number): string[] {
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.

Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?`

  return Array(pages).fill(0).map((_, i) => {
    // Vary the content slightly for each page
    return `Chapter ${Math.floor(i / 5) + 1}\n\n${loremIpsum}\n\nPage ${i + 1} of the book. ${i % 3 === 0 ? 'The character looked around nervously.' : i % 3 === 1 ? 'The wind howled through the trees.' : 'The sun was setting on the horizon.'}`
  })
} 