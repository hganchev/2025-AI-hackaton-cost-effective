"use client"

import React from "react"
import { BookCard, BookCardProps } from "./book-card"
import { EmptyState } from "./empty-state"

interface BookGridProps {
  books: BookCardProps["book"][]
  variant?: "default" | "compact"
  className?: string
  emptyStateProps?: React.ComponentProps<typeof EmptyState>
}

export function BookGrid({ 
  books, 
  variant = "default", 
  className = "",
  emptyStateProps
}: BookGridProps) {
  if (!books || books.length === 0) {
    return <EmptyState {...emptyStateProps} />
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {books.map((book) => (
        <BookCard key={book.id} book={book} variant={variant} />
      ))}
    </div>
  )
} 