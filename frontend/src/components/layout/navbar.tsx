"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Search, Menu, UserCircle, LogOut, Heart, PlusCircle, BookOpen, LogIn, UserPlus, X, Book, BookOpenText, Library } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { NavItem } from "@/types/index"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuth()
  
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
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
    const logoLink = document.querySelector('header .logo-text')
    if (logoLink && !logoLink.textContent?.trim()) {
      logoLink.textContent = 'BookReader'
    }
  }, [])

  // Add click outside handler for profile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false)
      }
    }

    // Add event listener if menu is open
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    
    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isProfileMenuOpen])

  const navItems: NavItem[] = [
    { name: "Home", href: "/", icon: <BookOpenText className="w-4 h-4 mr-1" /> },
    { name: "Library", href: "/library", icon: <Library className="w-4 h-4 mr-1" /> },
    { name: "Categories", href: "/categories", icon: <Book className="w-4 h-4 mr-1" /> },
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

  // Toggle profile menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  return (
    <header className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center mr-8 group">
              <div className="relative w-10 h-10 mr-2 bg-amber-500 dark:bg-amber-600 rounded-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="font-serif text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-700 to-amber-500 dark:from-amber-400 dark:to-amber-300 logo-text group-hover:scale-105 transition-transform duration-300">
                BookReader
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium relative py-2 overflow-hidden group",
                    pathname === item.href 
                      ? "text-amber-700 dark:text-amber-400" 
                      : "text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
                  )}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {item.name}
                  </span>
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300"></span>
                  )}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-600 to-amber-400 dark:from-amber-500 dark:to-amber-300 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {/* Search form first */}
            <form onSubmit={handleSearch} className="hidden md:flex relative">
              <div className="relative group">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-amber-500 transition-colors duration-200" />
                <input
                  type="search"
                  placeholder="Search books..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-10 w-[200px] lg:w-[300px] rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 focus-visible:border-amber-500 dark:focus-visible:border-amber-400"
                />
              </div>
            </form>
            
            {/* Conditional rendering based on authentication status */}
            {!isAuthenticated ? (
              // Login and Registration buttons when not authenticated
              <div className="flex items-center space-x-3" id="auth-buttons">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={openLoginModal}
                  className="flex items-center gap-1 border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-slate-800"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
                <Button 
                  size="sm" 
                  onClick={openRegisterModal}
                  className="flex items-center gap-1 bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Button>
              </div>
            ) : (
              // Profile menu when authenticated
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400"
                >
                  <UserCircle className="h-6 w-6" />
                  <span className="text-sm font-medium">{user?.email}</span>
                </button>
                
                {isProfileMenuOpen && (
                  <div
                    ref={profileMenuRef}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2"
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-1.5 rounded-md bg-amber-100 dark:bg-slate-700"
              onClick={toggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <Menu className="h-5 w-5 text-amber-700 dark:text-amber-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-amber-200 dark:border-slate-700 py-4 bg-white dark:bg-slate-800 shadow-lg absolute w-full">
          <div className="container mx-auto px-4 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                placeholder="Search books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 w-full rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400"
              />
            </form>
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center py-3 px-4 text-base font-medium rounded-md transition-all duration-200",
                    pathname === item.href 
                      ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400" 
                      : "text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile authentication options */}
              <div className="pt-2 flex flex-col gap-2">
                {!isAuthenticated ? (
                  // Login and register buttons when not authenticated
                  <>
                    <Button 
                      variant="outline" 
                      className="w-full justify-center border-amber-600 text-amber-700 hover:bg-amber-50 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-slate-800" 
                      onClick={() => {
                        openLoginModal();
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      <span>Login</span>
                    </Button>
                    <Button 
                      className="w-full justify-center bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600" 
                      onClick={() => {
                        openRegisterModal();
                        setIsMenuOpen(false);
                      }}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span>Register</span>
                    </Button>
                  </>
                ) : (
                  // User profile options when authenticated
                  <>
                    <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 mb-2">
                      <div className="flex items-center">
                        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-400 dark:from-amber-400 dark:to-amber-600 flex items-center justify-center text-white shadow-md mr-3">
                          <UserCircle className="w-7 h-7" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-200">John Doe</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">john.doe@example.com</p>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href="/favorites" 
                      onClick={() => setIsMenuOpen(false)}
                      className="group flex items-center py-3 px-4 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-md transition-all duration-200"
                    >
                      <span className="inline-flex items-center justify-center w-5 h-5 mr-3 relative">
                        <Heart 
                          className="w-5 h-5 stroke-current stroke-2"
                          fill="transparent"
                        />
                        <Heart 
                          className="w-5 h-5 absolute inset-0 fill-red-500 stroke-red-500 heart-fill" 
                        />
                      </span>
                      <span>Favorites</span>
                      <span className="ml-auto bg-amber-500 text-white text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">7</span>
                    </Link>
                    <Link 
                      href="/add-book" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-3 px-4 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-md transition-all duration-200"
                    >
                      <span className="bg-amber-100 dark:bg-slate-700 rounded-full p-1 mr-2">
                        <PlusCircle className="w-4 h-4" />
                      </span>
                      <span>Add Book</span>
                    </Link>
                    <Link 
                      href="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-3 px-4 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-md transition-all duration-200"
                    >
                      <UserCircle className="w-5 h-5 mr-3 text-amber-600 dark:text-amber-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link 
                      href="/settings" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center py-3 px-4 text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-slate-700 rounded-md transition-all duration-200"
                    >
                      <svg className="w-5 h-5 mr-3 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </Link>
                    <button 
                      className="flex items-center py-3 px-4 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md w-full text-left transition-all duration-200"
                      onClick={() => {
                        console.log('Logout');
                        setIsMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Logout</span>
                    </button>
                  </>
                )}
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