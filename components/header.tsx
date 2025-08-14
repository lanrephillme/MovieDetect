"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, Menu, X, User, Settings, Bell } from "lucide-react"
import Image from "next/image"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This would come from auth context
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleSignup = () => {
    router.push("/signup")
  }

  const handleSearch = () => {
    // This would trigger the search modal
    console.log("Open search modal")
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Movies", href: "/movies" },
    { name: "TV Shows", href: "/tv-shows" },
    { name: "Genres", href: "/genres" },
    { name: "Sports", href: "/sports" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0E17]/95 backdrop-blur-md border-b border-[#1F2937]">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <Image src="/placeholder-logo.svg" alt="MovieDetect Logo" fill className="object-contain" />
            </div>
            <span className="text-xl font-bold text-white">
              Movie<span className="text-[#00E6E6]">Detect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-[#B3B3B3] hover:text-[#00E6E6] transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSearch}
              className="text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937]"
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* User Actions */}
            {isLoggedIn ? (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937]">
                  <Bell className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937]">
                  <Settings className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937]">
                  <User className="w-5 h-5" />
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={handleLogin}
                  className="text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937]"
                >
                  Sign In
                </Button>
                <Button onClick={handleSignup} className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] font-semibold">
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937]"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#1F2937] py-4">
            <nav className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-[#B3B3B3] hover:text-[#00E6E6] transition-colors duration-200 font-medium px-2 py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Auth Buttons */}
              {!isLoggedIn && (
                <div className="flex flex-col gap-3 pt-4 border-t border-[#1F2937]">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      handleLogin()
                      setIsMenuOpen(false)
                    }}
                    className="text-[#B3B3B3] hover:text-[#00E6E6] hover:bg-[#1F2937] justify-start"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      handleSignup()
                      setIsMenuOpen(false)
                    }}
                    className="bg-[#00E6E6] text-[#0B0E17] hover:bg-[#00CCCC] font-semibold justify-start"
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
