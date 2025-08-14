"use client"

import { useState } from "react"
import { Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "./search-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false) // This would come from auth context

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800/30">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand - Left */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl">MovieDetect</span>
            </div>

            {/* Centered Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-1 max-w-md mx-8">
              <div className="flex items-center space-x-8">
                <a href="/" className="text-white hover:text-gray-300 transition-colors font-medium text-sm">
                  Home
                </a>
                <a href="/movies" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">
                  Movies
                </a>
                <a href="/tv-shows" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">
                  TV Shows
                </a>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">
                  Features
                </a>
                {isSignedIn && (
                  <a href="/watchlist" className="text-gray-400 hover:text-white transition-colors font-medium text-sm">
                    My List
                  </a>
                )}
              </div>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Button - Always visible */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full w-10 h-10"
                onClick={openSearch}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                {!isSignedIn ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white hover:bg-gray-800/50 px-4 py-2 text-sm font-medium"
                    >
                      Sign In
                    </Button>
                    <Button size="sm" className="bg-white text-black hover:bg-gray-200 px-4 py-2 text-sm font-medium">
                      Get Started
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">U</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full w-10 h-10 md:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800/30 bg-black/95 backdrop-blur-md">
              <nav className="py-4 space-y-2">
                <a href="/" className="block px-4 py-2 text-white hover:text-gray-300 transition-colors font-medium">
                  Home
                </a>
                <a
                  href="/movies"
                  className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Movies
                </a>
                <a
                  href="/tv-shows"
                  className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  TV Shows
                </a>
                <a
                  href="/features"
                  className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Features
                </a>
                {isSignedIn && (
                  <a
                    href="/watchlist"
                    className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    My List
                  </a>
                )}
                <div className="px-4 py-2 space-y-3 border-t border-gray-800/30 mt-4 pt-4">
                  {!isSignedIn ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start text-white hover:bg-gray-800/50">
                        Sign In
                      </Button>
                      <Button className="w-full bg-white text-black hover:bg-gray-200">Get Started</Button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">U</span>
                      </div>
                      <span className="text-white">Profile</span>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
