"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, Mic, ImageIcon, Music, Video, User, Play, Volume2, VolumeX, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SearchMethod {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

export function MovieDetectHero() {
  const [showSearchPlaceholder, setShowSearchPlaceholder] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)

  const searchMethods: SearchMethod[] = [
    {
      id: "text",
      title: "Text Search",
      description: "Search by movie title, actor, or description",
      icon: <Search className="w-6 h-6" />,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20 hover:bg-blue-500/30",
    },
    {
      id: "voice",
      title: "Voice Search",
      description: "Describe the movie you're looking for",
      icon: <Mic className="w-6 h-6" />,
      color: "text-green-400",
      bgColor: "bg-green-500/20 hover:bg-green-500/30",
    },
    {
      id: "image",
      title: "Image Search",
      description: "Upload a screenshot or poster",
      icon: <ImageIcon className="w-6 h-6" />,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20 hover:bg-purple-500/30",
    },
    {
      id: "audio",
      title: "Audio Search",
      description: "Upload soundtrack or dialogue",
      icon: <Music className="w-6 h-6" />,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20 hover:bg-yellow-500/30",
    },
    {
      id: "video",
      title: "Video Search",
      description: "Upload a video clip or scene",
      icon: <Video className="w-6 h-6" />,
      color: "text-red-400",
      bgColor: "bg-red-500/20 hover:bg-red-500/30",
    },
    {
      id: "face",
      title: "Face Recognition",
      description: "Find movies by actor's face",
      icon: <User className="w-6 h-6" />,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20 hover:bg-indigo-500/30",
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
    // Auto-start video after 3 seconds and hide search placeholder
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
            setShowSearchPlaceholder(false)
          })
          .catch((error) => {
            console.log("Hero video autoplay failed:", error)
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
            console.log("Hero video play failed:", error)
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

  const handleSearchMethodClick = (methodId: string) => {
    console.log(`Search method clicked: ${methodId}`)
    // This would open the search modal with the specific method
  }

  const handleWatchNowClick = () => {
    console.log("Watch Now clicked - would open movie detail modal")
    // This would open the movie detail modal
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted={isMuted}
          loop
          playsInline
          poster={featuredMovie.backdrop}
          onError={() => {
            console.log("Hero video failed to load")
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
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center px-6 pt-20">
          <div className="w-full max-w-6xl mx-auto">
            {/* Search Placeholder - Shows initially, fades out when video starts */}
            <div
              className={`transition-all duration-1000 ease-in-out ${
                showSearchPlaceholder ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  Find Any Movie
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                    Using AI
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                  Discover movies through text, voice, images, audio, video, or face recognition. Our AI understands
                  what you're looking for.
                </p>
              </div>

              {/* Search Methods Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {searchMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleSearchMethodClick(method.id)}
                    className={`${method.bgColor} border border-white/10 rounded-xl p-6 text-left transition-all duration-300 hover:scale-105 hover:border-white/20 backdrop-blur-sm`}
                  >
                    <div className={`${method.color} mb-4`}>{method.icon}</div>
                    <h3 className="text-white font-semibold text-lg mb-2">{method.title}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Watch Now Button - Shows when video is playing */}
            <div
              className={`transition-all duration-1000 ease-in-out ${
                !showSearchPlaceholder ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              }`}
            >
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleWatchNowClick}
                  className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-xl font-semibold rounded-full transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-6 h-6 mr-3" />
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Left Movie Info */}
        <div className="absolute bottom-8 left-8 max-w-md">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{featuredMovie.title}</h2>
              <div className="flex items-center space-x-4 mb-3">
                <span className="text-gray-300">{featuredMovie.year}</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">{featuredMovie.rating}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {featuredMovie.genre.map((g) => (
                  <Badge key={g} variant="outline" className="border-gray-400 text-gray-300">
                    {g}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3">{featuredMovie.description}</p>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleVideoToggle}
                className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
              >
                <Play className="w-4 h-4 mr-2" />
                {isVideoPlaying ? "Pause" : "Play"} Trailer
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMuteToggle}
                className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm"
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
