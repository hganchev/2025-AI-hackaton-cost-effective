"use client"

import React, { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookSearchProps {
  initialQuery?: string
  onSearch: (query: string) => void
  placeholder?: string
  className?: string
}

export function BookSearch({
  initialQuery = "",
  onSearch,
  placeholder = "Търсене на книги...",
  className
}: BookSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery)
  }, [debouncedQuery, onSearch])

  const handleClear = () => {
    setQuery("")
  }

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-input bg-background pl-9 pr-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      />
      
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground"
          aria-label="Изчисти търсенето"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
} 