"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Mic, ImageIcon, Music, Video, User, Play, Volume2, VolumeX, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchMethod {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
}

export function MovieDetectHero() {
  const [showSearchPlaceholder, setShowSearchPlaceholder] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showMovieInfo, setShowMovieInfo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const searchMethods: SearchMethod[] = [
    {
      id: "text",
      name: "Text Search",
      icon: Search,
      description: "Search by movie title, actor, or genre",
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "voice",
      name: "Voice Search",
      icon: Mic,
      description: "Describe the movie you're looking for",
      color: "from-green-500 to-green-600",
    },
    {
      id: "image",
      name: "Image Search",
      icon: ImageIcon,
      description: "Upload a movie poster or screenshot",
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "audio",
      name: "Audio Search",
      icon: Music,
      description: "Find movies by soundtrack or dialogue",
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "video",
      name: "Video Search",
      icon: Video,
      description: "Upload a movie clip or trailer",
      color: "from-red-500 to-red-600",
    },
    {
      id: "face",
      name: "Face Recognition",
      icon: User,
      description: "Find movies by actor's face",
      color: "from-pink-500 to-pink-600",
    },
  ]

  // Featured movie data
  const featuredMovie = {
    title: "Blade Runner 2049",
    year: 2017,
    genre: ["Sci-Fi", "Thriller", "Drama"],
    rating: 8.2,
    description:
      "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
    backdrop: "/blade-runner-2049-cityscape.png",
    trailer: "/placeholder-trailer.mp4",
  }

  useEffect(() => {
    // Auto-start video after 3 seconds
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
            // Hide search placeholder and show movie info after video starts
            setTimeout(() => {
              setShowSearchPlaceholder(false)
              setShowMovieInfo(true)
            }, 1000)
          })
          .catch((error) => {
            console.log("Video autoplay failed:", error)
          })
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
          })
          .catch((error) => {
            console.log("Video play failed:", error)
          })
      }
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleSearchMethodClick = (method: SearchMethod) => {
    console.log(`Opening ${method.name} search...`)
    // This would open the search modal with the specific method
  }

  const handleWatchNowClick = () => {
    console.log("Opening movie detail modal...")
    // This would open the movie detail modal
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Video/Image */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          poster={featuredMovie.backdrop}
          onError={() => {
            console.log("Video failed to load, using fallback image")
            setIsVideoPlaying(false)
          }}
        >
          <source src={featuredMovie.trailer} type="video/mp4" />
        </video>

        {/* Fallback background image */}
        {!isVideoPlaying && (
          <img
            src={featuredMovie.backdrop || "/placeholder.svg"}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "/placeholder.svg"
            }}
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top spacing for header */}
        <div className="h-16" />

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center items-center px-6 lg:px-8">
          {/* Search Placeholder - Initially Visible */}
          <div
            className={`transition-all duration-1000 ease-in-out ${
              showSearchPlaceholder ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Find Any Movie
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                  With AI Power
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Search movies using text, voice, images, audio, video clips, or even faces. Our AI understands what
                you're looking for.
              </p>
            </div>

            {/* Search Methods Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {searchMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => handleSearchMethodClick(method)}
                    className="group relative p-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-black/60 hover:border-white/20 transition-all duration-300 hover:scale-105"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">{method.name}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{method.description}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Watch Now Button - Shows when video starts */}
          <div
            className={`transition-all duration-1000 ease-in-out ${
              !showSearchPlaceholder ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <Button
              size="lg"
              onClick={handleWatchNowClick}
              className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-xl font-semibold rounded-full shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Play className="w-8 h-8 mr-3" />
              Watch Now
            </Button>
          </div>
        </div>

        {/* Bottom Left Movie Info */}
        <div
          className={`absolute bottom-8 left-8 max-w-md transition-all duration-1000 ease-in-out ${
            showMovieInfo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredMovie.title}</h2>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-gray-300 text-lg">{featuredMovie.year}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold text-lg">{featuredMovie.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredMovie.genre.map((g) => (
                  <Badge key={g} variant="outline" className="border-gray-400 text-gray-300">
                    {g}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 text-base leading-relaxed line-clamp-3">{featuredMovie.description}</p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                onClick={handleVideoToggle}
                className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/30"
              >
                <Play className="w-4 h-4 mr-2" />
                {isVideoPlaying ? "Pause" : "Play"} Trailer
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleMuteToggle}
                className="border-white/30 text-white hover:bg-white/20 bg-transparent"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
