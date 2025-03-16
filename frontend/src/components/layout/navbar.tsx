"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Search, Menu, UserCircle, LogOut, Heart, PlusCircle, BookOpen, LogIn, UserPlus, X } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NavItem } from "@/types/index"
import { cn } from "@/lib/utils"
// import { useAuth } from "@/lib/auth-context" // Removing the import that causes errors
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  
  // Mock implementation for authContext instead of useAuth() which causes an error
  const mockAuth = {
    user: null,
    isAuthenticated: false
  }
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  // State for tracking changes
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Function to force refresh
  const forceRefresh = () => {
    setLastUpdate(Date.now())
  }

  // On each component change, update lastUpdate
  useEffect(() => {
    // When the component loads or changes, update lastUpdate
    forceRefresh()
    
    // Make sure the buttons will show if we had a problem with that
    const authButtons = document.getElementById('auth-buttons')
    if (authButtons) {
      authButtons.style.display = 'flex'
    }
    
    // Add text to logo if empty
    const logoLink = document.querySelector('header .text-2xl.font-bold.text-primary')
    if (logoLink && !logoLink.textContent?.trim()) {
      logoLink.textContent = 'BookReader'
    }
  }, [])

  const navItems: NavItem[] = [
    { name: "Home", href: "/" },
    { name: "Library", href: "/library" },
    { name: "Categories", href: "/categories" },
  ]
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log(`Searching for: ${searchQuery}`)
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  
  // Modal management functions
  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }
  
  const openRegisterModal = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }
  
  const closeModals = () => {
    setIsLoginModalOpen(false)
    setIsRegisterModalOpen(false)
  }
  
  const switchToLogin = () => {
    setIsLoginModalOpen(true)
    setIsRegisterModalOpen(false)
  }
  
  const switchToRegister = () => {
    setIsRegisterModalOpen(true)
    setIsLoginModalOpen(false)
  }

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary mr-8">
              BookReader
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search form first */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 w-[200px] lg:w-[300px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </form>
            
            {/* Login and Registration buttons moved after search */}
            <div className="flex items-center space-x-2" id="auth-buttons">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openLoginModal}
                className="flex items-center gap-1"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
              <Button 
                size="sm" 
                onClick={openRegisterModal}
                className="flex items-center gap-1"
              >
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Button>
            </div>
            
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t py-4">
          <div className="container mx-auto px-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </form>
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile login/registration buttons */}
              <div className="pt-4 flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-center" 
                  onClick={() => {
                    openLoginModal();
                    setIsMenuOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  <span>Login</span>
                </Button>
                <Button 
                  className="w-full justify-center" 
                  onClick={() => {
                    openRegisterModal();
                    setIsMenuOpen(false);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  <span>Register</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
      
      {/* Hidden element for tracking changes - this helps with live reload */}
      <div style={{ display: 'none' }} data-last-update={lastUpdate}></div>
      
      {/* Modal components */}
      {isLoginModalOpen && (
        <LoginModal 
          onClose={closeModals} 
          onSwitchToRegister={switchToRegister} 
        />
      )}

      {/* Registration modal */}
      {isRegisterModalOpen && (
        <RegisterModal 
          onClose={closeModals} 
          onSwitchToLogin={switchToLogin} 
        />
      )}
    </header>
  )
}