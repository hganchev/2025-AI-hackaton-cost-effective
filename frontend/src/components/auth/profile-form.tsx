"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { User } from "@/types/index"

export function ProfileForm() {
  const { user, updateUser, logout } = useAuth()
  
  const [formData, setFormData] = useState<Partial<User>>({
    email: user?.email || ""
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
        setError(result.error || "An error occurred while saving your data.")
        return
      }
      
      setSuccess("Profile successfully updated.")
    } catch (err) {
      setError("An error occurred while saving your data.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-2">
          Edit your profile information
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
          <label htmlFor="email" className="text-sm font-medium">
            Email
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
        
        <div className="pt-2 space-y-4">
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
          
          <Button 
            type="button" 
            variant="outline"
            className="w-full"
            onClick={logout}
          >
            Sign Out
          </Button>
        </div>
      </form>
    </div>
  )
} 