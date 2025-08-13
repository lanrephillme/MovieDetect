"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search, Video, Menu, X, Camera, Sparkles, Zap, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MovieDetectHeroProps {
  onSearchClick: (query?: string, type?: string) => void
}

const MovieDetectHero: React.FC<MovieDetectHeroProps> = ({ onSearchClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)

  const searchMethods = [
    { icon: Search, label: "Text", desc: "Describe scenes or actors", type: "text" },
    { icon: Camera, label: "Image", desc: "Upload screenshots", type: "image" },
    { icon: Video, label: "Video", desc: "Movie clips", type: "video" },
    { icon: Sparkles, label: "Audio", desc: "Soundtrack clips", type: "audio" },
    { icon: Zap, label: "Voice", desc: "Speak your search", type: "voice" },
    { icon: Brain, label: "AI", desc: "Smart recommendations", type: "ai" },
  ]

  return (
    <>
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">MovieDetect</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm text-white font-medium hover:bg-white/10 rounded-md transition-all duration-200"
          >
            Home
          </Link>
          <Link
            href="/features"
            className="px-4 py-2 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="px-4 py-2 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
          >
            Contact
          </Link>
          <Link
            href="/watchlist"
            className="px-4 py-2 text-sm text-gray-300 font-medium hover:text-white hover:bg-white/10 rounded-md transition-all duration-200"
          >
            Watchlist
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-white/10 font-medium px-4 py-2 h-auto text-sm rounded-md"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-medium px-5 py-2 h-auto text-sm rounded-md transition-all duration-200">
              Get Started
            </Button>
          </Link>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden text-white hover:bg-white/10 rounded-md w-9 h-9"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-[73px] left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex flex-col p-6 space-y-1">
            <Link
              href="/"
              className="text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/features"
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Pricing
            </Link>
            <Link
              href="/contact"
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Contact
            </Link>
            <Link
              href="/watchlist"
              className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Watchlist
            </Link>
            <div className="flex flex-col space-y-2 pt-4 mt-4 border-t border-white/10">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-white/10 justify-start w-full font-medium px-4 py-3 h-auto rounded-lg"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-white text-gray-900 hover:bg-gray-100 w-full font-semibold px-4 py-3 h-auto rounded-lg shadow-lg transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />

        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          {/* Main heading */}
          <div className="mb-8">
            <Badge className="mb-4 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2">
              🎬 AI-Powered Movie Discovery
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Any Movie
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-400">
                Any Way You Want
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Search by scene descriptions, upload screenshots, hum a soundtrack, or speak your query. Our AI
              understands it all.
            </p>
          </div>

          {/* Search methods grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
            {searchMethods.map((method, index) => (
              <div
                key={index}
                className="group cursor-pointer"
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={() => onSearchClick("", method.type)}
              >
                <div
                  className={`
                  bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 
                  transition-all duration-300 hover:bg-gray-700/50 hover:border-teal-500
                  ${hoveredFeature === index ? "scale-105 shadow-xl shadow-teal-500/20" : ""}
                `}
                >
                  <method.icon className="w-8 h-8 text-teal-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-medium text-sm mb-1">{method.label}</h3>
                  <p className="text-gray-400 text-xs">{method.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main CTA */}
          <div className="space-y-6">
            <Button
              onClick={() => onSearchClick()}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105"
            >
              <Search className="w-6 h-6 mr-3" />
              Start Searching Movies
            </Button>

            <p className="text-gray-400 text-sm">No sign-up required • Powered by advanced AI • Free to use</p>
          </div>

          {/* Feature highlights */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300">
              <Brain className="w-10 h-10 text-teal-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">AI-Powered Recognition</h3>
              <p className="text-gray-400">
                Advanced machine learning identifies movies from any input - images, audio, video, or text descriptions.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300">
              <Sparkles className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Multiple Search Methods</h3>
              <p className="text-gray-400">
                Search by scene description, actor name, screenshot, soundtrack, video clip, or voice command.
              </p>
            </div>

            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/30 transition-all duration-300">
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-white font-semibold text-lg mb-2">Instant Results</h3>
              <p className="text-gray-400">
                Get accurate movie matches in seconds with confidence scores and streaming availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { MovieDetectHero }
export default MovieDetectHero
