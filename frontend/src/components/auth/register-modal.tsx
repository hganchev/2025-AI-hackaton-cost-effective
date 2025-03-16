"use client"

import React, { useState } from "react"
import { AlertCircle, Mail, Lock, Eye, EyeOff, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { useAuth } from "@/lib/auth-context"
import { motion } from "framer-motion"

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

/**
 * Modal component for system registration
 */
export function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)

  // Password strength state
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 0,
    label: '',
    color: 'bg-slate-200 dark:bg-slate-700'
  })
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Check password strength when it changes
    if (name === 'password') {
      calculatePasswordStrength(value)
    }
    
    // Clear error when user types
    if (error) setError('')
  }
  
  const calculatePasswordStrength = (password: string) => {
    let strength = 0
    let label = ''
    let color = 'bg-slate-200 dark:bg-slate-700'
    
    if (password.length === 0) {
      setPasswordStrength({ strength, label, color })
      return
    }
    
    // Add points for length
    if (password.length > 5) strength += 1
    if (password.length > 8) strength += 1
    
    // Add point for including lowercase letters
    if (/[a-z]/.test(password)) strength += 1
    
    // Add point for including uppercase letters
    if (/[A-Z]/.test(password)) strength += 1
    
    // Add point for including numbers
    if (/[0-9]/.test(password)) strength += 1
    
    // Add point for including special characters
    if (/[^a-zA-Z0-9]/.test(password)) strength += 1
    
    // Calculate final strength (max 5)
    strength = Math.min(5, Math.floor(strength / 1.2))
    
    // Set label and color based on strength
    if (strength <= 1) {
      label = 'Very Weak'
      color = 'bg-red-500 dark:bg-red-600'
    } else if (strength === 2) {
      label = 'Weak'
      color = 'bg-orange-500 dark:bg-orange-600'
    } else if (strength === 3) {
      label = 'Medium'
      color = 'bg-yellow-500 dark:bg-yellow-600'
    } else if (strength === 4) {
      label = 'Strong'
      color = 'bg-emerald-500 dark:bg-emerald-600'
    } else {
      label = 'Very Strong'
      color = 'bg-green-500 dark:bg-green-600'
    }
    
    setPasswordStrength({ strength, label, color })
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (passwordStrength.strength < 3) {
      setError('Please choose a stronger password')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const result = await register(formData)
      
      if (!result.success) {
        setError(result.error || 'Registration failed')
        return
      }
      
      setVerificationSent(true)
      setTimeout(() => {
        onClose()
        onSwitchToLogin()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const toggleShowPassword = () => {
    setShowPassword(prev => !prev)
  }
  
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev)
  }
  
  if (verificationSent) {
    return (
      <Modal onClose={onClose} title="" hideCloseButton={true}>
        <div className="w-full h-full flex flex-col">
          <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col">
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
                onClick={onSwitchToLogin}
                className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-600 dark:hover:bg-green-700"
              >
                Go to Login
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    )
  }
  
  return (
    <Modal 
      onClose={onClose} 
      title=""
      hideCloseButton={true}
    >
      <div className="w-full h-full flex flex-col">
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden flex-1 flex flex-col">
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
                  <span className="animate-pulse">Creating Account...</span>
                ) : (
                  "Create Account"
                )}
              </Button>
              
              <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <button 
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-amber-600 hover:text-amber-700 dark:text-amber-500 dark:hover:text-amber-400 font-medium"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  )
} 