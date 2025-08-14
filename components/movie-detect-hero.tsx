"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Play, Volume2, VolumeX, Search, Mic, Camera, Music, Video, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchModal } from "./search-modal"

interface HeroMovie {
  id: number
  title: string
  synopsis: string
  year: number
  genre: string[]
  rating: number
  backdrop: string
  trailer: string
  duration: number
}

interface SearchMethod {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

export function MovieDetectHero() {
  const [currentMovie, setCurrentMovie] = useState<HeroMovie | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [selectedSearchType, setSelectedSearchType] = useState<string>("")
  const [showSearchPlaceholder, setShowSearchPlaceholder] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Featured movies for hero rotation
  const featuredMovies: HeroMovie[] = [
    {
      id: 1,
      title: "Blade Runner 2049",
      synopsis:
        "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
      year: 2017,
      genre: ["Sci-Fi", "Thriller", "Drama"],
      rating: 8.2,
      backdrop: "/blade-runner-2049-cityscape.png",
      trailer: "/placeholder-trailer.mp4",
      duration: 164,
    },
    {
      id: 2,
      title: "Interstellar",
      synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      year: 2014,
      genre: ["Sci-Fi", "Drama", "Adventure"],
      rating: 8.6,
      backdrop: "/interstellar-space.png",
      trailer: "/placeholder-trailer.mp4",
      duration: 169,
    },
    {
      id: 3,
      title: "The Matrix",
      synopsis:
        "A computer programmer is led to fight an underground war against powerful computers who have constructed his entire reality with a system called the Matrix.",
      year: 1999,
      genre: ["Action", "Sci-Fi"],
      rating: 8.7,
      backdrop: "/matrix-digital-rain.png",
      trailer: "/placeholder-trailer.mp4",
      duration: 136,
    },
  ]

  const searchMethods: SearchMethod[] = [
    {
      id: "text",
      title: "Text Search",
      description: "Search by movie title, actor, or description",
      icon: Search,
      color: "bg-blue-500",
    },
    {
      id: "voice",
      title: "Voice Search",
      description: "Describe what you're looking for",
      icon: Mic,
      color: "bg-green-500",
    },
    {
      id: "image",
      title: "Image Search",
      description: "Upload a movie poster or scene",
      icon: Camera,
      color: "bg-purple-500",
    },
    {
      id: "audio",
      title: "Audio Search",
      description: "Hum a tune or upload a soundtrack",
      icon: Music,
      color: "bg-orange-500",
    },
    {
      id: "video",
      title: "Video Search",
      description: "Upload a movie clip or trailer",
      icon: Video,
      color: "bg-red-500",
    },
    {
      id: "face",
      title: "Face Recognition",
      description: "Find movies by actor's face",
      icon: Users,
      color: "bg-pink-500",
    },
  ]

  useEffect(() => {
    // Set initial featured movie
    setCurrentMovie(featuredMovies[0])

    // Auto-rotate featured movies every 10 seconds
    const rotateInterval = setInterval(() => {
      setCurrentMovie((prev) => {
        if (!prev) return featuredMovies[0]
        const currentIndex = featuredMovies.findIndex((movie) => movie.id === prev.id)
        const nextIndex = (currentIndex + 1) % featuredMovies.length
        return featuredMovies[nextIndex]
      })
    }, 10000)

    return () => {
      clearInterval(rotateInterval)
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Auto-play video after 3 seconds and hide search placeholder
    if (currentMovie && videoRef.current) {
      playTimeoutRef.current = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current
            .play()
            .then(() => {
              setIsVideoPlaying(true)
              // Hide search placeholder when video starts playing
              setTimeout(() => {
                setShowSearchPlaceholder(false)
              }, 500)
            })
            .catch((error) => {
              console.log("Hero video playback failed:", error)
              setIsVideoPlaying(false)
            })
        }
      }, 3000)
    }

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current)
      }
    }
  }, [currentMovie])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
        setShowSearchPlaceholder(true)
      } else {
        videoRef.current
          .play()
          .then(() => {
            setIsVideoPlaying(true)
            setShowSearchPlaceholder(false)
          })
          .catch((error) => {
            console.log("Video play failed:", error)
            setIsVideoPlaying(false)
            setShowSearchPlaceholder(true)
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

  const handleSearchClick = (searchType: string) => {
    setSelectedSearchType(searchType)
    setShowSearchModal(true)
  }

  const handleWatchNowClick = () => {
    // This would open the movie detail modal
    console.log("Opening movie detail modal for:", currentMovie?.title)
  }

  if (!currentMovie) {
    return (
      <div className="relative h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <>
      <div className="relative h-screen overflow-hidden">
        {/* Background Video/Image */}
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            loop
            playsInline
            poster={currentMovie.backdrop}
            onLoadedData={() => {
              // Video is ready to play
            }}
            onError={(e) => {
              console.log("Hero video failed to load, using fallback image")
              setIsVideoPlaying(false)
            }}
          >
            <source src={currentMovie.trailer} type="video/mp4" />
          </video>

          {/* Fallback background image */}
          {!isVideoPlaying && (
            <img
              src={currentMovie.backdrop || "/placeholder.svg"}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Center Search Section - Shows when video is not playing */}
          <div
            className={`flex-1 flex items-center justify-center transition-all duration-500 ${
              showSearchPlaceholder ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="text-center max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Find Any Movie with AI
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
                Describe scenes, upload images, hum soundtracks, or record video clips. Our advanced AI delivers precise
                results instantly.
              </p>

              {/* Search Methods Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
                {searchMethods.map((method) => {
                  const IconComponent = method.icon
                  return (
                    <button
                      key={method.id}
                      onClick={() => handleSearchClick(method.id)}
                      className="group relative bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-black/60 hover:border-white/40 transition-all duration-300 hover:scale-105"
                    >
                      <div
                        className={`${method.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2">{method.title}</h3>
                      <p className="text-gray-400 text-xs leading-relaxed">{method.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Center Watch Now Button - Shows when video is playing */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              !showSearchPlaceholder ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Button
              size="lg"
              onClick={handleWatchNowClick}
              className="bg-white text-black hover:bg-gray-200 px-12 py-4 text-xl font-bold rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Play className="w-8 h-8 mr-3" />
              Watch Now
            </Button>
          </div>

          {/* Bottom Left Movie Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
            <div className="container mx-auto">
              <div className="max-w-2xl">
                {/* Movie Badge */}
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className="bg-red-600 text-white px-3 py-1">Featured</Badge>
                  <span className="text-gray-300">{currentMovie.year}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-300">
                    {Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-white font-semibold">{currentMovie.rating}</span>
                  </div>
                </div>

                {/* Movie Title */}
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                  {currentMovie.title}
                </h2>

                {/* Genres */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentMovie.genre.map((genre) => (
                    <Badge
                      key={genre}
                      variant="outline"
                      className="border-gray-400 text-gray-300 bg-black/30 backdrop-blur-sm"
                    >
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Synopsis */}
                <p className="text-gray-200 text-lg leading-relaxed mb-6 max-w-xl">{currentMovie.synopsis}</p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold"
                    onClick={handlePlayPause}
                  >
                    <Play className="w-6 h-6 mr-2" />
                    {isVideoPlaying ? "Pause" : "Play"} Trailer
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm px-8 py-3 text-lg"
                    onClick={handleMuteToggle}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6 mr-2" /> : <Volume2 className="w-6 h-6 mr-2" />}
                    {isMuted ? "Unmute" : "Mute"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Indicators */}
          <div className="absolute bottom-6 right-6 flex space-x-2">
            {featuredMovies.map((movie) => (
              <button
                key={movie.id}
                onClick={() => setCurrentMovie(movie)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentMovie.id === movie.id ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} searchType={selectedSearchType} />
    </>
  )
}
