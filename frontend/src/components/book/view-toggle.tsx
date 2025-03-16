"use client"

import React from "react"
import { Grid, List } from "lucide-react"
import { ViewMode } from "@/types/index"
import { cn } from "@/lib/utils"

interface ViewToggleProps {
  currentView: ViewMode
  onChange: (view: ViewMode) => void
  className?: string
}

export function ViewToggle({ currentView, onChange, className }: ViewToggleProps) {
  return (
    <div className={cn("flex items-center border rounded-md overflow-hidden", className)}>
      <button
        className={cn(
          "p-2 transition-colors",
          currentView === "grid" 
            ? "bg-primary text-primary-foreground" 
            : "bg-background hover:bg-accent text-muted-foreground"
        )}
        onClick={() => onChange("grid")}
        aria-label="Покажи в решетка"
        aria-pressed={currentView === "grid"}
      >
        <Grid className="h-5 w-5" />
      </button>
      
      <button
        className={cn(
          "p-2 transition-colors",
          currentView === "list" 
            ? "bg-primary text-primary-foreground" 
            : "bg-background hover:bg-accent text-muted-foreground"
        )}
        onClick={() => onChange("list")}
        aria-label="Покажи в списък"
        aria-pressed={currentView === "list"}
      >
        <List className="h-5 w-5" />
      </button>
    </div>
  )
} 