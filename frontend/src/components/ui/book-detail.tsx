"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Star, Heart, Share2, Bookmark, Eye, Calendar, BookOpen, ChevronRight, FileText, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Book } from '@/types/index'

interface BookDetailProps {
  book: Book;
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
}

export function BookDetail({ book, isFavorited = false, onFavoriteToggle }: BookDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'reviews'>('overview')
  
  // Generate a random rating for demo purposes (real app would use actual data)
  const rating = ((Math.random() * 2) + 3).toFixed(1)
  const reviewCount = Math.floor(Math.random() * 500) + 50
  
  // Calculate what percentage of people gave each star rating (for demo)
  const ratingDistribution = [
    { stars: 5, percentage: Math.random() * 60 + 30 }, // 5 stars (30-90%)
    { stars: 4, percentage: Math.random() * 40 + 10 }, // 4 stars (10-50%)
    { stars: 3, percentage: Math.random() * 20 + 5 },  // 3 stars (5-25%)
    { stars: 2, percentage: Math.random() * 10 + 2 },  // 2 stars (2-12%)
    { stars: 1, percentage: Math.random() * 5 + 1 }    // 1 star (1-6%)
  ]
  
  // Sample reviews for demo
  const reviews = [
    {
      id: 1,
      name: "Emily Johnson",
      avatar: "/avatars/avatar1.jpg",
      rating: 5,
      date: "2 months ago",
      content: "This book completely changed my perspective. The author's ability to weave complex themes with relatable characters created an unforgettable reading experience. Highly recommended!",
    },
    {
      id: 2,
      name: "Michael Smith",
      avatar: "/avatars/avatar2.jpg",
      rating: 4,
      date: "1 month ago",
      content: "A compelling read with deep character development. While some parts felt slow, the overall narrative was engaging and thought-provoking.",
    },
    {
      id: 3,
      name: "Sarah Williams",
      avatar: "/avatars/avatar3.jpg",
      rating: 5,
      date: "2 weeks ago",
      content: "I couldn't put this book down! The pacing was perfect and each chapter left me wanting more. One of my favorite reads this year.",
    }
  ]
  
  // Function to create gradient placeholder for missing images
  const getPlaceholderImage = () => {
    const categories: Record<string, string> = {
      'Fiction': 'from-blue-500 to-purple-500',
      'Self-Help': 'from-amber-500 to-orange-500',
      'Science Fiction': 'from-teal-500 to-emerald-500',
      'Biography': 'from-rose-500 to-pink-500',
      'default': 'from-amber-600 to-amber-400'
    }
    
    const bgColor = book.category && categories[book.category] 
      ? categories[book.category] 
      : categories.default
    
    return (
      <div className={`relative w-full h-full rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center p-4 text-center shadow-md`}>
        <div>
          <h3 className="font-bold text-white text-sm">{book.title}</h3>
          <p className="text-white/80 text-xs mt-1">{book.author}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section with Book Cover and Main Info */}
      <div className="relative overflow-hidden rounded-2xl bg-amber-50 dark:bg-slate-800 mb-8">
        <div className="absolute inset-0 overflow-hidden">
          {book.coverImage && (
            <Image 
              src={book.coverImage} 
              alt={book.title}
              fill
              className="object-cover opacity-10 blur-2xl scale-110"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-700/20 dark:from-amber-800/20 dark:to-amber-900/20"></div>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 p-6 md:p-10">
          <motion.div 
            className="flex-shrink-0 w-full md:w-1/3 max-w-[300px] mx-auto md:mx-0 rounded-lg overflow-hidden shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-[2/3] bg-white dark:bg-slate-700">
              {book.coverImage ? (
                <Image 
                  src={book.coverImage} 
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : getPlaceholderImage()}
            </div>
          </motion.div>
          
          <motion.div 
            className="flex-grow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium rounded-full">
                {book.category || 'Fiction'}
              </span>
              {book.year && (
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {book.year}
                </span>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">{book.title}</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">by <span className="text-amber-700 dark:text-amber-400 font-medium">{book.author}</span></p>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={cn(
                        "w-5 h-5", 
                        parseFloat(rating) >= star 
                          ? "fill-amber-500 text-amber-500" 
                          : "text-slate-300 dark:text-slate-600"
                      )}
                    />
                  ))}
                </div>
                <span className="ml-2 text-amber-700 dark:text-amber-400 font-medium">{rating}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400">({reviewCount} reviews)</span>
            </div>
            
            <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
              {book.description || "No description available for this book."}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-6 py-2 h-auto rounded-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Start Reading
              </Button>
              <Button 
                variant="outline" 
                className="border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700 px-6 py-2 h-auto rounded-full"
                onClick={() => onFavoriteToggle && onFavoriteToggle(book.id)}
              >
                <Heart className={cn(
                  "w-4 h-4 mr-2",
                  isFavorited ? "fill-red-500 text-red-500" : ""
                )} />
                {isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
              </Button>
              <Button variant="ghost" className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 px-4 py-2 h-auto rounded-full">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Tabs for additional information */}
      <div className="mb-8">
        <div className="border-b border-slate-200 dark:border-slate-700">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={cn(
                "py-4 relative text-sm font-medium transition-colors",
                activeTab === 'overview'
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
              )}
            >
              Overview
              {activeTab === 'overview' && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-400"
                ></motion.div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={cn(
                "py-4 relative text-sm font-medium transition-colors",
                activeTab === 'details'
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
              )}
            >
              Details
              {activeTab === 'details' && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-400"
                ></motion.div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={cn(
                "py-4 relative text-sm font-medium transition-colors",
                activeTab === 'reviews'
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
              )}
            >
              Reviews
              {activeTab === 'reviews' && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 dark:bg-amber-400"
                ></motion.div>
              )}
            </button>
          </div>
        </div>
        
        <div className="py-6">
          {activeTab === 'overview' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Book Overview</h2>
              <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {book.description || "No description available for this book."}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    About the Book
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Explore the captivating narrative that has enchanted readers worldwide.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                    <User className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    About the Author
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Learn more about {book.author} and their literary accomplishments.
                  </p>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    Sample Chapter
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Read a preview of the book before making your decision.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Book Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6">
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Title</p>
                  <p className="text-slate-900 dark:text-white font-medium">{book.title}</p>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Author</p>
                  <p className="text-slate-900 dark:text-white font-medium">{book.author}</p>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Category</p>
                  <p className="text-slate-900 dark:text-white font-medium">{book.category || 'Fiction'}</p>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Year Published</p>
                  <p className="text-slate-900 dark:text-white font-medium">{book.year || 'Unknown'}</p>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Language</p>
                  <p className="text-slate-900 dark:text-white font-medium">English</p>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Pages</p>
                  <p className="text-slate-900 dark:text-white font-medium">{Math.floor(Math.random() * 300) + 200}</p>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Rating</p>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={cn(
                            "w-4 h-4", 
                            parseFloat(rating) >= star 
                              ? "fill-amber-500 text-amber-500" 
                              : "text-slate-300 dark:text-slate-600"
                          )}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-slate-900 dark:text-white font-medium">{rating} ({reviewCount} reviews)</span>
                  </div>
                </div>
                
                <div className="border-b border-slate-200 dark:border-slate-700 pb-4">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Format</p>
                  <p className="text-slate-900 dark:text-white font-medium">Ebook, Paperback, Audiobook</p>
                </div>
              </div>
            </motion.div>
          )}
          
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Reader Reviews</h2>
                  
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-bold text-amber-600 dark:text-amber-400">{rating}</span>
                        <div className="flex mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              className={cn(
                                "w-4 h-4", 
                                parseFloat(rating) >= star 
                                  ? "fill-amber-500 text-amber-500" 
                                  : "text-slate-300 dark:text-slate-600"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 mt-1">{reviewCount} reviews</span>
                      </div>
                      
                      <div className="flex-grow">
                        {ratingDistribution.map((item) => (
                          <div key={item.stars} className="flex items-center gap-2 mb-1">
                            <span className="text-xs w-6 text-slate-600 dark:text-slate-400">{item.stars}★</span>
                            <div className="flex-grow h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full" 
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-slate-600 dark:text-slate-400">{Math.round(item.percentage)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button className="w-full bg-amber-600 text-white hover:bg-amber-700">
                      Write a Review
                    </Button>
                  </div>
                </div>
                
                <div className="w-full md:w-2/3">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white">
                      {reviewCount} Reviews
                    </h3>
                    <select className="text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5">
                      <option>Most Recent</option>
                      <option>Highest Rated</option>
                      <option>Lowest Rated</option>
                    </select>
                  </div>
                  
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold">
                              {review.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900 dark:text-white">{review.name}</h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={cn(
                                  "w-4 h-4", 
                                  review.rating >= star 
                                    ? "fill-amber-500 text-amber-500" 
                                    : "text-slate-300 dark:text-slate-600"
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300">{review.content}</p>
                        <div className="flex gap-4 mt-4">
                          <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">
                            Helpful
                          </button>
                          <button className="text-xs text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">
                            Report
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <Button variant="outline" className="border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700">
                      Load More Reviews
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Related Books */}
      <section className="mt-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Books</h2>
          <Link href="/library" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center text-sm font-medium">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {/* This would be replaced with actual related books */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <Link href="#">
                <div className="aspect-[2/3] bg-amber-100 dark:bg-slate-700"></div>
                <div className="p-4">
                  <h3 className="font-medium text-slate-900 dark:text-white line-clamp-1">Related Book Title</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Author Name</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
} 