"use client"

import React, { useMemo } from "react"

interface PasswordStrengthMeterProps {
  password: string;
}

/**
 * Component for visualizing password strength
 * Displays a color bar and text description based on password complexity
 */
export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  // Calculate password strength score (0-100)
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);
  
  // Determine strength level and description
  const { level, color, description } = useMemo(() => {
    if (strength < 20) return { level: 'Very Weak', color: 'bg-red-500', description: 'Very insecure' };
    if (strength < 40) return { level: 'Weak', color: 'bg-orange-500', description: 'Easily guessable' };
    if (strength < 60) return { level: 'Fair', color: 'bg-yellow-500', description: 'Could be stronger' };
    if (strength < 80) return { level: 'Good', color: 'bg-blue-500', description: 'Good password' };
    return { level: 'Strong', color: 'bg-green-500', description: 'Very secure password' };
  }, [strength]);

  // Don't show meter for empty passwords
  if (!password) {
    return null;
  }

  return (
    <div className="mt-1 space-y-2">
      {/* Strength bar */}
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300`} 
          style={{ width: `${strength}%` }}
        />
      </div>
      
      {/* Strength description */}
      <div className="flex justify-between text-xs">
        <span className="font-medium">{level}</span>
        <span className="text-gray-500">{description}</span>
      </div>
    </div>
  );
}

/**
 * Function for calculating password strength from 0 to 100
 */
function calculatePasswordStrength(password: string): number {
  if (!password) return 0;
  
  let score = 0;
  
  // Length check (max 40 points)
  const lengthScore = Math.min(password.length * 4, 40);
  score += lengthScore;
  
  // Lowercase letters check (max 10 points)
  if (/[a-z]/.test(password)) {
    score += 10;
  }
  
  // Uppercase letters check (max 10 points)
  if (/[A-Z]/.test(password)) {
    score += 10;
  }
  
  // Numbers check (max 10 points)
  if (/[0-9]/.test(password)) {
    score += 10;
  }
  
  // Special characters check (max 10 points)
  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 10;
  }
  
  // Combination check (max 20 points)
  const typesUsed = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^a-zA-Z0-9]/.test(password)
  ].filter(Boolean).length;
  
  score += (typesUsed - 1) * 10;
  
  return score;
} 