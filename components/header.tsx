"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X, User, Bell, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock login state
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogin = () => {
    router.push("/login")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    // Add logout logic here
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "Genres", href: "/genres" },
    { name: "Sports", href: "/sports" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0B0E17]/95 backdrop-blur-md border-b border-[#1F2937]" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#00E6E6] rounded-lg flex items-center justify-center">
              <span className="text-[#0B0E17] font-bold text-lg">M</span>
            </div>
            <span className="text-white font-bold text-xl">MovieDetect</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#B3B3B3] hover:text-[#00E6E6] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:block flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-4 h-4" />
              <Input
                type="text"
                placeholder="Search movies, shows, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1F2937]/50 border-[#1F2937] text-white placeholder-[#B3B3B3] focus:border-[#00E6E6] focus:bg-[#1F2937]"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Icon - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-[#B3B3B3] hover:text-[#00E6E6]"
              onClick={() => {
                /* Open search modal */
              }}
            >
              <Search className="w-5 h-5" />
            </Button>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00E6E6] rounded-full"></span>
                </Button>

                {/* Settings */}
                <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6]">
                  <Settings className="w-5 h-5" />
                </Button>

                {/* Profile */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#B3B3B3] hover:text-[#00E6E6]"
                  onClick={handleLogout}
                >
                  <User className="w-5 h-5" />
                </Button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="text-[#B3B3B3] hover:text-[#00E6E6] font-medium"
                >
                  Sign In
                </Button>

                {/* Get Started Button */}
                <Button
                  size="sm"
                  onClick={handleSignup}
                  className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] font-medium px-4"
                >
                  Get Started
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-[#B3B3B3] hover:text-[#00E6E6]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#1F2937] bg-[#0B0E17]/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3] w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search movies, shows, actors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1F2937] border-[#1F2937] text-white placeholder-[#B3B3B3] focus:border-[#00E6E6]"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block text-[#B3B3B3] hover:text-[#00E6E6] transition-colors duration-200 font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              {!isLoggedIn && (
                <div className="flex space-x-4 pt-4 border-t border-[#1F2937]">
                  <Button
                    variant="outline"
                    onClick={handleLogin}
                    className="flex-1 border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17] bg-transparent"
                  >
                    Sign In
                  </Button>
                  <Button onClick={handleSignup} className="flex-1 bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC]">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
