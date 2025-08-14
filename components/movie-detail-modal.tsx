"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  X,
  Play,
  Pause,
  Plus,
  Check,
  Share2,
  Star,
  Calendar,
  Clock,
  User,
  Volume2,
  VolumeX,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

interface Movie {
  id: number
  title: string
  year: number
  poster: string
  backdrop: string
  rating: number
  genre: string[]
  synopsis: string
  duration: string
  director: string
  cast: string[]
  trailer: string
  isInWatchlist?: boolean
}

interface StreamingPlatform {
  name: string
  icon: string
  link: string
  type: "subscription" | "rent" | "buy"
  price?: string
}

interface MovieDetailModalProps {
  movieId: number
  isOpen: boolean
  onClose: () => void
}

const mockMovie: Movie = {
  id: 1,
  title: "Dune: Part Two",
  year: 2024,
  poster: "/dune-part-two-poster.png",
  backdrop: "/dune-part-two-poster.png",
  rating: 8.9,
  genre: ["Sci-Fi", "Adventure", "Drama"],
  synopsis:
    "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. When faced with a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
  duration: "166 min",
  director: "Denis Villeneuve",
  cast: ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Josh Brolin", "Austin Butler"],
  trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
}

const mockStreamingPlatforms: StreamingPlatform[] = [
  { name: "Netflix", icon: "🎬", link: "#", type: "subscription" },
  { name: "Amazon Prime", icon: "📺", link: "#", type: "subscription" },
  { name: "Apple TV", icon: "🍎", link: "#", type: "rent", price: "$3.99" },
  { name: "Google Play", icon: "🎮", link: "#", type: "buy", price: "$14.99" },
  { name: "Vudu", icon: "📱", link: "#", type: "rent", price: "$2.99" },
]

