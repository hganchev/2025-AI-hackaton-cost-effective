"use client"

import React, { useRef, useEffect } from "react"
import { X } from "lucide-react"

interface ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  hideCloseButton?: boolean;
}

/**
 * Modal component for displaying content in an overlay
 * Can be used for forms, messages, and other elements
 */
export function Modal({ title, onClose, children, hideCloseButton = false }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 bg-black bg-opacity-50 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-900 rounded-lg shadow-xl w-1/2 h-4/5 animate-slide-up overflow-auto relative"
      >
        {/* Always render a small X button in the top right corner */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none z-10"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        
        {title && (
          <div className="flex items-center justify-between p-4 border-b dark:border-slate-700">
            <h2 className="text-xl font-semibold">{title}</h2>
          </div>
        )}
        
        {children}
      </div>
    </div>
  );
} 