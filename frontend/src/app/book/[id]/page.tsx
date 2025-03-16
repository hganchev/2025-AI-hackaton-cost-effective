"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Bookmark, Share2, Settings, Moon, Sun, Maximize2, Minimize2, Menu, X, Home, Heart, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

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
  const [fontSize, setFontSize] = useState<number>(18)
  const [lineHeight, setLineHeight] = useState<number>(1.8)
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [fullscreen, setFullscreen] = useState<boolean>(false)
  const [isFavorite, setIsFavorite] = useState<boolean>(false)
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false)
  const [pageFlip, setPageFlip] = useState<'next' | 'prev' | null>(null)
  
  // Font family options
  const [fontFamily, setFontFamily] = useState<string>('Georgia')
  const fontOptions = [
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Merriweather', value: '"Merriweather", serif' },
    { name: 'Roboto Slab', value: '"Roboto Slab", serif' },
    { name: 'Lora', value: '"Lora", serif' },
    { name: 'System', value: 'system-ui, sans-serif' }
  ]
  
  // Paper texture options
  const [paperTexture, setPaperTexture] = useState<string>('classic')
  const paperOptions = [
    { name: 'Classic', value: 'classic' },
    { name: 'Antique', value: 'antique' },
    { name: 'Modern', value: 'modern' },
    { name: 'Parchment', value: 'parchment' },
    { name: 'None', value: 'none' }
  ]
  
  // Refs
  const readerRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setFullscreen(true)
    } else {
      document.exitFullscreen()
      setFullscreen(false)
    }
  }
  
  // Handle page flip animation
  const handlePageFlip = (direction: 'next' | 'prev') => {
    setPageFlip(direction)
    setTimeout(() => {
      setPageFlip(null)
    }, 500)
  }

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
  
  // Generate mock content for demo purposes
  const generateMockContent = (numPages: number): string[] => {
    const loremIpsumParagraphs = [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nunc pretium nunc, eget tincidunt nisl nunc eget nisl. Sed euismod, urna eu tincidunt consectetur, nisi nunc pretium nunc, eget tincidunt nisl nunc eget nisl.",
      "Vivamus et sagittis libero. Nullam et ornare erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut tincidunt ligula eget purus sodales, eget facilisis ipsum pulvinar. Sed euismod, urna eu tincidunt consectetur, nisi nunc pretium nunc, eget tincidunt nisl nunc eget nisl.",
      "Maecenas vitae porttitor dolor. Duis non metus vel nulla commodo fringilla. Aliquam pulvinar purus nec diam tempus, vel ultricies eros pretium. Praesent sagittis nunc vel justo vulputate, ac volutpat sapien dictum. Sed euismod, urna eu tincidunt consectetur, nisi nunc pretium nunc, eget tincidunt nisl nunc eget nisl.",
      "Donec volutpat vitae tortor at sollicitudin. Nulla facilisi. Nullam viverra diam eget arcu posuere sodales. Nulla sodales malesuada orci, in scelerisque nisi bibendum eget. Sed euismod, urna eu tincidunt consectetur, nisi nunc pretium nunc, eget tincidunt nisl nunc eget nisl.",
      "Etiam a libero eget orci molestie iaculis. Proin et velit a nunc suscipit lacinia. Suspendisse potenti. Sed gravida, ipsum nec auctor vestibulum, erat nisi vehicula arcu, nec eleifend ex tortor non erat. Sed euismod, urna eu tincidunt consectetur, nisi nunc pretium nunc, eget tincidunt nisl nunc eget nisl."
    ];
    
    const pages: string[] = [];
    
    for (let i = 0; i < numPages; i++) {
      let page = "";
      
      // Generate 3-5 paragraphs per page
      const paragraphCount = Math.floor(Math.random() * 3) + 3;
      
      for (let j = 0; j < paragraphCount; j++) {
        const randomIndex = Math.floor(Math.random() * loremIpsumParagraphs.length);
        page += loremIpsumParagraphs[randomIndex] + "\n\n";
      }
      
      pages.push(page.trim());
    }
    
    return pages;
  }

  // Navigation handlers
  const nextPage = (): void => {
    if (book && currentPage < book.totalPages) {
      handlePageFlip('next')
      setCurrentPage(prevPage => prevPage + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevPage = (): void => {
    if (currentPage > 1) {
      handlePageFlip('prev')
      setCurrentPage(prevPage => prevPage - 1)
      window.scrollTo(0, 0)
    }
  }

  // Settings handlers
  const toggleSettings = (): void => {
    setShowSettings(prevState => !prevState)
  }

  const toggleTheme = (): void => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  
  const toggleFavorite = (): void => {
    setIsFavorite(prev => !prev)
  }
  
  // Handle key presses for navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextPage()
      } else if (e.key === 'ArrowLeft') {
        prevPage()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPage, book])
  
  // Get paper texture class
  const getPaperTextureClass = (): string => {
    switch (paperTexture) {
      case 'classic':
        return 'bg-amber-50 dark:bg-slate-900'
      case 'antique':
        return 'bg-[url("/textures/paper-antique.jpg")] dark:bg-slate-900'
      case 'modern':
        return 'bg-white dark:bg-slate-900'
      case 'parchment':
        return 'bg-[url("/textures/paper-parchment.jpg")] dark:bg-slate-900'
      default:
        return 'bg-white dark:bg-slate-900'
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-amber-50 dark:bg-slate-950">
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-slate-300 dark:bg-slate-700 rounded mb-4"></div>
            <div className="h-4 w-40 bg-slate-300 dark:bg-slate-700 rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  // Error state
  if (!book) {
    return (
      <div className="min-h-screen flex flex-col bg-amber-50 dark:bg-slate-950">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Book Not Found</h1>
            <p className="mb-6 text-slate-600 dark:text-slate-400">Sorry, we couldn't find the book you're looking for.</p>
            <Link href="/" className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors">
              Return Home
            </Link>
          </div>
        </main>
      </div>
    )
  }

  // Main content
  return (
    <div 
      ref={readerRef}
      className={`min-h-screen flex flex-col ${fullscreen ? 'fixed inset-0 z-50' : ''}`}
    >
      {/* Book Header - Desktop */}
      <header className="bg-white dark:bg-slate-950 border-b border-amber-200 dark:border-slate-800 shadow-sm hidden md:block">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/library" className="text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-500 transition-colors">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to Library</span>
              </Link>
              <div>
                <h1 className="text-lg font-medium text-slate-800 dark:text-white">{book.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">{book.author}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                className={`p-2 rounded-full hover:bg-amber-100 dark:hover:bg-slate-800 transition-colors ${isFavorite ? 'text-red-500' : 'text-slate-400 hover:text-amber-600 dark:text-slate-500 dark:hover:text-amber-500'}`}
                onClick={toggleFavorite}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500' : 'fill-transparent'}`} />
              </button>
              <button 
                className="p-2 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-100 dark:text-slate-500 dark:hover:text-amber-500 dark:hover:bg-slate-800 transition-colors"
                aria-label="Download book"
              >
                <Download className="h-5 w-5" />
              </button>
              <button 
                className="p-2 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-100 dark:text-slate-500 dark:hover:text-amber-500 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleFullscreen}
                aria-label={fullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {fullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </button>
              <button 
                className="p-2 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-100 dark:text-slate-500 dark:hover:text-amber-500 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button 
                className="p-2 rounded-full text-slate-400 hover:text-amber-600 hover:bg-amber-100 dark:text-slate-500 dark:hover:text-amber-500 dark:hover:bg-slate-800 transition-colors"
                onClick={toggleSettings}
                aria-label="Reader settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Header */}
      <header className="bg-white dark:bg-slate-950 border-b border-amber-200 dark:border-slate-800 shadow-sm md:hidden sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center justify-between">
          <button 
            className="p-2 rounded-full text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-500"
            onClick={() => setShowMobileMenu(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <h1 className="text-sm font-medium text-slate-800 dark:text-white truncate max-w-[200px]">{book.title}</h1>
          
          <div className="flex items-center">
            <button 
              className="p-2 rounded-full text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-500"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div 
              className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 shadow-xl"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                  <span className="font-medium text-slate-800 dark:text-white">Book Reader</span>
                </div>
                <button 
                  className="p-1 rounded-full text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-500"
                  onClick={() => setShowMobileMenu(false)}
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-4">
                <div className="mb-6">
                  <h2 className="text-sm font-medium text-slate-800 dark:text-white mb-2">{book.title}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{book.author}</p>
                </div>
                
                <nav className="space-y-4">
                  <Link 
                    href="/library" 
                    className="flex items-center gap-3 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-500"
                  >
                    <Home className="h-4 w-4" />
                    <span>Back to Library</span>
                  </Link>
                  
                  <button 
                    className="flex items-center gap-3 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-500 w-full text-left"
                    onClick={toggleFavorite}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                    <span>{isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-3 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-500 w-full text-left"
                    onClick={toggleSettings}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Reading Settings</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-3 text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-500 w-full text-left"
                    onClick={toggleFullscreen}
                  >
                    {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    <span>{fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
                  </button>
                </nav>
                
                <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Page {currentPage} of {book.totalPages}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div 
            className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div 
              className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-md m-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-medium text-slate-800 dark:text-white">Reading Settings</h2>
                <button 
                  className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                  onClick={() => setShowSettings(false)}
                  aria-label="Close settings"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Font Size</label>
                  <div className="flex items-center">
                    <span className="mr-3 text-xs text-slate-500 dark:text-slate-400">A</span>
                    <input 
                      type="range" 
                      min="12" 
                      max="24" 
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 text-base text-slate-500 dark:text-slate-400">A</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Line Spacing</label>
                  <div className="flex items-center">
                    <span className="mr-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="-space-y-2">
                        <div className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400"></div>
                        <div className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400"></div>
                      </div>
                    </span>
                    <input 
                      type="range" 
                      min="1.4" 
                      max="2.2" 
                      step="0.1" 
                      value={lineHeight}
                      onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="ml-3 text-xs text-slate-500 dark:text-slate-400">
                      <div className="-space-y-4">
                        <div className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400"></div>
                        <div className="w-4 h-0.5 bg-slate-500 dark:bg-slate-400"></div>
                      </div>
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Font Family</label>
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  >
                    {fontOptions.map(font => (
                      <option key={font.name} value={font.value}>{font.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Paper Texture</label>
                  <select 
                    value={paperTexture}
                    onChange={(e) => setPaperTexture(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
                  >
                    {paperOptions.map(option => (
                      <option key={option.name} value={option.value}>{option.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Mode</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setTheme('light')}
                      className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${theme === 'light' ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      <Sun className="h-4 w-4" />
                      <span>Light</span>
                    </button>
                    <button 
                      onClick={() => setTheme('dark')}
                      className={`p-3 rounded-lg border flex items-center justify-center gap-2 ${theme === 'dark' ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                    >
                      <Moon className="h-4 w-4" />
                      <span>Dark</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <main className={`flex-grow ${getPaperTextureClass()} overflow-hidden`}>
        <div className="container mx-auto sm:px-4 py-8 md:py-12 lg:py-16 min-h-screen flex flex-col">
          <div className="max-w-3xl mx-auto w-full flex-grow flex flex-col px-4 md:px-0">
            {/* Book content with page flip animation */}
            <div className="flex-grow relative overflow-hidden flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPage}
                  initial={{ 
                    opacity: 0, 
                    x: pageFlip === 'next' ? 100 : pageFlip === 'prev' ? -100 : 0,
                    rotateY: pageFlip === 'next' ? 15 : pageFlip === 'prev' ? -15 : 0
                  }}
                  animate={{ 
                    opacity: 1, 
                    x: 0,
                    rotateY: 0
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: pageFlip === 'next' ? -100 : pageFlip === 'prev' ? 100 : 0,
                    rotateY: pageFlip === 'next' ? -15 : pageFlip === 'prev' ? 15 : 0
                  }}
                  transition={{ duration: 0.4 }}
                  className={`
                    prose max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-100 
                    prose-p:text-slate-700 dark:prose-p:text-slate-300
                    prose-strong:text-slate-900 dark:prose-strong:text-white
                    prose-a:text-amber-600 dark:prose-a:text-amber-500
                    ${paperTexture === 'antique' || paperTexture === 'parchment' ? 'prose-p:drop-shadow-sm dark:prose-p:drop-shadow-none' : ''}
                  `}
                  style={{ 
                    fontFamily: fontFamily, 
                    fontSize: `${fontSize}px`, 
                    lineHeight: lineHeight,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    perspective: '1000px'
                  }}
                >
                  <div className={`
                    relative p-6 md:p-8 lg:p-10 bg-transparent
                    ${paperTexture === 'antique' || paperTexture === 'parchment' ? 'shadow-inner' : ''}
                    ${theme === 'light' ? 'text-slate-900' : 'text-slate-100'}
                  `}>
                    {book.content[currentPage - 1].split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 first-letter:text-lg first-letter:font-semibold">{paragraph}</p>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Page Navigation */}
            <div className="mt-6 sm:mt-10 flex items-center justify-between">
              <button 
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md ${
                  currentPage === 1 
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                    : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700/80 shadow-sm border border-amber-200 dark:border-slate-700 transition-colors'
                }`}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Previous</span>
              </button>
              
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Page {currentPage} of {book.totalPages}
              </div>
              
              <button 
                onClick={nextPage}
                disabled={currentPage === book.totalPages}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md ${
                  currentPage === book.totalPages 
                    ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed' 
                    : 'bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-500 hover:bg-amber-50 dark:hover:bg-slate-700/80 shadow-sm border border-amber-200 dark:border-slate-700 transition-colors'
                }`}
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 