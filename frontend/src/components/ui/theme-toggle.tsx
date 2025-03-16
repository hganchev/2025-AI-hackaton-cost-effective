"use client"

import React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full w-10 h-10 bg-amber-100 dark:bg-slate-700 hover:bg-amber-200 dark:hover:bg-slate-600 transition-colors duration-200",
        className
      )}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 text-amber-600 dark:text-slate-400 rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 text-amber-600 dark:text-amber-400 rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
} 