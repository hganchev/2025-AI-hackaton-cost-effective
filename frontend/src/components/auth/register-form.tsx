"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { Mail, Lock, Eye, EyeOff, BookOpen, AlertCircle, X } from "lucide-react"
import { motion } from "framer-motion"

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  })
  
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await register(formData)
      
      if (!result.success) {
        setError(result.error || "An error occurred during registration")
        return
      }
      
      setVerificationSent(true)
    } catch (err) {
      setError("An error occurred during registration")
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const toggleShowPassword = () => setShowPassword(prev => !prev)
  const toggleShowConfirmPassword = () => setShowConfirmPassword(prev => !prev)
  
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
  
  if (verificationSent) {
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
          <div className="bg-gradient-to-r from-green-500 via-green-600 to-emerald-500 dark:from-green-600 dark:via-green-700 dark:to-emerald-600 p-4 sm:p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
              <h2 className="text-lg sm:text-xl font-bold">Book Haven</h2>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Registration Successful!</h1>
            <p className="opacity-90 text-sm sm:text-base">
              Please check your email to verify your account
            </p>
          </div>
          
          <div className="p-4 sm:p-6 flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              We've sent a verification link to your email address. Please click the link to activate your account.
            </p>
            <Button 
              onClick={() => router.push('/login')}
              className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
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
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                "Create Account"
              )}
            </Button>
            
            <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-medium"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
} 