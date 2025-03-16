"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { BookOpen } from "lucide-react"
import { Book } from "@/types/index"
import { Button } from "@/components/ui/button"
import { cn, truncateText, formatYear } from "@/lib/utils"
import { EmptyState } from "./empty-state"

interface BookListProps {
  books: Book[]
  className?: string
  emptyStateProps?: React.ComponentProps<typeof EmptyState>
}

export function BookList({ books, className, emptyStateProps }: BookListProps) {
  if (!books || books.length === 0) {
    return <EmptyState {...emptyStateProps} />
  }

  return (
    <div className={cn("space-y-4", className)}>
      {books.map((book) => (
        <div 
          key={book.id}
          className="flex gap-4 p-4 border rounded-lg bg-background hover:shadow-md transition-all"
        >
          <div className="relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-md">
            <Image
              src={book.coverImage || "/images/book-placeholder.jpg"}
              alt={`Корица на ${book.title}`}
              className="object-cover"
              fill
              sizes="80px"
            />
          </div>
          
          <div className="flex flex-1 flex-col">
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-sm text-muted-foreground">{book.author}</p>
            {book.year && (
              <p className="text-xs text-muted-foreground mt-1">
                {formatYear(book.year)}
              </p>
            )}
            
            <p className="mt-2 text-sm">
              {truncateText(book.description, 200)}
            </p>
            
            <div className="mt-auto pt-4 flex items-center gap-4">
              <Link href={`/book/${book.id}`} passHref>
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
      ))}
    </div>
  )
} 