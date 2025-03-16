"use client"

import React, { useState } from "react"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter"
import { 
  isValidEmail, 
  isStrongPassword, 
  getPasswordErrorMessage, 
  isNotEmpty, 
  doPasswordsMatch 
} from "@/lib/validation-utils"

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin: () => void;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  [key: string]: string;
}

/**
 * Modal component for system registration
 */
export function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      const inputs = Array.from(document.querySelectorAll('.register-form input'));
      const currentIndex = inputs.indexOf(e.target as HTMLInputElement);
      const nextInput = inputs[currentIndex + 1] as HTMLInputElement;
      if (nextInput) nextInput.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const inputs = Array.from(document.querySelectorAll('.register-form input'));
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
    
    // Collect validation errors
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!isNotEmpty(formData.name)) {
      newErrors.name = "Name is required";
    }
    
    // Validate email
    if (!formData.email || !isValidEmail(formData.email)) {
      newErrors.email = "Invalid email format. Example: user@example.com";
    }
    
    // Validate password
    if (!isNotEmpty(formData.password)) {
      newErrors.password = "Password is required";
    } else if (!isStrongPassword(formData.password)) {
      newErrors.password = getPasswordErrorMessage(formData.password);
    }
    
    // Validate password confirmation
    if (!isNotEmpty(formData.confirmPassword)) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (!doPasswordsMatch(formData.password, formData.confirmPassword)) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Registration submitted:', formData);
      setIsSubmitting(false);
      // Normally here we would handle the registration response
    }, 1000);
  };
  
  return (
    <Modal title="Register" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 register-form">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="John Doe"
          />
          {errors.name && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errors.name}</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errors.email}</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
          <input 
            type="password" 
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="********"
          />
          <PasswordStrengthMeter password={formData.password} />
          {errors.password && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errors.password}</span>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className={`w-full p-2 border rounded-md ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="********"
          />
          {errors.confirmPassword && (
            <div className="flex items-center mt-1 text-red-500 text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>
        <Button 
          type="submit" 
          className={`w-full transition-all duration-300 ${buttonClicked ? 'scale-95 opacity-90' : ''}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent border-white"></span>
              Registering...
            </span>
          ) : (
            'Register'
          )}
        </Button>
        <p className="text-center text-sm">
          Already have an account? <button 
            type="button"
            onClick={onSwitchToLogin} 
            className="text-primary hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </Modal>
  );
} 