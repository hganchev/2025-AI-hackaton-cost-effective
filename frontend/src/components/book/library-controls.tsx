"use client"

import React from "react"
import { BookSearch } from "./book-search"
import { SortBooks } from "./sort-books"
import { ViewToggle } from "./view-toggle"
import { SortDirection, SortOption, ViewMode } from "@/types/index"
import { cn } from "@/lib/utils"

interface LibraryControlsProps {
  searchQuery: string
  onSearch: (query: string) => void
  sortOption: SortOption
  sortDirection: SortDirection
  onSort: (option: SortOption, direction: SortDirection) => void
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  className?: string
}

export function LibraryControls({
  searchQuery,
  onSearch,
  sortOption,
  sortDirection,
  onSort,
  viewMode,
  onViewChange,
  className
}: LibraryControlsProps) {
  return (
    <div className={cn("space-y-4 md:space-y-0 md:flex md:items-center md:justify-between", className)}>
      <BookSearch
        initialQuery={searchQuery}
        onSearch={onSearch}
        className="md:max-w-sm"
      />
      
      <div className="flex items-center justify-between gap-2 md:justify-start">
        <SortBooks
          currentSort={sortOption}
          currentDirection={sortDirection}
          onChange={onSort}
        />
        
        <ViewToggle
          currentView={viewMode}
          onChange={onViewChange}
        />
      </div>
    </div>
  )
} 