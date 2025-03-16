"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Mail, Lock, User, Eye, EyeOff, BookOpen, AlertCircle, X } from "lucide-react"
import { motion } from "framer-motion"

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await register(formData)
      
      if (!result.success) {
        setError(result.error || "An error occurred during registration.")
        return
      }
      
      // Successful registration, redirect to library
      router.push("/library")
    } catch (err) {
      setError("An error occurred during registration.")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const toggleShowPassword = () => setShowPassword(prev => !prev)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev)
  
  // Calculate password strength
  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "" }
    
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    
    const labels = ["", "Weak", "Fair", "Good", "Strong", "Excellent"]
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500", "bg-emerald-500"]
    
    return { 
      strength, 
      label: labels[strength], 
      color: colors[strength]
    }
  }
  
  const passwordStrength = getPasswordStrength(formData.password)
  
  return (
    <div className="w-full mx-auto relative bg-white dark:bg-slate-800 rounded-xl shadow-xl overflow-hidden h-4/5 max-w-[50%]">
      <button
        onClick={() => router.push('/')}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none z-10"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 dark:from-amber-600 dark:via-amber-700 dark:to-orange-600 p-4 sm:p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            <h2 className="text-lg sm:text-xl font-bold">Book Haven</h2>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Create an Account</h1>
          <p className="opacity-90 text-sm sm:text-base">
            Begin your journey in the world of books
          </p>
        </div>
        
        <div className="p-4 sm:p-6 flex-1 overflow-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2 sm:p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-lg text-xs sm:text-sm flex items-start"
              >
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
            
            <div className="space-y-1">
              <label htmlFor="name" className="text-xs sm:text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <User className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-1 sm:py-2 text-sm text-slate-800 dark:text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600"
                placeholder="Your name"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-xs sm:text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Email</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-1 sm:py-2 text-sm text-slate-800 dark:text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600"
                placeholder="example@email.com"
              />
            </div>
            
            <div className="space-y-1">
              <label htmlFor="password" className="text-xs sm:text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-1 sm:py-2 text-sm text-slate-800 dark:text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600"
                  placeholder="********"
                />
                <button 
                  type="button" 
                  onClick={toggleShowPassword}
                  className="absolute right-2 sm:right-3 top-2 sm:top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-1 sm:mt-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level}
                          className={`h-1 sm:h-1.5 w-4 sm:w-5 rounded-full ${
                            level <= passwordStrength.strength 
                              ? passwordStrength.color
                              : 'bg-slate-200 dark:bg-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">
                    Use at least 8 characters with uppercase, lowercase, numbers and special characters.
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-1">
              <label htmlFor="confirmPassword" className="text-xs sm:text-sm font-medium flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full h-9 sm:h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-2 sm:px-3 py-1 sm:py-2 text-sm text-slate-800 dark:text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600"
                  placeholder="********"
                />
                <button 
                  type="button" 
                  onClick={toggleShowConfirmPassword}
                  className="absolute right-2 sm:right-3 top-2 sm:top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-600 dark:hover:bg-amber-700 h-9 sm:h-11 rounded-lg text-sm font-medium transition-all mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Registering...
                </span>
              ) : "Register"}
            </Button>
          </form>
          
          <div className="mt-4 sm:mt-6 flex items-center justify-center">
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
            <span className="px-2 text-xs text-slate-500 dark:text-slate-400">or</span>
            <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1"></div>
          </div>
          
          <div className="mt-4 sm:mt-5 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 h-9 sm:h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm">
              <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span>Register with Google</span>
            </button>
          </div>
          
          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 