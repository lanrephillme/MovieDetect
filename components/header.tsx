"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, User } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSignedIn, setIsSignedIn] = useState(false)
  const router = useRouter()

  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "Genres", href: "/genres" },
    { name: "Sports", href: "/sports" },
  ]

  const handleSignIn = () => {
    router.push("/login")
  }

  const handleGetStarted = () => {
    router.push("/signup")
  }

  const handleSignOut = () => {
    setIsSignedIn(false)
    // Add sign out logic here
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <img
              src="/placeholder-logo.svg"
              alt="MovieDetect"
              className="w-8 h-8"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "/placeholder.svg?height=32&width=32"
              }}
            />
            <span className="text-white font-bold text-xl">MovieDetect</span>
          </Link>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-[#00E6E6] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {!isSignedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={handleSignIn}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] font-medium px-6"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                >
                  <Search className="w-5 h-5" />
                </Button>
                <div className="relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-300 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <User className="w-5 h-5" />
                  </Button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="p-2">
                      <Link
                        href="/profile"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/watchlist"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                      >
                        My Watchlist
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                      >
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-700" />
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-300 hover:text-white hover:bg-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <nav className="flex flex-col space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-[#00E6E6] transition-colors duration-200 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {!isSignedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white hover:bg-white/10 justify-start"
                    onClick={() => {
                      handleSignIn()
                      setIsMenuOpen(false)
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] font-medium"
                    onClick={() => {
                      handleGetStarted()
                      setIsMenuOpen(false)
                    }}
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
