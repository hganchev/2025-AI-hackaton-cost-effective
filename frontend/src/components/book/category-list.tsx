"use client"

import React from "react"
import { Category } from "@/types/index"
import { cn } from "@/lib/utils"

interface CategoryListProps {
  categories: Category[]
  selectedCategory?: string
  onSelect: (categoryId: string | undefined) => void
  className?: string
}

export function CategoryList({
  categories,
  selectedCategory,
  onSelect,
  className
}: CategoryListProps) {
  if (!categories || categories.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-1", className)}>
      <h3 className="font-medium text-sm mb-3">Категории</h3>
      
      <button
        className={cn(
          "w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent",
          !selectedCategory ? "bg-muted font-medium" : "text-muted-foreground"
        )}
        onClick={() => onSelect(undefined)}
      >
        Всички категории
      </button>
      
      {categories.map((category) => (
        <button
          key={category.id}
          className={cn(
            "w-full text-left px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent",
            selectedCategory === category.id ? "bg-muted font-medium" : "text-muted-foreground"
          )}
          onClick={() => onSelect(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
} 