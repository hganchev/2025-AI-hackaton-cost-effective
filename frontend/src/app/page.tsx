"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Book, ChevronRight, Star, Bookmark, TrendingUp, Award, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FeaturedBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  category: string;
}

interface Category {
  name: string;
  count: number;
  icon: React.ReactNode;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

// Placeholder data for featured books
const featuredBooks: FeaturedBook[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    coverImage: '/books/midnight-library.jpg',
    rating: 4.6,
    category: 'Fiction'
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverImage: '/books/atomic-habits.jpg',
    rating: 4.8,
    category: 'Self-Help'
  },
  {
    id: '3',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverImage: '/books/project-hail-mary.jpg',
    rating: 4.7,
    category: 'Sci-Fi'
  },
  {
    id: '4',
    title: 'Educated',
    author: 'Tara Westover',
    coverImage: '/books/educated.jpg',
    rating: 4.5,
    category: 'Memoir'
  }
]

// Placeholder data for popular categories
const categories: Category[] = [
  { name: 'Fiction', count: 1243, icon: <Book className="w-6 h-6 text-amber-600" /> },
  { name: 'Non-Fiction', count: 876, icon: <Bookmark className="w-6 h-6 text-blue-600" /> },
  { name: 'Fantasy', count: 567, icon: <Award className="w-6 h-6 text-purple-600" /> },
  { name: 'Business', count: 432, icon: <TrendingUp className="w-6 h-6 text-green-600" /> },
  { name: 'History', count: 321, icon: <Clock className="w-6 h-6 text-red-600" /> },
]

// Placeholder data for testimonials
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sophia Anderson',
    role: 'Avid Reader',
    quote: 'This platform transformed how I discover new books. The recommendations are spot on!',
    avatar: '/testimonials/avatar1.jpg'
  },
  {
    id: 2,
    name: 'Michael Johnson',
    role: 'Book Club Leader',
    quote: 'Managing our book club has never been easier. We love the discussion features.',
    avatar: '/testimonials/avatar2.jpg'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Author',
    quote: 'As an author, I appreciate how well my books are presented on this beautiful platform.',
    avatar: '/testimonials/avatar3.jpg'
  }
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

