"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Book, BookOpen, Bookmark, TrendingUp, Award, Clock, Search, Filter, User, Film, Music, Globe, Code, HeartPulse, Flame, Dumbbell, Coffee, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Define category interface
interface Category {
  id: string
  name: string
  description: string
  count: number
  icon: React.ReactNode
  color: string
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

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  // Placeholder data for categories
  const categories: Category[] = [
    { 
      id: 'fiction', 
      name: 'Fiction', 
      description: 'Explore worlds of imagination and storytelling',
      count: 1243, 
      icon: <Book />,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'non-fiction', 
      name: 'Non-Fiction', 
      description: 'Discover facts, history and real-world knowledge',
      count: 876, 
      icon: <Bookmark />,
      color: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'fantasy', 
      name: 'Fantasy', 
      description: 'Journey into magical realms and epic adventures',
      count: 567, 
      icon: <Award />,
      color: 'from-purple-500 to-violet-600'
    },
    { 
      id: 'business', 
      name: 'Business', 
      description: 'Insights into entrepreneurship and leadership',
      count: 432, 
      icon: <TrendingUp />,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'history', 
      name: 'History', 
      description: 'Explore the events and figures that shaped our world',
      count: 321, 
      icon: <Clock />,
      color: 'from-red-500 to-rose-600'
    },
    { 
      id: 'biography', 
      name: 'Biography', 
      description: 'Life stories of influential and fascinating people',
      count: 287, 
      icon: <User />,
      color: 'from-pink-500 to-rose-600'
    },
    { 
      id: 'science-fiction', 
      name: 'Science Fiction', 
      description: 'Futuristic tales of science, technology and space',
      count: 412, 
      icon: <Globe />,
      color: 'from-teal-500 to-cyan-600' 
    },
    { 
      id: 'romance', 
      name: 'Romance', 
      description: 'Stories of love, relationships and heartfelt connections',
      count: 365, 
      icon: <HeartPulse />,
      color: 'from-rose-500 to-pink-600'
    },
    { 
      id: 'mystery', 
      name: 'Mystery', 
      description: 'Thrilling tales of suspense and detective work',
      count: 298, 
      icon: <Search />,
      color: 'from-slate-600 to-slate-800'
    },
    { 
      id: 'self-help', 
      name: 'Self-Help', 
      description: 'Guides for personal development and improvement',
      count: 254, 
      icon: <Dumbbell />,
      color: 'from-yellow-500 to-amber-600'
    },
    { 
      id: 'technology', 
      name: 'Technology', 
      description: 'Books on computing, programming and digital innovation',
      count: 187, 
      icon: <Code />,
      color: 'from-blue-500 to-sky-600'
    },
    { 
      id: 'cooking', 
      name: 'Cooking', 
      description: 'Recipes, culinary techniques and food culture',
      count: 156, 
      icon: <Coffee />,
      color: 'from-amber-600 to-orange-700'
    },
    { 
      id: 'arts', 
      name: 'Arts & Entertainment', 
      description: 'Explore film, music, visual arts and culture',
      count: 210, 
      icon: <Film />,
      color: 'from-violet-500 to-purple-600'
    },
    { 
      id: 'travel', 
      name: 'Travel', 
      description: 'Guides, adventures and explorations around the world',
      count: 145, 
      icon: <Globe />,
      color: 'from-emerald-500 to-green-600'
    },
    { 
      id: 'thriller', 
      name: 'Thriller', 
      description: 'Tense, exciting stories full of suspense',
      count: 276, 
      icon: <Flame />,
      color: 'from-red-600 to-orange-700'
    }
  ]
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Hero section */}
      <section className="relative bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-700 dark:to-orange-700">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/4 -right-1/4 w-2/3 h-screen bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-1/3 h-1/3 bg-white/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Browse by Category</h1>
              <p className="text-white/90 text-lg md:text-xl mb-8">
                Discover books organized by genres and topics to find your next reading adventure
              </p>
              
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-3 pl-12 pr-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-300 dark:focus:ring-amber-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Categories grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
              >
                <Link href={`/categories/${category.id}`} className="block h-full">
                  <div className={`h-24 bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                      {React.cloneElement(category.icon as React.ReactElement, { className: "w-8 h-8" })}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-white">{category.name}</h3>
                      <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-sm font-medium px-2.5 py-0.5 rounded-full">
                        {category.count}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center text-amber-600 dark:text-amber-400 font-medium text-sm group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors">
                      Browse Books <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          {filteredCategories.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-slate-800 dark:text-white mb-2">No categories found</h3>
              <p className="text-slate-600 dark:text-slate-400">
                Try a different search term or browse all categories
              </p>
              <Button 
                className="mt-6 bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => setSearchQuery("")}
              >
                View All Categories
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-amber-50 dark:bg-slate-800 border-t border-amber-100 dark:border-slate-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Our librarians are constantly adding new categories and books to our collection.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700">
                Request a Category
              </Button>
              <Button variant="outline" className="border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700">
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 