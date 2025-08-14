"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Search, Video, Menu, X, Camera, Sparkles, Zap, Brain, Play, Plus, Info, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MovieDetectHeroProps {
  onSearchClick: (query?: string, type?: string) => void
}

const MovieDetectHero: React.FC<MovieDetectHeroProps> = ({ onSearchClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [showTrailer, setShowTrailer] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const trailerTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Featured movie data (this would come from API in real app)
  const featuredMovie = {
    id: 1,
    title: "Blade Runner 2049",
    year: 2017,
    genre: ["Sci-Fi", "Thriller", "Drama"],
    tagline: "The key to the future is finally unearthed.",
    synopsis:
      "Thirty years after the events of the first film, a new blade runner, LAPD Officer K, unearths a long-buried secret that has the potential to plunge what's left of society into chaos.",
    backdrop: "/blade-runner-2049-cityscape.png",
    trailerUrl: "/trailers/blade-runner-2049-trailer.mp4", // Mock trailer URL
    rating: 8.0,
    duration: 164,
  }

  const searchMethods = [
    { icon: Search, label: "Text", desc: "Describe scenes or actors", type: "text" },
    { icon: Camera, label: "Image", desc: "Upload screenshots", type: "image" },
    { icon: Video, label: "Video", desc: "Movie clips", type: "video" },
    { icon: Sparkles, label: "Audio", desc: "Soundtrack clips", type: "audio" },
    { icon: Zap, label: "Voice", desc: "Speak your search", type: "voice" },
    { icon: Brain, label: "AI", desc: "Smart recommendations", type: "ai" },
  ]

  useEffect(() => {
    // Start trailer after 2 second delay
    trailerTimeoutRef.current = setTimeout(() => {
      setShowTrailer(true)
      if (videoRef.current) {
        videoRef.current.play().catch(console.error)
      }
    }, 2000)

    return () => {
      if (trailerTimeoutRef.current) {
        clearTimeout(trailerTimeoutRef.current)
      }
    }
  }, [])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }

  const handlePlayTrailer = () => {
    // Open full trailer or navigate to movie detail
    console.log("Play full trailer")
  }

  const handleAddToWatchlist = () => {
    // Add featured movie to watchlist
    console.log("Add to watchlist")
  }

  return (
    <>
      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-black/20 border-b border-white/10">
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

      {/* Cinematic Hero Banner */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.backdrop || "/placeholder.svg"}
            alt={featuredMovie.title}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              showTrailer && isVideoLoaded ? "opacity-0" : "opacity-100"
            }`}
          />
        </div>

        {/* Background Video */}
        {showTrailer && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              onLoadedData={handleVideoLoad}
              poster={featuredMovie.backdrop}
            >
              <source src={featuredMovie.trailerUrl} type="video/mp4" />
            </video>

            {/* Soft blur overlay when video is playing */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
          </div>
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

        {/* Video Controls */}
        {showTrailer && (
          <div className="absolute top-24 right-6 z-20">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMute}
              className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-2xl">
              {/* Movie Info */}
              <div className="mb-8">
                <Badge className="mb-4 bg-teal-600/80 backdrop-blur-sm text-white px-3 py-1 text-sm">
                  Featured Movie
                </Badge>

                <h1 className="text-6xl md:text-8xl font-bold text-white mb-4 leading-tight tracking-tight">
                  {featuredMovie.title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-6 font-light leading-relaxed">
                  {featuredMovie.tagline}
                </p>

                <div className="flex items-center space-x-6 mb-6 text-gray-300">
                  <span className="text-lg font-medium">{featuredMovie.year}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-lg font-medium">{featuredMovie.rating}</span>
                  </div>
                  <span className="text-lg">
                    {Math.floor(featuredMovie.duration / 60)}h {featuredMovie.duration % 60}m
                  </span>
                  <div className="flex space-x-2">
                    {featuredMovie.genre.slice(0, 3).map((g) => (
                      <Badge key={g} variant="outline" className="border-gray-400 text-gray-300 text-sm">
                        {g}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-xl">{featuredMovie.synopsis}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-4 mb-12">
                <Button
                  onClick={handlePlayTrailer}
                  className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Play
                </Button>

                <Button
                  onClick={handleAddToWatchlist}
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
                >
                  <Plus className="w-6 h-6 mr-3" />
                  Add to Watchlist
                </Button>

                <Button
                  onClick={() => onSearchClick()}
                  variant="outline"
                  className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-6 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
                >
                  <Info className="w-6 h-6 mr-3" />
                  More Info
                </Button>
              </div>

              {/* Search CTA */}
              <div className="space-y-4">
                <p className="text-gray-400 text-lg">Or discover movies using our AI-powered search:</p>

                <Button
                  onClick={() => onSearchClick()}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-full shadow-2xl hover:shadow-teal-500/25 transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5 mr-3" />
                  Start Searching Movies
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Methods Grid - Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Search Any Way You Want</h2>
              <p className="text-gray-300">Multiple AI-powered search methods at your fingertips</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                    bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 
                    transition-all duration-300 hover:bg-black/60 hover:border-teal-500/50
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
          </div>
        </div>
      </div>
    </>
  )
}

export { MovieDetectHero }
export default MovieDetectHero