export default function Home() {
  // Function to simulate book cover images with a gradient and text
  const getPlaceholderImage = (title: string, author: string, category: string) => {
    const colors: Record<string, string> = {
      'Fiction': 'from-blue-500 to-purple-500',
      'Self-Help': 'from-amber-500 to-orange-500',
      'Sci-Fi': 'from-teal-500 to-emerald-500',
      'Memoir': 'from-rose-500 to-pink-500',
      'default': 'from-gray-500 to-gray-700'
    }
    
    const bgColor = colors[category] || colors.default
    
    return (
      <div className={`relative w-full h-full rounded-lg bg-gradient-to-br ${bgColor} flex items-center justify-center p-4 text-center shadow-md`}>
        <div>
          <h3 className="font-bold text-white text-sm">{title}</h3>
          <p className="text-white/80 text-xs mt-1">{author}</p>
        </div>
      </div>
    )
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 py-20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/4 -right-1/4 w-2/3 h-screen bg-amber-200/40 dark:bg-amber-900/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-1/3 h-1/3 bg-amber-300/30 dark:bg-amber-700/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="w-full md:w-1/2 mb-12 md:mb-0"
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white mb-6 leading-tight">
                Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 dark:from-amber-400 dark:to-amber-300">Next Favorite</span> Book
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-8 max-w-lg">
                Explore thousands of books, join reading communities, and keep track of your reading journey all in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white px-8 py-3 rounded-full text-lg shadow-lg shadow-amber-500/20">
                  Explore Library
                </Button>
                <Button variant="outline" className="border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-800 px-6 py-3 rounded-full text-lg">
                  How It Works
                </Button>
              </div>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  {[1, 2, 3, 4].map((id) => (
                    <div key={id} className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 overflow-hidden bg-gradient-to-br from-amber-500 to-orange-400">
                      {/* User avatars would go here */}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                    <span className="ml-2 text-amber-700 dark:text-amber-400 font-medium">4.9</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">From 2,000+ happy readers</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="w-full md:w-1/2 flex justify-center"
              initial={{ opacity: 0, rotateY: 25 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative w-full max-w-md">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-amber-500 dark:bg-amber-600 rounded-xl blur-3xl opacity-20"></div>
                <div className="relative flex justify-center transform hover:scale-105 transition-transform duration-500">
                  <div className="relative w-48 h-72 md:w-56 md:h-80 bg-white dark:bg-slate-700 rounded-lg shadow-2xl transform rotate-6 -translate-x-4 translate-y-2 z-10">
                    {getPlaceholderImage('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction')}
                  </div>
                  <div className="relative w-48 h-72 md:w-56 md:h-80 bg-white dark:bg-slate-700 rounded-lg shadow-2xl transform -rotate-3 z-20">
                    {getPlaceholderImage('Think and Grow Rich', 'Napoleon Hill', 'Self-Help')}
                  </div>
                  <div className="relative w-48 h-72 md:w-56 md:h-80 bg-white dark:bg-slate-700 rounded-lg shadow-2xl transform rotate-3 translate-x-4 translate-y-1 z-0">
                    {getPlaceholderImage('Dune', 'Frank Herbert', 'Sci-Fi')}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="mt-24">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center">
                <h3 className="text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400">10K+</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Books Available</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400">500+</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Authors</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400">50+</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Categories</p>
              </div>
              <div className="flex flex-col items-center">
                <h3 className="text-3xl lg:text-4xl font-bold text-amber-600 dark:text-amber-400">100K+</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Happy Readers</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Books Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Featured Books</h2>
              <p className="text-slate-600 dark:text-slate-400 mt-2">Discover handpicked books recommended for you</p>
            </div>
            <Link href="/library" className="flex items-center text-amber-600 dark:text-amber-400 font-medium hover:text-amber-700 dark:hover:text-amber-300 transition-colors">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {featuredBooks.map((book) => (
              <motion.div 
                key={book.id}
                variants={fadeInUp}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <Link href={`/books/${book.id}`}>
                  <div className="h-64 overflow-hidden">
                    <div className="w-full h-full relative transform group-hover:scale-105 transition-transform duration-300">
                      {book.coverImage.startsWith('/') ? (
                        getPlaceholderImage(book.title, book.author, book.category)
                      ) : (
                        <Image 
                          src={book.coverImage} 
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                        <div className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                          {book.category}
                        </div>
                        <div className="flex items-center bg-slate-900/80 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1" />
                          <span className="text-white text-xs">{book.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 line-clamp-1">{book.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{book.author}</p>
                    <div className="mt-4 flex justify-between items-center">
                      <Button variant="outline" className="text-xs px-3 py-1 h-auto border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700">
                        Read Now
                      </Button>
                      <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center">
                        <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
                        {book.rating}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-20 bg-amber-50 dark:bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">Browse by Category</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              Explore our extensive collection organized by genres and topics to find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <Link href={`/categories/${category.name.toLowerCase()}`} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-slate-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-center text-slate-800 dark:text-white mb-2">{category.name}</h3>
                  <p className="text-sm text-amber-600 dark:text-amber-400">{category.count} Books</p>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button variant="outline" className="border-amber-600 text-amber-700 dark:border-amber-400 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-slate-700 px-6 py-2 rounded-full">
              View All Categories
            </Button>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-slate-900 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">What Our Readers Say</h2>
            <p className="text-slate-600 dark:text-slate-400">
              Discover why thousands of book lovers choose our platform for their reading journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-amber-50 dark:bg-slate-800 p-6 rounded-xl relative"
              >
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 8H8C5.79086 8 4 9.79086 4 12V20C4 22.2091 5.79086 24 8 24H16C18.2091 24 20 22.2091 20 20V12C20 9.79086 18.2091 8 16 8Z" fill="#F59E0B" fillOpacity="0.2"/>
                    <path d="M36 8H28C25.7909 8 24 9.79086 24 12V20C24 22.2091 25.7909 24 28 24H36C38.2091 24 40 22.2091 40 20V12C40 9.79086 38.2091 8 36 8Z" fill="#F59E0B" fillOpacity="0.2"/>
                  </svg>
                </div>
                
                <div className="mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4 bg-gradient-to-br from-amber-500 to-orange-400 flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-600 dark:to-amber-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your reading journey?</h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of readers today and discover your next favorite book.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-white text-amber-600 hover:bg-amber-50 px-8 py-3 rounded-full text-lg">
                Get Started
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-3 rounded-full text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
} 