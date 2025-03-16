import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Book } from '@/types/index'
import { cn } from '@/lib/utils'

interface BookCardProps {
  book: Book;
  layout?: 'grid' | 'list';
  isFavorited?: boolean;
  onFavoriteToggle?: (id: string) => void;
  className?: string;
}

export const BookCard = ({ 
  book, 
  layout = 'grid', 
  isFavorited = false, 
  onFavoriteToggle,
  className 
}: BookCardProps) => {
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
  
  // Generate a random rating for demo purposes (real app would use actual data)
  const rating = ((Math.random() * 2) + 3).toFixed(1)
  
  if (layout === 'list') {
    return (
      <div className={cn("flex bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group", className)}>
        <div className="w-1/3 md:w-1/4 relative h-auto min-h-[150px]">
          {book.coverImage ? (
            <Image 
              src={book.coverImage} 
              alt={book.title}
              fill
              className="object-cover"
            />
          ) : getPlaceholderImage()}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <div className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
              {book.category || 'Fiction'}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow p-4">
          <div className="flex items-start justify-between mb-1">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 line-clamp-1">{book.title}</h3>
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-amber-500 mr-1" />
              <span className="text-sm font-medium">{rating}</span>
            </div>
          </div>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">{book.author}</p>
          
          <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-4 flex-grow">
            {book.description || 'No description available for this book.'}
          </p>
          
          <div className="flex items-center justify-between mt-auto">
            <Link href={`/books/${book.id}`}>
              <Button variant="outline" size="sm" className="border-amber-500 text-amber-600 dark:border-amber-400 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700">
                <BookOpen className="w-4 h-4 mr-1" />
                Read Now
              </Button>
            </Link>
            
            <button 
              onClick={() => onFavoriteToggle && onFavoriteToggle(book.id)}
              className="group flex items-center justify-center w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-colors duration-300",
                  isFavorited 
                    ? "fill-red-500 text-red-500" 
                    : "fill-transparent text-slate-400 group-hover:text-red-400"
                )}
              />
            </button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn("bg-white dark:bg-slate-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-full", className)}>
      <Link href={`/books/${book.id}`} className="block h-full">
        <div className="aspect-[2/3] overflow-hidden relative">
          <div className="w-full h-full relative transform group-hover:scale-105 transition-transform duration-300">
            {book.coverImage ? (
              <Image 
                src={book.coverImage} 
                alt={book.title}
                fill
                className="object-cover"
              />
            ) : getPlaceholderImage()}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
              <div className="px-2 py-1 bg-amber-500 text-white text-xs rounded-full">
                {book.category || 'Fiction'}
              </div>
              <div className="flex items-center bg-slate-900/80 px-2 py-1 rounded-full">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500 mr-1" />
                <span className="text-white text-xs">{rating}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex flex-col h-[calc(100%-60%)]">
          <h3 className="font-bold text-slate-800 dark:text-white text-lg mb-1 line-clamp-1">{book.title}</h3>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">{book.author}</p>
          
          <div className="mt-auto flex justify-between items-center">
            <span className="text-slate-800 dark:text-slate-200 font-medium flex items-center">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500 mr-1" />
              {rating}
            </span>
            
            {onFavoriteToggle && (
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onFavoriteToggle(book.id);
                }}
                className="group flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    isFavorited 
                      ? "fill-red-500 text-red-500" 
                      : "fill-transparent text-slate-400 group-hover:text-red-400"
                  )}
                />
              </button>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
} 