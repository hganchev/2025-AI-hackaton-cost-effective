"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Book } from "@/types/index"
import { Button } from "@/components/ui/button"
import { cn, truncateText, formatYear } from "@/lib/utils"

export interface BookCardProps {
  book: Book;
  variant?: 'default' | 'compact';
  className?: string;
}

export function BookCard({ book, variant = 'default', className }: BookCardProps) {
  const { id, title, author, coverImage, year, description } = book;
  
  const isCompact = variant === 'compact';
  
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
          
          <button 
            className="text-muted-foreground hover:text-primary text-sm"
            aria-label="Добави в моите книги"
          >
            Запази
          </button>
        </div>
      </div>
    </div>
  );
} 