"use client"

import React from "react"
import { FileQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  actionHref?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export function EmptyState({
  title = "Няма намерени книги",
  description = "Не успяхме да намерим книги, отговарящи на критериите.",
  actionLabel,
  actionHref,
  onAction,
  icon = <FileQuestion className="h-12 w-12 text-muted-foreground" />,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center text-center py-16 px-4", className)}>
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">
        {description}
      </p>

      {(actionLabel && (actionHref || onAction)) && (
        <Button
          variant="outline"
          className="mt-6"
          onClick={onAction}
          {...(actionHref ? { as: 'a', href: actionHref } : {})}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
} 