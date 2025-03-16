"use client"

import React, { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { isValidEmail, isNotEmpty } from "@/lib/validation-utils"

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
  [key: string]: string;
}

/**
 * Modal component for system login
 */
export function LoginModal({ onClose, onSwitchToRegister }: LoginModalProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.login-form input'));
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      const nextInput = inputs[currentIndex + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.login-form input'));
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      const prevInput = inputs[currentIndex - 1] as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Button animation on click
    setButtonClicked(true);
    setTimeout(() => setButtonClicked(false), 300);
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!isNotEmpty(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!isNotEmpty(formData.password)) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Login with:', formData);
        setIsSubmitting(false);
        onClose();
      }, 1000);
    }
  };
  
  return (
    <Modal title="Login" onClose={onClose}>
      <form onSubmit={handleSubmit} className="login-form space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`block w-full rounded-md border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
              placeholder="your@email.com"
              autoComplete="email"
            />
            {errors.email && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className={`block w-full rounded-md border ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary`}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
            )}
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
        </div>
        
        <div className="pt-2">
          <Button
            type="submit"
            className={`w-full ${buttonClicked ? 'transform scale-95' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </div>
        
        <div className="text-center text-sm">
          <p>
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={onSwitchToRegister}
              className="text-primary hover:underline focus:outline-none"
            >
              Register
            </button>
          </p>
        </div>
      </form>
    </Modal>
  );
} 