"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    
    try {
      const result = await login(formData)
      
      if (!result.success) {
        setError(result.error || "Невалиден имейл или парола.")
        return
      }
      
      // Успешно вписване, пренасочваме към библиотеката
      router.push("/library")
    } catch (err) {
      setError("Възникна грешка при вписването.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Добре дошли отново</h1>
        <p className="text-muted-foreground mt-2">
          Влезте в акаунта си, за да продължите
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-900 rounded-md text-sm">
            {error}
          </div>
        )}
        
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
            placeholder="example@email.com"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Парола
            </label>
            <Link href="#" className="text-sm text-primary hover:underline">
              Забравена парола?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="********"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="remember" className="text-sm text-muted-foreground">
            Запомни ме
          </label>
        </div>
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Вписване..." : "Вход"}
        </Button>
      </form>
      
      <p className="text-center text-sm">
        Нямате акаунт?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Регистрирайте се
        </Link>
      </p>
    </div>
  )
} 