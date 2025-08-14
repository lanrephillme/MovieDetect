"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Info, Search, Mic, ImageIcon, Music, Video, Users, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchModal } from "./search-modal"

interface FeaturedMovie {
  id: number
  title: string
  synopsis: string
  year: number
  rating: number
  genre: string[]
  duration: string
  backdrop: string
  trailerUrl: string
  cast: string[]
}

export function MovieDetectHero() {
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [selectedSearchMethod, setSelectedSearchMethod] = useState<string | null>(null)
  const [featuredMovie, setFeaturedMovie] = useState<FeaturedMovie | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showVideoControls, setShowVideoControls] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const playTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Mock featured movie data - in real app, this would come from API
    const mockFeaturedMovie: FeaturedMovie = {
      id: 1,
      title: "Blade Runner 2049",
      synopsis:
        "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years.",
      year: 2017,
      rating: 8.0,
      genre: ["Sci-Fi", "Thriller", "Drama"],
      duration: "2h 44m",
      backdrop: "/blade-runner-2049-cityscape.png",
      trailerUrl: "/trailers/blade-runner-2049-trailer.mp4",
      cast: ["Ryan Gosling", "Harrison Ford", "Ana de Armas", "Jared Leto"],
    }

    setFeaturedMovie(mockFeaturedMovie)

    // Auto-play trailer after 2 seconds
    playTimeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error)
        setIsVideoPlaying(true)
      }
    }, 2000)

    return () => {
      if (playTimeoutRef.current) {
        clearTimeout(playTimeoutRef.current)
      }
    }
  }, [])

  const handleSearchMethodClick = (method: string) => {
    setSelectedSearchMethod(method)
    setShowSearchModal(true)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const searchMethods = [
    {
      id: "text",
      title: "Text Search",
      description: "Search by movie title, actor, or genre",
      icon: Search,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "voice",
      title: "Voice Search",
      description: "Describe the movie you're looking for",
      icon: Mic,
      color: "from-green-500 to-green-600",
    },
    {
      id: "image",
      title: "Image Search",
      description: "Upload a movie poster or screenshot",
      icon: ImageIcon,
      color: "from-purple-500 to-purple-600",
    },
    {
      id: "audio",
      title: "Audio Search",
      description: "Hum or play a movie soundtrack",
      icon: Music,
      color: "from-red-500 to-red-600",
    },
    {
      id: "video",
      title: "Video Search",
      description: "Upload a movie clip or trailer",
      icon: Video,
      color: "from-yellow-500 to-yellow-600",
    },
    {
      id: "face",
      title: "Face Recognition",
      description: "Find movies by actor's face",
      icon: Users,
      color: "from-indigo-500 to-indigo-600",
    },
  ]

  if (!featuredMovie) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Loading featured movie...</div>
      </div>
    )
  }

  return (
    <>
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={featuredMovie.backdrop || "/placeholder.svg"}
            alt={featuredMovie.title}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              isVideoPlaying ? "scale-110 blur-sm" : "scale-100 blur-0"
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        </div>

        {/* Background Video */}
        {isVideoPlaying && (
          <div className="absolute inset-0">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              onMouseEnter={() => setShowVideoControls(true)}
              onMouseLeave={() => setShowVideoControls(false)}
            >
              <source src={featuredMovie.trailerUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
          </div>
        )}

        {/* Video Controls */}
        {isVideoPlaying && (
          <div
            className={`absolute top-6 right-6 transition-opacity duration-300 ${
              showVideoControls ? "opacity-100" : "opacity-0"
            }`}
          >
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/30 text-white hover:bg-black/70 backdrop-blur-sm"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-16 max-w-7xl mx-auto">
          <div className="max-w-2xl">
            {/* Movie Badge */}
            <div className="flex items-center space-x-3 mb-6">
              <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-semibold">FEATURED</Badge>
              <div className="flex items-center space-x-2 text-gray-300">
                <span className="text-sm">{featuredMovie.year}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <span className="text-sm">{featuredMovie.duration}</span>
                <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm font-medium">{featuredMovie.rating}</span>
                </div>
              </div>
            </div>

            {/* Movie Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">{featuredMovie.title}</h1>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredMovie.genre.map((genre) => (
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
            <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">{featuredMovie.synopsis}</p>

            {/* Cast */}
            <div className="mb-8">
              <p className="text-gray-400 text-sm mb-2">Starring:</p>
              <p className="text-gray-200">{featuredMovie.cast.join(", ")}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 text-lg"
                onClick={() => console.log("Play movie")}
              >
                <Play className="w-6 h-6 mr-2" />
                Watch Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white hover:bg-white/20 bg-black/30 backdrop-blur-sm font-semibold px-8 py-3 text-lg"
                onClick={() => console.log("More info")}
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
            </div>
          </div>

          {/* Search Methods Grid */}
          <div className="mt-auto pb-12">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Discover Movies Your Way</h2>
              <p className="text-gray-300 text-lg">Use AI-powered search methods to find your perfect movie</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {searchMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <button
                    key={method.id}
                    onClick={() => handleSearchMethodClick(method.id)}
                    className="group relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm border border-white/20 p-6 text-left transition-all duration-300 hover:scale-105 hover:bg-black/60 hover:border-white/40"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                    />
                    <div className="relative z-10">
                      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${method.color} mb-4`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-white font-semibold text-sm mb-2 group-hover:text-white transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300 transition-colors">
                        {method.description}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={showSearchModal}
        onClose={() => {
          setShowSearchModal(false)
          setSelectedSearchMethod(null)
        }}
        initialMethod={selectedSearchMethod}
      />
    </>
  )
}
