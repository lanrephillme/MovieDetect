"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Plus, Info, Search, Mic, ImageIcon, Music, Video, Users, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface HeroProps {
  onSearchClick: (query?: string, type?: string) => void
}

export function MovieDetectHero({ onSearchClick }: HeroProps) {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const videoRef = useRef<HTMLVideoElement>(null)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const searchMethods = [
    {
      icon: Search,
      title: "Text Search",
      description: "Search by movie title, actor, or genre",
      type: "text",
      color: "bg-blue-600 hover:bg-blue-700",
    },
    {
      icon: Mic,
      title: "Voice Search",
      description: "Describe the movie you're looking for",
      type: "voice",
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      icon: ImageIcon,
      title: "Image Search",
      description: "Upload a movie poster or screenshot",
      type: "image",
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      icon: Music,
      title: "Audio Search",
      description: "Hum or play a movie soundtrack",
      type: "audio",
      color: "bg-orange-600 hover:bg-orange-700",
    },
    {
      icon: Video,
      title: "Video Search",
      description: "Upload a movie clip or scene",
      type: "video",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      icon: Users,
      title: "Face Search",
      description: "Find movies by actor's face",
      type: "face",
      color: "bg-indigo-600 hover:bg-indigo-700",
    },
  ]

  useEffect(() => {
    // Fetch featured movie for hero banner
    const fetchFeaturedMovie = async () => {
      try {
        const response = await fetch("/api/movies/trending")
        const data = await response.json()

        if (data.success && data.data && data.data.length > 0) {
          const featured = {
            ...data.data[0],
            backdrop: "/blade-runner-2049-cityscape.png",
            trailerUrl: "/trailers/featured-trailer.mp4",
            tagline: "The future is not set. There is no fate but what we make for ourselves.",
            genres: Array.isArray(data.data[0].genre) ? data.data[0].genre : [data.data[0].genre || "Sci-Fi"],
            synopsis:
              data.data[0].description ||
              "In a world where artificial intelligence meets human emotion, discover movies like never before. Experience the future of entertainment discovery.",
          }
          setFeaturedMovie(featured)
        }
      } catch (error) {
        console.error("Error fetching featured movie:", error)
        // Fallback featured movie
        setFeaturedMovie({
          id: 1,
          title: "MovieDetect AI",
          tagline: "Discover Movies Like Never Before",
          year: 2024,
          rating: 9.2,
          genres: ["AI", "Discovery", "Entertainment"],
          synopsis:
            "Experience the future of movie discovery with our advanced AI-powered search. Find any movie using text, voice, images, audio, video, or even faces.",
          backdrop: "/blade-runner-2049-cityscape.png",
          trailerUrl: "/trailers/featured-trailer.mp4",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedMovie()

    // Auto-play video after 2 seconds
    autoplayTimeoutRef.current = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(console.error)
        setIsVideoPlaying(true)
      }
    }, 2000)

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current)
      }
    }
  }, [])

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const handlePlayClick = () => {
    onSearchClick("", "featured")
  }

  const handleMoreInfoClick = () => {
    if (featuredMovie) {
      onSearchClick(featuredMovie.title, "text")
    }
  }

  if (isLoading) {
    return (
      <div className="relative h-screen bg-black flex items-center justify-center">
        <div className="animate-pulse text-white text-2xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredMovie?.backdrop || "/blade-runner-2049-cityscape.png"}
          alt="Featured Movie"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoPlaying ? "opacity-30" : "opacity-100"
          }`}
        />
      </div>

      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoPlaying ? "opacity-70" : "opacity-0"
          }`}
          muted={isMuted}
          loop
          playsInline
          poster={featuredMovie?.backdrop}
        >
          <source src={featuredMovie?.trailerUrl} type="video/mp4" />
        </video>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Blur Effect when Video Playing */}
      {isVideoPlaying && (
        <div
          className="absolute inset-0 backdrop-blur-sm"
          style={{
            background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.3) 100%)",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Main Hero Content */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              {/* Movie Info */}
              <div className="mb-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Badge className="bg-red-600 text-white px-3 py-1 text-sm font-semibold">FEATURED</Badge>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <span className="text-sm">{featuredMovie?.year}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm font-medium">{featuredMovie?.rating}</span>
                    </div>
                    <span className="w-1 h-1 bg-gray-400 rounded-full" />
                    <span className="text-sm">{featuredMovie?.genres?.slice(0, 2).join(" • ")}</span>
                  </div>
                </div>

                <h1 className="text-5xl lg:text-7xl font-bold text-white mb-4 leading-tight">{featuredMovie?.title}</h1>

                {featuredMovie?.tagline && (
                  <p className="text-xl lg:text-2xl text-gray-300 mb-6 font-light">{featuredMovie.tagline}</p>
                )}

                <p className="text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed">{featuredMovie?.synopsis}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-gray-200 px-8 py-4 text-lg font-semibold rounded-lg"
                  onClick={handlePlayClick}
                >
                  <Play className="w-6 h-6 mr-2 fill-current" />
                  Play
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg bg-black/30 backdrop-blur-sm"
                  onClick={() => onSearchClick("", "watchlist")}
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Add to Watchlist
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-400 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-lg bg-black/30 backdrop-blur-sm"
                  onClick={handleMoreInfoClick}
                >
                  <Info className="w-6 h-6 mr-2" />
                  More Info
                </Button>

                {/* Mute Toggle */}
                {isVideoPlaying && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-gray-400 text-white hover:bg-white/10 p-4 rounded-full bg-black/30 backdrop-blur-sm"
                    onClick={toggleMute}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Search Methods Grid */}
        <div className="pb-12">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Discover Movies Your Way</h2>
              <p className="text-gray-400 text-lg">Choose your preferred search method and find any movie instantly</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {searchMethods.map((method) => {
                const IconComponent = method.icon
                return (
                  <button
                    key={method.type}
                    onClick={() => onSearchClick("", method.type)}
                    className={`${method.color} p-6 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
                  >
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm mb-1">{method.title}</h3>
                        <p className="text-xs opacity-90 leading-tight">{method.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