const mockSimilarMovies: Movie[] = [
  {
    id: 2,
    title: "Blade Runner 2049",
    year: 2017,
    poster: "/blade-runner-2049-poster.png",
    backdrop: "/blade-runner-2049-poster.png",
    rating: 8.0,
    genre: ["Sci-Fi", "Drama"],
    synopsis:
      "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
    duration: "164 min",
    director: "Denis Villeneuve",
    cast: ["Ryan Gosling", "Harrison Ford"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    poster: "/interstellar-inspired-poster.png",
    backdrop: "/interstellar-inspired-poster.png",
    rating: 8.6,
    genre: ["Sci-Fi", "Drama"],
    synopsis: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    duration: "169 min",
    director: "Christopher Nolan",
    cast: ["Matthew McConaughey", "Anne Hathaway"],
    trailer: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  },
]

export function MovieDetailModal({ movieId, isOpen, onClose }: MovieDetailModalProps) {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState<"up" | "down" | null>(null)
  const [similarMovies] = useState(mockSimilarMovies)
  const videoRef = useRef<HTMLVideoElement>(null)
  const similarCarouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && movieId) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setMovie(mockMovie)
        setIsLoading(false)
        setIsInWatchlist(mockMovie.isInWatchlist || false)
      }, 500)
    }
  }, [movieId, isOpen])

  useEffect(() => {
    if (isOpen && movie && !isLoading) {
      // Auto-play trailer after 2 seconds
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.log)
          setIsPlaying(true)
        }
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, movie, isLoading])

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch(console.log)
        setIsPlaying(true)
      }
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleAddToWatchlist = () => {
    setIsInWatchlist(!isInWatchlist)
    // API call would go here
  }

  const handleShare = async () => {
    if (navigator.share && movie) {
      try {
        await navigator.share({
          title: movie.title,
          text: movie.synopsis,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else if (movie) {
      navigator.clipboard.writeText(window.location.href)
      console.log("Link copied to clipboard")
    }
  }

  const handleRating = (rating: "up" | "down") => {
    setUserRating(userRating === rating ? null : rating)
    // API call would go here
  }

  const scrollSimilarMovies = (direction: "left" | "right") => {
    if (similarCarouselRef.current) {
      const scrollAmount = 300
      similarCarouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  if (!isOpen) return null

  if (isLoading || !movie) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00E6E6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading movie details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        {/* Hero Section with Video */}
        <div className="relative h-screen">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            muted={isMuted}
            playsInline
            poster={movie.backdrop}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={movie.trailer} type="video/mp4" />
          </video>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E17] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E17]/80 via-transparent to-transparent" />

          {/* Close Button */}
          <Button
            variant="ghost"
            onClick={onClose}
            className="absolute top-6 right-6 z-10 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Video Controls */}
          <div className="absolute top-6 right-20 z-10 flex gap-2">
            <Button
              variant="ghost"
              onClick={togglePlay}
              className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              onClick={toggleMute}
              className="bg-black/50 text-white hover:bg-black/70 rounded-full w-10 h-10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>

          {/* Movie Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>

              <div className="flex items-center gap-6 mb-6 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="text-white font-semibold">{movie.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#B3B3B3]" />
                  <span className="text-[#B3B3B3]">{movie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#B3B3B3]" />
                  <span className="text-[#B3B3B3]">{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[#B3B3B3]" />
                  <span className="text-[#B3B3B3]">{movie.director}</span>
                </div>
              </div>

              <div className="flex gap-2 mb-6 flex-wrap">
                {movie.genre.map((g) => (
                  <Badge key={g} className="bg-[#00E6E6]/20 text-[#00E6E6] border-[#00E6E6]/30">
                    {g}
                  </Badge>
                ))}
              </div>

              <p className="text-lg text-[#B3B3B3] mb-8 max-w-3xl leading-relaxed">{movie.synopsis}</p>

              {/* Action Buttons */}
              <div className="flex gap-4 flex-wrap">
                <Button onClick={togglePlay} size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold">
                  {isPlaying ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                  {isPlaying ? "Pause" : "Play"} Trailer
                </Button>

                <Button
                  onClick={handleAddToWatchlist}
                  variant="outline"
                  size="lg"
                  className={`font-semibold bg-transparent ${
                    isInWatchlist
                      ? "border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17]"
                      : "border-white text-white hover:bg-white hover:text-black"
                  }`}
                >
                  {isInWatchlist ? <Check className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                  {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="lg"
                  className="border-[#00E6E6] text-[#00E6E6] hover:bg-[#00E6E6] hover:text-[#0B0E17] font-semibold bg-transparent"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>

                {/* Rating Buttons */}
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleRating("up")}
                    variant="outline"
                    size="lg"
                    className={`bg-transparent ${
                      userRating === "up"
                        ? "border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        : "border-[#B3B3B3] text-[#B3B3B3] hover:border-green-500 hover:text-green-500"
                    }`}
                  >
                    <ThumbsUp className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => handleRating("down")}
                    variant="outline"
                    size="lg"
                    className={`bg-transparent ${
                      userRating === "down"
                        ? "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        : "border-[#B3B3B3] text-[#B3B3B3] hover:border-red-500 hover:text-red-500"
                    }`}
                  >
                    <ThumbsDown className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-[#0B0E17] px-8 md:px-16 py-12">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Cast and Crew */}
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Cast</h3>
                <div className="space-y-2">
                  {movie.cast.map((actor, index) => (
                    <p key={index} className="text-[#B3B3B3]">
                      {actor}
                    </p>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Director</h3>
                <p className="text-[#B3B3B3]">{movie.director}</p>
              </div>
            </div>

            {/* Streaming Platforms */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Watch Now</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mockStreamingPlatforms.map((platform, index) => (
                  <Card
                    key={index}
                    className="bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-colors cursor-pointer"
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl mb-2">{platform.icon}</div>
                      <h4 className="text-white font-semibold text-sm mb-1">{platform.name}</h4>
                      <p className="text-[#B3B3B3] text-xs">
                        {platform.type === "subscription" ? "Included" : platform.price}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Similar Movies */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">More Like This</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollSimilarMovies("left")}
                    className="bg-[#1F2937] text-white hover:bg-[#00E6E6] hover:text-[#0B0E17] rounded-full w-10 h-10"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => scrollSimilarMovies("right")}
                    className="bg-[#1F2937] text-white hover:bg-[#00E6E6] hover:text-[#0B0E17] rounded-full w-10 h-10"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div ref={similarCarouselRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
                {similarMovies.map((similarMovie) => (
                  <Card
                    key={similarMovie.id}
                    className="flex-shrink-0 w-64 bg-[#1F2937] border-[#1F2937] hover:border-[#00E6E6] transition-all duration-300 cursor-pointer movie-card"
                  >
                    <div className="relative">
                      <Image
                        src={similarMovie.poster || "/placeholder.svg"}
                        alt={similarMovie.title}
                        width={256}
                        height={144}
                        className="w-full h-36 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-white mb-2 line-clamp-1">{similarMovie.title}</h4>
                      <div className="flex items-center gap-2 text-sm text-[#B3B3B3] mb-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{similarMovie.rating}</span>
                        <span>•</span>
                        <span>{similarMovie.year}</span>
                      </div>
                      <p className="text-[#B3B3B3] text-sm line-clamp-2">{similarMovie.synopsis}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
