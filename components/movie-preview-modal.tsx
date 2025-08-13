"use client"

import { useState, useEffect, useRef } from "react"
import {
  X,
  Star,
  Play,
  Plus,
  Share2,
  Volume2,
  VolumeX,
  Clock,
  ExternalLink,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface MoviePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  movieId: number | null
  searchType?: string
  confidence?: number
}

interface MovieDetail {
  id: number
  title: string
  year: number
  duration: number
  genre: string[]
  synopsis: string
  poster: string
  backdrop: string
  trailer: string
  ratings: {
    tmdb: number
    imdb: number
    rottenTomatoes: number
    userAverage: number
  }
  streamingPlatforms: {
    name: string
    icon: string
    link: string
    type: string // 'subscription', 'rent', 'buy'
    price?: string
  }[]
  cast: {
    name: string
    character: string
    image: string
  }[]
  reviews: {
    source: string
    author: string
    content: string
    rating: number
    date: string
    avatar?: string
  }[]
  similarMovies: {
    id: number
    title: string
    poster: string
    rating: number
    year: number
  }[]
  director: string
  writers: string[]
  budget?: string
  boxOffice?: string
}

export function MoviePreviewModal({ isOpen, onClose, movieId, searchType, confidence }: MoviePreviewModalProps) {
  const [movie, setMovie] = useState<MovieDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<"overview" | "reviews" | "similar" | "feedback">("overview")
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [similarMoviesIndex, setSimilarMoviesIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (isOpen && movieId) {
      fetchMovieDetails(movieId)
    }
  }, [isOpen, movieId])

  const fetchMovieDetails = async (id: number) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/movies/${id}/details`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setMovie(data.data)
        // Check if movie is in watchlist
        checkWatchlistStatus(id)
      } else {
        throw new Error(data.error || "Failed to fetch movie details")
      }
    } catch (error) {
      console.error("Error fetching movie details:", error)
      // Fallback mock data for demo
      setMovie({
        id: id,
        title: "Blade Runner 2049",
        year: 2017,
        duration: 164,
        genre: ["Sci-Fi", "Thriller", "Drama"],
        synopsis:
          "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard, who's been missing for thirty years. This discovery leads K on a quest to find Rick Deckard, a former LAPD blade runner who has been missing for 30 years.",
        poster: "/blade-runner-2049-poster.png",
        backdrop: "/blade-runner-2049-cityscape.png",
        trailer: "/placeholder-trailer.mp4",
        director: "Denis Villeneuve",
        writers: ["Hampton Fancher", "Michael Green"],
        budget: "$150-185 million",
        boxOffice: "$259.3 million",
        ratings: {
          tmdb: 8.0,
          imdb: 8.0,
          rottenTomatoes: 88,
          userAverage: 8.2,
        },
        streamingPlatforms: [
          { name: "Netflix", icon: "/placeholder-logo.png", link: "https://netflix.com", type: "subscription" },
          { name: "Prime Video", icon: "/placeholder-logo.png", link: "https://primevideo.com", type: "subscription" },
          {
            name: "Apple TV",
            icon: "/placeholder-logo.png",
            link: "https://tv.apple.com",
            type: "rent",
            price: "$3.99",
          },
          {
            name: "Google Play",
            icon: "/placeholder-logo.png",
            link: "https://play.google.com",
            type: "buy",
            price: "$14.99",
          },
        ],
        cast: [
          { name: "Ryan Gosling", character: "K", image: "/placeholder-user.jpg" },
          { name: "Harrison Ford", character: "Rick Deckard", image: "/placeholder-user.jpg" },
          { name: "Ana de Armas", character: "Joi", image: "/placeholder-user.jpg" },
          { name: "Sylvia Hoeks", character: "Luv", image: "/placeholder-user.jpg" },
        ],
        reviews: [
          {
            source: "IMDb",
            author: "MovieCritic2023",
            content:
              "A masterpiece of science fiction cinema. Villeneuve has created a worthy successor to the original Blade Runner.",
            rating: 9,
            date: "2023-10-15",
            avatar: "/placeholder-user.jpg",
          },
          {
            source: "Rotten Tomatoes",
            author: "CinemaReviewer",
            content: "Visually stunning and emotionally resonant. The cinematography is breathtaking.",
            rating: 8.5,
            date: "2023-10-10",
            avatar: "/placeholder-user.jpg",
          },
          {
            source: "User Review",
            author: "SciFiFan",
            content: "One of the best sequels ever made. It respects the original while telling its own story.",
            rating: 9.5,
            date: "2023-10-12",
            avatar: "/placeholder-user.jpg",
          },
        ],
        similarMovies: [
          { id: 2, title: "The Matrix", poster: "/matrix-movie-poster.png", rating: 8.7, year: 1999 },
          { id: 3, title: "Interstellar", poster: "/interstellar-inspired-poster.png", rating: 8.6, year: 2014 },
          { id: 4, title: "Ex Machina", poster: "/ex-machina-poster.png", rating: 7.7, year: 2015 },
          { id: 5, title: "Her", poster: "/her-ai-romance-movie-poster.png", rating: 8.0, year: 2013 },
          { id: 6, title: "Arrival", poster: "/placeholder.svg", rating: 7.9, year: 2016 },
          { id: 7, title: "Dune", poster: "/dune-part-two-poster.png", rating: 8.0, year: 2021 },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const checkWatchlistStatus = async (movieId: number) => {
    try {
      const response = await fetch(`/api/watchlist/check/${movieId}`)
      const data = await response.json()
      setIsInWatchlist(data.inWatchlist || false)
    } catch (error) {
      console.error("Error checking watchlist status:", error)
    }
  }

  const handleAddToWatchlist = async () => {
    if (!movie) return

    try {
      const endpoint = isInWatchlist ? "/api/watchlist/remove" : "/api/watchlist/add"
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id }),
      })

      if (response.ok) {
        setIsInWatchlist(!isInWatchlist)
      }
    } catch (error) {
      console.error("Error updating watchlist:", error)
    }
  }

  const handleRating = async (rating: number) => {
    if (!movie) return

    try {
      const response = await fetch("/api/movies/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: movie.id, rating }),
      })

      if (response.ok) {
        setUserRating(rating)
      }
    } catch (error) {
      console.error("Error rating movie:", error)
    }
  }

  const handleShare = async (platform: "whatsapp" | "twitter" | "email") => {
    if (!movie) return

    const shareData = {
      title: movie.title,
      text: `Check out ${movie.title} (${movie.year}) on MovieDetect!`,
      url: `${window.location.origin}/movie/${movie.id}`,
    }

    try {
      switch (platform) {
        case "whatsapp":
          window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`)
          break
        case "twitter":
          window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
          )
          break
        case "email":
          window.open(
            `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`,
          )
          break
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }

  const handleSimilarMovieClick = (similarMovie: any) => {
    fetchMovieDetails(similarMovie.id)
    setActiveTab("overview")
  }

  const scrollSimilarMovies = (direction: "left" | "right") => {
    if (!movie) return
    const maxIndex = Math.max(0, movie.similarMovies.length - 4)

    if (direction === "left") {
      setSimilarMoviesIndex(Math.max(0, similarMoviesIndex - 1))
    } else {
      setSimilarMoviesIndex(Math.min(maxIndex, similarMoviesIndex + 1))
    }
  }

  const submitFeedback = async () => {
    if (!movie || !feedback.trim()) return

    try {
      const response = await fetch("/api/feedback/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: movie.id,
          searchType,
          confidence,
          feedback: feedback.trim(),
        }),
      })

      if (response.ok) {
        setFeedback("")
        alert("Thank you for your feedback!")
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
    }
  }

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "bg-green-500"
    if (conf >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-7xl bg-gray-900 rounded-lg overflow-hidden max-h-[95vh] overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
              <p className="text-white mt-4">Loading movie details...</p>
            </div>
          ) : movie ? (
            <>
              {/* Header with close button */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-black/50 w-10 h-10"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Hero Section */}
              <div className="relative h-[60vh] overflow-hidden">
                {isPlaying && movie.trailer ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                  >
                    <source src={movie.trailer} type="video/mp4" />
                    <img
                      src={movie.backdrop || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </video>
                ) : (
                  <img
                    src={movie.backdrop || "/placeholder.svg"}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />

                {/* Video Controls */}
                <div className="absolute top-4 left-4 flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-gray-500 text-white hover:bg-black/70"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-black/50 border-gray-500 text-white hover:bg-black/70"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                </div>

                {/* Movie Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end space-x-8">
                    <img
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      className="w-40 h-60 object-cover rounded-lg shadow-2xl flex-shrink-0"
                    />
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h1 className="text-5xl font-bold text-white mb-2">{movie.title}</h1>
                          <div className="flex items-center space-x-4 text-gray-300 mb-4">
                            <span className="text-lg">{movie.year}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{movie.duration} min</span>
                            </div>
                            <div className="flex space-x-2">
                              {movie.genre.slice(0, 3).map((g) => (
                                <Badge key={g} variant="outline" className="border-gray-500 text-gray-300">
                                  {g}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Confidence Score */}
                        {confidence && (
                          <Badge className={`${getConfidenceColor(confidence)} text-white text-sm px-3 py-1`}>
                            {confidence}% AI Match
                            {confidence < 60 && " ⚠️"}
                          </Badge>
                        )}
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{movie.ratings.tmdb}</span>
                          <span className="text-gray-400 text-sm">TMDb</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">{movie.ratings.imdb}</span>
                          <span className="text-gray-400 text-sm">IMDb</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-semibold">{movie.ratings.rottenTomatoes}%</span>
                          <span className="text-gray-400 text-sm">RT</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-3">
                        <Button className="bg-white text-black hover:bg-gray-200 px-8 py-3 text-lg font-semibold">
                          <Play className="w-5 h-5 mr-2" />
                          Play Trailer
                        </Button>
                        <Button
                          variant="outline"
                          className="border-gray-500 text-white hover:bg-white/10 bg-transparent px-6 py-3"
                          onClick={handleAddToWatchlist}
                        >
                          {isInWatchlist ? (
                            <Heart className="w-5 h-5 mr-2 fill-current text-red-500" />
                          ) : (
                            <Plus className="w-5 h-5 mr-2" />
                          )}
                          {isInWatchlist ? "In Watchlist" : "Add to Watchlist"}
                        </Button>

                        {/* Rating Stars */}
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(star)}
                              className="text-gray-400 hover:text-yellow-400 transition-colors"
                            >
                              <Star className={`w-5 h-5 ${star <= userRating ? "fill-current text-yellow-400" : ""}`} />
                            </button>
                          ))}
                        </div>

                        {/* Share Button */}
                        <div className="relative group">
                          <Button
                            variant="outline"
                            className="border-gray-500 text-white hover:bg-white/10 bg-transparent"
                          >
                            <Share2 className="w-5 h-5 mr-2" />
                            Share
                          </Button>
                          <div className="absolute top-full left-0 mt-2 bg-gray-800 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <div className="p-2 space-y-1">
                              <button
                                onClick={() => handleShare("whatsapp")}
                                className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded"
                              >
                                WhatsApp
                              </button>
                              <button
                                onClick={() => handleShare("twitter")}
                                className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded"
                              >
                                Twitter/X
                              </button>
                              <button
                                onClick={() => handleShare("email")}
                                className="block w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded"
                              >
                                Email
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="border-b border-gray-700">
                <div className="flex space-x-8 px-8">
                  {[
                    { id: "overview", label: "Overview" },
                    { id: "reviews", label: "Reviews" },
                    { id: "similar", label: "Similar Movies" },
                    { id: "feedback", label: "Feedback" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                        activeTab === tab.id
                          ? "border-teal-500 text-teal-400"
                          : "border-transparent text-gray-400 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-8">
                {activeTab === "overview" && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-4">Synopsis</h3>
                        <p className="text-gray-300 leading-relaxed text-lg">{movie.synopsis}</p>
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-4">Cast</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {movie.cast.map((actor, index) => (
                            <div key={index} className="text-center">
                              <img
                                src={actor.image || "/placeholder-user.jpg"}
                                alt={actor.name}
                                className="w-24 h-24 rounded-full object-cover mb-3 mx-auto"
                              />
                              <p className="text-white font-medium">{actor.name}</p>
                              <p className="text-gray-400 text-sm">{actor.character}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Director</h4>
                          <p className="text-gray-300">{movie.director}</p>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-2">Writers</h4>
                          <p className="text-gray-300">{movie.writers.join(", ")}</p>
                        </div>
                        {movie.budget && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Budget</h4>
                            <p className="text-gray-300">{movie.budget}</p>
                          </div>
                        )}
                        {movie.boxOffice && (
                          <div>
                            <h4 className="text-lg font-semibold text-white mb-2">Box Office</h4>
                            <p className="text-gray-300">{movie.boxOffice}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-semibold text-white mb-4">Watch On</h3>
                        <div className="space-y-3">
                          {movie.streamingPlatforms.map((platform, index) => (
                            <a
                              key={index}
                              href={platform.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={platform.icon || "/placeholder-logo.png"}
                                  alt={platform.name}
                                  className="w-10 h-10 rounded"
                                />
                                <div>
                                  <span className="text-white font-medium">{platform.name}</span>
                                  <p className="text-gray-400 text-sm capitalize">{platform.type}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {platform.price && <span className="text-teal-400 font-medium">{platform.price}</span>}
                                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-white">Reviews & Ratings</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {movie.reviews.map((review, index) => (
                        <Card key={index} className="bg-gray-800 border-gray-700">
                          <CardContent className="p-6">
                            <div className="flex items-start space-x-4">
                              <Avatar>
                                <AvatarImage src={review.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{review.author[0]}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <p className="font-medium text-white">{review.author}</p>
                                    <p className="text-sm text-gray-400">{review.source}</p>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-white">{review.rating}</span>
                                  </div>
                                </div>
                                <p className="text-gray-300 mb-2">{review.content}</p>
                                <p className="text-xs text-gray-500">{review.date}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "similar" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-white">Similar Movies</h3>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => scrollSimilarMovies("left")}
                          disabled={similarMoviesIndex === 0}
                          className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => scrollSimilarMovies("right")}
                          disabled={similarMoviesIndex >= movie.similarMovies.length - 4}
                          className="border-gray-600 text-gray-300 hover:border-teal-400 hover:text-teal-400 bg-transparent"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {movie.similarMovies.slice(similarMoviesIndex, similarMoviesIndex + 4).map((similarMovie) => (
                        <Card
                          key={similarMovie.id}
                          className="bg-gray-800 border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors group"
                          onClick={() => handleSimilarMovieClick(similarMovie)}
                        >
                          <CardContent className="p-0">
                            <img
                              src={similarMovie.poster || "/placeholder.svg"}
                              alt={similarMovie.title}
                              className="w-full h-64 object-cover rounded-t-lg"
                            />
                            <div className="p-4">
                              <h4 className="text-white font-medium mb-2 line-clamp-2">{similarMovie.title}</h4>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-sm">{similarMovie.year}</span>
                                <div className="flex items-center space-x-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span className="text-gray-400 text-sm">{similarMovie.rating}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "feedback" && (
                  <div className="max-w-2xl space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white mb-2">Help Us Improve</h3>
                      <p className="text-gray-400">
                        Your feedback helps us improve our AI search results. Let us know how accurate this match was.
                      </p>
                    </div>

                    {searchType && (
                      <div className="bg-gray-800 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2">Search Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Search Type:</span>
                            <span className="text-white capitalize">{searchType}</span>
                          </div>
                          {confidence && (
                            <div className="flex justify-between">
                              <span className="text-gray-400">AI Confidence:</span>
                              <span
                                className={`font-medium ${confidence >= 80 ? "text-green-400" : confidence >= 60 ? "text-yellow-400" : "text-red-400"}`}
                              >
                                {confidence}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-white font-medium mb-2">Your Feedback</label>
                      <Textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Tell us about the accuracy of this result, what worked well, or what could be improved..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-teal-400 focus:ring-teal-400/20 min-h-[120px]"
                      />
                    </div>

                    <Button
                      onClick={submitFeedback}
                      disabled={!feedback.trim()}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-white text-xl">Movie not found</p>
              <p className="text-gray-400 mt-2">The requested movie could not be loaded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
