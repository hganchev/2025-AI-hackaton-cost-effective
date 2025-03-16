"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { User } from "@/types/index"

export function ProfileForm() {
  const { user, updateUser, logout } = useAuth()
  
  const [formData, setFormData] = useState<Partial<User>>({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  })
  
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsSubmitting(true)
    
    try {
      const result = await updateUser(formData)
      
      if (!result.success) {
        setError(result.error || "Възникна грешка при запазването на данните.")
        return
      }
      
      setSuccess("Профилът беше успешно актуализиран.")
    } catch (err) {
      setError("Възникна грешка при запазването на данните.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Моят профил</h1>
        <p className="text-muted-foreground mt-2">
          Редактирайте информацията за своя профил
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-md text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-900 rounded-md text-sm">
            {success}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Име
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Имейл
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="avatar" className="text-sm font-medium">
            URL на профилна снимка
          </label>
          <input
            id="avatar"
            name="avatar"
            type="url"
            value={formData.avatar || ""}
            onChange={handleChange}
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        
        <div className="pt-2 space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Запазване..." : "Запази промените"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={logout}
          >
            Изход от профила
          </Button>
        </div>
      </form>
    </div>
  )
} 