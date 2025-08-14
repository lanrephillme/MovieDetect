"use client"

import { useState, useRef, useEffect } from "react"
import { X, Play, Plus, Check, Star, Clock, Calendar, Volume2, VolumeX, Share, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Movie {
  id: number
  title: string
  poster: string
  backdrop?: string
  rating: number
  year: number
  genre: string[]
  synopsis?: string
  duration?: number
  trailer?: string
  isInWatchlist?: boolean
}

interface MovieDetailModalProps {
  movie: Movie
  isOpen: boolean
  onClose: () => void
}

interface StreamingPlatform {
  name: string
  icon: string
  link: string
  type: "subscription" | "rent" | "buy"
  price?: string
}

interface CastMember {
  name: string
  character: string
  image: string
}

interface Review {
  source: string
  author: string
  content: string
  rating: number
  date: string
}

interface SimilarMovie {
  id: number
  title: string
  poster: string
  rating: number
  year: number
}

export function MovieDetailModal({ movie, isOpen, onClose }: MovieDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [userRating, setUserRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isInWatchlist, setIsInWatchlist] = useState(movie.isInWatchlist || false)
  const [isLiked, setIsLiked] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Mock data for enhanced movie details
  const streamingPlatforms: StreamingPlatform[] = [
    { name: "Netflix", icon: "/netflix-icon.png", link: "https://netflix.com", type: "subscription" },
    { name: "Prime Video", icon: "/prime-icon.png", link: "https://primevideo.com", type: "subscription" },
    { name: "Apple TV", icon: "/appletv-icon.png", link: "https://tv.apple.com", type: "rent", price: "$3.99" },
    {
      name: "Google Play",
      icon: "/googleplay-icon.png",
      link: "https://play.google.com",
      type: "buy",
      price: "$14.99",
    },
  ]

  const cast: CastMember[] = [
    { name: "Ryan Gosling", character: "K", image: "/cast-1.jpg" },
    { name: "Harrison Ford", character: "Rick Deckard", image: "/cast-2.jpg" },
    { name: "Ana de Armas", character: "Joi", image: "/cast-3.jpg" },
    { name: "Jared Leto", character: "Niander Wallace", image: "/cast-4.jpg" },
  ]

  const reviews: Review[] = [
    {
      source: "IMDb",
      author: "MovieCritic2023",
      content:
        "A visually stunning sequel that honors the original while creating something entirely new. The cinematography is breathtaking.",
      rating: 9,
      date: "2023-10-15",
    },
    {
      source: "Rotten Tomatoes",
      author: "Critics Consensus",
      content:
        "Blade Runner 2049 is a rare sequel that enhances its predecessor while standing as a remarkable achievement in its own right.",
      rating: 8.8,
      date: "2023-10-10",
    },
  ]

  const similarMovies: SimilarMovie[] = [
    { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7, year: 1999 },
    { id: 3, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6, year: 2014 },
    { id: 4, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7, year: 2014 },
    { id: 5, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0, year: 2013 },
  ]

  const aiInsights = {
    matchScore: 94,
    reasons: [
      "Matches your preference for sci-fi thrillers",
      "Similar to movies you've rated highly",
      "Features acclaimed cinematography you enjoy",
      "Complex narrative structure you appreciate",
    ],
    mood: "Contemplative and visually stunning",
    bestWatchTime: "Evening viewing recommended",
    similarViewers: "Fans of Denis Villeneuve and cyberpunk aesthetics",
  }

  useEffect(() => {
    if (isOpen && videoRef.current) {
      // Auto-play trailer after 1 second
      const timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(console.error)
          setIsVideoPlaying(true)
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
        setIsVideoPlaying(false)
      } else {
        videoRef.current.play().catch(console.error)
        setIsVideoPlaying(true)
      }
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleStarClick = (rating: number) => {
    setUserRating(rating)
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "reviews", label: "Reviews" },
    { id: "similar", label: "Similar Movies" },
    { id: "ai-insights", label: "AI Insights" },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm">
      <div className="h-full overflow-y-auto">
        <div className="relative">
          {/* Hero Section with Video/Image */}
          <div className="relative h-[70vh] overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              poster={movie.backdrop || movie.poster}
              onError={() => setIsVideoPlaying(false)}
            >
              <source src={movie.trailer || "/placeholder-trailer.mp4"} type="video/mp4" />
            </video>

            {/* Fallback Image */}
            {!isVideoPlaying && (
              <img
                src={movie.backdrop || movie.poster || "/placeholder.svg"}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-6 right-6 text-white hover:bg-white/20 z-10"
            >
              <X className="w-6 h-6" />
            </Button>

            {/* Video Controls */}
            <div className="absolute top-6 left-6 flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleVideoToggle} className="text-white hover:bg-white/20">
                <Play className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleMuteToggle} className="text-white hover:bg-white/20">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
            </div>

            {/* Movie Info Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-4xl">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>

                <div className="flex items-center space-x-6 mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className="text-white text-xl font-semibold">{movie.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <Calendar className="w-5 h-5" />
                    <span>{movie.year}</span>
                  </div>
                  {movie.duration && (
                    <div className="flex items-center space-x-2 text-gray-300">
                      <Clock className="w-5 h-5" />
                      <span>
                        {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genre.map((g) => (
                    <Badge key={g} variant="outline" className="border-white/50 text-white bg-black/30">
                      {g}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 px-8">
                    <Play className="w-6 h-6 mr-2" />
                    Watch Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsInWatchlist(!isInWatchlist)}
                    className="border-white/50 text-white hover:bg-white/20"
                  >
                    {isInWatchlist ? <Check className="w-6 h-6 mr-2" /> : <Plus className="w-6 h-6 mr-2" />}
                    {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className="border-white/50 text-white hover:bg-white/20"
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? "fill-current text-red-500" : ""}`} />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/50 text-white hover:bg-white/20 bg-transparent"
                  >
                    <Share className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-black text-white">
            {/* Tabs */}
            <div className="border-b border-gray-800">
              <div className="max-w-6xl mx-auto px-8">
                <div className="flex space-x-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? "border-red-500 text-white"
                          : "border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="max-w-6xl mx-auto px-8 py-8">
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    {/* Synopsis */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Synopsis</h3>
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {movie.synopsis || "A captivating story that will keep you on the edge of your seat."}
                      </p>
                    </div>

                    {/* Cast */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Cast</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {cast.map((member) => (
                          <div key={member.name} className="text-center">
                            <img
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder-user.jpg"
                              }}
                            />
                            <p className="font-semibold text-sm">{member.name}</p>
                            <p className="text-gray-400 text-xs">{member.character}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Rating */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4">Rate This Movie</h3>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="transition-colors"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= (hoveredStar || userRating) ? "text-yellow-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          </button>
                        ))}
                        {userRating > 0 && <span className="ml-4 text-gray-300">You rated: {userRating}/5</span>}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Streaming Platforms */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Where to Watch</h3>
                      <div className="space-y-3">
                        {streamingPlatforms.map((platform) => (
                          <div
                            key={platform.name}
                            className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={platform.icon || "/placeholder.svg"}
                                alt={platform.name}
                                className="w-8 h-8 rounded"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = "/placeholder.svg"
                                }}
                              />
                              <span className="font-medium">{platform.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400 capitalize">{platform.type}</p>
                              {platform.price && <p className="text-sm font-semibold">{platform.price}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Movie Stats */}
                    <div>
                      <h3 className="text-xl font-bold mb-4">Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Release Year:</span>
                          <span>{movie.year}</span>
                        </div>
                        {movie.duration && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Runtime:</span>
                            <span>
                              {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <span>{movie.rating}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Genres:</span>
                          <span>{movie.genre.join(", ")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Reviews</h3>
                  {reviews.map((review, index) => (
                    <div key={index} className="bg-gray-900 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <p className="text-sm text-gray-400">
                            {review.source} • {review.date}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="font-semibold">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{review.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "similar" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Similar Movies</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {similarMovies.map((similarMovie) => (
                      <div
                        key={similarMovie.id}
                        className="cursor-pointer group"
                        onClick={() => console.log("Navigate to", similarMovie.title)}
                      >
                        <div className="relative overflow-hidden rounded-lg mb-2 group-hover:scale-105 transition-transform">
                          <img
                            src={similarMovie.poster || "/placeholder.svg"}
                            alt={similarMovie.title}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = "/placeholder.svg"
                            }}
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play className="w-8 h-8 text-white" />
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm mb-1 line-clamp-2">{similarMovie.title}</h4>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{similarMovie.year}</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span>{similarMovie.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "ai-insights" && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold">AI Insights</h3>

                  {/* Match Score */}
                  <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-semibold">AI Match Score</h4>
                      <div className="text-3xl font-bold text-green-400">{aiInsights.matchScore}%</div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-1000"
                        style={{ width: `${aiInsights.matchScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Reasons */}
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Why This Movie Matches You</h4>
                    <div className="grid gap-3">
                      {aiInsights.reasons.map((reason, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-900 rounded-lg">
                          <div className="w-2 h-2 bg-green-400 rounded-full" />
                          <span className="text-gray-300">{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Insights */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-900 rounded-lg p-6">
                      <h4 className="font-semibold mb-2">Mood</h4>
                      <p className="text-gray-300">{aiInsights.mood}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6">
                      <h4 className="font-semibold mb-2">Best Watch Time</h4>
                      <p className="text-gray-300">{aiInsights.bestWatchTime}</p>
                    </div>
                    <div className="bg-gray-900 rounded-lg p-6 md:col-span-2">
                      <h4 className="font-semibold mb-2">Similar Viewers</h4>
                      <p className="text-gray-300">{aiInsights.similarViewers}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
