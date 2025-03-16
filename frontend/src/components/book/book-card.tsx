"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen, Heart } from "lucide-react"
import { Book } from "@/types/index"
import { Button } from "@/components/ui/button"
import { cn, truncateText, formatYear } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { useFavorites } from "@/lib/favorites-context"

export interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact';
  className?: string;
}

export function BookCard({ book, variant = 'default', className }: BookCardProps) {
  const { id, title, author, coverImage, year, description } = book;
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const isCompact = variant === 'compact';
  const isFavorited = isFavorite(id);
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(id);
  };
  
  return (
    <div className={cn(
      "group relative flex flex-col overflow-hidden rounded-lg border bg-background transition-all hover:shadow-md",
      isCompact ? "h-[320px]" : "h-[420px]",
      className
    )}>
      <div className={cn(
        "relative overflow-hidden",
        isCompact ? "h-[180px]" : "h-[250px]"
      )}>
        <Image
          src={coverImage || "/images/book-placeholder.jpg"}
          alt={`Корица на ${title}`}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold line-clamp-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{author}</p>
        {year && (
          <p className="text-xs text-muted-foreground mt-1">
            {formatYear(year)}
          </p>
        )}
        
        {!isCompact && (
          <p className="mt-2 text-sm line-clamp-2">
            {truncateText(description, 120)}
          </p>
        )}
        
        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link href={`/book/${id}`} passHref>
            <Button variant="primary" size="sm" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Чети</span>
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <button 
              className={cn(
                "flex items-center text-sm gap-1 transition-colors",
                isFavorited 
                  ? "text-red-500 hover:text-red-600"
                  : "text-muted-foreground hover:text-primary"
              )}
              onClick={handleFavoriteClick}
              aria-label={isFavorited ? "Премахни от любими" : "Добави в любими"}
            >
              <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
              <span>{isFavorited ? "Премахни" : "Запази"}</span>
            </button>
          ) : (
            <Link 
              href="/login" 
              className="text-muted-foreground hover:text-primary text-sm"
            >
              Вход за запазване
            </Link>
          )}
        </div>
      </div>
    </div>
  );
} 