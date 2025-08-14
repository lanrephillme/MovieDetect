"use client"

import { useState } from "react"
import { Menu, X, Search, User, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md border-b border-gray-800/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="/placeholder-logo.svg"
                alt="MovieDetect"
                className="w-8 h-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg"
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">MovieDetect</h1>
              <Badge variant="secondary" className="bg-blue-600 text-white text-xs px-2 py-0.5">
                AI
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-white hover:text-gray-300 transition-colors font-medium">
              Home
            </a>
            <a href="/movies" className="text-gray-400 hover:text-white transition-colors">
              Movies
            </a>
            <a href="/tv-shows" className="text-gray-400 hover:text-white transition-colors">
              TV Shows
            </a>
            <a href="/watchlist" className="text-gray-400 hover:text-white transition-colors">
              Watchlist
            </a>
            <a href="/features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="/pricing" className="text-gray-400 hover:text-white transition-colors">
              Pricing
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <User className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-300 hover:text-white hover:border-white bg-transparent"
            >
              Sign In
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden text-white" onClick={toggleMenu}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-white hover:text-gray-300 transition-colors font-medium">
                Home
              </a>
              <a href="/movies" className="text-gray-400 hover:text-white transition-colors">
                Movies
              </a>
              <a href="/tv-shows" className="text-gray-400 hover:text-white transition-colors">
                TV Shows
              </a>
              <a href="/watchlist" className="text-gray-400 hover:text-white transition-colors">
                Watchlist
              </a>
              <a href="/features" className="text-gray-400 hover:text-white transition-colors">
                Features
              </a>
              <a href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                Pricing
              </a>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-800">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:text-white hover:border-white bg-transparent"
                >
                  Sign In
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Sign Up
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
