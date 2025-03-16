"use client"

import React from "react"
import { ChevronDown, ArrowUpDown } from "lucide-react"
import { SortOption, SortDirection } from "@/types/index"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SortBooksProps {
  currentSort: SortOption
  currentDirection: SortDirection
  onChange: (sort: SortOption, direction: SortDirection) => void
  className?: string
}

export function SortBooks({
  currentSort,
  currentDirection,
  onChange,
  className
}: SortBooksProps) {
  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "title", label: "Заглавие" },
    { value: "author", label: "Автор" },
    { value: "year", label: "Година" }
  ]

  const toggleDirection = () => {
    onChange(currentSort, currentDirection === "asc" ? "desc" : "asc")
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative group">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          Сортирай по: <span className="font-medium">{sortOptions.find(opt => opt.value === currentSort)?.label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
        
        <div className="absolute z-10 top-full left-0 mt-1 w-full bg-background border rounded-md shadow-md invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
          <div className="py-1">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                className={cn(
                  "w-full text-left px-3 py-1.5 text-sm hover:bg-accent",
                  currentSort === option.value && "bg-muted font-medium"
                )}
                onClick={() => onChange(option.value, currentDirection)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        aria-label={currentDirection === "asc" ? "Възходящ ред" : "Низходящ ред"}
        onClick={toggleDirection}
        className="p-1"
      >
        <ArrowUpDown 
          className={cn(
            "h-4 w-4 transition-transform", 
            currentDirection === "desc" && "rotate-180"
          )} 
        />
      </Button>
    </div>
  )
} 