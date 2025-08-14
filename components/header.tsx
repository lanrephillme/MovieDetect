"use client"

import { useState } from "react"
import { Search, Menu, X, User, Bell, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SearchModal } from "./search-modal"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <img
                  src="/placeholder-logo.svg"
                  alt="MovieDetect"
                  className="w-8 h-8"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
                <span className="text-white font-bold text-xl">MovieDetect</span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-white hover:text-gray-300 transition-colors font-medium">
                  Home
                </a>
                <a href="/features" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Features
                </a>
                <a href="/pricing" className="text-gray-400 hover:text-white transition-colors font-medium">
                  Pricing
                </a>
                <a href="/watchlist" className="text-gray-400 hover:text-white transition-colors font-medium">
                  My Watchlist
                </a>
              </nav>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full"
                onClick={openSearch}
              >
                <Search className="w-5 h-5" />
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full hidden md:flex"
              >
                <Bell className="w-5 h-5" />
              </Button>

              {/* Settings */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full hidden md:flex"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* User Profile */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full hidden md:flex"
              >
                <User className="w-5 h-5" />
              </Button>

              {/* Auth Buttons - Desktop */}
              <div className="hidden md:flex items-center space-x-3">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-gray-800 border border-gray-600 hover:border-gray-500"
                >
                  Sign In
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white">Get Started</Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full md:hidden"
                onClick={toggleMenu}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-800 bg-black/95 backdrop-blur-md">
              <nav className="py-4 space-y-4">
                <a href="/" className="block px-4 py-2 text-white hover:text-gray-300 transition-colors font-medium">
                  Home
                </a>
                <a
                  href="/features"
                  className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Features
                </a>
                <a
                  href="/pricing"
                  className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Pricing
                </a>
                <a
                  href="/watchlist"
                  className="block px-4 py-2 text-gray-400 hover:text-white transition-colors font-medium"
                >
                  My Watchlist
                </a>
                <div className="px-4 py-2 space-y-3 border-t border-gray-800 mt-4 pt-4">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-gray-800 border border-gray-600 hover:border-gray-500"
                  >
                    Sign In
                  </Button>
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Get Started</Button>
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
